import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { hashHistory } from 'react-router';
import { projectQuery } from '../api/index';
import { goLink } from '../utils/common';
import ProjectShowView from './projectShowView';
import { Provider,KeepAlive } from 'react-keep-alive';
import Header from './components/header';
import Theme from '../config/theme';
const {
    Row,
    Col,
    Icon, Menu, Loader, Buttons, Toaster, LoadText, FullScreen, PopOver, Modal, MenuSearch
  } = Components;
const { sessions, storage } = utils;

class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
          confirmDirty: false,
          menuData: [],
          nowPageId: '',
          nowProject: {},
          loadStatus: 'LOADING', //'LOADING', 'ERROR', 'SUCCESS',
          userInfo: sessions.getStorage('userInfo') || {}, //storage.getStorage('bindUserInfo')
          homePage: { _id: 'dashBord', projectIcon: 'android-apps ', templateId: 'dashBord', isDIYPage: true, url: '@Home', title: '首页'},
          collapsedStatus: false,
          selectKey: {
            oldInPwd:'',
            newInPwd:'',
            qrInPwd:''
          },
          oldInPwd:'',
          newInPwd:'',
          pwdFlag:0,
          showResetModal:false,
          resourceKey: 'dashBord'
      };
    // 用户类型 userNature  00 系统管理员, 01 开发者, 02 运营者, 03 服务商, 04 操作员, 05 全局管理员
    }
    
    componentDidMount(){
        const { homePage } = this.state;
        let navCache = sessions.getStorage('navCache')
        if(!(navCache&&navCache.length>0)){
            sessions.setStorage('navCache', [homePage]);
        }
        this.getProjectList();
        this.setState({
            showResetModal:false,
          })
    }
    findNode(dataArr, id){
        let node = {}
        for(let i=0;i<dataArr.length;i++){
          if(id==dataArr[i]._id){
            node = dataArr[i]
            break;
          }
          if(dataArr[i].children){
            node = this.findNode(dataArr[i].children, id)
          }
        }
        return node
    }

    handleClick(link) {
        if(link) {
            hashHistory.push(link);
        }
    }
    // 菜单点击
    handleMenuClick = (res) => {
        console.log('res',res);
        this.setState({
            showResetModal:false,
          })
        if(!res.children && res.title == '首页'){
            this.setState({ nowPageId: res._id });
        }
        const { menuData } = this.state;
        let fatherNode = this.findNode(menuData, res.projectId);
        if(res.url){
            // this.$$keepTab.changeActive(res);
            let navCache = sessions.getStorage('navCache');
            Toaster.closeAll();
            if(navCache){
                let flag=false;
                navCache.map(item=>{
                    if(item._id==res._id){
                        flag=true;
                    }
                })
                if(flag){
                    return this.setState({
                        nowPage:res,
                        nowPageId:res._id,
                        nowProject: fatherNode || {}
                    })
                }
                let arr=[];
                arr.push(res);
                let newArr=arr.concat(navCache);
                sessions.setStorage('navCache', newArr);
            }else{
                let arr=[];
                arr.push(res);
                sessions.setStorage('navCache', arr);
            }
            this.setState({
                nowPage:res,
                nowPageId:res._id,
                nowProject: fatherNode || {}
            })
        }
    }
    onMenuClick = (res) => {
        this.setState({
            showResetModal:false,
        })
        const { menuData } = this.state;
        let fatherNode = this.findNode(menuData, res.projectId);
        Toaster.closeAll();
        this.setState({
            nowPage:res,
            nowPageId:res._id,
            nowProject: fatherNode || {}
        })
        // this.$$keepTab.changeActive(res)
    }
    // 获取项目列表
    getProjectList(){
         this.setState({
            showResetModal:false,
          })
        const self = this;
        const {userInfo, homePage} = this.state;
        Loader.show()
        if(JSON.stringify(userInfo)=='{}'){
            storage.removeAllStorage();
            sessions.removeAllStorage();
            goLink('/LoginPage')
            return
        }
        let id=userInfo.userNature=='04'?userInfo.optrno:userInfo._id;
        projectQuery({
            "loginUserId": id,
            "role": userInfo.role||null,
        }).then((res)=>{
            Loader.hide()
            if(res.code=="0000") {
                self.setState({
                    loadStatus: 'SUCCESS',
                    menuData: [homePage, ...res.data],
                    nowPageId: homePage._id,
                    nowPage: homePage
                })
            } else {
                self.setState({
                    loadStatus: 'ERROR',
                    menuData: [homePage],
                    nowPageId: homePage._id,
                    nowPage: homePage
                })
                Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg })
            }
        }).catch(()=>{
            self.setState({
                loadStatus: 'ERROR',
                menuData: [homePage],
                nowPageId: homePage._id,
                nowPage: homePage
            })
            Loader.hide()
        })
    }
    toggole(){
        this.setState({
            showResetModal:false,
          })
        const { collapsedStatus } = this.state;
        const self = this;
        if(collapsedStatus){
            self.setState({
                collapsedStatus: false
            }) 
        } else{
            self.setState({
                collapsedStatus: true
            }) 
        }
    }
 
    render() {
        const { menuData, nowPageId, nowPage, loadStatus, collapsedStatus, nowProject, userInfo,showResetModal, resourceKey } = this.state;
        let userNature= userInfo.userNature;
        let navCache = sessions.getStorage('navCache');
        const self = this;

        return(
          <section className="bg-f5f5f5  ">
            <Row className="">
                <Col span={collapsedStatus? 1 : 4} style={collapsedStatus? {width: '50px'}: {}} 
                className={`bg-show heighth-100 relative`}>
                    <Row className={`${Theme.headerBg} textclolor-white heighr-3 border-bottom ${Theme.headerBorderColor}  ${collapsedStatus ? '' : 'padding-left-1r'}`}>
                        <Col className={`${collapsedStatus ? `text-align-center ` : ''} line-height-3r`}>
                        <span className={`relative ${!collapsedStatus && 'left-1r'} font-size-great font-weight-700`}>{collapsedStatus ? 'Can' :'Candys'}</span>
                        </Col>
                    </Row>
                    <Row className='container-height relative' direction='column'>
                        <Col className="border-top border-color-f5f5f5">
                        {menuData&&menuData.length> 0 && !collapsedStatus?<MenuSearch data={menuData} placeholder={'搜索功能'} handSelect={this.handleMenuClick} /> : ''}
                        </Col>
                        <Col className={`menu-height ${ collapsedStatus ? '' :'overflow-auto overflow-x-hide scroller'}`}>
                    {menuData&&menuData.length> 0? <Menu
                        Date={menuData}
                        activeNode={nowPageId}
                        theme={'default'}
                        callBack={this.handleMenuClick}
                        collapsed={collapsedStatus}
                        transKey={{
                            'title': 'name',
                            'otherName': 'name',
                            'id': '_id',
                            'key': '_id',
                            'keyID': '_id',
                            'pid': 'projectId',
                            'projectId': 'projectId',
                        }}
                        /> : <LoadText className={"padding-top-2r"} loadStatus={loadStatus} refreshBack={()=>{ self.getProjectList()}} />}
                        </Col>
                        <Col className={`${!collapsedStatus && 'heighr-4'} absolute bottom-0`}>
                            <Row className="bg-show zindex-10 width-100  border-top border-color-f5f5f5">
                                <Col span={collapsedStatus ? 24 : 4} className="padding-top-1r text-align-center cursor-pointer" onClick={()=>{self.toggole()}}>
                                    <Icon iconName={collapsedStatus ? 'ios-list-outline': 'ios-list'} size={'140%'} iconColor={'#5D8EFF'}  />
                                </Col>
                                <Col span={collapsedStatus ? 24 : 4} className="padding-top-1r text-align-center cursor-pointer"><FullScreen showDes={false} /></Col>
                                <Col span={collapsedStatus ? 24 : 16} className="padding-top-1r text-align-center cursor-pointer" onClick={()=>{
                                        goLink('/Projects')
                                    }}>
                                    <Icon iconName={'android-settings '} size={'140%'} iconColor={'#5D8EFF'}  /> {collapsedStatus? '' : '编辑模式'}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col span={collapsedStatus ? 23 :20} className="heighth-100 flex-1 overflow-hide">
                    <Header nowPageId={nowPageId} onMenuClick={this.onMenuClick} />                
                    <div className="width-100 container-height overflow-auto scroller ">
                    <Provider><KeepAlive name={nowPageId||'home'} ><ProjectShowView pageId={nowPageId} pageInfo={nowPage} allPagse={menuData} projectInfo={nowProject} /></KeepAlive></Provider>
                      {/* <Provider><KeepAliveTab options={tabOptions} active={resourceKey} ref={(r)=>{ self.$$keepTab = r}}></KeepAliveTab></Provider> */}
                    </div>
                </Col>
            </Row>     
          </section>
        );
    }
}
export default Home;
