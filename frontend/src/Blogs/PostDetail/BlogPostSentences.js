import React, {useEffect, useState} from "react";

import $ from 'jquery'
import {useParams} from "react-router-dom";
import {Spinner, OverlayTrigger, Tooltip, Modal, Button} from "react-bootstrap";


export default function BlogPostSentences() {
    const {postId} = useParams();
    const [sentences, setSentences] = useState(null);
    const [findSimilarTo, setFindSimilarTo] = useState();

    useEffect(() => {
        $.getJSON(`/api/blog_posts/${postId}/sentences`)
            .done((sentences) => setSentences(sentences))
    }, [postId]);

    return (<>
        <div className="text-left">
            {sentences ? (
                sentences.map((sentence) =>
                    <OverlayTrigger key={sentence.id}
                                    overlay={<Tooltip>Click to find similar sentences!</Tooltip>}>
                        <span className="blog-post-sentence"
                              onClick={() => setFindSimilarTo(sentence.content)}>
                            {sentence.content}
                        </span>
                    </OverlayTrigger>
                )
            ) : (<Spinner animation="border" variant="primary"/>)}
        </div>
        {findSimilarTo ? <SimilarSentencesModal
            findSimilarTo={findSimilarTo}
            closeModal={() => setFindSimilarTo(null)} /> : ''}
    </>)
}

const SimilarSentencesModal = ({findSimilarTo, closeModal}) => {
    const [similarSentences, setSimilarSentences] = useState();
    useEffect(() => {
        $.getJSON('/api/find_similar_sentences', {text: findSimilarTo})
            .done((sentences) => setSimilarSentences(sentences))
    }, [findSimilarTo]);
    return (
        <Modal show={true} dialogClassName="w75" onHide={closeModal}>
            <Modal.Body>
                {similarSentences ? (
                    similarSentences.map((sent) =>
                        <p key={sent.id}>
                            <strong className="d-block">score: {sent.score}</strong>
                            {sent.content}
                        </p>
                    )
                ) : (<Spinner animation="border" variant="primary"/>)}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={closeModal}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
};