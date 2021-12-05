import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import fetch from '../../utils/request';
import { Row, Col, Toaster } from '../../Components';
import * as arrayUtils from '../../utils/array';
import config from '../../utils/config';
import styles from './style';
import { DetailPart, TablePart, ButtonTools } from '../../Parts';

class DetailRichTemplate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pageData: {},
      urlInfo: this.props.urlInfo,
      pageParmes: this.props.pageParmes,
    };
  }
  componentDidMount(){
    this.fetData()
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      urlInfo: nextProps.urlInfo,
      pageParmes: nextProps.pageParmes,
    }, ()=>{
      if(nextProps.reRender=='shuldRender' || !nextProps.reRender ){
      this.fetData()
      }
    })
  }
  
  setReq(condition, parmes){
    if(!parmes) return;
    let resp = {}
    for(let i=0;i<condition.length;i++){
      resp[condition[i].text] = condition[i].value ? condition[i].value :parmes[condition[i].text]
    }
    return resp
  }

  fetData(){
    const { urlInfo, pageParmes } = this.state;
    const self = this;
    if(!(urlInfo&&urlInfo.url)){
      return;
    }
    if(urlInfo&&urlInfo.url) {
      fetch(urlInfo.url, {
        method: urlInfo.method,
        data: urlInfo.options&&urlInfo.options.length>0 ? self.setReq(urlInfo.options, pageParmes): {},
      }, urlInfo.header||{}, urlInfo).then((res) => {
        if (res.code === config.SUCCESS) { 
          self.setState({
            pageData: res.data
          })
          // Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
        } else {
          Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
        }
      }).catch((err)=>{
        // console.log('err',err);
      });
    }
  }

  mergeDetail(detailList, pageData) {
    return detailList&&detailList.length>0 ? detailList.map((info) => {
      if (info.items) {
        arrayUtils.forEach(info.items, (item) => {
          item.value = pageData[item.key];
        });
      } else {
        info.value = pageData[info.key];
      }
      info.pageData = pageData;
      return info;
    }) : {};
  }

  render() {
    const { detailList, funcButton, callback  } = this.props;
    const { pageData } = this.state;
    // console.log('detailList', detailList, pageData)
    const detailDom = detailList&&detailList.length > 0 ? detailList.map((itm, idx)=>{
  
      if(itm.moldal=='TABLE') {
        return (<Row key={`${idx}-table`}>
          <Col><TablePart
              title={'test'}
              items={detailList.length==1? pageData:  (pageData[itm.key]|| [])}
              minWidth={'100%'}
              itemFormat={itm.keyArr}
              showPage={false}
              showIndex={false}
              ref={(itm) => {
                this.table = itm;
              }}
            /></Col>
        </Row>)
      } else if(itm.moldal=='TEXT'){
        let mergedDetailList = pageData&&JSON.stringify(pageData)!=='{}' ? this.mergeDetail(itm.keyArr, pageData): detailList  //DetailRichTemplate.mergeDetail(detailList, respData);
        return (<Row key={`${idx}-text`}>
          <Col><DetailPart
          detailList={mergedDetailList}
          data={pageData}
        /></Col>
        </Row>)
      }
    }): '';
    
    return (
      <Row justify={"center"}>
        <Col className="minheight-30">
        {detailDom}
        </Col>
        <Col style={styles.container}> 
          <Row justify={'flex-end'}>
          <ButtonTools options={funcButton} styles={styles.btn} pageData={pageData}
            callback={()=>{callback()}} />
          </Row>
        </Col>
      </Row>
    );
  }
}

DetailRichTemplate.propTypes = {
  detailList: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.array]),
  btns: PropTypes.arrayOf(PropTypes.shape()),
  funcButton: PropTypes.arrayOf(PropTypes.shape()),
  pageParmes: PropTypes.shape(),
};

DetailRichTemplate.defaultProps = {
  valid: [],
  btns: [],
  funcButton: [],
  pageParmes: {},
  detailList: []
};

export default DetailRichTemplate;