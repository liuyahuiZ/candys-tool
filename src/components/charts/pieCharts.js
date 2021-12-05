import React , { Component }from 'react';
import { Components } from 'neo';
import { PropTypes } from 'prop-types';
import G2 from '@antv/g2';

const {
    Row,
    Col,
} = Components;
  
class PieCharts extends Component {
    constructor(props) {
      super(props);
      this.state = {
          id: this.props.id || 'pieCharts',
          renderStatue: 'LOADING', // 'LOADING', 'LOADED'
          data: [{
            item: '事例一',
            count: 40,
            percent: 0.4
          }, {
            item: '事例二',
            count: 21,
            percent: 0.21
          }, {
            item: '事例三',
            count: 17,
            percent: 0.17
          }, {
            item: '事例四',
            count: 13,
            percent: 0.13
          }, {
            item: '事例五',
            count: 9,
            percent: 0.09
          }],
          style:{
              height: 300
          }
      };
    }
        
    componentDidMount(){
      // Step 1: 创建 Chart 对象
      const self = this;
      const {data} = this.state;
      let clentWidth =  this.$$container.clientWidth;
      this.setState({
          renderStatue: 'LOADED',
          clentWidth: clentWidth
      },()=>{
          if(data&&data.length>0){
            self.renderCharts();
          }
      })
    }

    componentWillReceiveProps(nextProps){
        // const self = this;
        // console.log('nextProps', nextProps);
        // const {data} = this.state;
        // this.setState({
        //     data: nextProps.data
        // }, ()=>{
        //     if(nextProps.data&&nextProps.data.length>0){
        //         if(data&&data.length>0&&(data[0].value==nextProps.data[0].value)) {return false;}
        //         self.renderCharts()
        //     }
            
        // })
    }

    renderCharts(){
        const {id, data, clentWidth} = this.state;
        const chart = new G2.Chart({
            container: id,
            width: clentWidth,
            height: 400
          });
        // Step 2: 载入数据源
        chart.source(data, {
          percent: {
            formatter: function formatter(val) {
              val = val * 100 + '%';
              return val;
            }
          }
        });
        chart.coord('theta');
        chart.tooltip({
          showTitle: false
        });
        chart.intervalStack().position('percent').color('item').label('percent', {
          offset: -40,
          // autoRotate: false,
          textStyle: {
            textAlign: 'center',
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, .45)'
          }
        }).tooltip('item*percent', function(item, percent) {
          percent = percent * 100 + '%';
          return {
            name: item,
            value: percent
          };
        }).style({
          lineWidth: 1,
          stroke: '#fff'
        });
        // Step 4: 渲染图表
        chart.render();
    }
    render() {
        const {id, renderStatue} = this.state;
        const { className } = this.props
        return(
          <section className={className} ref={(r) => { this.$$container = r; }}>
            { renderStatue == "LOADED" ? <div id={id}></div> :
            <Row><Col className="text-align-center">加载中</Col></Row>}
          </section>
        );
    }
}
PieCharts.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func
};

PieCharts.defaultProps = {
  id: '',
  className: '',
  onChange: () => {},
};
export default PieCharts;
