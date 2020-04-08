import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import styled from 'styled-components';
import config from '../../config';
import { IComic } from "./Comic";
import { ComicPreview } from "./ComicPreview";
interface IComicListProps {
    comics: Array<IComic>,
    numPerPage: number,
    curPage: number,
    pageNav: any,
}
export class ComicList extends React.Component<IComicListProps> {
    render() {
        const Img = styled.img`
            width: 25%;
            `;
        const comics = this.props.comics;
        const numPerPage = this.props.numPerPage;
        const listItems = comics.map((comic: any, idx: number) => <li key={"List" + comic.id}>
            <Link to={`/comic/${comic.id}`}>
                <Img src={`${config.backendHost}/api/v1/comics/${comic.id}`}></Img>
                {comic.name}
            </Link>
        </li>);
        return (<Switch>
            <Route exact path='/comic' render={() => <div>
                <ul>
                    {listItems.slice((this.props.curPage - 1) * numPerPage, Math.min(this.props.curPage * numPerPage, comics.length))}
                </ul>
                {this.props.pageNav}
            </div>} />
            <Route path='/comic/:comicid' render={props => <ComicPreview {...props} comics={this.props.comics} />} />
        </Switch>);
    }
}
