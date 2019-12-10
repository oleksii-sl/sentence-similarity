import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import $ from 'jquery';
import {Container, Row, Col, Spinner} from "react-bootstrap";
import AuthorDetails from "./AuthorDetails";
import BlogPostNav from "./BlogPostNav";
import BlogPostContent from "./BlogPostContent";


export default function BlogPost() {
    const {postId} = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        $.getJSON(`/api/blog_posts/${postId}/`)
            .done((data) => setPost(data));
    }, [postId]);

    return (
        <Container>
            {post ? (<>
                <Row><Col>
                    <AuthorDetails {...post.author} posted_on={post.created_at}/>
                </Col><Col className="d-flex justify-content-center align-items-center">
                    <BlogPostNav/>
                </Col></Row>
                <Row><Col><BlogPostContent post={post}/> </Col></Row>
            </>) : <Spinner animation="border" variant="primary"/>}

        </Container>
    )
}
