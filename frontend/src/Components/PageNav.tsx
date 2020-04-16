import React from "react";
import Pagination from "react-bootstrap/Pagination";
export interface IPageNavProps {
  onClickSpecifyPage: (page: number) => void;
  currentPage: number;
  totalPage: number;
}
export class PageNav extends React.Component<IPageNavProps> {
  render() {
    type mouseEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
    return (
      <Pagination style={{ justifyContent: "center" }}>
        <Pagination.Prev
          id="prevpage"
          disabled={this.props.currentPage === 1}
          onClick={(e: mouseEvent) => {
            this.props.onClickSpecifyPage(this.props.currentPage - 1);
          }}
        />
        <Pagination.Item
          id="firstpage"
          disabled={this.props.currentPage === 1}
          onClick={(e: mouseEvent) => {
            this.props.onClickSpecifyPage(1);
          }}
        >
          {1}
        </Pagination.Item>
        <Pagination.Ellipsis disabled />
        <Pagination.Item active>{this.props.currentPage}</Pagination.Item>
        <Pagination.Ellipsis disabled />
        <Pagination.Item
          id="lastpage"
          disabled={this.props.currentPage === this.props.totalPage}
          onClick={(e: mouseEvent) => {
            this.props.onClickSpecifyPage(this.props.totalPage);
          }}
        >
          {this.props.totalPage}
        </Pagination.Item>
        <Pagination.Next
          id="nextpage"
          disabled={this.props.currentPage === this.props.totalPage}
          onClick={(e: mouseEvent) => {
            this.props.onClickSpecifyPage(this.props.currentPage + 1);
          }}
        />
      </Pagination>
    );
  }
}
