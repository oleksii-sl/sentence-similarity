import {Link, Route, Switch, useRouteMatch} from "react-router-dom";
import React from "react";

const BlogPostNav = () => {
    const {path, url} = useRouteMatch();
    return <div>
        <div className="p-2">
            <Link to="/" className="btn btn-primary">Home</Link>
        </div>

        <div><Switch>
            <Route exact path={path}>
                <Link className="btn btn-primary" to={`${url}/sentences`}>
                    View sentences
                </Link>
            </Route>
            <Route path={`${path}/sentences`}>
                <Link className="btn btn-primary" to={`${url}`}>
                    View blog
                </Link>
            </Route>
        </Switch></div>
    </div>
};

export default BlogPostNav;