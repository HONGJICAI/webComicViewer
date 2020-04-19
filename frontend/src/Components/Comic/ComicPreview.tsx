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
      @media only screen and (max-width: 760px){
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
    const tags = [...getTagsFromNames([comic.name]).keys()].map((tag) => (
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
            <Row>
              <Link to={`/comic/${comic.id}/ScrollView`}>
                <Button>ScrollView</Button>
              </Link>
              <Link to={`/comic/${comic.id}/PageView`}>
                <Button>PageView</Button>
              </Link>
            </Row>
          </Col>
        </Row>
      </Container>
    );

    const pages = Array.from(new Array(comic.totalPage), (val, index) => index);
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
                <Col xs={0} md={2}></Col>
                {/* main preview content */}
                <Col>
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
