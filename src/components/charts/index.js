import React , { Component }from 'react';
import { Components } from 'neo';
import { PropTypes } from 'prop-types';
import * as ChartRegistor from './chartRegistor';

const {
    Row,
    Col,DatePicker
} = Components;
  
class ChartsCommon extends Component {
    constructor(props) {
      super(props);
      this.state = {
          id: this.props.id || 'charts',
          renderStatue: 'LOADING', // 'LOADING', 'LOADED'
      };
    }
        
    componentDidMount(){
      // Step 1: 创建 Chart 对象
    }

    componentWillReceiveProps(nextProps){
   
    }

    render() {
        const { chartType, id, className, title } = this.props
        const ChartComponent = ChartRegistor.default[chartType]
        if(ChartComponent){
            return <Row className={`${className} width-100`}>
            <Col span={12} className={'text-align-left padding-left-1r line-height-3r font-size-12'}>{title}</Col>
            <Col span={12} className={'padding-top-1 text-align-right'}> <DatePicker showTime={false} onChange={()=>{}} callback={()=>{}}></DatePicker></Col>
            <Col className={''}><ChartComponent id={id} /></Col>
            </Row>
        } else{
            return <div className="padding-all-2r bg-show">未找到页面404</div>
        }
    }
}
ChartsCommon.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func
};
  
ChartsCommon.defaultProps = {
    id: '',
    className: '',
    onChange: () => {},
};
export default ChartsCommon;
