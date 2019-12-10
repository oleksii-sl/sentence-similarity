from elasticsearch_dsl.query import MatchPhrase
from flask import request

from app.api import bp
from app.models import BlogPost


@bp.route('/search_blog_posts', methods=['GET'])
def search_blog_posts():
    return BlogPost.search().query(
        MatchPhrase(content=request.args['q'])
    ).execute().to_dict()


@bp.route('/blog_posts/<post_id>/', methods=['GET'])
def get_blog_post_by_id(post_id):
    post = BlogPost.get(
        id=post_id
    ).to_dict()
    post['created_at'] = str(post['created_at'])
    return post
