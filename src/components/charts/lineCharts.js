import React , { Component }from 'react';
import { PropTypes } from 'prop-types';
import { Components } from 'neo';
import G2 from '@antv/g2';

const {
    Row,
    Col,
} = Components;
  
class LineCharts extends Component {
    constructor(props) {
      super(props);
      this.state = {
          id: this.props.id || 'lineCharts',
          renderStatue: 'LOADING', // 'LOADING', 'LOADED'
          data: [{
            year: '1991',
            value: 3
          }, {
            year: '1992',
            value: 4
          }, {
            year: '1993',
            value: 3.5
          }, {
            year: '1994',
            value: 5
          }, {
            year: '1995',
            value: 4.9
          }, {
            year: '1996',
            value: 6
          }, {
            year: '1997',
            value: 7
          }, {
            year: '1998',
            value: 9
          }, {
            year: '1999',
            value: 13
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
        chart.source(data);
        chart.scale('value', {
            min: 0
        });
        chart.scale('year', {
            range: [0, 1]
        });
        chart.tooltip({
            crosshairs: {
              type: 'line'
            }
        })
        chart.line().position('year*value');
        chart.areaStack().position('year*value').color('l(90) 0:#5D8EFF 1:#fff');
        chart.lineStack().position('year*value').color('#5D8EFF')
        .size(2);
        chart.point().position('year*value').size(4).shape('circle').style({
            stroke: '#fff',
            lineWidth: 1
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
LineCharts.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func
};

LineCharts.defaultProps = {
  id: '',
  className: '',
  onChange: () => {},
};
export default LineCharts;
