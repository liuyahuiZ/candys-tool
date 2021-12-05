import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as arrayUtils from '../../utils/array';
import Icon from '../Icon';

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      loadStatus: 'LOADING',
      imgText: this.props.value ? '加载中...': '暂无数据'
    };
  }
  componentDidMount() {
  }

  render() {
    const { imageURl, value, className, innerStyle, showText } = this.props;
    const { loadStatus, imgText } = this.state
    console.log('imageURl', imageURl, loadStatus)
    let rootUrl = imageURl
    if(imageURl&&imageURl.indexOf('${')>=0&&value){
      // let splitArr = imageURl.split(/\${.*\}/g)
      rootUrl = imageURl.replace(/\${.*\}/g, value)
    } else{
      rootUrl = value
    }
    return (
      <div className={` ${className||'width-100'} display-inline-block`}>
         {loadStatus=='ERROR'? '' :<img src={rootUrl} onLoad={()=>{ console.log('load complate');
          this.setState({
              loadStatus: 'LOADED',
              imgText: ''
          })
        }} onError={()=>{
          this.setState({
            loadStatus: 'ERROR',
            imgText: '加载失败'
          })
        }} className={` ${className||'width-100'} ${loadStatus=='LOADING'? 'img_bg': ''}`} style={innerStyle ? arrayUtils.arrToObg(innerStyle, 'text', 'value') : {}} />}
        <div className='width-100 text-align-center'>{ loadStatus=='ERROR'||!value ? <Icon iconName='image' size="200%" /> : ''}</div>
        <div className='width-100 text-align-center'>{ showText ? imgText : '' }</div>
      </div>
    );
  }
}

Image.propTypes = {
  iconName: PropTypes.string,
  size: PropTypes.string,
  iconColor: PropTypes.string,
  iconPadding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.shape(),
  onClick: PropTypes.func,
  className: PropTypes.string,
  showText: PropTypes.bool
};

Image.defaultProps = {
  iconName: 'happy-outline',
  size: '100%',
  iconColor: '#666',
  iconPadding: '',
  style: {},
  onClick: () => {},
  className: '',
  showText: true
};


export default Image;
