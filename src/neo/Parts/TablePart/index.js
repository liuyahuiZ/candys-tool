import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import styles from './style';
import * as arrUtil from '../../utils/array';
import { LoadText, LoadPage } from '../../Components';
import formatPart from '../FormatPart';
import ButtonTools from '../ButtonTools';

import {
  Table,
  TableRow,
  TableRowColumn,
  TableHeaderRow,
  Pagination, Checkbox,Box,
  Icon,Row,Col
} from '../../Components';

export default class TablePart extends Component {
  constructor(props){
    super(props);
    this.state = {
      allCheck: false,
      checkedArr: [],
      percent: 10,
      showFix: false,
      checkedAllStatus: 'unChecked',
      noRender: false,
      items: this.props.items||[],
      isLoading: this.props.isLoading
    };
    this.getValue = this.getValue.bind(this)
  }
  componentDidMount() {
    if (this.page) {
      this.search = this.page.search;
    }
    const self = this;
    const tableContainer = this.$$tableContainer;
    const { operations } = this.props;
    const opLength = operations&&operations.length ? operations.length : 0;
    const opWidth = opLength * styles.opBtnLength;
    tableContainer.onscroll = (ev)=>{
     if(ev.target.scrollLeft + ev.target.offsetWidth >= (ev.target.scrollWidth - opWidth)){
      self.setState({
        showFix: false
      })
     } else{
      self.setState({
        showFix: true
      })
     }
   };
  }

  componentWillReceiveProps(nextProps){
    let showFix = false;
    if(nextProps.items&&nextProps.items.length>0&&nextProps.operationsFix) {
      showFix = true
    }
    this.setState({
      items: nextProps.items,
      showFix: showFix,
      isLoading: nextProps.isLoading
    })
  }

  getValue(){
    const { checkedArr } = this.state
    if(this.props.valueBack){
      this.props.valueBack(checkedArr)
    } else{
      return checkedArr
    }
  }

  changeCheckArr(item, checkStatus, idx){
    const { checkedArr } = this.state
    let newArr= JSON.parse(JSON.stringify(checkedArr))
    const self = this;
    item.checkId = idx
    let isInArr = arrUtil.checkInArrIndex(newArr, 'checkId', idx)
    if(checkStatus&&checkStatus.agree.checkStatus =='checked'){
      if(!isInArr.status){
        newArr.push(item)
        this.setState({
          checkedArr: newArr
        },()=>{self.getValue()})
      } 
    } else if(checkStatus&&checkStatus.agree.checkStatus =='unchecked'){
      newArr.splice(isInArr.index, 1)
      this.setState({
        checkedArr: newArr
      },()=>{self.getValue()})
    }
    self.changeBox(newArr)
  }

  changeBox(newArr){
    const { items } = this.props;
    if(newArr.length>0&&newArr.length<items.length){
      this.$$checkAllBox.changetoAmb('ambivalent')
      this.setState({
        checkedAllStatus: 'ambivalent'
      })
    }
    if(newArr.length == items.length){
      this.$$checkAllBox.changetoAmb('checked')
      this.setState({
        checkedAllStatus: 'checked'
      })
    }
  }

  getFixHeader() {
    const { operations } = this.props;
    const opLength = operations&&operations.length ? operations.length : 0;
    const self = this;
    const opWidth = opLength * styles.opBtnLength;
    return (
      <TableHeaderRow ref={(r)=>{ self.$$fixedHeader = r}}>
        {
          opLength ?
            <TableRowColumn style={{ width: 'auto', padding: '10px 0px' }} columnNumber={opLength}>
              操作
            </TableRowColumn>
          :
            ''
        }
      </TableHeaderRow>
    );
  }
  genHeader() {
    const { itemFormat, operations, showIndex, showCheckBox } = this.props;
    // const opLength = operations.filter(item => !item.auth || authFunc(item.auth)).length;
    const opLength = operations&&operations.length ? operations.length : 0;

    const opWidth = opLength * styles.opBtnLength;
    return (
      <TableHeaderRow>
        { showIndex ?
          <TableRowColumn >
            序号
          </TableRowColumn>
          :
          ''
        }
        { showCheckBox ?
          <TableRowColumn >
            {/* <Checkbox 
              options={[{ value: 'agree', text: '', checkStatus: allCheck ? 'checked': '' }]}
              onChange={(data) => {
                  console.log(data);
              }}
              ref={(r) => { this[`$$check-All`] = r; }} 
              /> */}
              选择
          </TableRowColumn>
          :
          ''
        }
        {
          itemFormat&&itemFormat.length>0 ? itemFormat.map((item, idx) => {
            const key = `${item.title}-${idx}`;
            return (
              <TableRowColumn
                key={key}
                columnNumber={idx}
                title={item.title}
              >{item.title}</TableRowColumn>
            );
          }) : ''
        }
        {
          opLength ?
            <TableRowColumn style={{ width: opWidth }} columnNumber={opLength}>
              操作
            </TableRowColumn>
          :
            ''
        }
      </TableHeaderRow>
    );
  }


  genOperations(rowIdx, item) {
    const { operations, items } = this.props;
    const self = this;
    // console.log(operationsRule.crule, item[operationsRule.relyKey]);
    // 操作对象不存在，return null
    return (
      operations&&operations.length > 0? <TableRowColumn columnNumber={1}>
        <ButtonTools options={operations} styles={styles.opBtn} pageData={items[rowIdx]}
        size={'small'} rowIdx={rowIdx} callback={()=>{self.props.onSearch(self.props.searchParams)}} />
      </TableRowColumn> : ''
    );
  }
  
  getBatchOperation(rowIdx){
    const { batchOperations } = this.props;
    const { checkedArr, checkedAllStatus, items } = this.state;
    const self = this;
    const newItems = items.concat();
    return (
      batchOperations&&batchOperations.length > 0? <Row className="padding-top-1r padding-left-1r padding-right-1r">
      <Col span={6}>已选 {checkedArr.length} <Box checkStatus={checkedAllStatus} onChange={(stus)=>{
        // console.log(stus)
        if(stus=='unChecked'){
          self.setState({
            checkedArr: [],
            noRender: true,
            checkedAllStatus: 'unChecked'
          })
        } else if(stus=='checked'){
          for(let i=0;i<newItems.length;i++){
            newItems[i].checkId = i
          }
          self.setState({
            checkedArr: newItems,
            noRender: true,
            checkedAllStatus: 'checked'
          })
        }
        setTimeout(()=>{
          self.setState({
            noRender: false
          })
        }, 1000)
      }} ref={(r) => { self[`$$checkAllBox`] = r; }} />
      </Col>
      <Col span={18} className='text-align-right'>
        <ButtonTools options={batchOperations} styles={styles.opBtn} pageData={checkedArr}
        size={'small'} rowIdx={rowIdx} callback={()=>{self.props.onSearch(self.props.searchParams)}} /></Col>
      </Row> : ''
    );
  }
  genRows() {
    const { itemFormat, showIndex, showCheckBox } = this.props;
    const { items, isLoading, checkedArr, noRender } = this.state
    const self = this;
    if(isLoading){
      return (<TableRow >
        <TableRowColumn columnNumber={1} colspan={itemFormat.length + 1}>
        <div className="timer-loader" style={{margin: '15px 0 15px 0'}}></div>
        <div style={{margin: '0 0 16px 0'}}>加载中</div>
      </TableRowColumn></TableRow>)
    }
    return items&&items.length>0 ? items.map((item, rowIdx) => {
      const rowKey = `rowKey${rowIdx}`;
      return (
        <TableRow
          key={rowKey}
          rowNumber={rowIdx}
        >
          { showIndex ? <TableRowColumn>{rowIdx + 1}</TableRowColumn> : ''}
          { showCheckBox ?
          <TableRowColumn noRender={noRender}>
            <Checkbox 
              options={[{ value: 'agree', text: '', checkStatus: arrUtil.checkInArr(checkedArr, 'checkId', rowIdx) ? 'checked': '' }]}
              onChange={(data) => {
                  // console.log(data, item, rowIdx);
                  self.changeCheckArr(item, data, rowIdx);
              }}
              ref={(r) => { this[`$$check-${rowIdx}`] = r; }}
              />
          </TableRowColumn>
          :
          ''
          }
          {
            itemFormat&&itemFormat.length>0? itemFormat.map((config, colIdx) => {
              const { key, after } = config;
              let value = item[key];
              if(typeof(value) =='object'&&value!==null) { value = JSON.stringify(value)}
              if(config.formatModel){
                value = formatPart(config, item[key], config.formatStr||config.format, config.replaceStr )
              }
              // let value = format ? filter(eval(format), item[key]) : item[key];
              
              value = (value === '' || value === undefined || value === null) ? '——' : value;
              
              const tAfter = (value || after) ? (after) : '';
              return (
                <TableRowColumn
                  key={`${key}-trc`}
                  columnNumber={colIdx}
                  title={value}
                  style={config.style}
                >{value}{tAfter}</TableRowColumn>
              );
            }) : ''
          }
          {
            this.genOperations(rowIdx, item)
          }
        </TableRow>
      );
    }) : 
    (<TableRow
      rowNumber={0}
    >
      <TableRowColumn
        columnNumber={1}
        colspan={itemFormat.length + 1}
      >
        <Icon iconName={'android-clipboard'} style={{color: '#5253cc', fontSize: '4em'}} />
        <div style={{margin: '0 0 16px 0'}}>暂无数据</div>
      </TableRowColumn>
    </TableRow>) ;
  }
  genFixRows() {
    const { items } = this.state;
    const self = this
    return items.map((item, rowIdx) => {
      const rowKey = `rowKey${rowIdx}`;
      return (
        <TableRow
          key={rowKey}
          rowNumber={rowIdx}
          ref={(r)=>{ self.$$fixedRow = r}}
        >
          { 
            this.genOperations(rowIdx, item)
          }
        </TableRow>
      );
    });
  }
  // shouldComponentUpdate(nextProps, nextState){
  //   const { items } = this.props;
  //   // // console.log(listStatus);
  //   // // console.log(nextState.listStatus)
  //   // // debugger
  //   // if(nextProps.items.length !== items.length){
  //   //   if(nextProps.items.length==0){
  //   //     return false
  //   //   }
  //   //   if(items.length==0){
  //   //     return true
  //   //   }
  //   // }
  //   // if(nextProps.items.length == items.length) {
  //   //   if(nextProps.items.length==0){
  //   //     return true
  //   //   }
  //   //   if(items.length!==0){
  //   //     return true
  //   //   }
  //   // }
  //   return true
  // }
  render() {
    const {
      title,
      showTitle,
      minWidth,
      maxHeight,
      beforeSearch,
      success,
      error,
      searchParams,
      url,
      method,
      header,
      respon,
      showPage,
      operationsFix,
      tableStyle,
      operations,
      itemFormat,
      urlConfig,
      showCheckBox,
      ...othors
    } = this.props;

    const { showFix, items, isLoading } = this.state;
    const paginationStyle = Object.assign({}, styles.pagination);
    const outerWrapperStyle = Object.assign({}, styles.contener);
    let showBatchOperation = true
    if (minWidth) {
      tableStyle.minWidth = minWidth;
    }
    if (!items || !items.length || items.length === 0) {
      paginationStyle.display = 'none';
      showBatchOperation = false
    }
    const fixTable = operationsFix&&showFix ? (<div style={Object.assign({}, styles.fixTab,styles.tableContainer, {width: 'auto'}) }>
    <Table hoverable center  >
      {this.getFixHeader()}
      {this.genFixRows()}
    </Table></div>) : '';
    return (
      <div>
            <div style={outerWrapperStyle} >
              <div  className="scroller" style={Object.assign({}, styles.tableContainer) } ref={(r) => { this.$$tableContainer = r; }}>
                <Table hoverable center style={tableStyle}
                  ref={(r) => { this.$$mainTable = r; }} >
                  {this.genHeader()}
                  { this.genRows()}
                </Table>
              </div>
              <div style={styles.fixdRight}>
                {fixTable}
              </div>
            </div>
            { showCheckBox&&showBatchOperation ? this.getBatchOperation() : ''}
            <Pagination
              url={url}
              method={method}
              header={header}
              respon={respon}
              beforeSearch={beforeSearch}
              success={success}
              error={error}
              showPage={showPage}
              searchParams={searchParams}
              style={paginationStyle}
              urlConfig={urlConfig}
              ref={(item) => {
                this.page = item;
              }}
            />
      </div>
    );
  }
}

TablePart.propTypes = {
  title: PropTypes.string,
  showTitle: PropTypes.bool,
  url: PropTypes.string.isRequired,
  method: PropTypes.string,
  header: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({})), PropTypes.shape({})]),
  items: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({})), PropTypes.shape({})]),
  itemFormat: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  operations: PropTypes.arrayOf(PropTypes.shape()),
  operationsRule: PropTypes.shape(),
  tableStyle: PropTypes.shape({}),
  isLoading: PropTypes.bool,
  minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  beforeSearch: PropTypes.func,
  success: PropTypes.func,
  searchParams: PropTypes.shape(),
  showPage: PropTypes.bool,
  operationsFix: PropTypes.bool,
  showIndex: PropTypes.bool
};

TablePart.defaultProps = {
  title: '查询结果',
  showTitle: true,
  url: '',
  method: '',
  header: [],
  isLoading: false,
  operations: [],
  operationsRule: {},
  tableStyle: {},
  minWidth: null,
  maxHeight: null,
  success: () => {},
  beforeSearch: () => {},
  searchParams: {},
  showPage: true,
  items: [],
  operationsFix: false,
  showIndex: false
};
