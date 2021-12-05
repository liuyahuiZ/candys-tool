import React , { Component }from 'react';
import { Components } from 'neo';
import G2 from '@antv/g2';
import { PropTypes } from 'prop-types';

const {
    Row,
    Col,
} = Components;
  
class Charts extends Component {
    constructor(props) {
      super(props);
      this.state = {
          id: this.props.id || 'charts',
          renderStatue: 'LOADING', // 'LOADING', 'LOADED'
          data: [
            { genre: 'Sports', sold: 275 },
            { genre: 'Strategy', sold: 115 },
            { genre: 'Action', sold: 120 },
            { genre: 'Shooter', sold: 350 },
            { genre: 'Other', sold: 150 }
          ],
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
        // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
        chart.interval().position('genre*sold').color('genre');
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
Charts.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func
};
  
Charts.defaultProps = {
    id: '',
    className: '',
    onChange: () => {},
};
export default Charts;
