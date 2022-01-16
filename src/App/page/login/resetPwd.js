import React, { Component } from 'react';
import { Components, utils } from 'neo';
import { goLink, getUserInfo } from '../../utils/common';
import { resetPasswd } from '../../api/index'
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

class ResetPwd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectKey: {},
            RESdisplay: '',
            RESaction: 'enter',
            pwdFlag: 0,
            oldPwd: '',
            newPwd: '',
            userInfo: getUserInfo() || {},
            outPage:false,
            oldEye:false,
            newEye:false,
            qrEye:false,
        };
        this.showReset = this.showReset.bind(this)
    }
    componentDidMount(){
    }

    componentWillReceiveProps(nextProps) {
    }

    showReset(){
        this.setState({
            RESdisplay: 'show',
            RESaction: 'enter',
            selectKey:{}   
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
    hideResetModal(){
        this.setState({
          RESdisplay: 'hide',
          RESaction: 'leave',
          selectKey:{}   
        })
    }
    pwdImg() {
        return (
            <Row>
                <Col span='6' className="bg-button-red height-5 line-height-5" style={{borderTopLeftRadius: '6px',
    borderBottomLeftRadius: '6px'}}>
                </Col><Col span='6' className="bg-ffa439 height-5 line-height-5">
                </Col><Col span='6' className="bg-button-gray height-5 line-height-5">
                </Col><Col span='6' className="bg-button-gray height-5 line-height-5" style={{borderTopRightRadius: '6px',
    borderBottomRightRadius: '6px'}}>
                </Col>
            </Row>
        )
    }
    pwdImgStrong() {
        return (
            <Row>
                <Col span='6' className="bg-button-red height-5 line-height-5" style={{borderTopLeftRadius: '6px',
    borderBottomLeftRadius: '6px'}}>
                </Col><Col span='6' className="bg-ffa439 height-5 line-height-5">
                </Col><Col span='6' className="bg-69cb89 height-5 line-height-5">
                </Col><Col span='6' className="bg-6bab3d height-5 line-height-5" style={{borderTopRightRadius: '6px',
    borderBottomRightRadius: '6px'}}>
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
        if (!selectKey.oldPwd) return Toaster.toaster({ type: 'error', position: 'top', content: '请输入原密码',time: 3000 },true)
        if (!selectKey.newPwd) return Toaster.toaster({ type: 'error', position: 'top', content: '请输入新密码',time: 3000 },true)
        if (!selectKey.qrPwd) return Toaster.toaster({ type: 'error', position: 'top', content: '请确认新密码' ,time: 3000 },true)
        if (!(this.validPwd(selectKey.newPwd))) {
            //弱密码
            this.setState({
                pwdFlag: 1
            })
            //新密码
            if (selectKey.newPwd.length < 8 || selectKey.newPwd.length > 20) {
                return Toaster.toaster({ type: 'error', position: 'top', content: '请设置密码长度在8-20位',time: 3000 },true)
            } else {
                return Toaster.toaster({ type: 'error', position: 'top', content: '为了您账号安全，请您设置密码强度高的密码',time: 3000 },true)
            }
        } else {
            this.setState({
                pwdFlag: 2
            }, () => {
                if (selectKey.newPwd == selectKey.qrPwd) {
                    Loader.show()
                    let oldPwd= this.pwdStrong(selectKey.oldPwd);
                    let newPwd=  this.pwdStrong(selectKey.newPwd);
                    let qrPwd=this.pwdStrong(selectKey.qrPwd);
                    if(oldPwd&&newPwd&&qrPwd){
                        resetPasswd({
                            'pwdold': oldPwd,
                            'pwdnew': newPwd,
                            'qrdnew': qrPwd,
                            'uppwtp': '01',
                            'logina':sessions.getStorage('userInfo')?sessions.getStorage('userInfo').loginName:'',
                            'uschnl': 'X002',
                        }).then((res) => {
                            Loader.hide()
                            if (res.code == "0000") {
                                storage.removeAllStorage();
                                sessions.removeAllStorage();
                                this.hideResetModal();   
                                goLink('/LoginPage')                                
                                return Toaster.toaster({ type: 'success', position: 'top', content: '重置密码' + res.msg ,time: 3000 },true)
                            } else {
                                return Toaster.toaster({ type: 'error', position: 'top', content: res.msg,time: 3000 },true)
                            }
                        }).catch(() => {
                            Loader.hide()
                        })
                    }
                } else {
                    return Toaster.toaster({ type: 'error', position: 'top', content: '新密码与确认新密码不一致，请重新设置',time: 3000 },true)
                }
            })
        }
    }
    showOldEye(){
        const {oldEye}=this.state;
        let eyes=!oldEye
        this.setState({
            oldEye:eyes
        })
    }
    showQrEye(){
        const {qrEye}=this.state;
        let eyes=!qrEye
        this.setState({
            qrEye:eyes
        })
    }
    showNewEye(){
        const {newEye}=this.state;
        let eyes=!newEye
        this.setState({
            newEye:eyes
        })
    }
    render() {
        const { selectKey, RESdisplay, RESaction,pwdFlag ,oldEye,qrEye,newEye} = this.state;
        const self = this;
        return (
            <ExModal display={RESdisplay} action={RESaction} disabledLayout='0' style={{ width: '60%' }} options={{
                content: (<div>
                    <Row className="padding-left-1r line-height-3r padding-right-1r border-bottom border-color-f5f5f5">
                        <Col span={20} className="line-height-3r">{'重置密码'}</Col>
                        <Col span={4} className="text-align-right cursor-pointer" onClick={()=>{self.hideResetModal()}}>
                        <Icon iconName={'android-cancel '} size={'160%'} iconColor={'#666'}  /></Col>
                    </Row>
                    <Row className="padding-all" >
                        <Col span="8" className="line-height-35 text-align-right padding-right-1r font-size-small"><span className="textcolor-DF1B2E ">*</span>原密码: </Col>
                        <Col span="10" className="line-height-35 has-border" style={{ borderRadius: '2px' }}>
                            <Row>
                                <Col span="20">
                                <Input      
                                autoComplete="new-password"               
                                    value={selectKey.oldPwd || ''}
                                    placeholder="请输入"                       
                                    maxLength={20}
                                    type={oldEye?'text':'password'}
                                    innerStyle={{ 'lineHeight': '35px', 'height': '35px'}}
                                    onChange={(e, t, v) => {
                                        this.setKey('oldPwd', v)
                                    }}
                                />
                                </Col>
                                <Col span="4" className="text-align-center"  onClick={()=>{self.showOldEye()}}>
                                  <Icon iconName={oldEye?'eye-disabled':'eye'} size={'120%'} iconColor={'#ccc'}  />
                                </Col>
                            </Row>                              
                        </Col>
                    </Row>
                    <Row style={{ paddingBottom: '0', paddingRight: '3%', paddingLeft: '3%' }}>
                        <Col span="8" className="line-height-35 text-align-right padding-right-1r font-size-small"><span className="textcolor-DF1B2E font-size-small">*</span>新密码: </Col>
                        <Col span="10" className="line-height-35 has-border" style={{ borderRadius: '2px' }}>
                            <Row>
                                 <Col span="20">
                                 <Input
                                    autoComplete="new-password"
                                        value={selectKey.newPwd || ''}
                                        placeholder="请输入"
                                        maxLength={20}
                                        type={newEye?'text':'password'}
                                        innerStyle={{ 'lineHeight': '35px', 'height': '35px' }}
                                        onChange={(e, t, v) => {
                                            this.setKey('newPwd', v)
                                            this.validPasImg()
                                        }}
                                    />
                                </Col>
                                <Col span="4" className="text-align-center"  onClick={()=>{self.showNewEye()}}>
                                  <Icon iconName={newEye?'eye-disabled':'eye'} size={'120%'} iconColor={'#ccc'}  />
                                </Col>
                            </Row>
                           
                        </Col>
                    </Row>
                    {selectKey.newPwd ? (pwdFlag == 1 ? (<Row className="padding-all" style={{ width: '100%', paddingTop: '3%', paddingBottom: '0' }} >
                        <Col span="8" className="font-size-small text-align-right padding-right-1r textcolor-DF1B2E ">密码强度：弱</Col>
                        <Col span="10" style={{ paddingTop: '3px' }} >
                            <Row><Col style={{ opacity: '0.5' }}>{this.pwdImg()}</Col>
                                <Col > {this.alertTxt()}</Col>
                            </Row>
                        </Col>
                    </Row>) : (pwdFlag == 2 ? (<Row className="padding-all" style={{ width: '100%', paddingTop: '3%', paddingBottom: '0' }}>
                        <Col span="8" className="font-size-small text-align-right padding-right-1r textcolor-DF1B2E" >密码强度：强</Col>
                        <Col span="10" style={{ paddingTop: '3px' }}>
                            <Row>
                                <Col >{this.pwdImgStrong()}</Col>
                            </Row>
                        </Col>
                    </Row>) : '')) : ''}
                    <Row style={{ paddingBottom: '1%', paddingRight: '3%', paddingLeft: '3%',paddingTop:'3%' }}>
                        <Col span="8" className="line-height-35 text-align-right padding-right-1r font-size-small"><span className="textcolor-DF1B2E font-size-small">*</span>确认密码: </Col>
                        <Col span="10" className="line-height-35 has-border" style={{ borderRadius: '2px' }}>
                        <Row>
                           <Col span="20">
                         <Input
                            autoComplete="new-password"
                            value={selectKey.qrPwd || ''}
                            placeholder="请输入"
                            type={qrEye?'text':'password'}
                            maxLength={20}
                            innerStyle={{ 'lineHeight': '35px', 'height': '35px' }}
                            onChange={(e, t, v) => {
                                this.setKey('qrPwd', v)
                            }}
                        />
                                </Col>
                                <Col span="4" className="text-align-center"  onClick={()=>{self.showQrEye()}}>
                                  <Icon iconName={qrEye?'eye-disabled':'eye'} size={'120%'} iconColor={'#ccc'}  />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="border-top padding-all-1r margin-top-1r border-color-f5f5f5" justify={'flex-end'}>
                        <Col span={5} className="margin-right-1r">
                            <Buttons
                                text={'确定'}
                                type={'primary'}
                                size={'normal'}
                                style={{ color: '#fff' }}
                                onClick={() => {
                                    this.goReset()
                                }}
                            />
                        </Col>
                        <Col span={5} className="">
                            <Buttons
                                text={'取消'}
                                type={'primary'}
                                size={'normal'}
                                style={{}}
                                onClick={() => {
                                    this.hideResetModal()
                                }}
                                plain
                            />
                        </Col>
                    </Row>
                </div>),
                type: 'top',
                containerStyle: { top: '4rem', width: '40%', left: '30vw',minHeight: '30vh',position: 'fixed', zIndex: '1000' },
            }} />
        )
    }
}

export default ResetPwd;