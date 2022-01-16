import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { goLink, clearCache } from '../../utils/common'
import Theme from '../../config/headerTheme';
import ResetPwd from '../login/resetPwd';
import NavTab from './navTag';
import { socketLogin, heardCommit } from '../../servise/socketClient';
const {Row, Col, Icon, Buttons, Modal, PopOver, Toaster} = Components;
const { sessions, storage, array } = utils
  
class Header extends Component {
    constructor(props) {
      super(props);
      const userInfo = sessions.getStorage('userInfo');
      this.state = {
        userInfo: userInfo||{},
        nowPageId: this.props.nowPageId,
        showResetModal: false,
        targetChannel: {},
      };
    }
    componentDidMount(){
      socketLogin()
      heardCommit((res)=>{
        console.log('res', res)
      })
    }


    componentWillReceiveProps(newProps){
      this.setState({
        nowPageId: newProps.nowPageId
      })
    }

    showModal() {
        this.setState({
          showResetModal: true,
          selectKey: {}
        },()=>{
            this.$$ResetPwd.showReset()
        })
    }
    logOut() {
        Modal.formConfirm(
          {
            title: '提示',
            content: '是否确认退出？',
            style: '',
            type: 'small',
            btnConStyle: 'right',
            btnSure: {
              text: '确认',
              type: 'primary',
              style: { height: '2rem', minWidth: '100px' }
            },
            btnCancle: {
              text: '取消',
              type: 'primary',
              plain: true,
              style: { height: '2rem', minWidth: '100px' }
            }
          },
          (id, callback) => {
            callback(id)
            clearCache();
            goLink('/LoginPage')
          },
          (id, callback) => {
            callback(id)
          }
        )
    }

    render(){
        const { nowPageId, userInfo, showResetModal  } = this.state;
        let navCache = sessions.getStorage('navCache')
        console.log('userInfo', userInfo)
        const self = this;
        return (
            <Row className={`relative ${Theme.headerBg} border-left ${Theme.headerBorderColor}`}>
              <Col span={ 19} className={`overflow-hide border-right ${Theme.headerBorderColor}`}>
                <NavTab
                  activeId={nowPageId}
                  onMenuClick={this.props.onMenuClick}
                  options={navCache}
                />
              </Col>
              <Col span={2} className={`text-align-center line-height-3r  heighr-3 overflow-hide border-right ${Theme.headerBorderColor}`}>
              <Icon iconName={'android-textsms'} size={'180%'} iconColor={'#fff'} />
              </Col>
              <Col span={ 3 } className="absolute text-align-center right-0 top-0">
                <PopOver
                  popContent={
                    <div className='user-center-pop'>
                      <div onClick={()=>{self.showModal()}} className='minwidthx-140 cursor-pointer'>
                        <span className="small-round text-align-center display-inline-block border-radius-3r margin-right-3">
                          <Icon iconName={'android-unlock '} size={'120%'} iconColor={'#666'}/>
                        </span> 重置密码
                      </div>
                      <div onClick={()=>{self.logOut()}} className='minwidthx-140 margin-top-3 cursor-pointer'>
                        <span className="small-round text-align-center display-inline-block border-radius-3r margin-right-3">
                          <Icon iconName={'android-exit '} size={'120%'} iconColor={'#666'}/>
                        </span> 退出登录
                      </div>
                    </div>
                  }
                  popStyle={{'right': '0'}}
                  placement={'bottom'} selfkey={'1'} >
                  <Row justify="center" className={`${Theme.headerBg} line-height-3r text-align-center minwidth-140 maxwidthx-140 text-overflow  user-info cursor-pointer relative`} >
                    <span className="small-round line-height-3r relative  display-inline-block border-radius-3r  margin-right-p5r">
                      <Icon
                        iconName={'ios-contact-outline'}
                        size={'180%'}
                        iconColor={'#fff'}
                      />
                    </span>
                    <span title={userInfo.username} className={`textclolor-gray`}>
                      {userInfo.username || ''}
                    </span>
                  </Row>
                </PopOver>
              </Col>
              {showResetModal ? <ResetPwd ref={(r)=>{ self.$$ResetPwd = r}} /> : ''}
            </Row>
        )
    }
}
export default Header;