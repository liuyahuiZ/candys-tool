import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Input } from '../';
import Buttons from '../Button/buttons';
import styles from './style';
import Selects from '../Select/selects';

const { pageStyle, leftStyle, rightStyle, pageSizeStyle } = styles;

class Pagination extends Component {
  constructor(props) {
    super(props);
    const { pageInfo } = this.props;
    this.state = {
      size: pageInfo.size,
      current: pageInfo.current,
      totalCount: pageInfo.totalCount,
      totalPage: pageInfo.totalPage,
    };

    this.changePageSize = this.changePageSize.bind(this);
    this.gotoPrePage = this.gotoPrePage.bind(this);
    this.gotoNextPage = this.gotoNextPage.bind(this);
    this.gotoPage = this.gotoPage.bind(this);
  }
  componentWillReceiveProps(nextProps){
    const { pageInfo } = nextProps;
    this.setState({
      size: pageInfo.size,
      current: pageInfo.current,
      totalCount: pageInfo.totalCount,
      totalPage: pageInfo.totalPage,
    })
  }
  // params: 即时响应输入框参数
  getData(pnum, params, pageSz) {
    const { totalPage } = this.state;
    const nowPageSize = (pageSz !== '' && pageSz) ? pageSz : this.state.size;
    if (pnum <= 0 || pnum > totalPage) {
      return;
    }
    if (!pnum) {
      pnum = 1;
    }
    const pageInfo = {
      current: pnum,
      size: nowPageSize
    };

    this.props.onChange(pageInfo)
  }
 
  changePageSize(e) {
    const n = +e.target.innerText;

    this.setState({
      size: n
    });

    this.getData(this.state.current, this.props.searchParams, n);
  }
  changePage(n) {
    this.setState({
      size: n
    });

    this.getData(this.state.current, this.props.searchParams, n);
  }
  gotoPage() {
    const n = this.$$input.getValue();

    if (!/^\d+$/.test(n)) {
      return;
    }
    this.getData(n);
  }
  gotoPrePage() {
    const { current } = this.state;
    this.getData(current - 1);
  }
  gotoNextPage() {
    const { current } = this.state;
    this.getData(current + 1);
  }

  render() {
    const { size, current, totalCount, totalPage } = this.state;
    const { style } = this.props;
    const containerStyle = Object.assign({}, pageStyle, style);
    const self = this;
    const pages = [5, 10, 20, 50,100];
    // const pagesDom = pages.map((ite, idx)=>{
    //   return <span
    //   role="button"
    //   onClick={this.changePageSize}
    //   style={pageSizeStyle[size === ite ? 'current' : 'common']}
    //   key={`${idx}-p`}
    // >
    //   {ite}
    // </span>
    // })
    const pagesData = pages.map((ite, idx)=>{
      return {text: `${ite} 条/页`, value: ite}
    })
    return (
      <div style={containerStyle}>
        <div style={leftStyle}>
          {/* 每页展示：
          {pagesDom}
          条 */}
          <Selects value={size} options={pagesData} onChange={(i,e,v)=>{
            self.changePage(v.value)
          }} />
        </div>
        <div style={rightStyle}>
          总计：{totalCount} 条
          <Buttons
            style={{
              margin: '0 5px 0 20px'
            }}
            text={'上一页'}
            size={'small'}
            onClick={this.gotoPrePage}
            plain
          />
          {current}/{totalPage}
          <Buttons
            style={{
              margin: '0 5px 0 5px'
            }}
            text={'下一页'}
            size={'small'}
            onClick={this.gotoNextPage}
            plain
          />
          <Input
            style={{
              width: '60px',
              margin: '0 5px 0 0',
              position: 'relative',
              top: '1px'
            }}
            value={current.toString()}
            type="number"
            max={totalPage}
            min={0}
            valid="number"
            maxLengthShow={false}
            ref={(dom) => { this.$$input = dom; }}
          />
          <Buttons
            text="跳转"
            size={'small'}
            onClick={this.gotoPage}
            plain
          />
        </div>
      </div>
    );
  }
}

Pagination.propTypes = {
  style: PropTypes.shape({}),
  onChange: PropTypes.func,
};

Pagination.defaultProps = {
  style: {},
  onChange: () => {}
};

export default Pagination;
