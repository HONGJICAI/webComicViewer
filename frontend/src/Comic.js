import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styled from 'styled-components';
import PageNav from './PageNav.js'

// let backendHost = "http://192.168.2.149:5000";
let backendHost = "http://192.168.2.116:5000";
class ComicContent extends React.Component {
  constructor(props) {
    super(props);
    console.log('cons');
    // const uri = window.location.pathname.split('/');
    // this.filename = uri[uri.length - 1];
    this.filename = props.filename;
    this.loadNumPerReq = 3;
    this.state = {
      maxPage: this.loadNumPerReq,
      continueLoading: true
    };
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
  handleScroll() {
    if (!this.state.continueLoading) {
      window.removeEventListener('scroll', this.handleScroll)
      return;
    }
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom + 100 >= docHeight) {
      this.setState({ maxPage: this.state.maxPage + this.loadNumPerReq });
    }
  }
  render() {
    console.log('render');
    const pages = Array.from(new Array(this.state.maxPage), (val, index) => index);
    const Img = styled.img`
        width: 100%;
    `;
    console.log(`${backendHost}/api/v1/comics/${this.filename}?page=${0}`);
    const contents = pages.map((val, idx) =>
      <Img key={"Content" + this.filename + String(idx)}
        src={`${backendHost}/api/v1/comics/${this.filename}?page=${val}`}
        onError={(e) => {
          e.target.onError = null; e.target.src = "";
          this.setState({
            continueLoading: false,
            maxPage: this.state.maxPage - 1
          })
        }
        }
      />
    );
    return (
        {contents}
    );
  }
}

class Comic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comics: [],
      renderContent: false,
      numPerPage: 10,
      curPage: 1
    };
    this.getList();
  }
  async getList() {
    try {
      let rsp = await fetch(`${backendHost}/api/v1/comics`);
      let data = await rsp.json();
      this.setState({ comics: data });
    }
    catch (e) {
      alert(e);
    }
  }
  render() {
    const Img = styled.img`
      width: 25%;
    `;
    const listItems = this.state.comics.map((filename, idx) =>
      <li key={"List" + filename} onClick={() => this.setState({ renderContent: true })}>
        <Link to={`/comic/${filename}`}>
          <Img src={`${backendHost}/api/v1/comics/${filename}`}></Img>
          {filename}
        </Link>
      </li>
    );
    const listRoute = this.state.comics.map(filename =>
      <Route key={"Route" + filename} path={`/comic/${filename}`}
        render={ ()=><ComicContent filename={filename}/>}
      />
    );
    const totalPage = parseInt(this.state.comics.length / this.state.numPerPage) + (this.state.comics.length % this.state.numPerPage ? 1 : 0);
    const pageInfo = {
      curPage: this.state.curPage,
      totalPage: totalPage
    };
    const pageNav =
      <PageNav pageInfo={pageInfo}
        onClickPre={() => this.setState({ curPage: Math.max(1, this.state.curPage - 1) })}
        onClickNext={() => this.setState({ curPage: Math.min(totalPage, this.state.curPage + 1) })}
      />;
    return (
      <Router>
        {this.state.renderContent ?
          (listRoute) :
          (
            <div>
              {pageNav}
              <ul>
                {listItems.slice((this.state.curPage - 1) * this.state.numPerPage, Math.min(this.state.curPage * this.state.numPerPage, this.state.comics.length))}
              </ul>
              {pageNav}
            </div>
          )
        }
      </Router>
    );
  }
}

export default Comic;