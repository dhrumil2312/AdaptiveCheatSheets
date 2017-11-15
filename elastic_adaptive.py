import requests
import json
headers = {'content-type': 'application/json'}

data = {
    "settings": {
        "analysis" : {
            "analyzer" : {
                "content_analyzer" : {
                    "tokenizer" : "standard",
                    "filter" : ["standard", "lowercase", "my_stemmer"]
                }
            },
            "filter" : {
                "my_stemmer" : {
                    "type" : "stemmer",
                    "name" : "english"
                }
            }
        }
    },
"mappings": {
    "data": {
      "properties": {
        "note_id": {
          "type": "string"
        },
        "author_id": {
          "type": "string"
        },
        "content": {
          "type": "string",
          "analyzer": "content_analyzer"
        },
        "mainpage": {
          "type": "string"
        }
      }
    }
  }
}


r = requests.put('http://localhost:9200/AdaptiveCheatSheet' , headers=headers , data=json.dumps(data) )
print(r.content)
print(r.status_code)
i = 1
with open('finalnotes.json','r') as f:
    for line in f:
        dat = json.loads(line)
        url = 'http://localhost:9200/AdaptiveCheatSheet/data/'+str(i)
        #print(dat)
        print(url)
        i += 1
        r = requests.put(url, headers=headers, data=json.dumps(dat))
        print(r.content)
        print(r.status_code)


