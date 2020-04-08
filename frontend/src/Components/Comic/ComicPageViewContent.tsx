import React from "react";
import styled from 'styled-components';
import config from '../../config';
import { IComic } from "./Comic";
interface ComicPageViewContentProps {
    comic: IComic
}
interface ComicPageViewContentState {
    curPage: number
}
export class ComicPageViewContent extends React.Component<ComicPageViewContentProps, ComicPageViewContentState> {
    comic: IComic;
    constructor(props: any) {
        super(props);
        this.comic = props.comic;
        this.state = {
            curPage: 0
        };
    }
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }
    handleKeyDown = (event: {
        key: any;
    }) => {
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
        const contents = <Img src={`${config.backendHost}/api/v1/comics/${this.comic.id}?page=${this.state.curPage}`} onError={(e) => {
            this.setState({
                curPage: this.state.curPage - 1
            });
        }} />;
        return (<div>
            {contents}
            <button onClick={() => { this.setState({ curPage: Math.max(0, this.state.curPage - 1) }); }}>Pre</button>
            <button onClick={() => { this.setState({ curPage: this.state.curPage + 1 }); }}>Next</button>
        </div>);
    }
}
