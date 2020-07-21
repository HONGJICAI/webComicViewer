import React from "react";
import { Link, Route, Switch, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import config from "../../config";
import { IComic } from "./Comic";
import { ComicPageViewContent } from "./ComicPageViewContent";
import { ComicScrollViewContent } from "./ComicScrollViewContent";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { IThumb, ThumbGroup } from "../ThumbGroup";
import { getTagsFromNames } from "../../Utility";
import Badge from "react-bootstrap/Badge";

interface IComicPreviewProps {
  comics: Array<IComic>;
  match: any;
}
interface IComicPreviewState {
  comics: Array<IComic>;
}
export class ComicPreview extends React.Component<
  IComicPreviewProps & RouteComponentProps,
  IComicPreviewState
> {
  constructor(props: IComicPreviewProps & RouteComponentProps) {
    super(props);
    this.state = {
      comics: props.comics,
    };
  }
  componentWillReceiveProps(nextProps: { comics: Array<IComic> }) {
    nextProps.comics !== this.props.comics &&
      this.setState({
        comics: nextProps.comics,
      });
  }
  render() {
    const Img = styled.img`
      display: block;
      margin-left: auto;
      margin-right: auto;
      margin-top: auto;
      margin-bottom: auto;
      height: 25vw
      width: auto
      @media only screen and (max-width: 768px){
        height: 35vw
      }
    `;
    const [comicid] = [this.props.match.params.comicid];
    if (
      this.state.comics === undefined ||
      comicid >= this.state.comics.length
    ) {
      return <Spinner animation="border" />;
    }
    const comic = this.state.comics[comicid];
    const currentComicTags = [...getTagsFromNames([comic.name]).keys()];
    const tags = currentComicTags.map((tag) => (
      <Badge
        pill
        variant="primary"
        onClick={(e: any) => this.props.history.push(`/comic?s=${tag}`)}
      >
        {`${tag}`}
      </Badge>
    ));
    const detail = (
      <Container fluid>
        <Row>
          <Col xs md>
            <Img src={`/api/v1/comics/${comic.id}?page=0`} />
          </Col>
          <Col xs md>
            <p>Comic Name : {comic.name}</p>
            {tags}
          </Col>
        </Row>
        <Row style={{ justifyContent: "space-around" }}>
          <Link to={`/comic/${comic.id}/ScrollView`}>
            <Button>ScrollView</Button>
          </Link>
          <Link to={`/comic/${comic.id}/PageView`}>
            <Button>PageView</Button>
          </Link>
          <i
            className="far fa-heart"
            onClick={(e) => {
              var target = e.target as HTMLElement;
              target.className = "fas fa-heart";
            }}
          ></i>
          <i className="far fa-thumbs-up"></i>
          <i className="far fa-thumbs-down"></i>
        </Row>
      </Container>
    );
    const leftSidebar = (
      <Container fluid className="col-xs-0">
        <Row></Row>
      </Container>
    );

    const pages = Array.from(new Array(comic.page), (val, index) => index);
    const thumbs: Array<IThumb> = pages.map((val: number, idx: number) => {
      return {
        thumbUrl: `/api/v1/comics/${comic.id}?page=${idx}`,
        jumpToUrl: `/comic/${comic.id}/PageView?p=${idx}`,
        thumbName: `${idx}`,
      };
    });
    return (
      <>
        <Route
          exact
          path={`/comic/${comic.id}`}
          render={() => (
            <Container fluid>
              <Row>
                {/* left side bar */}
                <Col md={2}>{leftSidebar}</Col>
                {/* main preview content */}
                <Col>
                  <Button variant="light">
                    <i
                      className="fas fa-long-arrow-alt-left"
                      onClick={(e) => this.props.history.push(`/comic`)}
                    ></i>
                  </Button>
                  <div>{detail}</div>
                  <br />
                  <ThumbGroup thumbArray={thumbs} />
                </Col>
              </Row>
            </Container>
          )}
        />
        <Route
          path={`/comic/${comic.id}/ScrollView`}
          render={(props) => <ComicScrollViewContent comic={comic} />}
        />
        <Route
          path={`/comic/${comic.id}/PageView`}
          render={(props) => <ComicPageViewContent {...props} comic={comic} />}
        />
      </>
    );
  }
}
