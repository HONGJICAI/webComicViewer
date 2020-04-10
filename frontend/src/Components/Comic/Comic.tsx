import React from "react";
import config from "../../config";
import { PageNav } from "../../PageNav";
import { ComicList } from "./ComicList";

export interface IComic {
  id: number;
  name: string;
  path: string;
  lastModifiedTime: number;
}
interface IComicProps {}
interface IComicState {
  comics: Array<IComic>;
  curPage: number;
}
export class Comic extends React.Component<IComicProps, IComicState> {
  numPerPage: number;
  constructor(props: IComicProps) {
    super(props);
    this.numPerPage = 5;
    this.state = {
      comics: [],
      curPage: 1,
    };
    this.getList();
  }
  async getList() {
    try {
      const rsp = await fetch(`${config.backendHost}/api/v1/comics`);
      const data = await rsp.json();
      this.setState({ comics: data });
    } catch (e) {
      alert(e);
    }
  }
  render() {
    const totalPage =
      Math.floor(this.state.comics.length / this.numPerPage) +
      (this.state.comics.length % this.numPerPage ? 1 : 0);
    const pageInfo = {
      curPage: this.state.curPage,
      totalPage: totalPage,
    };
    const pageNav = (
      <PageNav
        pageInfo={pageInfo}
        onClickPre={() =>
          this.setState({ curPage: Math.max(1, this.state.curPage - 1) })
        }
        onClickNext={() =>
          this.setState({
            curPage: Math.min(totalPage, this.state.curPage + 1),
          })
        }
      />
    );
    return (
      <ComicList
        comics={this.state.comics}
        numPerPage={this.numPerPage}
        curPage={this.state.curPage}
        pageNav={pageNav}
      />
    );
  }
}
