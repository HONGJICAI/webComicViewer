import React, { SyntheticEvent } from "react";
import { Link, Route, RouteComponentProps, Redirect } from "react-router-dom";
import styled from "styled-components";
import { IComic } from "./Comic";
import { ComicPreview } from "./ComicPreview";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ThumbGroup, IThumb } from "../ThumbGroup";
import { getTagsFromNames, IsMobile, parseQueryString } from "../../Utility";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Collapse from "react-bootstrap/Collapse";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
interface IComicListProps {
  comics: Array<IComic>;
  numPerPage: number;
  curPage: number;
  pageNav: any;
  OnRefreshComics: Function;
}
interface IComicListState {
  searchedComic: string;
  collapseTag: boolean;
  order: "Newest" | "Oldest" | "ABC" | "ZYX";
}
const supportedOrder = new Map([
  [
    "Newest",
    (comic1: IComic, comic2: IComic) =>
      comic1.lastModifiedTime > comic2.lastModifiedTime ? 1 : -1,
  ],
  [
    "Oldest",
    (comic1: IComic, comic2: IComic) =>
      comic1.lastModifiedTime < comic2.lastModifiedTime ? 1 : -1,
  ],
  [
    "ABC",
    (comic1: IComic, comic2: IComic) => (comic1.name > comic2.name ? 1 : -1),
  ],
  [
    "ZYX",
    (comic1: IComic, comic2: IComic) => (comic1.name < comic2.name ? 1 : -1),
  ],
]);
export class ComicList extends React.Component<
  IComicListProps & RouteComponentProps,
  IComicListState
> {
  constructor(props: IComicListProps & RouteComponentProps) {
    super(props);
    this.state = {
      searchedComic: "",
      collapseTag: IsMobile() ? true : false,
      order: "Newest",
    };
    this.onSearchInput = this.onSearchInput.bind(this);
  }
  componentDidMount() {
    if (this.props && this.props.location) {
      const paramsMap = parseQueryString(this.props.location.search);
      if (paramsMap.has("s")) {
        this.setState({ searchedComic: paramsMap.get("s") });
      }
    }
  }
  onSearchInput(e: SyntheticEvent) {
    const target = e.target as HTMLInputElement;
    this.setState({ searchedComic: target.value });
  }
  render() {
    if (this.props.location.search) {
      const paramsMap = parseQueryString(this.props.location.search);
      if (paramsMap.has("s")) {
        const searched = paramsMap.get("s");
        this.setState({ searchedComic: searched });
        return <Redirect to="/comic" />;
      }
    }
    const comics = this.props.comics
      .filter((comic: IComic, idx: number) => {
        if (this.state.searchedComic) {
          return comic.name
            .toLowerCase()
            .includes(this.state.searchedComic.toLowerCase());
        }
        return true;
      })
      .sort(supportedOrder.get(this.state.order));
    const thumbs: Array<IThumb> = comics.map((comic: IComic, idx: number) => {
      return {
        thumbUrl: `/api/v1/comics/${comic.id}?page=${0}`,
        jumpToUrl: `/comic/${comic.id}`,
        thumbName: `${comic.name}`,
      };
    });
    const comicNames = this.props.comics.map((comic) => comic.name);
    const popularTags = getTagsFromNames(comicNames);
    const tags = [...popularTags.entries()].filter(([tag, count]) => count > 0);
    const tagsComponent = tags.map(([tag, count]) => (
      <Badge
        pill
        variant="primary"
        onClick={(e: any) => this.setState({ searchedComic: tag })}
      >
        {`${tag}:${count}`}
      </Badge>
    ));
    const leftSidebar = (
      <>
        <Row>
          <Col xs={12} md={12}>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="search..."
                value={this.state.searchedComic}
                onInput={this.onSearchInput}
              />
              <InputGroup.Append>
                <Button onClick={() => this.setState({ searchedComic: "" })}>
                  <i className="fas fa-times"></i>
                </Button>
              </InputGroup.Append>
              <InputGroup.Append>
                <Button
                  onClick={() =>
                    this.setState({
                      collapseTag: !this.state.collapseTag,
                    })
                  }
                >
                  <i className="fas fa-bars"></i>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Collapse in={!this.state.collapseTag}>
            <div>
              <div>{tags.length > 0 ? tagsComponent : "Tag not found"}</div>
            </div>
          </Collapse>
        </Row>
      </>
    );
    const mainContentHeader = (
      <Row>
        <Col style={{ justifyContent: "flex-start" }}>
          <Nav variant="tabs">
            <Nav.Item>
              <LinkContainer to="#">
                <Nav.Link>
                  <i className="fas fa-home"></i>
                </Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to="#">
                <Nav.Link>
                  <i className="fas fa-heart" />
                </Nav.Link>
              </LinkContainer>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to="#">
                <Nav.Link>
                  <i className="fas fa-history"></i>
                </Nav.Link>
              </LinkContainer>
            </Nav.Item>
          </Nav>
        </Col>
        <Col style={{ display: "flex", justifyContent: "flex-end" }}>
          <Form.Control
            as="select"
            value={this.state.order}
            style={{ width: "7em", display: "flex" }}
            onChange={(e: any) => this.setState({ order: e.target.value })}
          >
            {[...supportedOrder.keys()].map((val) => (
              <option>{val}</option>
            ))}
          </Form.Control>
          <Button
            style={{ display: "flex" }}
            onClick={async (e: any) => {
              this.props.OnRefreshComics(true);
            }}
          >
            <i className="fas fa-sync-alt"></i>
          </Button>
        </Col>
      </Row>
    );
    return (
      <>
        <Route
          exact
          path="/comic"
          render={() => (
            <Container fluid>
              <Row>
                <Col xs={12} md={2}>
                  {leftSidebar}
                </Col>
                <Col>
                  {mainContentHeader}
                  <ThumbGroup thumbArray={thumbs} />
                </Col>
              </Row>
            </Container>
          )}
        />
        <Route
          path="/comic/:comicid"
          render={(props) => (
            <ComicPreview {...props} comics={this.props.comics} />
          )}
        />
      </>
    );
  }
}
