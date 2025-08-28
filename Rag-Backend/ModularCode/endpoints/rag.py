from fastapi import APIRouter, HTTPException
from database import gemini_model, es_client, embedding_model, markdown_collection
from models import QueryRequest, RAGResponse
from translation_service import translation_service
from pdf_processing import pdf_processor
from utils import logger

router = APIRouter()

@router.post("/rag-query", response_model=RAGResponse)
async def rag_query(query: QueryRequest):
    try:
        logger.info(f"Processing multilingual RAG query: {query.query}")
        
        detected_language = translation_service.detect_language(query.query)
        logger.info(f"Detected language: {detected_language}")
        
        translated_query, original_language = translation_service.translate_to_english(query.query, detected_language)
        logger.info(f"Translated query: {translated_query}")
        
        example_schemes = [
            "Sukanya Samriddhi Account Scheme",
            "Pradhan Mantri Awas Yojana",
            "Ayushman Bharat",
            "Pradhan Mantri Kisan Samman Nidhi",
            "Atal Pension Yojana",
            "National Pension System"
        ]
        
        scheme_prompt = """
        You are given a user query in English about government schemes.
        Your task is to identify and extract the exact name of the scheme mentioned in the query.
        The scheme name is a proper noun or specific title, such as one of the following examples:
        {examples}
        
        If no scheme name is found, return "null".
        Provide only the scheme name as a string, or "null" if not found.

        Query:
        {query}

        Output only the scheme name or null:
        """
        
        scheme_name = None
        try:
            prompt = scheme_prompt.format(query=translated_query, examples="\n- " + "\n- ".join(example_schemes))
            response = gemini_model.generate_content(prompt)
            scheme_name = response.text.strip()
            if scheme_name.lower() == "null" or not scheme_name:
                scheme_name = None
            logger.info(f"Extracted scheme name: {scheme_name}")
        except Exception as e:
            logger.error(f"Error extracting scheme name with Gemini API: {e}")
            scheme_name = None
        
        if not scheme_name:
            logger.warning(f"No scheme name found for query: {query.query}")
            response_text = "Please specify the scheme name in your query."
            if original_language != 'en-IN':
                response_text = translation_service.translate_from_english(response_text, original_language)
            
            return RAGResponse(
                success=False,
                message="No scheme name found",
                scheme_name=None,
                response=response_text,
                retrieved_chunks=[],
                detected_language=detected_language,
                translated_query=translated_query
            )
        
        try:
            original_query_embedding = embedding_model.encode(
                f"query: {query.query}", 
                normalize_embeddings=True
            ).tolist()
            
            english_query_embedding = embedding_model.encode(
                f"query: {translated_query}", 
                normalize_embeddings=True
            ).tolist()
            
            logger.info("Generated multilingual query embeddings successfully")
        except Exception as e:
            logger.error(f"Error creating query embeddings: {e}")
            raise HTTPException(status_code=500, detail="Error processing query embeddings")
        
        try:
            search_body = {
                "size": 10,
                "query": {
                    "bool": {
                        "should": [
                            {
                                "multi_match": {
                                    "query": scheme_name,
                                    "fields": ["scheme_name^2", "text", "english_text"],
                                    "type": "best_fields",
                                    "boost": 2.0
                                }
                            },
                            {
                                "script_score": {
                                    "query": {"match_all": {}},
                                    "script": {
                                        "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                                        "params": {"query_vector": original_query_embedding}
                                    },
                                    "boost": 1.5
                                }
                            },
                            {
                                "script_score": {
                                    "query": {"match_all": {}},
                                    "script": {
                                        "source": "cosineSimilarity(params.query_vector, 'english_embedding') + 1.0",
                                        "params": {"query_vector": english_query_embedding}
                                    },
                                    "boost": 1.8
                                }
                            }
                        ],
                        "minimum_should_match": 1
                    }
                },
                "_source": ["text", "english_text", "chunk_id", "scheme_name", "document_id", "language"]
            }
            
            logger.info(f"Searching for multilingual chunks related to scheme: {scheme_name}")
            response = es_client.search(index="haqdarshak", body=search_body)
            
            retrieved_chunks = []
            seen_chunk_ids = set()
            
            for hit in response['hits']['hits']:
                chunk_id = f"{hit['_source']['document_id']}_{hit['_source']['chunk_id']}"
                if chunk_id not in seen_chunk_ids:
                    seen_chunk_ids.add(chunk_id)
                    retrieved_chunks.append({
                        "text": hit['_source']['text'],
                        "english_text": hit['_source'].get('english_text', hit['_source']['text']),
                        "chunk_id": hit['_source']['chunk_id'],
                        "language": hit['_source'].get('language', 'en-IN'),
                        "score": hit['_score']
                    })
            
            retrieved_chunks = sorted(retrieved_chunks, key=lambda x: x['score'], reverse=True)[:5]
            logger.info(f"Retrieved {len(retrieved_chunks)} unique multilingual chunks from Elasticsearch")
            
        except Exception as e:
            logger.error(f"Error searching Elasticsearch: {e}")
            try:
                logger.info("Falling back to MongoDB search")
                markdown_doc = markdown_collection.find_one({"scheme_name": scheme_name})
                if markdown_doc:
                    content = markdown_doc.get("markdown_content", "")
                    chunks = pdf_processor.chunk_text_custom(content, max_length=400)
                    retrieved_chunks = [
                        {
                            "text": chunk, 
                            "english_text": chunk,
                            "chunk_id": i, 
                            "language": "en-IN",
                            "score": 1.0
                        }
                        for i, chunk in enumerate(chunks[:5])
                    ]
                else:
                    retrieved_chunks = []
            except Exception as fallback_error:
                logger.error(f"Fallback search also failed: {fallback_error}")
                retrieved_chunks = []
        
        if not retrieved_chunks:
            response_text = f"I couldn't find specific information about {scheme_name}. Please make sure the scheme name is correct or try uploading the relevant document first."
            
            if original_language != 'en-IN':
                response_text = translation_service.translate_from_english(response_text, original_language)
            
            return RAGResponse(
                success=False,
                message=f"No information found for scheme: {scheme_name}",
                scheme_name=scheme_name,
                response=response_text,
                retrieved_chunks=[],
                detected_language=detected_language,
                translated_query=translated_query
            )
        
        context = "\n\n".join([chunk['english_text'] for chunk in retrieved_chunks])
        
        response_prompt = """
        You are a helpful chatbot answering questions about government schemes. 
        Use the following context to answer the user's query accurately and concisely in English.
        The user's original query was in a different language, but provide your answer in clear English first.
        
        Context:
        {context}
        
        Original User Query: {original_query}
        Translated Query: {translated_query}
        
        Provide a comprehensive answer based on the context. If the context doesn't contain enough information, 
        provide what information is available and suggest clarifying the query:
        """
        
        response_text = "No relevant information found. Please clarify your query or specify the correct scheme."
        try:
            prompt = response_prompt.format(
                context=context,
                original_query=query.query,
                translated_query=translated_query
            )
            response = gemini_model.generate_content(prompt)
            response_text = response.text.strip()
            logger.info("Generated English response successfully")
            
            if original_language != 'en-IN':
                logger.info(f"Translating response back to {original_language}")
                response_text = translation_service.translate_from_english(response_text, original_language)
                logger.info("Response translated back successfully")
                
        except Exception as e:
            logger.error(f"Error generating response with Gemini API: {e}")
            error_response = f"I found information about {scheme_name}, but I'm having trouble generating a response right now. Please try again."
            
            if original_language != 'en-IN':
                error_response = translation_service.translate_from_english(error_response, original_language)
            response_text = error_response
        
        return RAGResponse(
            success=True,
            message="Multilingual query processed successfully",
            scheme_name=scheme_name,
            response=response_text,
            retrieved_chunks=retrieved_chunks,
            detected_language=detected_language,
            translated_query=translated_query
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error processing multilingual RAG query: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")
