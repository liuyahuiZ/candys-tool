import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Row, Col, Toaster, Image } from '../../Components';
import { DetailPart } from '../../Parts';
import * as arrayUtils from '../../utils/array';

class DetailTemplate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pageData: this.props.pageParmes || {},
      urlInfo: this.props.urlInfo,
      pageParmes: this.props.pageParmes,
      itmsConfig: this.props.itmsConfig,
      cardBgConfig: this.props.cardBgConfig
    };
    this.getValue =  this.getValue.bind(this)
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      urlInfo: nextProps.urlInfo,
      pageParmes: nextProps.pageParmes,
      itmsConfig: nextProps.itmsConfig,
      cardBgConfig: nextProps.cardBgConfig
    })
  }
  componentWillUnmount(){
    this.setState({
      urlInfo: ''
    })
  }

  getValue(){
    const { detailList  } = this.props;
    const { pageData } = this.state;
    return {};
  }
  

  render() {
    const { callback  } = this.props;
    const { itmsConfig, cardBgConfig } = this.state;
    let contStyle = {};
    if(cardBgConfig.contStyle) {
        contStyle = arrayUtils.arrToObg(cardBgConfig.contStyle, 'text', 'value')
        // console.log(contStyle);
    }
    const self = this;
    console.log('itmsConfig', itmsConfig, cardBgConfig);
    return (
      <Row className="relative" style={{ height: '100%', background: cardBgConfig.bgColor }} >
        <Col span={24} className="relative zindex-6">
            <DetailPart
                detailList={itmsConfig}
            />
        </Col>
        {cardBgConfig.bgUrl && <div style={Object.assign({}, contStyle)}><Image imageURl={cardBgConfig.bgUrlPre} value={cardBgConfig.bgUrl} /></div>}
      </Row>
    );
  }
}

DetailTemplate.propTypes = {
  cardBgConfig: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.array]),
  pageParmes: PropTypes.shape(),
  itmsConfig:  PropTypes.oneOfType([PropTypes.shape({}),PropTypes.array])
};

DetailTemplate.defaultProps = {
  valid: [],
  pageParmes: {},
  itmsConfig: [],
  cardBgConfig: {}
};

export default DetailTemplate;