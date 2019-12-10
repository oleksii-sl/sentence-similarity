import uuid
from datetime import datetime
from zipfile import ZipFile

import click
import xmltodict
from elasticsearch.helpers import bulk
from elasticsearch_dsl.connections import connections

from .models import BlogPost, Sentence


ES_INDEXES = {i.Index.name: i._index for i in [BlogPost, Sentence]}


@click.command()
def es_create_schema():
    for name, index in ES_INDEXES.items():
        es_drop_index(name)
        index.create()


# drops original index if name is alias
def es_drop_index(index_name):
    es = connections.get_connection()
    real_index_name = index_name
    if es.indices.exists_alias(name=index_name):
        real_index_name = list(es.indices.get_alias(name=index_name).keys())[0]
    es.indices.delete(index=real_index_name, ignore=404)


def es_reindex_for(index_name):
    source_index = ES_INDEXES[index_name]

    new_index = source_index.clone(f'{index_name}_{uuid.uuid1()}')
    new_index.save()

    es = connections.get_connection()
    es.reindex({
        'source': {'index': index_name},
        'dest': {'index': new_index._name}
    }, params={'request_timeout': 120})
    es_drop_index(index_name)

    new_index.put_alias(name=index_name)


@click.command()
@click.argument('indexes', nargs=10, default=ES_INDEXES.keys())
def es_reindex(indexes):
    for index_name in indexes:
        es_reindex_for(index_name)


def extract_posts_from_blog(author, blog):
    for date_str, post_content in zip(blog['date'], blog['post']):
        # skip empty posts or posts with too few sentences
        if not post_content or post_content.count('.') < 5:
            continue
        try:
            date = datetime.strptime(date_str, '%d,%B,%Y').date()
        except Exception as e:
            print(date_str, e)
            continue
        yield BlogPost(
            id=str(uuid.uuid1()),
            author=author,
            created_at=date,
            content=post_content
        )


def extract_posts_from_zip(zipfile, limit):
    archive = ZipFile(zipfile, 'r')
    counter = 0
    author_fields = ['id', 'gender', 'age', 'industry', 'astrological_sign']
    for file_name in archive.namelist():
        if not file_name.endswith('.xml'):
            continue
        author = dict(
            (k, v) for k, v in zip(author_fields, file_name.replace('blogs/', '').split('.'))
        )
        # there are invalid xmls with non-unicode chars and not encoded entities
        xml = str(archive.read(file_name), 'utf-8', errors='ignore').replace('&', ' ')
        try:
            blog = xmltodict.parse(xml)['Blog']
        except Exception as e:
            print(file_name, e)
            continue
        for blog_post in extract_posts_from_blog(author, blog):
            yield blog_post.to_dict(include_meta=True)
            counter += 1
            for sentence in blog_post.content_to_sentences():
                yield sentence.to_dict(include_meta=True)
            if counter == limit:
                return


@click.command()
@click.option('--zipfile', type=click.Path(exists=True, readable=True, dir_okay=False),
              help='path to zip containing blog posts')
@click.option('--limit', type=int, help='max number of posts to load', default=10000)
def load_blog_posts_to_es(zipfile, limit):
    bulk(
        connections.get_connection(),
        extract_posts_from_zip(zipfile, limit),
        request_timeout=120,
        chunk_size=100,
    )
