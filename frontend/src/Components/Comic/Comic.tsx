import React from "react";
import { PageNav } from "../PageNav";
import { ComicList } from "./ComicList";
import { AppendAlertToBottom, getTagsFromNames } from "./../../Utility";
import styled from "styled-components";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import { Route, RouteComponentProps } from "react-router-dom";

export interface IComic {
  id: number;
  name: string;
  path: string;
  lastModifiedTime: number;
  totalPage: number;
}
interface IComicProps {}
interface IComicState {
  comics: Array<IComic>;
  curPage: number;
}
export class Comic extends React.Component<
  IComicProps & RouteComponentProps,
  IComicState
> {
  numPerPage: number;
  constructor(props: IComicProps & RouteComponentProps) {
    super(props);
    this.numPerPage = 30;
    this.state = {
      comics: [],
      curPage: 1,
    };
    this.getList();
  }
  async getList() {
    try {
      const rsp = await fetch(`/api/v1/comics`);
      if (rsp.ok) {
        const data = await rsp.json();
        this.setState({ comics: data });
      } else {
        const text = await rsp.text();
        AppendAlertToBottom(
          `Failed to get comics, got status: ${rsp.status} ${rsp.statusText}`,
          text
        );
        console.log(
          `Failed to get comics, got status: ${rsp.status} ${rsp.statusText}`,
          text
        );
      }
    } catch (e) {
      console.log(e);
      AppendAlertToBottom("Get comics failed", "reason unknown");
    }
  }
  render() {
    const totalPage =
      Math.floor(this.state.comics.length / this.numPerPage) +
      (this.state.comics.length % this.numPerPage ? 1 : 0);
    const pageNav = (
      <PageNav
        currentPage={this.state.curPage}
        totalPage={totalPage}
        onClickSpecifyPage={(page: number) =>
          this.setState({
            curPage: page,
          })
        }
      />
    );
    return (
      <ComicList
        {...this.props}
        comics={this.state.comics}
        numPerPage={this.numPerPage}
        curPage={this.state.curPage}
        pageNav={pageNav}
      />
    );
  }
}
