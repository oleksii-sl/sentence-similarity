## Sentence-similarity

Flask/React/Elasticsearch solution for finding semantically similar sentences among blog posts
Spacy en_core_web_md model is used for text2vec transformations. 
Solution can be easily adapted for any other text2vec provider (word2vec, GloVe, fastText etc)

---

###Setting up

Run this on host machine `sudo sysctl -w vm.max_map_count=262144`
it sets max virtual mem to higher value, required by elasticsearch

**Start containers for dev**

```sudo docker-compose up```

You'll find frontend at http://localhost:3001

**Start containers for prod**

```sudo docker-compose -f docker-compose.yml -f docker-compose.prod.yml up```

frontend at http://localhost


After this you need to create Elasticsearch schema and load some data
I used this [blogs dataset](http://u.cs.biu.ac.il/~koppel/BlogCorpus.htm)
You need to download it, put under api folder or add mount option,
start containers & execute following commands in order to load data:
```bash
# enter api container
sudo docker-compose exec api bash

# create indexes schema from Elasticsearch_dsl mapping
flask es-create-schema

# load blogs data, you may have different zip path
# there are lots of malformed xml so you'll see errors, but it's ok
flask load-blog-posts-to-es --zipfile blogs.zip
```