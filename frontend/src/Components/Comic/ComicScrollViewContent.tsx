import React from "react";
import styled from 'styled-components';
import config from '../../config';
import { IComic } from "./Comic";
interface ComicScrollViewContentProps {
    comic: IComic,
}
interface ComicScrollViewContentState {
    maxPage: number,
    continueLoading: boolean
}
export class ComicScrollViewContent extends React.Component<ComicScrollViewContentProps, ComicScrollViewContentState> {
    comic: IComic;
    loadNumPerReq: number;
    constructor(props: any) {
        super(props);
        this.comic = props.comic;
        this.loadNumPerReq = 3;
        this.state = {
            maxPage: this.loadNumPerReq,
            continueLoading: true
        };
        this.handleScroll = this.handleScroll.bind(this);
    }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        document.addEventListener("keydown", this.handleKeyDown);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        document.removeEventListener("keydown", this.handleKeyDown);
    }
    handleScroll() {
        if (!this.state.continueLoading) {
            window.removeEventListener('scroll', this.handleScroll);
            return;
        }
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom + 100 >= docHeight) {
            this.setState({ maxPage: this.state.maxPage + this.loadNumPerReq });
        }
    }
    handleKeyDown = (event: {
        key: any;
    }) => {
        console.log(event.key);
        const curY = document.documentElement.scrollTop || document.body.scrollTop;
        const curX = window.pageYOffset;
        switch (event.key) {
            case "ArrowRight":
                window.scrollTo(curX, curY + window.innerHeight);
                break;
            case "ArrowLeft":
                window.scrollTo(curX, Math.max(0, curY - window.innerHeight));
                break;
        }
    };
    render() {
        const pages = Array.from(new Array(this.state.maxPage), (val, index) => index);
        const Img = styled.img`
        width: 100%;
    `;
        const contents = pages.map((val, idx) => <Img key={"Content" + this.comic.name + String(idx)} src={`${config.backendHost}/api/v1/comics/${this.comic.id}?page=${val}`} onError={(e) => {
            const imgdiv: any = e.target;
            imgdiv.onError = null;
            imgdiv.src = "";
            this.setState({
                continueLoading: false,
                maxPage: this.state.maxPage - 1
            });
        }} />);
        return (<div>
            {contents}
        </div>);
    }
}
