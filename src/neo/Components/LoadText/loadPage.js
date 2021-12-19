import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import Row from '../Grid/Row';
import Col from '../Grid/Col';

class LoadPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadStatus: this.props.loadStatus||'LOADING', //'LOADING', 'ERROR', 'SUCCESS', 'NODATA'
      loadText: {
        LOADING: '加载中...',
        SUCCESS: '加载成功',
        ERROR: '加载失败',
        NODATA: '暂无数据'
      }, // '加载中', '加载失败', '成功'
    };
  }
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      loadStatus: nextProps.loadStatus
    })
  }

  render() {
    const { loadText, loadStatus } = this.state;
    const { className, showText, text } = this.props;
    let loadTxt = text ? text: loadText[loadStatus]
    return (
      <div className={ `${className} text-align-center maxwidth-70`}>
        <Row className="padding-all-1r" align={'center'}>
        <Col span={24} className="bg-5253cc heighr-2 margin-top-1r border-radius-3f opacity-4"></Col>
        <Col span={20} className="bg-5253cc heighr-2 margin-top-1r border-radius-3f opacity-4"></Col>
        <Col span={12} className="bg-5253cc heighr-2 margin-top-1r border-radius-3f opacity-4"></Col>
        {showText? <Col span={24}  className="line-height-3r margin-top-3r"><span>{loadTxt}</span></Col>: ''}
        </Row>
      </div>
    );
  }
}

LoadPage.propTypes = {
  loadText: PropTypes.string,
  loadStatus: PropTypes.string,
  iconPadding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.shape(),
  refreshBack: PropTypes.func,
  className: PropTypes.string,
  showText: PropTypes.bool
};

LoadPage.defaultProps = {
  loadText: '加载中',
  loadStatus: 'LOADING',
  iconPadding: '',
  style: {},
  refreshBack: () => {},
  className: '',
  showText: true
};


export default LoadPage;
