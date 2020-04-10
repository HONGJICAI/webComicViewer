import React, { SyntheticEvent } from "react";
import { Link, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import config from "../../config";
import { IComic } from "./Comic";
import { ComicPreview } from "./ComicPreview";
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
    const Img = styled.img`
      width: 25%;
    `;
    const comics = this.props.comics.filter((comic: IComic, idx: number) => {
      if (this.state.searchedComic) {
        return comic.name.includes(this.state.searchedComic);
      }
      return true;
    });
    const numPerPage = this.props.numPerPage;
    const listItems = comics.map((comic: IComic, idx: number) => (
      <li key={"List" + comic.id}>
        <Link to={`/comic/${comic.id}`}>
          <Img src={`${config.backendHost}/api/v1/comics/${comic.id}`}></Img>
          {comic.name}
        </Link>
      </li>
    ));
    return (
      <Switch>
        <Route
          exact
          path="/comic"
          render={() => (
            <div>
              <input
                type="text"
                name="searchText"
                onInput={this.onSearchInput}
              />
              <ul>
                {listItems.slice(
                  (this.props.curPage - 1) * numPerPage,
                  Math.min(this.props.curPage * numPerPage, comics.length)
                )}
              </ul>
              {this.props.pageNav}
            </div>
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
