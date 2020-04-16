import React, { SyntheticEvent } from "react";
import { Link, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import config from "../../config";
import { IComic } from "./Comic";
import { ComicPreview } from "./ComicPreview";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ThumbGroup, IThumb } from "../ThumbGroup";
interface IComicListProps {
  comics: Array<IComic>;
  numPerPage: number;
  curPage: number;
  pageNav: any;
}
interface IComicListState {
  searchedComic: string;
}
export class ComicList extends React.Component<
  IComicListProps,
  IComicListState
> {
  constructor(props: IComicListProps) {
    super(props);
    this.state = {
      searchedComic: "",
    };
    this.onSearchInput = this.onSearchInput.bind(this);
  }
  onSearchInput(e: SyntheticEvent) {
    const target = e.target as HTMLInputElement;
    this.setState({ searchedComic: target.value });
  }
  render() {
    const comics = this.props.comics.filter((comic: IComic, idx: number) => {
      if (this.state.searchedComic) {
        return comic.name.includes(this.state.searchedComic);
      }
      return true;
    });
    const thumbs: Array<IThumb> = comics.map((comic: IComic, idx: number) => {
      return {
        thumbUrl: `/api/v1/comics/${comic.id}?page=${0}`,
        jumpToUrl: `/comic/${comic.id}`,
        thumbName: `${comic.name}`,
      };
    });
    return (
      <Switch>
        <Route
          exact
          path="/comic"
          render={() => (
            <>
              <input
                type="text"
                name="searchText"
                onInput={this.onSearchInput}
              />
              <ThumbGroup thumbArray={thumbs} />
            </>
          )}
        />
        <Route
          path="/comic/:comicid"
          render={(props) => (
            <ComicPreview {...props} comics={this.props.comics} />
          )}
        />
      </Switch>
    );
  }
}
