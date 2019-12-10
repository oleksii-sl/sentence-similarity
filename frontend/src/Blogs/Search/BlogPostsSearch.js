import React, {useEffect, useState} from "react";

import { Col, Row} from 'react-bootstrap';
import $ from 'jquery'
import BlogPostsSearchWidget from "./BlogPostsSearchWidget";
import BlogPostsSearchResults from "./BlogPostsSearchResults";


const BlogPostsSearch = () => {
    const [searchDisabled, setSearchDisabled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('bananas');
    const [posts, setPosts] = useState([]);

    const searchPosts = () => {
        if (searchQuery.trim().length < 3)
            return;
        setSearchDisabled(true);
        $.getJSON('/api/search_blog_posts', {q: searchQuery})
            .done((data) => setPosts(data.hits.hits))
            .always(() => setSearchDisabled(false));
    };
    useEffect(searchPosts, []);

    return (<>
        <Row className="justify-content-center"><Col md="auto">
            <span className="align-middle">Find posts in blog posts db</span>
        </Col>
        </Row>
        <Row className="justify-content-center">
            <Col md="auto">
                <BlogPostsSearchWidget
                    searchQuery={searchQuery} searchDisabled={searchDisabled}
                    onInputChange={(e) => setSearchQuery(e.target.value)}
                    searchPosts={searchPosts}
                />
            </Col>
        </Row>
        <div>
            <BlogPostsSearchResults posts={posts}/>
        </div>
    </>)
};

export default BlogPostsSearch;