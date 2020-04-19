import React from "react";
import Pagination from "react-bootstrap/Pagination";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
export interface IPageNavProps {
  onClickSpecifyPage: (page: number) => void;
  currentPage: number;
  totalPage: number;
}
interface IPageNavState {
  targetPage: string;
}
export class PageNav extends React.Component<IPageNavProps> {
  handleSubmitPage = (event: any) => {
    event.preventDefault();
    try {
      const targetPage = parseInt(this.state.targetPage);
      if (targetPage >= 0 && targetPage <= this.props.totalPage)
        this.props.onClickSpecifyPage(targetPage);
      else throw "InvalidPage";
    } catch {}
  };
  state = {
    targetPage: "",
  };

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

        <OverlayTrigger
          trigger="click"
          key={"top"}
          placement={"top"}
          overlay={
            <Popover id={`popover-positioned-top`}>
              <Popover.Content>
                <Form onSubmit={this.handleSubmitPage}>
                  <InputGroup>
                    <FormControl
                      required
                      type="number"
                      placeholder="page"
                      value={this.state.targetPage}
                      onChange={(e: any) =>
                        this.setState({ targetPage: e.target.value })
                      }
                    />
                    <InputGroup.Append>
                      <Button onClick={this.handleSubmitPage}>Go</Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Form>
              </Popover.Content>
            </Popover>
          }
        >
          <Pagination.Item active>{this.props.currentPage}</Pagination.Item>
        </OverlayTrigger>
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
