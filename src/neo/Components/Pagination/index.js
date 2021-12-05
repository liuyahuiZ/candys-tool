import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Input } from '../';
import Buttons from '../Button/buttons';
import styles from './style';
import Selects from '../Select/selects';
import fetch from '../../utils/request';
import * as arrayUtils from '../../utils/array';
import Toaster from '../Toaster';
import config from '../../utils/config';
import * as arrayUtil from '../../utils/array';

const { pageStyle, leftStyle, rightStyle, pageSizeStyle } = styles;

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageNumber: 0,
      totalCount: 0,
      totalPage: 0,
    };

    this.changePageSize = this.changePageSize.bind(this);
    this.gotoPrePage = this.gotoPrePage.bind(this);
    this.gotoNextPage = this.gotoNextPage.bind(this);
    this.gotoPage = this.gotoPage.bind(this);
    this.search = this.search.bind(this);
  }
  // params: 即时响应输入框参数
  getData(pnum, params, pageSz) {
    const { totalPage } = this.state;
    const { success, url, beforeSearch, searchParams, method, header, respon, urlConfig, error } = this.props;
    const nowPageSize = (pageSz !== '' && pageSz) ? pageSz : this.state.pageSize;
    const Method = method && method !== '' ? method : 'POST';
    if (pnum <= 0 || pnum > totalPage) {
      return;
    }
    if (!pnum) {
      pnum = 1;
    }
    if(!url) return;
    const pageInfo = {
      current: pnum,
      pageSize: nowPageSize
    };
    beforeSearch();
    const paramsAll = params || searchParams;
    const dataPara = Object.assign({}, arrayUtils.setReq(urlConfig.options, {}), pageInfo, paramsAll);
    fetch(url, {
      method: Method,
      data: dataPara,
    }, header, urlConfig).then((res) => {
      const msgType = (res.code === config.SUCCESS) ? 'success' : 'error';
      if (res.code === config.SUCCESS&&res.data) {
        const { total, pages, records, pageInfo} = res.data
        let totalPage = Number(pageInfo.allPage);
        let totalCount = Number(pageInfo.allCount);
        let allRecords = records
        if(respon&&JSON.stringify(respon)!=='{}') {
          totalPage = res.data[arrayUtil.getItemKeyForValue(respon, 'totalPage', 'text', 'value')]||pages;
          totalCount = res.data[arrayUtil.getItemKeyForValue(respon, 'totalCount', 'text', 'value')]||total
          allRecords = res.data[arrayUtil.getItemKeyForValue(respon, 'allRecords', 'text', 'value')]||allRecords
        }
        if(!totalPage){
          totalPage = Number(totalCount) / Number(nowPageSize)
          if(totalPage>parseInt(totalPage)){
            totalPage=parseInt(totalPage)+1
          }
        }
        this.setState({
          pageNumber: +pnum || 1,
          totalPage: totalPage,
          totalCount: totalCount
        });
        success(allRecords );
      } else {
        error('error')
        Toaster.toaster({ type: msgType, content: res.msg, time: 3000 }, true);
      }
    }).catch((err)=>{
      // error('error')
      console.log(err)
    });
  }
  // 供外部调用
  search(params) {
    this.getData(undefined, params);
  }
  changePageSize(e) {
    const n = +e.target.innerText;

    this.setState({
      pageSize: n
    });

    this.getData(this.state.pageNumber, this.props.searchParams, n);
  }
  changePage(n) {
    this.setState({
      pageSize: n
    });

    this.getData(this.state.pageNumber, this.props.searchParams, n);
  }
  gotoPage() {
    const n = this.$$input.getValue();

    if (!/^\d+$/.test(n)) {
      return;
    }
    this.getData(n);
  }
  gotoPrePage() {
    const { pageNumber } = this.state;
    this.getData(pageNumber - 1);
  }
  gotoNextPage() {
    const { pageNumber } = this.state;
    this.getData(pageNumber + 1);
  }

  render() {
    const { pageSize, pageNumber, totalCount, totalPage } = this.state;
    const { style, showPage } = this.props;
    const containerStyle = Object.assign({}, pageStyle, style);
    const self = this;
    const pages = [5, 10, 20, 50,100];
    // const pagesDom = pages.map((ite, idx)=>{
    //   return <span
    //   role="button"
    //   onClick={this.changePageSize}
    //   style={pageSizeStyle[pageSize === ite ? 'current' : 'common']}
    //   key={`${idx}-p`}
    // >
    //   {ite}
    // </span>
    // })
    const pagesData = pages.map((ite, idx)=>{
      return {text: `${ite} 条/页`, value: ite}
    })
    return (
      <div style={showPage ? containerStyle: Object.assign({}, containerStyle, {display: 'none'}) }>
        <div style={leftStyle}>
          {/* 每页展示：
          {pagesDom}
          条 */}
          <Selects value={pageSize} options={pagesData} onChange={(i,e,v)=>{
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
          {pageNumber}/{totalPage}
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
            value={pageNumber.toString()}
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
  url: PropTypes.string.isRequired,
  method: PropTypes.string,
  header: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({})), PropTypes.shape({})]),
  beforeSearch: PropTypes.func,
  success: PropTypes.func,
  searchParams: PropTypes.shape({}),
  style: PropTypes.shape({}),
  showPage: PropTypes.bool,
  respon: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({})), PropTypes.shape({})]),
};

Pagination.defaultProps = {
  style: {},
  method: '',
  searchParams: {},
  header: [],
  respon: {},
  success: () => {},
  beforeSearch: () => {},
  showPage: true
};

export default Pagination;
