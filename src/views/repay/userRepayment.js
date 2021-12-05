
import React, { Component } from 'react';
import { Components, Parts, utils } from 'neo';
import {getDateTimeStr} from 'utils/timeStamp';
const { sessions, storage, request, config } = utils
const { Row, Col, Icon, Tab, Buttons, Input, Selects,ExModal, Textarea, Toaster } = Components;
const { NumFormRichPart, ListPart, TablePart } = Parts
class userRepayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageData: this.props.pageData,
      pageParmes: this.props.pageParmes,
      repaymentDate:'',
      // pageParmes: { orderId: 'SX201908310000000182', creditsCustomerName: '李豪哇', brandName: "点刷" },
      pageList: this.props.pageList,
      defaultAction: this.props.defaultAction,
      waitRepayAmt: '',
      repaymentTotalAmount: 0,
      repaymentType: '1',
      selectKey: {},
      shuldRefresh: true,
      showAlert: false,
      tableListData:[],
      MDdisplay:'',
      MDaction:'',
      checkedAcconItem:'',
      subAcount:[],
      assignObj:'',//签约主体
      remarkMsg:''
      // tableData:[
      //   {text:'111',solt:'222',sddd:'21331'},{text:'1111',solt:'2222',sddd:'21331'},{text:'11111',solt:'22222',sddd:'21331'}
      // ]
    };
  }
  componentWillMount() {
    this.getWaitRepayAmt(this.state.pageParmes.orderId).then(res => {
      this.setState({
        waitRepayAmt: res.data[0] ? res.data[0].suramt : '',
      })
    }).catch(err => {
      Toaster.toaster({ type: 'error', content: err, time: 3000 });
    })
  }
  
  componentDidMount() {
    this.getInitDate()
}
  getInitDate(){
    this.setState({
      repaymentDate:getDateTimeStr()
    })
  }
	/**
	 * 获取初始数据
	 * @param {*} orderId 
	 */
  getWaitRepayAmt(orderId) {
    return new Promise((resolve, reject) => {
      request("/api/galaxy-johnnyq-order/api/v1/galaxy/johnnyq/credit/repayment/info/query", {
        method: 'POST',
        data: { orderId }
      }).then((res) => {
        if (res.code === config.SUCCESS) {
          resolve(res)
        } else {
          reject(res.message)
        }
      }).catch(err => {
        reject(err)

      })
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

  //   resetMoney(arr){
  // 		let userRepayAmt = 0
  //         if(arr&&arr.length==0){

  //         }
  //         for(let i=0;i<arr.length;i++){
  //             if(arr[i].repaymentAmount){
  //                 userRepayAmt += Number(arr[i].repaymentAmount)
  //             }
  //         }
  //         this.setKey('repaymentTotalAmount', userRepayAmt)
  //         this.setState({
  //           repaymentTotalAmount:userRepayAmt
  //         })

  // 	}
  resetMoney() {
    let userRepayAmt = 0
    var arr = this.$$repayList?this.$$repayList.getValue():this.$$acconTable.getValue()
    // debugger
    if (arr && arr.length == 0) return 0
    for (let i = 0; i < arr.length; i++) {
      // if (arr[i].repaymentAmount) userRepayAmt += Number(arr[i].repaymentAmount)
      if (arr[i].repaymentAmount) userRepayAmt= this.accAdd(userRepayAmt,Number(arr[i].repaymentAmount))
    }

    this.setState({
      repaymentTotalAmount: userRepayAmt,
      shuldRefresh: false
    })
  }
  showPlayer(){
    if(this.state.repaymentType=='2'){
      this.setState({
        MDdisplay: 'show',
        MDaction: 'enter',    
    })
    }else{
      Toaster.toaster({ type: 'error', content:"请选择还款方式", time: 3000 });
    }
}
hideModal(){
  this.setState({
      MDdisplay: 'hide',
      MDaction: 'leave'
  })
}


repayOpt(){
  // debugger
  if(this.state.repaymentType== 1){
    let dateInt=(this.$$repayList.getValue())[0].repaymentDate
    if(dateInt==''){
      (this.$$repayList.getValue())[0].repaymentDate= this.state.repaymentDate; 
    }
  }
  const reqData={
    orderId:this.state.pageParmes.orderId,
    remark:this.state.remarkMsg,
    repaymentType:this.state.repaymentType,
    repaymentTotalAmount:this.state.repaymentTotalAmount,
    repaymentPayerList:this.state.repaymentType== 1?this.$$repayList.getValue():this.state.subAcount.map(item=>{
      if(item.repaymentAmount)
      return {
        ...item,
        agentName:item.custna,
        brandName:item.psedna,
        repaymentAccount:item.acctno,
        repaymentAmount:item.repaymentAmount||undefined,
        //  repaymentDate:'',
        repaymentName:item.custna
      }
    }).filter(item=>{
      if(item)
      return item
    })
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
    accAdd(arg1,arg2){
      let r1,r2,m;
      try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
      try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
      m=Math.pow(10,Math.max(r1,r2))
      return ((arg1*m+arg2*m)/m).toFixed(2);
    }
    Subtr(arg1,arg2){
     let r1,r2,m,n;
      try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
      try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
      m=Math.pow(10,Math.max(r1,r2));
      //last modify by deeka
      //动态控制精度长度
      n=(r1>=r2)?r1:r2;
      return ((arg1*m-arg2*m)/m).toFixed(2);
  }
  //被动还款新增签约主体
  addRepayChange(e,v){
    if(!v) return
    this.setState({assignObj: event.target.value});
    request("/api/galaxy-johnnyq-order/api/v1/galaxy/johnnyq/credit/electronic/main/account", {
      method: 'POST',
      data: { creditsCustomerName:v }
    }).then((res) => {
      if (res.code === config.SUCCESS) {
        this.setState({
          tableListData:res.data||[]
        })
      } else {
        Toaster.toaster({ type: 'error', content: res.msg,time: 3000 },true)
      }
    }).catch(err => {
      Toaster.toaster({ type: 'error', content: err,time: 3000 },true)
    })

  }
  remarkChange(v){
    this.setState({
      remarkMsg:v
    })
  }
  render() {
    const delItem =((idex, item, surchFun)=>{
      let delAmt=item.repaymentAmount||0;
      this.setState({
        repaymentTotalAmount: this.Subtr(this.state.repaymentTotalAmount,Number(delAmt)),
        shuldRefresh: false
      })

    })
    const { shuldRefresh, repaymentTotalAmount,assignObj,remarkMsg } = this.state
    const alertDom = this.state.showAlert ? (<br />) : "";
    const repayListDom = this.state.repaymentType && this.state.repaymentType == 1 ? (
      <div>
        {/* 主动还款 */}
        <Row>
          <h3 className="textcolor-313132" >还款列表</h3>
        </Row>
        <Row>
          <Col>
            <ListPart EditlistData={[{ repaymentName: '', repaymentAmount: '', repaymentDate: '',imgUrl:'' }]}
              listFormat={[{ key: 'repaymentName', text: '名字' ,titleStyle:{ maxWidth: '250px' ,width: '250px' ,overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis'}}, {
                key: 'repaymentAmount', text: '还款金额', iteChange: (it, value, rowIdx) => {     
                     if(!value) { this.resetMoney();    return}
                    let reg=/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
                    if(reg.test(value)){
                      this.resetMoney()
                    }else {      
                        Toaster.toaster({ type: 'error', content: '请输入金额', time: 2000 });     
                    }                 
                },titleStyle:{ maxWidth: '250px' ,width: '250px' ,overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis'}
              }, { key: 'repaymentDate', text: '还款日期', type: 'date', model: 'date',  titleStyle:{ maxWidth: '250px' ,width: '250px',overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis'} },
              { key: 'imgUrl',
              text: '上传凭证', 
              type: 'FileUpWithData', 
              model: 'FileUpWithData',
              fileType:"blob",
              fileModel:'SINGEL',
              description:"点击上传",
              typeModel:'Button',
              params:{ orderId: this.state.pageParmes.orderId },
              doRequest:{
                  url: '/api/galaxy-johnnyq-order/api/v1/galaxy/johnnyq/credit/repayment/uploadImg',
                  method: 'POST',
                  options: [{ key: 'orderId', value: this.state.pageParmes.orderId }, { key: 'file', value: '' }]
                }, 
                titleStyle:{ maxWidth: '250px' ,width: '250px' ,overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis'}
              }]} showButton={true} showIndex={false} showSort={false} ref={(r) => { this.$$repayList = r }}
              shuldRefresh={shuldRefresh}  showButton={true}  showOption={true} delItem={delItem}
            ></ListPart>
          </Col>
        </Row>
      </div>
    ) : (
        <div>
          {/* 被动还款 */}
          <Row>
            <h3 className="textcolor-313132" >还款列表</h3>
          </Row>
          <Row>
            <Buttons
              text={'新增'}
              type={'primary'}
              size={'normal'}
              className="padding-all-10"
              style={{ color: '#fff', borderRadius: '0.3rem', minWidth: '9rem', width: '9rem' }}
              onClick={() => {
                this.showPlayer()
              }}
            />
          </Row>
          <Row>
          <ListPart 
            minWidth={1200} 
            showCheckBox={true} 
            showIndex={false} 
            showPage={false} 
            showButton={false}
            showSort={false}
            showOption={false}
            shuldRefresh={true}
            listFormat={[
              // { key: 'checked', text: 'check',type: 'Checkbox', options: [ { value: 'checked', text: '' }],iteChange:(a,b,c)=>{
              //   if(b.checked.checkStatus=='checked'){
              //     console.log('选中')
              //   }else if(b.checked.checkStatus=='unchecked'){
              //     console.log('没选中')
              //   }
              // }},
              { key: 'custno', text: '签约主体ID' ,type: 'Text', titleStyle:{ maxWidth: '250px' ,width: '250px',overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis' } }, 
              { key: 'custna', text: '签约主体名称'  ,type: 'Text',titleStyle:{ maxWidth: '150px' ,width: '150px',overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis' }}, 
              { key: 'custac', text: '电子主账户' ,type: 'Text',titleStyle:{ maxWidth: '150px' ,width: '150px',overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis' } },
              { key: 'psedna', text: '品牌名称' ,type: 'Text',titleStyle:{ maxWidth: '120px' ,width: '150px',overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis' } },
              { key: 'acctno', text: '扣款子账户账号' ,type: 'Text', titleStyle:{ maxWidth: '200px' ,width: '200px',overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis' } },
              { key: 'acctna', text: '子账户名称' ,type: 'Text',titleStyle:{ maxWidth: '250px' ,width: '250px',overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis' } },
              { key: 'onlnbl', text: '当前账户余额'  ,type: 'Text',titleStyle:{ maxWidth: '150px' ,width: '150px',overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis' }},
              { key: 'canusa', text: '当前账户可用余额'  ,type: 'Text',titleStyle:{ maxWidth: '150px' ,width: '150px',overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis' }},
              { key: 'repaymentDate', text: '还款时间'  ,type: 'date',model: 'date', titleStyle:{ maxWidth: '160px' ,width: '160px',overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis' } },
              { key: 'repaymentAmount', text: '还款金额',iteChange:(a,b,c)=>{
                if(b>this.state.subAcount[c].canusa){
                  Toaster.toaster({ type: 'error', content: '输入金额必须小于当前账户可用余额', time: 3000 });
                  return
                }
                this.resetMoney()
              },titleStyle:{ maxWidth: '180px' ,width: '180px',overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis' }}]}
              EditlistData={this.state.subAcount}
              // EditlistData={[{ repaymentName: '', repaymentAmount: '', repaymentDate: '' }]}
            ref={(items) => { this.$$acconTable = items}}
            ></ListPart>
          </Row>
        </div>
      )
    return (
      <section className="bg-show  padding-all-1r">
        {/* 基础头信息 */}
        <Row>
          <Col span={12} className="line-height-3r textclolor-black-low">订单编号：<span  className="textcolor-313132">{this.state.pageParmes.orderId}</span></Col>
          <Col span={12} className="line-height-3r textclolor-black-low">赊销客户名称：<span  className="textcolor-313132">{this.state.pageParmes.creditsCustomerName}</span></Col>
          <Col span={12} className="line-height-3r textclolor-black-low">品牌：<span  className="textcolor-313132">{this.state.pageParmes.brandName}</span></Col>
          <Col span={12} className="line-height-3r textclolor-black-low">待还金额（元）：<span  className="textcolor-313132">{this.state.waitRepayAmt}</span></Col>
        </Row>
        {/*还款方式  */}
        <Row className="border-all border-color-f5f5f5 padding-all-1r">
          <Col span={24}>
            <Row>
              <Col span={3} className="line-height-3r textclolor-black-low">还款方式：</Col>
              <Col span={12} className="line-height-3r" style={{marginTop:'6px'}}>
                <Selects value={this.state.repaymentType || ''} options={[{ text: '主动还款', value: '1' }, { text: '被动还款', value: '2' }]} onChange={(e, t, v) => {
                  this.setState({
                    repaymentType: v.value,
                    repaymentTotalAmount:0,
                    subAcount:[]  
                  })
                  if(v.value=='1'){
                    this.hideModal()
                  }
                }} />
              </Col>
            </Row>
            {repayListDom}
          </Col>
        </Row>
        {/* 此为动态渲染区域选择不同的还款方式渲染不同的还款列表 */}

        {/* 实际还款总金额 */}
        <Row >
          <Col className="line-height-3r textclolor-black-low">实际还款总金额：<span  className="textcolor-313132">{repaymentTotalAmount}</span></Col>
        </Row>

        {/* 尾部备注 */}
        <Row>
          <Col span={2} className="line-height-3 textclolor-black-low" >备注：</Col>
          <Col span={22} className="line-height-3r">
            <Textarea placeholder="请填写备注" maxLength="120"  value={remarkMsg|| ''}    onChange={(v)=>{
                                           this.remarkChange(v)
               }}/>
          </Col>
        </Row>
        {/* 尾部提交按钮 */}
        <Row>
          <Col className='margin-top-2r text-align-center'>
            <Buttons
              text={'提交'}
              type={'primary'}
              size={'normal'}
              style={{ color: '#fff', borderRadius: '0.3rem', minWidth: '9rem', width: '9rem' }}
              onClick={() => {
                this.repayOpt()
              }}
              iconName={'paper-airplane'}
              hasIcon
            />
          </Col>
        </Row>
        {/* 弹框 */}
        <ExModal  display={this.state.MDdisplay} action={this.state.MDaction}  options={
          {content:(<Row justify="center">
          <Col className="line-height-3r font-size-12 padding-left-1r border-bottom border-color-f5f5f5">
            <Row>
              <Col span={20}>账户查询</Col>
              <Col span={4} className="text-align-right cursor-pointer" onClick={() => { this.hideModal() }}>
                <Icon iconName={'android-cancel '} size={'140%'} iconColor={'#666'} /></Col>
            </Row>
          </Col>
          <Col span={22} className="padding-top-1r heighth-45">
            <Row>
              <Col span={4} className='line-height-3r'>签约主体名称</Col>
              <Col span={4}><Input placeholder="请输入" maxLength={100} value={assignObj} hasBorder={true} innerStyle={{ 'lineHeight': '3rem', 'height': '3rem' }}
                onChange={(e, t, v) => {
                  this.addRepayChange(e,v)
                }}
              /></Col>
            </Row>
          </Col>
          <Col span={22} className="padding-top-1r heighth-45">
            <TablePart 
            minWidth={1000} 
            showCheckBox={true} 
            showIndex={false} 
            showPage={false} 
            itemFormat={[{ key: 'custna', title: '主体名称' }, { key: 'custno', title: '主体编号' }, { key: 'custac', title: '电子主账户' }]} 
            items={this.state.tableListData} 
            ref={(items) => { this.$$acconTable = items}}
            ></TablePart>
          </Col>
          <Col span={22} className="padding-top-1r heighth-45 text-align-right">
          <Buttons
              text={'提交'}
              type={'primary'}
              size={'normal'}
              style={{ color: '#fff', borderRadius: '0.3rem', minWidth: '9rem', width: '9rem',marginBottom:'2rem' }}
              onClick={() => {
                // this.repayOpt()
                // console.log('this.$$acconTable.state.checkedArr',this.$$acconTable.state.checkedArr)
                if(this.$$acconTable.state.checkedArr.length!=1){
                  Toaster.toaster({ type: 'error', content: '请选择一项数据', time: 3000 });
                }else{
                  this.setState({
                    checkedAcconItem:this.$$acconTable.state.checkedArr[0]
                  }, () =>{
                    request("/api/galaxy-johnnyq-order/api/v1/galaxy/johnnyq/credit/electronic/sub/account", {
                      method: 'POST',
                      data: { electronicAccount:this.state.checkedAcconItem.custac}
                    }).then((res) => {
                      if (res.code === config.SUCCESS) {
                        this.setState({
                          subAcount:res.data
                        },()=>{
                          this.hideModal()
                        })
                      } else {
                        Toaster.toaster({ type: 'error', content: res.msg,time: 3000 },true)
                      }
                    }).catch(err => {
                      Toaster.toaster({ type: 'error', content: err,time: 3000 },true)
                    })
                  })
                }
              }}
              iconName={'paper-airplane'}
              hasIcon
            />
          </Col>
        </Row>),
           type: 'bottom',
           containerStyle: { bottom:'2rem'}
        }}></ExModal>
      </section>
    );
  }
}
export default userRepayment;
