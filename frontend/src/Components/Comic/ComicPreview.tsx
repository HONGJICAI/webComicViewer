import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import styled from 'styled-components';
import config from '../../config';
import { IComic } from "./Comic";
import { ComicPageViewContent } from "./ComicPageViewContent";
import { ComicScrollViewContent } from "./ComicScrollViewContent";

interface IComicPreviewProps {
    comics: Array<IComic>,
    match: any
}
interface IComicPreviewState {
    comics: Array<IComic>
}
export class ComicPreview extends React.Component<IComicPreviewProps, IComicPreviewState> {
    constructor(props: IComicPreviewProps) {
        super(props);
        this.state = {
            comics: props.comics,
        };
    }
    componentDidUpdate(nextProps: {
        comics: Array<IComic>;
    }) {
        nextProps.comics !== this.props.comics && this.setState({
            comics: nextProps.comics
        });
    }
    render() {
        const Img = styled.img`
      width: 25%;
    `;
        const [comicid] = [this.props.match.params.comicid];
        if (this.state.comics === undefined || comicid >= this.state.comics.length) {
            return <div>Loading</div>;
        }
        const comic = this.state.comics[comicid];
        const detail = <div>
            <Img src={`${config.backendHost}/api/v1/comics/${comic.id}`}></Img>
            {comic.name}
            <Link to={`/comic/${comic.id}/ScrollView`}>
                <button>ScrollView</button>
            </Link>
            <Link to={`/comic/${comic.id}/PageView`}>
                <button>PageView</button>
            </Link>
        </div>;
        return (<Switch>
            <Route exact path={`/comic/${comic.id}`} render={() => <div>{detail}</div>} />
            <Route key={"Route" + comic.name} path={`/comic/${comic.id}/ScrollView`} render={() => <ComicScrollViewContent comic={comic} />} />
            <Route key={"Route" + comic.name} path={`/comic/${comic.id}/PageView`} render={() => <ComicPageViewContent comic={comic} />} />
        </Switch>);
    }
}
