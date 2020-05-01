import React, { useEffect, FormEvent, SyntheticEvent } from "react";
import styled from "styled-components";
import config from "../../config";
import { IComic } from "./Comic";
import Button from "react-bootstrap/Button";
import { parseQueryString } from "../../Utility";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { Link, RouteProps, RouteComponentProps } from "react-router-dom";
import ReactDOM from "react-dom";
import Form from "react-bootstrap/Form";
import { PageNav } from "../PageNav";
interface ComicPageViewContentProps {
  comic: IComic;
  // location: any;
}
interface ComicPageViewContentState {}
export class ComicPageViewContent extends React.Component<
  ComicPageViewContentProps & RouteComponentProps,
  ComicPageViewContentState
> {
  curPage: number;
  constructor(props: any) {
    super(props);
    this.curPage = 0;
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }
  componentDidUpdate() {
    window.scrollTo(0, 0);
  }
  hasNextPage() {
    return this.curPage + 1 < this.props.comic.totalPage;
  }
  hasPreviousPage() {
    return this.curPage > 0;
  }
  turnToNextPage() {
    if (this.hasNextPage()) {
      this.props.history.push(`?p=${this.curPage + 1}`);
    }
  }
  turnToPreviousPage() {
    this.hasPreviousPage() && this.props.history.push(`?p=${this.curPage - 1}`);
  }
  hasSpecifyPage(page: number) {
    return page >= 1 && page <= this.props.comic.totalPage;
  }
  turnToSpecifyPage(page: number) {
    this.hasSpecifyPage(page) && this.props.history.push(`?p=${page}`);
  }
  handleKeyDown = (event: KeyboardEvent) => {
    const pageInput = document.querySelector("#content-page-input");
    if (document.activeElement === pageInput) return;
    console.log(event.key);
    switch (event.key) {
      case "ArrowRight":
        this.turnToNextPage();
        break;
      case "ArrowLeft":
        this.turnToPreviousPage();
        break;
    }
  };
  render() {
    if (this.props.location.search) {
      const paramsMap = parseQueryString(this.props.location.search);
      if (paramsMap.has("p")) {
        this.curPage = parseInt(paramsMap.get("p"));
      }
    }
    const Img = styled.img`
      width: 100%;
    `;
    const contents = (
      <Img
        id="comic-content"
        src={`/api/v1/comics/${this.props.comic.id}?page=${this.curPage}`}
        onError={(e) => {
          console.log(e);
        }}
        onClick={(e) => {
          const comicContent = document.querySelector("#comic-content");
          if (comicContent) {
            const contentRect = comicContent.getBoundingClientRect();
            const x = e.pageX;
            if (x) {
              const turnRight =
                x - contentRect.left >
                (contentRect.right - contentRect.left) / 2;
              turnRight && this.turnToNextPage();
              !turnRight && this.turnToPreviousPage();
            }
          }
        }}
      />
    );
    console.log(this.props);
    return (
      <Container fluid>
        <Row>
          {/* left side bar */}
          <Col xs={0} md={2}></Col>
          {/* main content */}
          <Col style={{ justifyContent: "center", padding: "1" }}>
            <Button variant="light">
              <i
                className="fas fa-long-arrow-alt-left"
                onClick={(e) =>
                  this.props.history.push(`/comic/${this.props.comic.id}`)
                }
              ></i>
            </Button>
            {/* comic content */}
            {contents}
            {/* Pagination  */}
            <PageNav
              onClickSpecifyPage={(page) => this.turnToSpecifyPage(page)}
              currentPage={this.curPage}
              totalPage={this.props.comic.totalPage}
            />
          </Col>
          {/* right side bar */}
          <Col xs={0} md={2}></Col>
        </Row>
      </Container>
    );
  }
}
