import spacy

_nlp = spacy.load('en_core_web_md')
_nlp.add_pipe(_nlp.create_pipe("sentencizer"), before="parser")


def text_to_sentence_vectors(text):
    for sentence in _nlp(text).sents:
        if sentence.vector_norm < .001:
            continue
        yield str(sentence), (sentence.vector / sentence.vector_norm).tolist()


def text_to_vector(text):
    doc = _nlp(text)
    return (doc.vector / doc.vector_norm).tolist()
