from flask import Blueprint

bp = Blueprint('api', __name__)

from app.api import blog_posts, sentences #noqa
