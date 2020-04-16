import React from "react";
import styled from "styled-components";
import config from "../../config";
import { IComic } from "./Comic";
import Button from "react-bootstrap/Button";
import { parseQueryString } from "../../Utility";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { stringify } from "querystring";
import Container from "react-bootstrap/Container";
interface ComicPageViewContentProps {
  comic: IComic;
  location: any;
}
interface ComicPageViewContentState {
  curPage: number;
}
export class ComicPageViewContent extends React.Component<
  ComicPageViewContentProps,
  ComicPageViewContentState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      curPage: 0,
    };
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    if (this.props.location.search) {
      const paramsMap = parseQueryString(this.props.location.search);
      if (paramsMap.has("p")) {
        this.setState({ curPage: parseInt(paramsMap.get("p")) });
      }
    }
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }
  handleKeyDown = (event: { key: any }) => {
    console.log(event.key);
    switch (event.key) {
      case "ArrowRight":
        this.setState({ curPage: this.state.curPage + 1 });
        break;
      case "ArrowLeft":
        this.setState({ curPage: Math.max(0, this.state.curPage - 1) });
        break;
    }
  };
  render() {
    const Img = styled.img`
      width: 100%;
    `;
    const contents = (
      <Img
        src={`/api/v1/comics/${this.props.comic.id}?page=${this.state.curPage}`}
        onError={(e) => {
          console.log(e);
        }}
      />
    );
    console.log(this.props);
    return (
      <>
        {contents}
        <Container fluid>
          <Row style={{ justifyContent: "center" }}>
            <Button
              disabled={this.state.curPage <= 0}
              onClick={() => {
                this.setState({ curPage: Math.max(0, this.state.curPage - 1) });
              }}
            >
              Pre
            </Button>
            <input
              placeholder={`${this.state.curPage + 1}/${
                this.props.comic.totalPage
              }`}
              style={{ textAlign: "center" }}
            ></input>
            <Button
              disabled={this.state.curPage + 1 >= this.props.comic.totalPage}
              onClick={() => {
                this.setState({ curPage: this.state.curPage + 1 });
              }}
            >
              Next
            </Button>
          </Row>
        </Container>
      </>
    );
  }
}
