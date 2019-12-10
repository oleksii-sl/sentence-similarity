import Container from "react-bootstrap/Container";
import BlogPostsSearch from "./Search/BlogPostsSearch";
import React from "react";

export default function Home() {
    return <>
        <header>
            <h2>Blogs DB</h2>
        </header>
        <Container>
            <BlogPostsSearch/>
        </Container>
    </>
}