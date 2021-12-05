import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { SearchConditionPart, TablePart } from '../../Parts';
import { Row, Col, Toaster, AnTransition } from '../../Components';
import md5 from 'js-md5';

class ListTemplate extends Component {
  constructor(props) {
    super(props);
    const parentData = this.props.parentData||{}
    this.state = {
      listData: parentData.records||[],
      isLoading: false,
      searchParams: null,
      isInit: true,
      pageParmes: this.props.pageParmes,
      hasRequested: false,
    };

    this.beforeSearch = this.beforeSearch.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.getValue = this.getValue.bind(this);
  }
  componentWillReceiveProps(nextProps){
    let searchParams = {}
    if(nextProps.contextParames){
      searchParams = nextProps.contextParames
    }
    this.setState({
      searchCondition: nextProps.searchCondition,
      searchParams: searchParams,
      pageParmes: nextProps.pageParmes,
      isInit: false
    },()=>{
      const parentData = nextProps.parentData||{}
      if(nextProps.reRender=='shuldRender'){
        this.setState({
          listData: [],
        })
        let params = this.resetSearchCondition(nextProps.searchCondition)
        try{
          let getSearchData = this.$$searchCon&&this.$$searchCon.getSearchData() || {}
        this.onSearch( Object.assign({}, params, this.state.searchParams, getSearchData, nextProps.contextParames))
        } catch(e){
          // console.log(e)
        }
        
      }
      if(nextProps.reRender==='noRender'){
        
      } else{
        if(parentData.records&&parentData.records.length>0){
          this.setState({
            listData: parentData.records||[],
          })
        }
        
      }
    })
  }
  resetSearchCondition(arr){
    let obj ={}
    for(let i=0;i<arr.length;i++){
       if(arr[i].value&&arr[i].value!==''){ obj[arr[i].key] = arr[i].value
      }
    }
    return obj;
  }
  getValue(){
    let result = this.table.getValue()
    if(result&&result.length>0) {
      return result
    } else{
      Toaster.toaster({ type: 'error', content: '请至少选择一个', time: 3000 });
      return false;
    }
  }
  onSearch(params) {
    const { pageParmes } = this.state;
    if(pageParmes&&JSON.stringify(pageParmes)!=='{}'){
      let keys = Object.keys(params);
      let values= Object.values(params);
      for(let i=0;i<keys.length;i++){
        if(pageParmes[keys[i]]){
          params[keys[i]] = pageParmes[keys[i]]
        }
      }
    }
    
    // console.log('params', params)
    this.setState({
      searchParams: params
    });
    this.table.search(params);
  }
  beforeSearch() {
    this.setState({
      isLoading: true,
      listData: []
    });
  }
  success(data, allData) {
    this.setState({
      isLoading: false,
      listData: data,
      hasRequested: true
    });
  }
  error(data){
    this.setState({
      isLoading: false,
      listData: [],
    });
  }
  shouldComponentUpdate(nextProps, nextState){
    const { listData, isInit, hasRequested } = this.state;
    // console.log('isInit', isInit);
    // console.log(nextState.listStatus)
    if(nextState.listData&&nextState.listData.length !== (listData&&listData.length)){
      if(nextState.listData.length==0){
        if(hasRequested==true){
          return true
        }
        return false
      }
      if(listData.length==0){
        return true
      }
    }
    if(nextState.listData&&nextState.listData.length == (listData&&listData.length)) {
      if(nextState.listData.length==0){
        return true
      }
      if(listData.length!==0){
        if(isInit==false&&hasRequested==false){
          return false
        }
        return true
      }
    }
    return true
  }
  render() {
    const {
      listFormat,
      operations,
      searchCondition,
      searchUrl,
      method,
      header,
      respon,
      operationsRule,
      operationsFix,
      showIndex,
      showCheckBox,
      labelFormat,
      listConfig,
      batchOperations,
      ...others
    } = this.props;

    const { isLoading, listData, searchParams } = this.state;
    return (
      <Row>
        {listConfig&&(listConfig.showSearchCondition!== undefined&& listConfig.showSearchCondition== false) ?'':  
        <Col className="border-all border-color-f5f5f5 zindex-6 padding-bottom-1r">
        <AnTransition
          act={'enter'}
          delay={0}
          duration={166}
          enter={'listTem-enter'}
          leave={'listTem-leave'}
        ><SearchConditionPart
          title="查询条件"
          conditions={searchCondition}
          onSearch={this.onSearch}
          beforeSearch={this.beforeSearch}
          searchParams={searchParams}
          ref={(item) => {
            this.$$searchCon = item;
          }}
          {...others}
        /></AnTransition>
        </Col> }
        <Col className="border-all margin-top-1r border-color-f5f5f5">
        <AnTransition
          act={'enter'}
          delay={300}
          duration={166}
          enter={'listTable-enter'}
          leave={'listTable-leave'}
        >
        <TablePart
          title="查询结果"
          items={listData}
          minWidth={800}
          maxHeight={400}
          isLoading={isLoading}
          itemFormat={listFormat}
          operations={operations}
          batchOperations={batchOperations}
          operationsRule={operationsRule}
          ref={(item) => {
            this.table = item;
          }}
          beforeSearch={this.beforeSearch}
          success={this.success}
          error={this.error}
          onSearch={this.onSearch}
          searchParams={searchParams}
          url={searchUrl}
          method={method}
          header={header}
          respon={respon}
          operationsFix={operationsFix}
          showIndex={showIndex}
          showCheckBox={listConfig.showCheckBox}
          showPage={listConfig.showPage}
          {...others}
        /></AnTransition>
         </Col>
        </Row>
    );
  }
}

ListTemplate.propTypes = {
  searchCondition: PropTypes.arrayOf(PropTypes.shape()),
  listFormat: PropTypes.arrayOf(PropTypes.shape()),
  operations: PropTypes.arrayOf(PropTypes.shape()),
  operationsRule: PropTypes.shape(),
  operationsFix: PropTypes.bool,
  searchUrl: PropTypes.string,
  method: PropTypes.string,
  header: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({})), PropTypes.shape({})]),
  showIndex: PropTypes.bool,
  showCheckBox: PropTypes.bool,
  labelFormat: PropTypes.arrayOf(PropTypes.shape()),
  listConfig: PropTypes.shape(),
};

ListTemplate.defaultProps = {
  operations: [],
  operationsRule: {},
  operationsFix: false,
  method: 'POST',
  showIndex: false,
  labelFormat: [],
  header: [],
  showCheckBox: true,
  listConfig: { showCheckBox: false,  showSearchCondition: true}
};

export default ListTemplate
