import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { ComicPreview } from './ComicPreview';

it('renders without crashing', () => {
    const div = document.createElement('div');
    const comics = [{
        id: 1,
        name: "test",
        path: "test.zip",
        lastModifiedTime: 0
    }];
    const match = {
        params:{
            comicid:1
        }
    }
    ReactDOM.render(<Router>
        <ComicPreview
            comics={comics}
            match={match} />
    </Router>, div);
    ReactDOM.unmountComponentAtNode(div);
});
