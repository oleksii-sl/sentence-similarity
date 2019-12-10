import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import React from "react";


const BlogPostsSearchWidget = ({searchQuery, searchDisabled, onInputChange, searchPosts}) => {
    return (
        <div className="search-widget">
            <input type="text" placeholder="type..." onChange={onInputChange}
                   value={searchQuery} disabled={searchDisabled}/>
            <Button disabled={searchDisabled}>
                <FontAwesomeIcon icon={faSearch} onClick={searchPosts}/>
            </Button>
        </div>
    )
};

export default BlogPostsSearchWidget;
