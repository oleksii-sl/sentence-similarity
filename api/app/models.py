from elasticsearch_dsl import Document, Date, \
    InnerDoc, Keyword, Text, Field, Object, Integer

from .similarity import text_to_sentence_vectors


class DenseVector(Field):
    name = 'dense_vector'


class Sentence(Document):
    post_id = Keyword()
    order = Integer()
    content = Keyword()
    vector = DenseVector(dims=300)

    class Index:
        name = 'blog_post_sentences'
        settings = dict(
            number_of_shards=1,
            number_of_replicas=0
        )


class Author(InnerDoc):
    id = Integer()
    age = Integer()
    gender = Keyword()
    industry = Keyword()
    astrological_sign = Keyword()


class BlogPost(Document):
    id = Keyword()
    author = Object(Author)
    content = Text()
    created_at = Date()

    class Index:
        name = 'blog_posts'
        settings = dict(
            number_of_shards=1,
            number_of_replicas=0
        )

    def content_to_sentences(self):
        for i, (sentence, vector) in enumerate(text_to_sentence_vectors(self.content)):
            yield Sentence(post_id=self.id, order=i, content=sentence, vector=vector)
