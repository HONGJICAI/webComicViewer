import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { ComicScrollViewContent } from './ComicScrollViewContent';

it('renders without crashing', () => {
    const div = document.createElement('div');
    const comic = {
        id : 1,
        name : "test",
        path : "test.zip",
        lastModifiedTime : 0
    };
    ReactDOM.render(<Router>
        <ComicScrollViewContent
            comic={comic} />
    </Router>, div);
    ReactDOM.unmountComponentAtNode(div);
});
