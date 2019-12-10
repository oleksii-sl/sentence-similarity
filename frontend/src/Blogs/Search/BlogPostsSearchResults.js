import {Col, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import React from "react";

const BlogPostsSearchResults = ({posts}) => {
    function* renderCols(start, end) {
        for (let i = start; i < end; i++) {
            const post = posts[i];
            yield <Col key={post._id} className="col-4 mt-4">
                <div className="blog-post-search-result">
                    {post._source.content.substring(0, 200)}...
                </div>
                <Link to={`/blog-posts/${post._id}`}>
                    Details
                </Link>
            </Col>
        }
    }

    function* renderRows() {
        for (let i = 0; i < posts.length; i += 3) {
            let end = i + 3 < posts.length ? i + 3 : posts.length;
            yield <Row key={i} className="justify-content-center text-center">
                {[...renderCols(i, end)]}
            </Row>
        }
    }

    return <>{[...renderRows()]}</>
};

export default BlogPostsSearchResults;