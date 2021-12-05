import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as arrayUtils from '../../utils/array';
import Row from '../Grid/Row';
import Col from '../Grid/Col';
import fetch from '../../utils/request';
import config from '../../utils/config';
import * as sessions from '../../utils/sessions';

class ImageArr extends Component {
  constructor(props) {
    super(props);
    const { hasRequest } = this.props;
    this.state = {
      options: [],
      hasRequest: hasRequest
    };
  }
  componentDidMount() {
    const { hasRequest } = this.props;
    if(hasRequest==true){
      this.initRequest()
    }
  }
  setReqs(condition, parmes){
    if(!parmes) return;
    let resp = {}
    if(!(condition&&condition.length)) return;
    for(let i=0;i<condition.length;i++){
      let resValue = condition[i].value ? condition[i].value :parmes[condition[i].key]
      if(condition[i].value&&condition[i].value.indexOf('$P.')>=0){
        const { pageData } = this.props
        if(pageData){
          resValue = pageData[condition[i].value.replace('$P.', '')] 
        }
      }
      if(condition[i].valueType){
        resValue = this.setType(condition[i].valueType, condition[i].value)
      }
      if(condition[i].optionCacheKey){
        let cache = sessions.getStorage('caches')
        resValue = cache[condition[i].optionCacheKey.keyName]
      }
      resp[condition[i].text] = resValue
    }
    return resp
  }
  initRequest(parems = {}){
    const { imgArrRequest } = this.props;
    const self = this;
    if(imgArrRequest&&imgArrRequest.url) {
      fetch(imgArrRequest.url, {
        method: imgArrRequest.method,
        data: Object.assign({}, self.setReqs(imgArrRequest.options, {}), parems)
      }, imgArrRequest.header||{}, imgArrRequest).then((res) => {
        if (res.code === config.SUCCESS) {
          let options = arrayUtils.getOptions(res.data, imgArrRequest.textKey, imgArrRequest.valueKey)
          let allOptions = []
          allOptions.push(...options);
          self.setState({
            options: allOptions,
          });
        } else {
          // Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
        }
      }).catch((err)=>{
        // console.log(err);
      });
    }
  }

  setUrl(value){
    const { imageURl } = this.props;
    // console.log('imageURl', imageURl)
    let rootUrl = imageURl
    if(imageURl&&imageURl.indexOf('${')>=0&&value){
      // let splitArr = imageURl.split(/\${.*\}/g)
      rootUrl = imageURl.replace(/\${.*\}/g, value)
    } else{
      rootUrl = value
    }
    return rootUrl
  }
  render() {
    const { innerStyle } = this.props;
	const imgStyle={minWidth:'10rem',minHeight:'10rem !important',marginRight:'0.6rem',marginBottom:'0.6rem',background:'#f9f9f9'};
    const { options } = this.state
    const self = this;
    const imgArr =  options&&options.length>0?options.map((itm, idx)=>{
      return <img key={`${idx}-key`} src={self.setUrl(itm.value)} className="width-30" style={innerStyle ? arrayUtils.arrToObg(innerStyle, 'text', 'value') : {},imgStyle} />
    }): <Col/>
    return <Row className="width-100">
      {imgArr}
    </Row>;
  }
}

ImageArr.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
};

ImageArr.defaultProps = {
  onClick: () => {},
  className: ''
};


export default ImageArr;
