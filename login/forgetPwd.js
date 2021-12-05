import React, { Component } from 'react';
import { Components, utils } from 'neo';
import { goLink } from '../../utils/common';
import { sendPwdCode, resetPasswd,  } from '../../api/index'
import PublicKey from '../../config/publishKey';
import Hex from '../../utils/Hex';
import SM2 from '../../utils/sm2';
const { sessions, storage } = utils;

const {
    Buttons,
    Toaster,
    Row,
    Col,
    Icon,
    Input, Loader, Notification, ExModal
} = Components;

class ForgetPwd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectKey: {},
            MDdisplay: 'show',
            MDaction: 'enter',
            pwdFlag: 0,
            oldPwd: '',
            newPwd: '',
            userInfo: sessions.getStorage('userInfo') || {},
            codeImg: '/api/admin/api/v1/user/getCode',
            show_btn: true,
            count: 60,
            timer:null,
            codeMsg:'获取验证码',
            newEye:false,
            qrEye:false
        };
    }
    componentDidMount(){
      this.changeImg()
        this.setState({
            MDdisplay: 'show',
            MDaction: 'enter',
            selectKey:{}   
          })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            MDdisplay: 'show',
            MDaction: 'enter',
            selectKey:{}   
          })
          // this.changeImg()
       }
    setKey(key, value) {
        const { selectKey } = this.state;
        let newSelectKey = selectKey
        newSelectKey[key] = value
        this.setState({
            selectKey: newSelectKey
        })
    }
    pwdImg() {
        return (
            <Row>
                <Col span='6' className="bg-button-red height-5 line-height-5">
                </Col><Col span='6' className="bg-ffa439 height-5 line-height-5">
                </Col><Col span='6' className="bg-69cb89 height-5 line-height-5">
                </Col><Col span='6' className="bg-6bab3d height-5 line-height-5">
                </Col>
            </Row>
        )
    }
    alertTxt() {
        const { selectKey, pwdFlag } = this.state;
        let textLength, lenghFlag;
        let textFlag = false;
        lenghFlag = selectKey.newPwd && (selectKey.newPwd.length < 8 || selectKey.newPwd.length > 20)
        if (!lenghFlag) {
            // if (pwdFlag == 1) {
            //     textFlag = false;
            // }
            if (pwdFlag == 2) {
                textFlag = true;
            }
            textLength = "密码设置请包含数字、大/小写字母、特殊符号中的至少两种类型";
        } else {
            // textFlag = false;
            textLength = "密码请设置8-20位";
        }
        return (
            <Row>
                <Col span="20">
                    <Icon iconName={!textFlag ? 'ios-close' : 'checkmark-circled'} size={'120%'} iconColor={!textFlag ? '#DF1B2E' : '#6bab3d'} /> <span className="textclolor-black font-size-small">{textLength}</span>
                </Col>
            </Row>
        )
    }
    changeImg() {
        const ran = Math.random();
        const url = `/api/admin/api/v1/user/getCode?${ran}`;
        this.setState({
          codeImg: url,
        });
      };
      countMlus() {
        const { selectKey, show_btn} = this.state;
        if (!selectKey.logina) return Toaster.toaster({ type: 'error', position: 'top', content: '请先输入账号',time: 3000 },true)
        if (!selectKey.code){
           return Toaster.toaster({ type: 'error', position: 'top', content: '请输入图形验证结果',time: 3000 },true)
        }
        if (show_btn&&selectKey.logina&&selectKey.code) {
          this.goFirstCode()
        }
      }
      countMsg() {
        let count = this.state.count;
        const timer = setInterval(() => {
          this.setState({
            count: (count--),
            show_btn: false,
            codeMsg: count + 'S后重新发送'
          }, () => {
            this.setState({
             timer:timer
            })
            if (count === 0) {
              clearInterval(timer)
              this.setState({
                show_btn: true,
                count: 60,
                codeMsg: '获取验证码'
              })
            }
          })
        }, 1000)
      }
    
    goFirstCode() {
    const { selectKey } = this.state;
    Loader.show();
    //发送验证码
    sendPwdCode({
        'code': selectKey.code,
        'logina': selectKey.logina,
    }).then((res) => {
        Loader.hide()
        if (res.code == "0000") {
         this.countMsg()
        }else if(res.code=="00025"||res.code=="00026"){       
        this.changeImg()
        return Toaster.toaster({ type: 'error', position: 'top', content: res.msg ,time: 3000 },true)
        }else {
        this.changeImg()
        return Toaster.toaster({ type: 'error', position: 'top', content: res.msg ,time: 3000 },true)
        }
    }).catch(() => {
        this.changeImg()
        Loader.hide()
    })
    }
    hideModal() {
        const {count,timer}=this.state;
        if (count >=0) {
          clearInterval(timer)
        }
        this.changeImg()
        this.setState({
          MDdisplay: 'hide',
          MDaction: 'leave',
          selectKey: {},
          codeMsg: '获取验证码',
          show_btn: true,
          count: 60,    
          pwdFlag:0,
        })
      }
    //找回密码
    findPwd() {
        const { selectKey} = this.state;
        if (!selectKey.logina) return Toaster.toaster({ type: 'error', position: 'top', content: '请输入账号', time: 3000 },true)
        if (!selectKey.code) return Toaster.toaster({ type: 'error', position: 'top', content: '请输入图形验证码',time: 3000 },true)
        if (!selectKey.vecode) return Toaster.toaster({ type: 'error', position: 'top', content: '请输入短信验证码',time: 3000 },true)
        if (!selectKey.newPwd) return Toaster.toaster({ type: 'error', position: 'top', content: '请输入新密码',time: 3000 },true)
        if (!selectKey.qrPwd) return Toaster.toaster({ type: 'error', position: 'top', content: '请输入确认密码',time: 3000 },true)
        if(!(this.validPwd(selectKey.newPwd))){
        //新密码弱密码
            this.setState({
            pwdFlag:1
            })
            return   Toaster.toaster({ type: 'error',  position: 'top', content: '密码设置在8-20位，包含数字、大/小写字母、特殊符号中的至少两种类型',time: 3000 },true)
        }else{
        this.setState({
            pwdFlag:2
        },()=>{
            if(selectKey.newPwd==selectKey.qrPwd){
             this.goReset();
            }else{
            return   Toaster.toaster({ type: 'error',  position: 'top', content: '新密码与确认新密码不一致，请重新设置',time: 3000 },true)
            }
        })
        }
    }
    validPasImg() {
        const { selectKey } = this.state;
        if (!(this.validPwd(selectKey.newPwd))) {
            //弱密码
            this.setState({
                pwdFlag: 1
            })
        } else {
            //强密码  
            this.setState({
                pwdFlag: 2
            })
        }
    }
    //密码强弱校验
    validPwd(getD) {
        let regx = new RegExp("^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*-=+@()_;'/,\|]+$)[\da-zA-Z!#$%^&*-=+@()_;'/,\|]{8,20}$", "g");
        let flag = regx.test(getD);
        return flag
    }
    pwdStrong(pwd){
        // 公钥
        const publicKey = PublicKey.PUBLISH_KEY;
        const sm2DataHex = Hex.utf8StrToHex(pwd);
        // 加密结果
        const result = SM2.encrypt(publicKey, sm2DataHex);
       return  result
    }
    goReset() {
      const { selectKey } = this.state;
      Loader.show();
      let oldPwd= this.pwdStrong(selectKey.oldPwd);
      let newPwd=  this.pwdStrong(selectKey.newPwd);
      let qrPwd=this.pwdStrong(selectKey.qrPwd);
      if(oldPwd&&newPwd&&qrPwd){
        resetPasswd({
          'pwdold': oldPwd,
          'pwdnew': newPwd,
          'qrdnew': qrPwd,
          'vecode':selectKey.vecode,
          'uppwtp': '02',
          'logina': selectKey.logina,
          'uschnl': 'X002',
        }).then((res) => {
            Loader.hide()
            if (res.code == "0000") {
                storage.removeAllStorage();
                sessions.removeAllStorage();    
                this.changeImg()
                this.hideModal()
                this.props.callBack('refresh');
                goLink('/LoginPage')                                
                return Toaster.toaster({ type: 'success', position: 'top', content: '重置密码' + res.msg ,time: 3000 },true)
            } else {
                this.changeImg()
                return Toaster.toaster({ type: 'error', position: 'top', content: res.msg,time: 3000 },true)
            }
        }).catch(() => {
            this.changeImg()
            Loader.hide()
        })       
      }
        
    }
    showNewEye(){
      const {newEye}=this.state;
      let eyes=!newEye
      this.setState({
          newEye:eyes
      })
  }
  showQrEye(){
    const {qrEye}=this.state;
    let eyes=!qrEye
    this.setState({
      qrEye:eyes
    })
}
    render() {
        const { selectKey, MDdisplay, MDaction,pwdFlag,codeImg,show_btn,codeMsg,newEye,qrEye } = this.state;
        const self = this;
        return (
            <ExModal display={MDdisplay} action={MDaction} disabledLayout='0' style={{width:'60%'}} options={{
                content: (
                  <div className="font-size-small">
                    <Row className="padding-left-1r line-height-3r padding-right-1r border-bottom border-color-f5f5f5">
                        <Col span={20} className="line-height-3r">{'忘记密码'}</Col>
                        <Col span={4} className="text-align-right cursor-pointer" onClick={()=>{self.hideModal()}}>
                        <Icon iconName={'android-cancel '} size={'160%'} iconColor={'#666'}  /></Col>
                    </Row>
                    <Row className="padding-all"  style={{paddingBottom:'1.666%'}}>
                      <Col span="8" className="line-height-35 text-align-right padding-right-1r"><span className="textcolor-DF1B2E">*</span>账号: </Col>
                      <Col span="10" className="line-height-35 has-border" style={{ borderRadius: '2px' }}><Input 
                       autoComplete="new-password"
                        value={selectKey.logina || ''}
                        placeholder="请输入您的账号"
                        maxLength={30}
                        innerStyle={{ 'lineHeight': '35px', 'height': '35px' }}
                        onChange={(e, t, v) => {
                          this.setKey('logina', v)
                        }}
                      />
                      </Col>
                    </Row>  
                    <Row style={{ paddingBottom: '1.666%', paddingRight: '3%', paddingLeft: '3%' }}>
                      <Col span="8" className="line-height-35 text-align-right padding-right-1r"><span className="textcolor-DF1B2E">*</span>图形验证码: </Col>
                      <Col span="10">
                        <Row>
                          <Col span="10" className="overflow-hide border-radius-3f bg-show  line-height-35 text-align-center has-border" style={{ borderRadius: '2px' }}>
                            <Input
                              style={{ height: '35px' }}
                              innerStyle={{ height: '35px' }}
                              value={selectKey.code}
                              placeholder="请输入结果"
                              maxLength={10}
                              onChange={(e, t, v) => {
                                this.setKey('code', v)
                              }}
                            />
                          </Col>
                          <Col span='1'></Col>
                          <Col span='13' className="border-radius-3f bg-show " onClick={() => { this.changeImg() }}>
                            <img className="width-100 height-35 line-height-35" src={codeImg} />
                          </Col>
                        </Row>
                      </Col>
                    </Row>      
                    <Row className="padding-all" style={{ paddingTop: 0 , paddingBottom:'1.666%'}} >
                      <Col span="8" className="line-height-35 text-align-right padding-right-1r"><span className="textcolor-DF1B2E">*</span>短信验证码: </Col>
                      <Col span="10">
                        <Row>
                          <Col span="10"  style={{ borderRadius: '2px' }}><Input
                            value={selectKey.vecode || ''}
                            placeholder="请输入"
                            maxLength={10}
                            innerStyle={{ 'lineHeight': '35px', 'height': '35px',border:'1px solid #999' }}
                            onChange={(e, t, v) => {
                              this.setKey('vecode', v)
                            }}
                          />
                          </Col>
                          <Col span="1">
                          </Col>
                          <Col span="13" className="text-align-center" >
                            {show_btn ? <Buttons
                              style={{ backgroundColor: "#ea6f5a", padding: '6px', width: '100%',fontSize:'4px',minWidth:'80px' }}
                              text={codeMsg || '发送验证码'}
                              size="small"
                              onClick={() => {
                                this.countMlus()
                              }} /> : <Buttons
                                style={{ backgroundColor: "#999", padding: '6px', width: '100%',fontSize:'4px' ,minWidth:'80px'}}
                                text={codeMsg || '发送验证码'}
                                size="small"
                                onClick={() => {
                                }} />}
          
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row style={{ paddingBottom: '1.666%', paddingRight: '3%', paddingLeft: '3%' }}>
                      <Col span="8" className="line-height-35 text-align-right padding-right-1r"><span className="textcolor-DF1B2E font-size-small ">*</span>新密码: </Col>
                      <Col span="10" className="line-height-35 has-border" style={{ borderRadius: '2px' }}>
                        <Row>
                          <Col span="20">
                          <Input
                            value={selectKey.newPwd || ''}
                            placeholder="请输入"
                            type={this.state.newEye?'text':"password"}
                            autoComplete="new-password"
                            maxLength={21}
                            innerStyle={{ 'lineHeight': '35px', 'height': '35px' }}
                            onChange={(e, t, v) => {
                              this.setKey('newPwd', v)
                              this.validPasImg()
                            }}
                          />
                          </Col>
                          <Col span="4" className="text-align-center"  onClick={()=>{self.showNewEye()}}>
                             <Icon iconName={this.state.newEye?'eye-disabled':'eye'} size={'120%'} iconColor={'#ccc'}  />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    {selectKey.newPwd?(pwdFlag==1?(<Row className="padding-all" style={{ width:'100%',paddingTop:'1%',paddingBottom:'1%'}} >
                    <Col span="8" className="font-size-small text-align-right padding-right-1r textcolor-DF1B2E ">密码强度：弱</Col>
                    <Col span="10" style={{paddingTop:'3px'}} >
                     <Row><Col  style={{opacity:'0.5'}}>{this.pwdImg()}</Col>
                       <Col > {this.alertTxt()}</Col>
                     </Row>      
                    </Col>
          </Row>):(pwdFlag==2?(<Row  className="padding-all" style={{width:'100%',paddingTop:'1%',paddingBottom:'1%'}}>
                 <Col span="8"  className="font-size-small text-align-right padding-right-1r textcolor-DF1B2E" >密码强度：强</Col>
                 <Col span="10" style={{paddingTop:'3px'}}> 
                 <Row>
                   <Col >{this.pwdImg()}</Col>
                  </Row> 
                 </Col>
                </Row>):'')):''}
            
                    <Row style={{ paddingRight: '3%', paddingLeft: '3%',paddingBottom: '1.666%', }}>
                      <Col span="8" className="line-height-35 text-align-right padding-right-1r"><span className="textcolor-DF1B2E font-size-small ">*</span>确认密码: </Col>
                      <Col span="10" className="line-height-35 has-border" style={{ borderRadius: '2px' }}>
                      <Row>
                          <Col span="20">
                          <Input
                        value={selectKey.qrPwd || ''}
                        placeholder="请输入"
                        type={this.state.qrEye?'text':'password'}
                        maxLength={21}
                        innerStyle={{ 'lineHeight': '35px', 'height': '35px' }}
                        onChange={(e, t, v) => {
                          this.setKey('qrPwd', v)
                        }}
                      />
                          </Col>
                          <Col span="4" className="text-align-center"  onClick={()=>{self.showQrEye()}}>
                             <Icon iconName={this.state.qrEye?'eye-disabled':'eye'} size={'120%'} iconColor={'#ccc'}  />
                          </Col>
                        </Row>                       
                      </Col>
                    </Row>
                    <Row className="border-top padding-all-1r margin-top-1r border-color-f5f5f5" justify={'flex-end'}>
                        <Col span={5}  className="margin-right-1r">
                            <Buttons
                            text={'确定'}
                            type={'primary'}
                            size={'normal'}
                            style={{color:'#fff'}}
                            onClick={()=>{
                            this.findPwd()
                            }}
                        />
                        </Col>
                        <Col span={5} className="">
                            <Buttons
                                text={'取消'}
                                type={'primary'}
                                size={'normal'}
                                style={{}}
                                onClick={()=>{
                                    this.hideModal()
                                }}
                                plain
                            />
                        </Col>
                     </Row>
                  </div>
                ),
                type: 'top',
                containerStyle: { top: '4rem',width:'40%' ,left: '30vw', minHeight: '40vh', position: 'fixed', zIndex: '1000'},
              }} />
        )
    }
}
export default ForgetPwd;