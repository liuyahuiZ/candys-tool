import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import * as arrayUtils from '../../utils/array';
import { Toaster, Row, Col, Pagination } from '../../Components/';
import styles from './style';
import filter from '../../utils/filter';
import genInput from '../factory';
import formatPart from '../FormatPart';
import ButtonTools from '../ButtonTools';

class CardsPart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: this.props.listData
    };
    this.genInput = genInput.bind(this);
  }
  getValue(detail) {
    const { detailList } = this.props;
    if (detail.format && detail.format !== '') {
      // console.log('format', detail.format);
      if (detail.format === 'html') {
        return (<span style={styles.value} dangerouslySetInnerHTML={{ __html: detail.value }} />);
      }
      return (<span style={styles.value}> {filter(eval(detail.format), detail.value)} </span>);
    }
    if(detail.formatModel){
      return formatPart(detail, detail.value, detail.formatStr, detail.replaceStr, detailList )
    }
    if(detail.type){
      return this.genInput(detail)
    }
    return (<span style={styles.value}
      ref={(r) => { this[`$$${detail.key}${detail.keyId?detail.keyId:''}`] = r; }}> {detail.value||'--'} </span>);
  }
  componentDidMount() {
    if (this.pageNation) {
      this.search = this.pageNation.search;
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      listData: nextProps.listData,
      isLoading: nextProps.isLoading
    })
  }
  genOperations(rowIdx) {
    const { operations, listData } = this.props;
    const self = this;

    return (operations&&operations.length > 0? <div style={styles.buttonTools}>
      <ButtonTools options={operations} styles={styles.opBtn} pageData={listData[rowIdx]}
        size={'small'} rowIdx={rowIdx} callback={()=>{ console.log('res') }} /></div> : ''
    );
  }
  render() {
    const { listData } = this.state;
    const { minWidth, maxHeight,beforeSearch,success, error,searchParams,url, listConfig, 
      method,header,respon,showPage, operations,urlConfig, showCheckBox, itemFormat
    } = this.props;
    const self = this;
    const paginationStyle = Object.assign({}, styles.pagination);
    let showBatchOperation = false;
    let cardStyle = listConfig ? arrayUtils.arrToObg(listConfig.cardStyle, 'text', 'value') : {};
  
    const listDom = listData&&listData.length>0 ? listData.map((item, idx)=>{
      return (<Col key={`${idx}-card`} className='relative' span={listConfig.span||12} style={Object.assign({}, cardStyle)} >
        {itemFormat&&itemFormat.length>0? itemFormat.map((config, colIdx) => {
              const { key, after,title } = config;
              const dispStyle = {};
              if (config.isShow!==undefined) {
                if (config.isShow==false) {
                  dispStyle.display = 'none';
                }
              }

              let contStyle = {}
              if(config.contStyle) {
                contStyle = arrayUtils.arrToObg(config.contStyle, 'text', 'value')
              }
              let textContStyle= {}
              if(config.textContStyle) {
                textContStyle = arrayUtils.arrToObg(config.textContStyle, 'text', 'value')
              }
              let labelStyle = {}
              if(config.labelStyle) {
                labelStyle = arrayUtils.arrToObg(config.labelStyle, 'text', 'value')
              }
              config.value = item[key]
              const value = item && self.getValue(config);
              return (
                <div key={`${colIdx}-trc`} title={config.value}
                  style={Object.assign({}, config.style, contStyle, dispStyle)}>
                  <span style={Object.assign({}, styles.label, labelStyle)}>{title}</span>
                  <div style={Object.assign({}, styles.inline, textContStyle)}>{value}</div>
                </div>
              );
            }) : ''
          }
          {self.genOperations(idx, item)}
          </Col>)
    }): ''
    if (!listData || !listData.length || listData.length === 0) {
      paginationStyle.display = 'none';
      showBatchOperation = false
    }
    return (
      <div >
        <Row >{listDom}</Row>
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
                this.pageNation = item;
              }}
            />
      </div>
    );
  }
}

CardsPart.propTypes = {
  listConfig: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.array, PropTypes.string]),
};

CardsPart.defaultProps = {
  style: {},
  listConfig: {}
};

export default CardsPart;
