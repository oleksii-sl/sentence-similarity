import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";


import 'bootstrap/dist/css/bootstrap.css';
import './App.scss';
import Home from "./Blogs/Home";
import BlogPost from "./Blogs/PostDetail/BlogPost";

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/blog-posts/:postId" component={BlogPost}/>
                    <Route path="/" component={Home}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
