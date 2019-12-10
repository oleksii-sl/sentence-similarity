import {Route, Switch, useRouteMatch} from "react-router-dom";
import BlogPostSentences from "./BlogPostSentences";
import React from "react";

const BlogPostContent = ({post}) => {
    const {path} = useRouteMatch();
    return <Switch>
        <Route path={`${path}/sentences`} component={BlogPostSentences}/>
        <Route exact path={path}>
            <div className="text-left">
                {post.content}
            </div>
        </Route>
    </Switch>
};

export default BlogPostContent;