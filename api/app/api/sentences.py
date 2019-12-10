from elasticsearch_dsl.function import ScriptScore
from elasticsearch_dsl.query import FunctionScore, Term
from flask import request, jsonify

from app.api import bp
from app.models import BlogPost, Sentence
from app.similarity import text_to_vector


FILTER_PATH = ','.join(
    '-hits.hits._source.' + f
    for f in ['vector', 'post_id', 'order']
)


@bp.route('/blog_posts/<post_id>/sentences', methods=['GET'])
def get_blog_post_sentences(post_id):
    post_uuid = BlogPost.get(id=post_id).id

    resp = Sentence.search().query(
        Term(post_id=post_uuid)
    )[:200].params(filter_path=FILTER_PATH).sort('order').execute()
    return es_resp_to_sentences_resp(resp)


@bp.route('/find_similar_sentences')
def find_similar_sentences():
    query_vector = text_to_vector(request.args['text'])

    query = FunctionScore(
        functions=[ScriptScore(script=dict(
            source="cosineSimilarity(params.query_vector, doc['vector']) + 1.0",
            params={"query_vector": query_vector}
        ))])
    resp = Sentence.search().query(
        query
    ).params(filter_path=FILTER_PATH).execute()
    return es_resp_to_sentences_resp(resp)


def es_resp_to_sentences_resp(resp):
    return jsonify([{
        'id': hit.meta.id, 'score': hit.meta.score, **hit.to_dict()
    } for hit in resp])
