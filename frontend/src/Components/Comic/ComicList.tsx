import React, { SyntheticEvent } from "react";
import {
  Link,
  Route,
  RouteProps,
  RouteComponentProps,
  Redirect,
} from "react-router-dom";
import styled from "styled-components";
import { IComic } from "./Comic";
import { ComicPreview } from "./ComicPreview";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ThumbGroup, IThumb } from "../ThumbGroup";
import { getTagsFromNames, IsMobile, parseQueryString } from "../../Utility";
import Badge from "react-bootstrap/Badge";
import { PageNav } from "../PageNav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
interface IComicListProps {
  comics: Array<IComic>;
  numPerPage: number;
  curPage: number;
  pageNav: any;
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
  // searchedComic: string;
  constructor(props: IComicListProps & RouteComponentProps) {
    super(props);
    // this.searchedComic = "";
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
    return (
      <>
        <Route
          exact
          path="/comic"
          render={() => (
            <Container fluid>
              <Row>
                {/* side bar */}
                <Col xs={12} md={2}>
                  {/* search bar */}
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
                          <Button>Clear</Button>
                        </InputGroup.Append>
                        <InputGroup.Append>
                          <Button
                            onClick={() =>
                              this.setState({
                                collapseTag: !this.state.collapseTag,
                              })
                            }
                          >
                            <svg
                              className="bi bi-list"
                              width="1em"
                              height="1em"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M2.5 11.5A.5.5 0 013 11h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4A.5.5 0 013 7h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4A.5.5 0 013 3h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </Button>
                        </InputGroup.Append>
                      </InputGroup>
                    </Col>
                    {/* <Col xs={2} md={0}>
                    </Col> */}
                  </Row>
                  {/* side bar content */}
                  <div
                    style={{
                      display: `${this.state.collapseTag ? "None" : "block"}`,
                    }}
                  >
                    <Row>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <Button>Order</Button>
                        </InputGroup.Prepend>
                        <Form.Control
                          as="select"
                          value={this.state.order}
                          onChange={(e: any) =>
                            this.setState({ order: e.target.value })
                          }
                        >
                          {[...supportedOrder.keys()].map((val) => (
                            <option>{val}</option>
                          ))}
                        </Form.Control>
                      </InputGroup>
                    </Row>
                    <br />
                    <div>{tagsComponent}</div>
                  </div>
                </Col>
                <Col>
                  <Row>
                    <Button
                      style={{ marginLeft: "auto" }}
                      onClick={async (e: any) => {
                        const rsp = await fetch("/api/v1/comics?refresh=true");
                        if (rsp.ok) {
                          this.props.history.push(`?`);
                        }
                      }}
                    >
                      Refresh
                    </Button>
                  </Row>
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
