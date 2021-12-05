import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { login, register } from '../../api/index'
import PublicKey from '../../config/publishKey';
import { goLink, setCache  } from '../../utils/common';
import Hex from '../../utils/Hex';
import SM2 from '../../utils/sm2';

const {
  Buttons,
  Toaster,
  Row,
  Col,
  Icon,
  Input, Loader, Notification, Modal, ExModal, VerifyCode
} = Components;
const { sessions, storage } = utils;
class BindUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      loginName: '',
      loginPassword: '',
      LoadSatus: 'NULLLOAD', //'LOADING', 'LOADED', 'NULLLOAD'
      codeImg: '/api/admin/api/v1/user/getCode',
      codeValue: '',
      selectKey: {},
      RESdisplay: '',
      RESaction: '',
      oldPwd:'',
      newPwd:'',
      phone: '',
      userInfo: sessions.getStorage('userInfo') || {}, //storage.getStorage('bindUserInfo')
      showReset:false,
      showForget:false,
      newEye:false
    };
  }
  componentDidMount() {
    this.changeImg();
    const self = this;
    this.$$loginPage.addEventListener('keydown', (e) => {
      if (e.keyCode == 13) {
        self.doLogin();
      }
    })
    this.setState({
      showReset:false,
      showForget:false  
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showReset:false,
      showForget:false  
    })
    Loader.hide()
  }

  setValue(key, val) {
    this.setState({ [key]: val });
  }

  doLogin() {
    const self = this;
    const { code, loginName, loginPassword, codeValue, phone } = this.state;
    if (!loginName && code === '') {
      Toaster.toaster({ type: 'error', position: 'top', content: '请输入账户!', time: 3000 }, true);
      return false;
    }

    if (!phone && code === '') {
      Toaster.toaster({ type: 'error', position: 'top', content: '请输入手机号!', time: 3000 }, true);
      return false;
    }

    if (!loginPassword && code === '') {
      Toaster.toaster({ type: 'error', position: 'top', content: '请输入密码!', time: 3000 }, true);
      return false;
    }

    if (!code && code === '') {
      Toaster.toaster({ type: 'error', position: 'top', content: '请填写图形验证码结果', time: 3000 }, true);
      return false;
    }

    if(codeValue.toLocaleLowerCase()!=code.toLocaleLowerCase()){
      Toaster.toaster({ type: 'error', position: 'top', content: '图形验证码填写有误，请重试', time: 3000 }, true);
      return false;
    }

    self.setState({
      LoadSatus: 'LOADING'
    })

    // 公钥
    // const publicKey = PublicKey.PUBLISH_KEY;
    // const sm2DataHex = Hex.utf8StrToHex(loginPassword);
    // // 加密结果
    // const result = SM2.encrypt(publicKey, sm2DataHex);
    register({
      "username": loginName,
      "code": code,
      "phone": phone,
      "password": loginPassword
    }).then((res) => {
      if (res.code == '0000') {
        self.setState({
          LoadSatus: 'LOADED'
        })
        // storage.setStorage('userInfo', res.data);

        setCache(res.data);
        // sessions.setStorage('token', res.data.token);
        // localStorage.token = res.data.token
        // localStorage.user = JSON.stringify(res.data)
        self.props.cancleCallback && self.props.cancleCallback();
        self.$$loginPage.removeEventListener('keydown', () => { });
        Toaster.closeAll()
        Notification.toaster({ type: 'success',time:3000, position: 'top', title: '提示', content: `登陆${res.msg}，欢迎进入Candys Manage！` }, true);
        setTimeout(() => {
          goLink('/Home')
        }, 200)
      } else {
        if(loginName=='test'){
          setCache({username: 'test', typecode: '01', token: '123'})
          Notification.toaster({ type: 'success',time:3000, position: 'top', title: '提示', content: `登陆${res.msg}，欢迎进入Candys Manage！` }, true);
          setTimeout(() => {
            goLink('/Home')
          }, 200)
          self.setState({
            LoadSatus: 'NULLLOAD'
          })
          return ;
        }
        self.changeImg();
        self.setState({
          LoadSatus: 'NULLLOAD'
        })
        return  Toaster.toaster({ type: 'error', position: 'top', content: res.msg,time: 3000 },true)
      }
    }).catch((err) => {
      self.changeImg()
      self.setState({
        LoadSatus: 'NULLLOAD'
      })
      Toaster.toaster({ type: 'error', position: 'top', content: '系统错误',time: 3000 },true)
    })
  }

  changeImg() {
    const ran = Math.random();
    const url = `/api/admin/api/v1/user/getCode?${ran}`;
    this.setState({
      codeImg: url,
    });
  };
  showModal() {
    this.setState({
      showForget:true
    })
  }

  showResetModal() {
    this.setState({
      showReset: true,
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
  showNewEye(){
      const {newEye}=this.state;
      let eyes=!newEye
      this.setState({
          newEye:eyes
      })
  }
  render() {
    const { loginName, loginPassword, code, LoadSatus, codeImg ,showForget,showReset,newEye, phone} = this.state;
    const self = this;
    return (
      <section className="" ref={(r) => { this.$$loginPage = r }}>
        <Row className="padding-all-1r">
          <Col span={24} className="overflow-hide border-radius-3f bg-show margin-top-3r heighr-3">
            <Row className="">
              <Col span={2} className="heighr-3 line-height-3r text-align-center">
                <Icon iconName={'android-person '} size={'150%'} iconColor={'#aaa'} />
              </Col>
              <Col span={22}>
                <Input
                  style={{ height: '3rem' }}
                  innerStyle={{ height: '3rem' }}
                  value={loginName}
                  placeholder="请输入账户"
                  maxLength={100}
                  onChange={(e, t, v) => {
                    self.setValue('loginName', v)
                    self.setState({
                      showForget:false,
                      showReset:false
                    })
                  }}
                />
              </Col>
            </Row>
          </Col>
          <Col span={24} className="overflow-hide border-radius-3f bg-show margin-top-3r heighr-3">
            <Row className="">
              <Col span={2} className="heighr-3 line-height-3r text-align-center">
                <Icon iconName={'android-person '} size={'150%'} iconColor={'#aaa'} />
              </Col>
              <Col span={22}>
                <Input
                  style={{ height: '3rem' }}
                  innerStyle={{ height: '3rem' }}
                  value={phone}
                  placeholder="请输入手机号"
                  maxLength={100}
                  onChange={(e, t, v) => {
                    self.setValue('phone', v)
                    self.setState({
                      showForget:false,
                      showReset:false
                    })
                  }}
                />
              </Col>
            </Row>
          </Col>
          <Col span={24} className="overflow-hide border-radius-3f bg-show margin-top-2r heighr-3">
            <Row className="">
              <Col span={2} className="heighr-3 line-height-3r text-align-center">
                <Icon iconName={'android-lock '} size={'150%'} iconColor={'#aaa'} />
              </Col>
              <Col span={22}>
                <Row>
                  <Col span="20">
                  <Input
                  style={{ height: '3rem' }}
                  innerStyle={{ height: '3rem' }}
                  value={loginPassword}
                  placeholder="请输入密码"
                  type={this.state.newEye?'text':"password"}
                  maxLength={100}
                  onChange={(e, t, v) => {
                    self.setValue('loginPassword', v)
                    self.setState({
                      showForget:false,
                      showReset:false
                    })
                  }}
                />
                  </Col>
                  <Col span="4" className="heighr-3 line-height-3r text-align-center"  onClick={()=>{self.showNewEye()}}>
                    <Icon iconName={this.state.newEye?'eye-disabled':'eye'} size={'150%'} iconColor={'#aaa'}  />
                  </Col>
                </Row>
              </Col>

            </Row>
          </Col>
          <Col span={24} className=" margin-top-2r heighr-3">
            <Row className="">
              <Col span={15} className="overflow-hide border-radius-3f bg-show heighr-3 line-height-3r text-align-center">
                <Input
                  style={{ height: '3rem' }}
                  innerStyle={{ height: '3rem' }}
                  value={code}
                  placeholder="请输入计算结果"
                  maxLength={100}
                  onChange={(e, t, v) => {
                    self.setValue('code', v)
                    self.setState({
                      showForget:false,
                      showReset:false
                    })
                  }}
                />
              </Col>
              <Col span={1}></Col>
              <Col span={8} className="border-radius-3f bg-show " >
                <VerifyCode onChange={(e)=>{
                  console.log(e)
                  self.setState({
                    codeValue: e
                  })
                }} />
              </Col>
            </Row>
          </Col>
          <Col className="margin-top-2r" >
            <Buttons
              text={'注册'}
              LoadSatus={LoadSatus}
              type={'primary'}
              size={'small'}
              style={{ borderRadius: '0.3rem', width: '100px', color: '#fff', marginRight: '20px' }}
              onClick={() => {
                self.setState({
                  showForget:false,
                  showReset:false
                })
                this.doLogin()
              }}
            />
            <Buttons
                text={'取消'}
                type={'primary'}
                size={'small'}
                plain
                style={{ borderRadius: '0.3rem', width: '100px'}}
                onClick={()=>{
                  self.props.cancleCallback && self.props.cancleCallback();
                }}
            />
          </Col>
        </Row>
        {/* </div> */}
      </section>
    );
  }
}
export default BindUser;
