import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import config from "../config";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PageNav } from "./PageNav";
export interface IThumb {
  thumbUrl: string;
  jumpToUrl: string;
  thumbName: string;
}
interface IThumbGroupProps {
  thumbArray: Array<IThumb>;
}
interface IThumbGroupState {
  currentPage: number;
}

const numPerPage = 30;
export class ThumbGroup extends React.Component<
  IThumbGroupProps,
  IThumbGroupState
> {
  constructor(props: IThumbGroupProps) {
    super(props);
    this.state = {
      currentPage: 1,
    };
  }
  render() {
    const Box = styled.div`
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
    `;
    const Text = styled.div`
      //   float: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      //   display: inline-block;
      max-width: 100%;
      text-align: center;
    `;
    const listItems = this.props.thumbArray.map(
      (thumb: IThumb, idx: number) => (
        <Col style={{ padding: 5 }} key={`Thumb${idx}`}>
          <Link to={thumb.jumpToUrl}>
            <Box
              style={{
                backgroundImage: `url(${thumb.thumbUrl})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "auto 100%",
                backgroundPosition: "center top",
              }}
            />
            <Text>{thumb.thumbName}</Text>
          </Link>
          <small className="text-muted"></small>
        </Col>
      )
    );
    const totalPage =
      Math.floor(this.props.thumbArray.length / numPerPage) +
      (this.props.thumbArray.length % numPerPage ? 1 : 0);
    return (
      <>
        <Container fluid>
          <Row xs={3} md={6}>
            {listItems.slice(
              (this.state.currentPage - 1) * numPerPage,
              Math.min(
                this.state.currentPage * numPerPage,
                this.props.thumbArray.length
              )
            )}
          </Row>
        </Container>
        <PageNav
          currentPage={this.state.currentPage}
          totalPage={totalPage}
          onClickSpecifyPage={(page: number): void =>
            this.setState({ currentPage: page })
          }
        />
      </>
    );
  }
}
