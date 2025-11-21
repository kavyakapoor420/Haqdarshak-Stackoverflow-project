const {GoogleGenAI} =require('@google/genai')
const  cosineSimilarity =require('compute-cosine-similarity')

const api_key="AIzaSyAXzmHm2OTvvjtUmDyQNy-tgDlslaxbOEo"

async function main(){
    const ai=new GoogleGenAI({
        apiKey:api_key
    })

    const texts=[
        'what is meaning of life',
        'what is the purpose of existence',
        'how do i bake a cake '
    ]
    const response=await ai.models.embedContent({
        model:'gemini-embedding-001',
        contents:texts,
        taskType:'SEMANTIC_SIMILARITY'
    })

    const embeddings=response.embeddings.map(e=>e.values)

    for( let i=0;i<texts.length;i++){
        for(let j=i+1;j<texts.length;j++){
            const text1=texts[i];
            const text2=texts[j];

            const similarity=cosineSimilarity(embeddings[i],embeddings[j])

            console.log(`similarity between ${text1} and ${text2} : ${similarity.toFixed(4)}`)
        }
    }
}

main() 



async function main(){

    const ai=new GoogleGenAI({
        apiKey:api_key
    })

    const response=await ai.models.embedContent({
        model:'google-emedding-001',
        content:'what is meaning of life',
        outputDimenssionlaity:768,
    })

    const embeddingLength=response.embeddings.values.length
    console.log(`length of embedding ${embeddingLength}`)
}