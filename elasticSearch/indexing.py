from elasticsearch import Elasticsearch 

client = Elasticsearch(
    "https://my-elasticsearch-project-c1043c.es.us-central1.gcp.elastic.cloud:443",
    api_key="NmhZSlI1Z0JVTTFkNkhWVWVTdnQ6YXFKcW54R3RVazdkeFBjXzk5RC1EUQ=="
)

index_name='search'

mapping={
    "properties":{
        "text":{
            "type":"semantic_text"
        }
    }

}

mapping_response=client.indices.put_mapping(index=index_name,body=mapping)
print(mapping_response)
