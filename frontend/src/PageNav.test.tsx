import React from 'react';
import ReactDOM from 'react-dom';
import { PageNav } from './PageNav';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const pageInfo = {
    curPage: 0,
    totalPage: 2
  };
  ReactDOM.render(<PageNav pageInfo={pageInfo} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
