
import React , { Component, useState }from 'react';
import { Components , Parts ,utils} from 'neo';
import { goLink } from 'utils/common';
const { Row, Col , Icon , Modal ,DatePicker, RandomNumber, RandomNum,Loader} = Components;
const { TablePart } = Parts;
const { sessions} = utils;
import ChartCommon from '../../components/charts';
import Example from './hook';
import Hooke from './hooke';
import Hookc from './hookc';
import Hookd from './hookd';
import Hookf from './hookf';
import Hookg from './hookg';
import Redu from './redu';

class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
          accountMoney:0
      };
    }

    componentDidMount(){

    }
  
    handleJump(){
        // TODO
        Modal.alert({ title: '提示',
            content:'表急，程序猿疯狂开发中' ,
            style: '',
            type: 'small',
            btnConStyle: 'right',
            btn: {
              text: '确认',
              type: 'primary',
              style: { 'height': '2rem', 'minWidth': '100px'}
            }
          },
          (id, callback) => { 
              callback(id);
          },
          (id, callback) => { callback(id); });
    }
    handleAccount=()=>{
        this.props.go('/electronic/subAccount/list',{}, { linkModal: true })
    }
    render() {
        const {accountMoney}=this.state;
        return(
          <section className="">
            {/* <Example ref={(r)=>{ this.$$$ExampHook = r}} /> */}
            {/* <Hooke data={'1'} />
            <Hookc />
            <Hookd />
            <Hookf />
            <Hookg />
            <Redu /> */}
            <Row className="relative padding-top-2r">
            <Col span={19}><Row >
                <Col span={6} className="padding-right-1r" >
                    <Row className="heighr-6 bg-FFA940 box-shadow border-radius-5f padding-all-1r">
                    <Col span={8}><Icon iconName={'cash'} size={'250%'} iconColor={'#fff'} /></Col>
                        <Col span={16} className="textcolor-000">
                            <Row className="font-size-8 textclolor-white">昨日交易额</Row>
                            <Row className="font-size-16 textclolor-white"><RandomNum value={15142} /></Row>
                            <Row className="font-size-8 textclolor-white"><Icon iconPadding={'0'} style={{marginTop:'-5px'}} iconName={'android-arrow-dropdown'} size={'200%'} iconColor={'#5D8EFF'} /><span className="textcolor-DF1B2E">10% </span><span>同比前日</span></Row>
                        </Col>
                    </Row>
                </Col>

                <Col span={6} className="padding-right-1r" >
                    <Row className="heighr-6 bg-73D03D box-shadow border-radius-5f padding-all-1r">
                    <Col span={8}><Icon iconName={'android-people '} size={'300%'} iconColor={'#217804'} /></Col>
                        <Col span={16} className="textcolor-000">
                            <Row className="font-size-8">本月新用户</Row>
                            <Row className="font-size-16"><RandomNum value={4785} /></Row>
                            <Row className="font-size-8"><Icon iconPadding={'0'} style={{marginTop:'-5px'}} iconName={'android-arrow-dropdown'} size={'200%'} iconColor={'#5D8EFF'} /><span className="textcolor-DF1B2E">10% </span><span>同比上周</span></Row>
                        </Col>
                    </Row>
                </Col>
                <Col span={6} className="padding-right-1r" >
                    <Row className="heighr-6 bg-show box-shadow border-radius-5f padding-all-1r">
                    <Col span={8}><Icon iconName={'android-contacts'} size={'300%'} iconColor={'#5D8EFF'} /></Col>
                        <Col span={16} className="textcolor-000">
                            <Row className="font-size-8">下级服务商</Row>
                            <Row className="font-size-16"><RandomNum value={8962} /></Row>
                            <Row className="font-size-8"><Icon style={{marginTop:'-5px'}} iconPadding={'0'} iconName={'android-arrow-dropup'} size={'200%'} iconColor={'#ff5757'} /><span className="textcolor-ff5757">10% </span><span>同比前日</span></Row>
                        </Col>
                    </Row>
                </Col>
                <Col span={6} className="padding-right-1r" >
                    <Row className="heighr-6 bg-855EF1 box-shadow border-radius-5f padding-all-1r">
                    <Col span={8}><Icon iconName={'ios-calculator '} size={'300%'} iconColor={'#fff'} /></Col>
                        <Col span={16} className="textcolor-000">
                            <Row className="font-size-8 textclolor-white">活跃终端（个）</Row>
                            <Row className="font-size-16 textclolor-white"><RandomNum value={89745} /></Row>
                            <Row className="font-size-8 textclolor-white"><Icon style={{marginTop:'-5px'}} iconPadding={'0'} iconName={'android-arrow-dropdown'} size={'200%'} iconColor={'#5D8EFF'} /><span className="textcolor-DF1B2E">10% </span><span>同比上周</span></Row>
                        </Col>
                    </Row>
                </Col>
                <Col span={16} className="padding-top-1r padding-right-1r">
                    <ChartCommon chartType={"LineCharts"} title={'用户增长趋势'} className="box-shadow border-radius-5f overflow-hide" />
                </Col>
                <Col span={8} className="padding-top-1r padding-right-1r">
                    <ChartCommon chartType={"Charts"} title={'收益'} className="box-shadow border-radius-5f overflow-hide" id="chart1" />
                </Col>
                <Col span={12} className="padding-top-1r padding-right-1r">
                    <ChartCommon  chartType={"PieCharts"} title={'收益占比'} className="box-shadow border-radius-5f overflow-hide" id="pie1" />
                </Col>
                <Col span={12} className="padding-top-1r padding-right-1r">
                    <ChartCommon chartType={"Charts"} title={'终端趋势'} className="box-shadow border-radius-5f overflow-hide" />
                </Col>
            </Row></Col>
            <Col span={5} className="border-left border-color-f5f5f5 padding-left-1r">
                <Row className="heighr-6 bg-FC5C4B box-shadow border-radius-5f padding-all-1r margin-bottom-1r">
                    <Col span={8}><Icon iconName={'filing'} size={'300%'} iconColor={'#fff'} /></Col>
                        <Col span={16} className="textcolor-000">
                            <Row className="font-size-8 textclolor-white">账户总金额（元）</Row>
                            <Row className="font-size-12 textclolor-white"><RandomNum value={accountMoney||0} /></Row>
                            <Row className="text-overflow textclolor-white" ><span onClick={this.handleAccount} className="margin-right-5">品牌子账户列表</span></Row>
                        </Col>
                </Row>
                <Row className="heighr-6 bg-6E9EFB box-shadow border-radius-5f padding-all-1r margin-bottom-1r">
                        <Col span={8}><Icon iconName={'card'} size={'300%'} iconColor={'#fff'} /></Col>
                        <Col span={16} className="textcolor-000">
                            <Row className="font-size-8 textclolor-white">结算卡</Row>
                            <Row className="font-size-12 textclolor-white">6227****1245</Row>
                            <Row className="text-overflow textclolor-white"><span onClick={this.handleJump} className="margin-right-5">继续绑卡</span><span onClick={this.handleJump}>查看</span></Row>
                        </Col>
                </Row>
                <Row className="heighr-6 bg-FC5C4B box-shadow border-radius-5f padding-all-1r margin-bottom-1r">
                    <Col span={8}><Icon iconName={'filing'} size={'300%'} iconColor={'#fff'} /></Col>
                        <Col span={16} className="textcolor-000">
                            <Row className="font-size-8 textclolor-white">今日新增客户</Row>
                            <Row className="font-size-12 textclolor-white"><RandomNumber value={6666} /></Row>
                        </Col>
                </Row>
                <Row className="heighr-6 bg-6E9EFB box-shadow border-radius-5f padding-all-1r margin-bottom-1r">
                        <Col span={8}><Icon iconName={'card'} size={'300%'} iconColor={'#fff'} /></Col>
                        <Col span={16} className="textcolor-000">
                            <Row className="font-size-8 textclolor-white">今日新开终端</Row>
                            <Row className="font-size-12 textclolor-white"><RandomNumber value={6666} /></Row>
                        </Col>
                </Row>
                <Row>
                    <ChartCommon  chartType={"PieCharts"} title={'LineCharts'} className="box-shadow border-radius-5f overflow-hide" id="pie2" />
                </Row>
            </Col>
            </Row>
          </section>
        );
    }
}
export default Home;
