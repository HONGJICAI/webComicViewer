import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { ComicList } from './ComicList';

it('renders without crashing', () => {
    const div = document.createElement('div');
    const pageInfo = {
        curPage: 0,
        totalPage: 10
      };
    ReactDOM.render(<Router>
        <ComicList
            comics={[]}
            numPerPage={5}
            curPage={0}
            pageNav={pageInfo} />
    </Router>, div);
    ReactDOM.unmountComponentAtNode(div);
});
