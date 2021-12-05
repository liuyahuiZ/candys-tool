
import React , { Component }from 'react';
import { Components, Parts, utils } from 'neo';
import { hashHistory } from 'react-router';

const { sessions, storage, request, config } = utils
const { Row, Col, Icon, Tab, Buttons, Input, Selects, Textarea, FileUp, Toaster } = Components;
const { NumFormRichPart, ListPart } = Parts
class ReturnGoods extends Component {
    constructor(props) {
      super(props);
      this.state = {
          confirmDirty: false,
          pageData: this.props.pageData,
          pageParmes: this.props.pageParmes,
          pageList: this.props.pageList,
          defaultAction: this.props.defaultAction,
          detailData: {},
          formData: [{ text: '订单编号', key: 'orderId', value: ''},
          { text: '赊销客户名称', key: 'creditsCustomerName', value: ''}, 
          { text: '品牌', key: 'brandName', value: ''},
          { text: '采购台数', key: 'purchaseNumber', value: '', after: '台'},
          { text: '订单总金额', key: 'orderTotalAmount', value: '', after: '元'},
          { text: '赊销金额', key: 'creditsAmount', value: '', after: '元'},
          ],
          times: '',
          selectKey: {}
      };
    //   console.log('pageParmes', this.props.pageParmes)
    }

    componentDidMount(){
        const {formData, pageParmes} = this.state
        this.mergeList(formData, pageParmes);
        this.getDetail(pageParmes)
    }
    getDetail(pageParmes){
        const {formData} = this.state;
        const self = this;
        let reqData = {
            orderId: pageParmes.orderId,
            orderFlowNumber:pageParmes.orderFlowNumber
        }
        request('/api/galaxy-johnnyq-order/api/v1/galaxy/johnnyq/credit/order/query', {
            method: 'POST',
            data: reqData,
          }).then((res) => {
            if (res.code === config.SUCCESS) {
              // Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
              let nweformData = self.mergeList(formData, res.data);
            //   console.log('nweformData', nweformData)
              self.setState({
                formData: nweformData,
                detailData: res.data
              })
            } else {
              
              Toaster.toaster({ type: 'error', content: res.msg,time: 3000 },true)
            }
          }).catch(()=>{
          });
    }
    mergeList(arr, obj) {
        if (!obj) {
          return;
        }
        for(let i=0;i<arr.length;i++){
            arr[i].value = obj[arr[i].key]
        }
        return arr
    }
    setKey(key, value) {
        const { selectKey } = this.state;
        let newSelectKey = selectKey
        newSelectKey[key] = value
        this.setState({
            selectKey: newSelectKey
        })
    }
    resetMoney(){
        let money = 0
        let arr = this.$$NumFormRich.getValue()
        // console.log('arr', arr);
        for(let i=0;i<arr.length;i++){
            if(arr[i].customRepaymentAmount){
                money += Number(arr[i].customRepaymentAmount)
            }
        }
        this.setKey('repayMoney', money)

    }

    doSumbit(){
        const { detailData, selectKey, defaultAction } = this.state;
        const self = this;
        if(!(selectKey.returnNumber&&selectKey.returnNumber!=='')){
            Toaster.toaster({ type: 'error', content: '请输入退货台数',time: 3000 },true)
            return ;
        }
        if(!(selectKey.returnAmount&&selectKey.returnAmount!=='')){
            Toaster.toaster({ type: 'error', content: '请输入退货金额',time: 3000 },true)
            return ;
        }
        if(!(selectKey.isCustomRepayment&&selectKey.isCustomRepayment!=='')){
            Toaster.toaster({ type: 'error', content: '请选择还款计划变更方式',time: 3000 },true)
            return ;
        }
        if(selectKey.isCustomRepayment == '1'){
            if(!(selectKey.times&&selectKey.times!=='')){
                Toaster.toaster({ type: 'error', content: '请输入期数',time: 3000 },true)
                return ;
            }
            let checkResult = this.$$NumFormRich.checkValid()
            if(!checkResult.status){
                Toaster.toaster({ type: 'error', content: checkResult.errStr, time: 3000 },true)
                return ;
            }
            let dataArr = this.$$NumFormRich.getValue();
            if(dataArr==''){
                Toaster.toaster({ type: 'error', content: '请完成必填项',time: 3000 },true)
                return ;
            }
        }
        let reqData = {
            orderId: detailData.orderId,
            orderFlowNumber:detailData.orderFlowNumber,
            remark: selectKey.remark,
            returnAmount: selectKey.returnAmount,
            returnNumber: selectKey.returnNumber,
            isCustomRepayment: selectKey.isCustomRepayment,
            originalPurchaseNumber:  detailData.purchaseNumber,
            originalOrderAmount: detailData.orderTotalAmount,
            originalCreditsAmount: detailData.creditsAmount,
            creditsCustomerName: detailData.creditsCustomerName
        }
        if(selectKey.isCustomRepayment == '1') {
            let dataArr = this.$$NumFormRich.getValue();
            reqData = Object.assign({}, reqData,{returnRepaymentPlan: dataArr})
        }
        debugger
        request('/api/galaxy-johnnyq-order/api/v1/galaxy/johnnyq/credit/return/add', {
            method: 'POST',
            data: reqData,
          }).then((res) => {
            if (res.code === config.SUCCESS) {
              // Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
              this.setState({ LoadSatus: 'LOADED' },()=>{
                this.setLoadStatus('NULLLOAD');
              });
              Toaster.toaster({ type: 'success', content: res.msg,time: 3000 },true)
              self.props.callback();
            } else {
              this.setLoadStatus('NULLLOAD');
              Toaster.toaster({ type: 'error', content: res.msg,time: 3000 },true)
            }
          }).catch(()=>{
            this.setLoadStatus('NULLLOAD');
          });
    }

    setLoadStatus(status){
        const self = this;
        setTimeout(()=>{
          self.setState({ LoadSatus: status });
        }, 2000)
      }
    render() {
        const { pageData,formData, times, formatModel , selectKey, LoadSatus}= this.state
        // console.log('pageData', pageData, formData)
        const formDom = formData&&formData.length > 0 ? formData.map((itm, idx)=>{
            return <Col span={8} key={`${idx}-f`} className="line-height-2r"><span>{itm.text}</span>: {itm.value} {itm.after? itm.after : ''}</Col>
        }) : '';

        const self = this;
        return(
          <section className="bg-show  padding-all-1r">        
            <Row>
                <Col><h3>原订单信息</h3></Col>
                <Col>
                    <Row className="padding-all-1r">
                        {formDom}
                        <Col span={8} className="line-height-2r"><span>剩余未还金额</span>: {self.props.pageParmes.remainAmt} 元</Col>
                    </Row>
                </Col>
                <Col><h3>退货信息</h3></Col>
                <Col>
                    <Row className="padding-all-1r">
                        <Col span={10}> 
                        <Row>
                            <Col span={12} className="line-height-3r maxwidthx-160 text-overflow"><span className="textcolor-F55936">*</span> 退货台数（台）：</Col>
                            <Col span={12} className="border-all border-color-e5e5e5 border-radius-3f"><Input
                            value={selectKey.returnNumber}
                            placeholder="请输入退货台数"
                            maxLength={100}
                            innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                            onChange={(e,t,v)=>{
                                self.setKey('returnNumber', v)
                            }}
                            /></Col></Row>
                        </Col>
                        <Col span={10}><Row>
                            <Col span={12} className="line-height-3r maxwidthx-160 text-overflow"><span className="textcolor-F55936">*</span> 退货金额（元）：</Col>
                            <Col span={12} className="border-all border-color-e5e5e5 border-radius-3f"><Input
                            value={selectKey.returnAmount}
                            placeholder="请输入退货金额"
                            maxLength={100}
                            innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                            onChange={(e,t,v)=>{
                                self.setKey('returnAmount', v)
                            }}
                            /></Col></Row></Col>
                        <Col className="margin-top-1r" ><Row>
                            <Col span={12} className="line-height-3r maxwidthx-160 text-overflow"><span className="textcolor-F55936">*</span> 还款计划变更方式：</Col>
                            <Col span={10} className=""><Selects value={selectKey.isCustomRepayment||''} onChange={(e,t,v)=>{
                                
                               self.setKey('isCustomRepayment', v.value)
                            }} options={[{text: '请选择', value: ''},{text: '自定义变更还款计划', value: '1'},{text: '期数不变，按照剩余未还金额平均', value: '0'}]} />
                            </Col></Row></Col>
                        {selectKey.isCustomRepayment==1 ? <Col className="margin-top-1r" span={8}><Row>
                            <Col span={12} className="line-height-3r maxwidthx-100 text-overflow"><span className="textcolor-F55936">*</span> 期数：</Col>
                            <Col span={12} className="border-all border-color-e5e5e5 border-radius-3f"><Input
                            value={selectKey.times}
                            placeholder="请输入期数"
                            maxLength={100}
                            innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                            onChange={(e,t,v)=>{
                                if(v>=12){
                                    return;
                                }
                                self.setKey('times', v)
                                self.$$NumFormRich.setValue(v);
                            }}
                            />
                            </Col></Row></Col> : ''}
                        {selectKey.isCustomRepayment==1 ?<Col className="margin-top-1r" span={10}><Row>
                            <Col span={12} className="line-height-3r maxwidthx-160 text-overflow">应还款金额之和：</Col>
                            <Col span={12} className="line-height-3r">{selectKey.repayMoney}
                            </Col></Row></Col> : ''}
                        {selectKey.isCustomRepayment==1 ?<Col span={13} className="margin-top-1r">
                            <ListPart listFormat={[{"hasOnchange":false,"isShow":true,"disabled":false,"key":"id","text":"编号","type":"InnerText"},
                            {key: 'customRepaymentPeriod', type: 'text', text: '期数', disabled: true, "isShow":false, auto: true, innerStyle: {textAlign: 'center'}}, 
                            {key: 'customRepaymentAmount', type: 'Input', text: '应还金额', innerStyle: {textAlign: 'center'}, errorMsg:'应还金额必填', valid: 'required', 
                            iteChange: (it, value, rowIdx)=>{ 
                                // console.log('res', it, value, rowIdx);
                                self.resetMoney()
                            }},
                            {key:'customRepaymentDate', type: 'date', text: '应还款日期', model: 'date', contStyle:[{text:'width', value:'200px'}], errorMsg:'应还款日期', valid: 'required' }]} 
                            showSort={false} showIndex={false} 
                            wholeRules={[{"ruleModal":false,"text":"全局1","key":"rule1",
                            "activeFactor":[{"text":"编号","value":"id","linkDomKey":"id","key":"id"}],
                            "passiveFactor":[{"text":"期数","value":"customRepaymentPeriod","linkDomKey":"customRepaymentPeriod","key":"customRepaymentPeriod"}],
                            "vaildType":"Factor","factors":[{"text":"编号","value":"id","linkDomKey":"id","factorType":"Factor","key":"1"},{"text":"+","value":"add","linkDomKey":"add","factorType":"Calculation","key":"add"},{"text":"0","value":"0","factorType":"ConstValue","key":"y"}],"changeType":"onChange","actionType":"toValue"}]} 
                            ref={(r)=>{this.$$NumFormRich=r}} />
                            {/* <NumFormRichPart valid="required" modalType={'LIST'} 
                            formatArr={[{key: 'customRepaymentPeriod', type: 'Input', text: '期数', disabled: true, auto: true, innerStyle: {textAlign: 'center'}}, 
                            {key: 'customRepaymentAmount', type: 'Input', text: '应还金额', innerStyle: {textAlign: 'center'}, errorMsg:'应还金额必填', valid: 'required', 
                            onChange: (res)=>{ 
                                // console.log('res', res);
                                self.resetMoney(res)
                            }}]} ref={(r)=>{this.$$NumFormRich=r}} /> */}
                        </Col> : ''}
                        <Col className="margin-top-1r" span={12}><Row>
                            <Col span={12} className="line-height-3r maxwidthx-100 text-overflow">备注：</Col>
                            <Col span={12}><Textarea
                            value={selectKey.remark}
                            placeholder="请填写备注"
                            maxLength={100}
                            innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                            onChange={(value)=>{
                                self.setKey('remark', value)
                            }}
                            />
                            </Col></Row></Col>
                        <Col span={14} className="margin-top-2r text-align-center">
                            <Buttons
                                text={'提交'}
                                type={'primary'}
                                size={'normal'}
                                style={{color:'#fff', borderRadius: '0.3rem', minWidth: '9rem', width: '9rem'}}
                                onClick={()=>{
                                    self.doSumbit()
                                }}
                                LoadSatus={LoadSatus}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
          </section>
        );
    }
}
export default ReturnGoods;
