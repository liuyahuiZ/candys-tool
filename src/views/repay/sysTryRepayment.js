
import React , { Component }from 'react';
import { Components, Parts, utils } from 'neo';
import { hashHistory } from 'react-router';

const { sessions, storage, request,  config} = utils
const { Row, Col, Icon, Tab, Buttons, Input, Selects, Textarea,FileUpWithData,Toaster } = Components;
const { NumFormRichPart } = Parts
class userRepayment extends Component {
    constructor(props) {
      super(props);
      this.state = {
		  order:{orderId:'AAAA',customerName:'张三',pinpai:'1',waitRepayAmt:'aa'},
		  confirmDirty: false,
		  waitRepayAmt:"",
          pageData: this.props.pageData,
          pageParmes: this.props.pageParmes,
          pageList: this.props.pageList,
          defaultAction: this.props.defaultAction,
          times: '',
		  abcoptions:[],
		  repayAmt:0,
		  selectKey: {},
		  remark:""
      };
	}

	componentDidMount(){
        const {formData, pageParmes} = this.state
        this.getWaitRepayAmt(pageParmes.orderId).then(res=>{
			// console.log("卧槽，这是返回数据",res)
			this.setState({
				waitRepayAmt:res.data[0].ordram,
				abcoptions:[{text: '主动还款', value: 'userrepay'}]
			})
			
		}).catch(err=>{
			// console.log("我去",err)
		})
    }
	getWaitRepayAmt(orderId){
		return new Promise((resolve,reject)=>{
			request("/api/galaxy-johnnyq-order/api/v1/galaxy/johnnyq/credit/repayment/info/query",{
				method: 'POST', 
				data:{orderId}
			}).then((res) => {
				if (res.code === config.SUCCESS) {
					resolve(res)
				}else{
					reject(res.message)
				}
			}).catch(err=>{
				reject(err)

			})
		})
	}
	componentWillReceiveProps(){
		this.setState({
			abcoptions:[{text: '主动还款', value: 'userrepay'}]
		})
	}

	repayOpt(){
		const reqData={
			orderId:this.state.pageParmes.orderId,
			remark:this.state.remark,
			repaymentType:'1',
			repaymentTotalAmount:this.state.selectKey.repayAmt,
			repaymentPayerList:this.$$NumFormRich.state.dataMap
		}
		request("/api/galaxy-johnnyq-order/api/v1/galaxy/johnnyq/credit/repayment/operation",{
			method: 'POST', 
			data:reqData
		}).then(res=>{
			if(res.code===config.SUCCESS){
				Toaster.toaster({ type: 'success', content: res.msg,time: 3000 },true)
			}else{
				Toaster.toaster({ type: 'error', content: res.msg,time: 3000 },true)
			}

		}).catch(err=>{
			Toaster.toaster({ type: 'error', content: err,time: 3000 },true)
		})

	}

    setKey(key, value) {
        const { selectKey } = this.state;
        let newSelectKey = selectKey
        newSelectKey[key] = value
        this.setState({
            selectKey: newSelectKey
        })
    }
    resetMoney(arr){
		let userRepayAmt = 0
        if(arr&&arr.length==0){

        }
        for(let i=0;i<arr.length;i++){
            if(arr[i].repaymentAmount){
                userRepayAmt += Number(arr[i].repaymentAmount)
            }
        }
        this.setKey('repayAmt', userRepayAmt)

	}
	
    render() {
        const {selectKey,order,pageParmes,waitRepayAmt,abcoptions,repayAmt}= this.state
        const self = this;
		const selectDom=abcoptions&&abcoptions.length>0 ? <Selects options={abcoptions} />:"";

		// console.log("巴啦啦",repayAmt,repayDom)
		// console.log('selek', selectKey)
        return(
          <section className="bg-show  padding-all-1r">
                <Col>
                    <Row className="padding-all-1r">
						<Col span={12} className="line-height-3r text-overflow">订单编号：{pageParmes.orderId}</Col>
						<Col span={12} className="line-height-3r  text-overflow">赊销客户名称：{pageParmes.creditsCustomerName}</Col>
					</Row>
					<Row className="padding-all-1r">
					<Col span={12} className="line-height-3r  text-overflow">品牌：{pageParmes.brandName}</Col>
						<Col span={12} className="line-height-3r  text-overflow">待还金额（元）：{waitRepayAmt}</Col>
					</Row>
                </Col>
					{/* <Row className="padding-all-1r">
					    <Col span={12} className="line-height-3r maxwidthx-160 text-overflow">还款方式：</Col>
					    <Col span={12}>{selectDom}</Col>
					</Row> */}
					<Row className="padding-all-1r">
						<h3>还款列表</h3>
					</Row>
					<Row className="padding-left-1r">
					<NumFormRichPart modalType={'LIST'}
						dataMap={[{"repaymentName":'',"repaymentAmount":'','repaymentDate':""}]}
						formatArr={[{key: 'repaymentName', text: '名字'},{key: 'repaymentAmount', text: '还款金额',onChange:(res)=>{
							self.resetMoney(res)
						}},{key: 'repaymentDate', text: '还款日期', type:'date',model:'date'}]} 
						ref={(r)=>{this.$$NumFormRich=r}} />
					</Row>
					
					<Row className="padding-all-1r">
						<Col>
							<Buttons
								text={'增加还款记录'}
								type={'primary'}
								size={'normal'}
								style={{color:'#fff', borderRadius: '0.3rem', minWidth: '9rem', width: '9rem'}}
								onClick={()=>{
									// console.log("self.state",self.$$NumFormRich.state.dataMap)
									self.setState({
										dataMap:self.$$NumFormRich.state.dataMap.push(
											{"repaymentName":'',"repaymentAmount":'','repaymentDate':""}
										)
									})
									// self.$$NumFormRich.setValue(self.$$NumFormRich.getValue().length + 1);
								}}
								iconName={'plus-round'}
								hasIcon
							/>
						</Col>
					</Row>
					
					<Row className="padding-all-1r">
						<Col span={8}><span>还款总金额</span> {selectKey.repayAmt}</Col>
					</Row>
					
					<Row className="padding-all-1r"> 
					    <h3>请选择凭证上传</h3>
						<FileUpWithData fileType="blob" fileModel="MULTIPLE"  typeModel={'View'}  doRequest={
							{
							 url: '/api/galaxy-johnnyq-order/api/v1/galaxy/johnnyq/credit/repayment/uploadImg', 
							 method: 'POST', 
							 options: [{key: 'orderId', value: self.state.pageParmes.orderId}, {key: 'file', value: ''}]}} params={{ orderId:self.state.pageParmes.orderId }} />
					</Row>
					
						<Row className="padding-all-1r">
                            <Col span={12} className="line-height-3r maxwidthx-100 text-overflow">备注：</Col>
                            <Col span={12}>
								<Textarea placeholder="请填写备注"
									value={self.state.remark}
									onChange={(value)=>{
                                        self.setState({
                                            remark: value
                                        })
                                    }} />
                            </Col>
						</Row>
						
					
					<Col span={14} className="margin-top-2r text-align-center">
					    <Buttons
					        text={'提交'}
					        type={'primary'}
					        size={'normal'}
					        style={{color:'#fff', borderRadius: '0.3rem', minWidth: '9rem', width: '9rem'}}
					        onClick={()=>{
					            self.repayOpt()
					        }}
					        iconName={'paper-airplane'}
					        hasIcon
					    />
					</Col>
					
					
          </section>
        );
    }
}
export default userRepayment;
