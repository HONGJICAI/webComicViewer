import React from "react";
import styled from 'styled-components';
export interface IPageNavProps {
  onClickPre: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  onClickNext: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  pageInfo: any
}
export class PageNav extends React.Component<IPageNavProps> {
  render() {
    const Div = styled.div`
      width: 100%;
    `;
    const Pre = styled.button`
      text-align: left;
      display: inline-block;
      border: none;
      color: #008CBA;
    `;
    const CurPage = styled.input`
      text-align: center;
      display: inline-block;
    `;
    const Next = styled.button`
      text-align: right;
      display: inline-block;
      border: none;
      color: #008CBA;
    `;
    return (
      <Div>
        <Pre onClick={this.props.onClickPre}>{'<<<<'}</Pre>
        <CurPage placeholder={`${this.props.pageInfo.curPage}/${this.props.pageInfo.totalPage}`} />
        <Next onClick={this.props.onClickNext}>{'>>>>'}</Next>
      </Div>
    );
  }
}