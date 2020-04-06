import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import styled from 'styled-components';
import PageNav from './PageNav'
import config from './config'

interface Comic {
  id: number,
  name: string,
  path: string,
  lastModifiedTime: number
}
interface IComicContentProps {
  comic: Comic
}
interface IComicContentState {
  curPage: number
}
class ComicPageViewContent extends React.Component<IComicContentProps, IComicContentState> {
  comic: Comic;
  state: IComicContentState;
  constructor(props: any) {
    super(props);
    this.comic = props.comic;
    this.state = {
      curPage: 0
    };
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }
  handleKeyDown = (event: { key: any; }) => {
    console.log(event.key);
    switch (event.key) {
      case "ArrowRight":
        break;
      case "ArrowLeft":
        break;
    }
  }
  render() {
    const Img = styled.img`
        width: 100%;
    `;
    const contents =
      <Img
        src={`${config.backendHost}/api/v1/comics/${this.comic.id}?page=${this.state.curPage}`}
        onError={(e) => {
          const img: any = e.target;
          img.onError = null; img.src = "";
          this.setState({
            curPage: this.state.curPage - 1
          })
        }
        }
      />;
    return (
      <div>
        {contents}
        <button onClick={() => { this.setState({ curPage: Math.max(0, this.state.curPage - 1) }) }}>Pre</button>
        <button onClick={() => { this.setState({ curPage: this.state.curPage + 1 }) }}>Next</button>
      </div>
    );
  }
}
interface IScorllComicContentProps {
  comic: Comic,
}
interface IScorllComicContentState {
  maxPage: number,
  continueLoading: boolean
}
class ComicScrollViewContent extends React.Component<IScorllComicContentProps, IScorllComicContentState> {
  comic: Comic;
  loadNumPerReq: number;
  constructor(props: any) {
    super(props);
    this.comic = props.comic;
    this.loadNumPerReq = 3;
    this.state = {
      maxPage: this.loadNumPerReq,
      continueLoading: true
    };
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    document.addEventListener("keydown", this.handleKeyDown);

  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener("keydown", this.handleKeyDown);
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
  handleKeyDown = (event: { key: any; }) => {
    console.log(event.key);
    const curY = document.documentElement.scrollTop || document.body.scrollTop;
    const curX = window.pageYOffset;
    switch (event.key) {
      case "ArrowRight":
        window.scrollTo(curX, curY + window.innerHeight);
        break;
      case "ArrowLeft":
        window.scrollTo(curX, Math.max(0, curY - window.innerHeight));
        break;
    }
  }
  render() {
    const pages = Array.from(new Array(this.state.maxPage), (val, index) => index);
    const Img = styled.img`
        width: 100%;
    `;
    const contents = pages.map((val, idx) =>
      <Img key={"Content" + this.comic.name + String(idx)}
        src={`${config.backendHost}/api/v1/comics/${this.comic.id}?page=${val}`}
        onError={(e) => {
          const imgdiv: any = e.target;
          imgdiv.onError = null; imgdiv.src = "";
          this.setState({
            continueLoading: false,
            maxPage: this.state.maxPage - 1
          })
        }
        }
      />
    );
    return (
      <div>
        {contents}
      </div>
    );
  }
}

interface IComicPreviewProps {
  comics: Array<Comic>,
  match: any
}
interface IComicPreviewState {
  comics: Array<Comic>
}
class ComicPreview extends React.Component<IComicPreviewProps, IComicPreviewState> {
  constructor(props: IComicPreviewProps) {
    super(props);
    this.state = {
      comics: props.comics,
    };
  }
  componentWillReceiveProps(nextProps: { comics: any; }) {
    nextProps.comics !== this.props.comics && this.setState({
      comics: nextProps.comics
    })
  }
  render() {
    const Img = styled.img`
      width: 25%;
    `;
    const [comicid] = [this.props.match.params.comicid];
    if (this.state.comics === undefined || comicid >= this.state.comics.length) {
      return <div>Loading</div>;
    }
    const comic = this.state.comics[comicid];
    const detail =
      <div>
        <Img src={`${config.backendHost}/api/v1/comics/${comic.id}`}></Img>
        {comic.name}
        <Link to={`/comic/${comic.id}/ScrollView`}>
          <button>ScrollView</button>
        </Link>
        <Link to={`/comic/${comic.id}/PageView`}>
          <button>PageView</button>
        </Link>
      </div>;
    return (
      <Switch>
        <Route exact path={`/comic/${comic.id}`}
          render={() => <div>{detail}</div>}
        />
        <Route key={"Route" + comic.name} path={`/comic/${comic.id}/ScrollView`}
          render={() => <ComicScrollViewContent comic={comic} />}
        />
        <Route key={"Route" + comic.name} path={`/comic/${comic.id}/PageView`}
          render={() => <ComicPageViewContent comic={comic} />}
        />
      </Switch>
    );
  }
}

interface IComicListProps {
  comics: Array<Comic>,
  numPerPage: number,
  curPage: number,
  pageNav: any
}
class ComicList extends React.Component<IComicListProps> {
  render() {
    const Img = styled.img`
      width: 25%;
    `;
    const comics = this.props.comics;
    const numPerPage = this.props.numPerPage;
    const listItems = comics.map((comic: any, idx: number) =>
      <li key={"List" + comic.id}>
        <Link to={`/comic/${comic.id}`}>
          <Img src={`${config.backendHost}/api/v1/comics/${comic.id}`}></Img>
          {comic.name}
        </Link>
      </li>
    );
    return (
      <Switch>
        <Route exact path='/comic'
          render={() =>
            <div>
              <ul>
                {listItems.slice((this.props.curPage - 1) * numPerPage, Math.min(this.props.curPage * numPerPage, comics.length))}
              </ul>
              {this.props.pageNav}
            </div>
          }
        />
        <Route path='/comic/:comicid'
          render={props => <ComicPreview {...props} comics={this.props.comics} />}
        />
      </Switch>
    );
  }
}
interface IComicProps {
}
interface IComicState {
  comics: Array<Comic>,
  numPerPage: number,
  curPage: number
}
class Comic extends React.Component<IComicProps, IComicState> {
  constructor(props: any) {
    super(props);
    this.state = {
      comics: [],
      numPerPage: 5,
      curPage: 1
    };
    this.getList();
  }
  async getList() {
    try {
      const rsp = await fetch(`${config.backendHost}/api/v1/comics`);
      const data = await rsp.json();
      this.setState({ comics: data });
    }
    catch (e) {
      alert(e);
    }
  }
  render() {
    const totalPage = (this.state.comics.length / this.state.numPerPage) + (this.state.comics.length % this.state.numPerPage ? 1 : 0);
    const pageInfo = {
      curPage: this.state.curPage,
      totalPage: totalPage
    };
    const pageNav =
      <PageNav pageInfo={pageInfo}
        onClickPre={() => this.setState({ curPage: Math.max(1, this.state.curPage - 1) })}
        onClickNext={() => this.setState({ curPage: Math.min(totalPage, this.state.curPage + 1) })}
      />;
    return <ComicList
      comics={this.state.comics}
      numPerPage={this.state.numPerPage}
      curPage={this.state.curPage}
      pageNav={pageNav}
    />;
  }
}

export default Comic;