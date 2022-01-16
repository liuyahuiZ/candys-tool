import React , { Component }from 'react';
import { Components, utils, Templates } from 'neo';
import { hashHistory } from 'react-router';
import { getProjectInfo, getProjectPages, addProjectPages, copyProjectPages, modifyProjectPages, pageConfigGet, pageConfigQry, pageConfigAdd, pageConfigModify, deleteProjectPages } from '../api/index';
import ShowView from './modals/showView';
import SelectIcon from '../components/selectIcon';
import { UrlSearch } from '../utils/index';
import { getUserInfo  } from '../utils/common';
import { ListContext } from  'context';
import * as ModalRegister from './modalRegister';
import * as Register from '../../views/register';

const { Row, Col, Icon,Input, Buttons, Searchs, Selects, Toaster, Notification, Modal, Switch, Loader, PopOver, AnTransition, PopModal, FullScreen, LoadText, LoadPage } = Components;
const { sessions, storage } = utils
const { ErrorBounDary } = Templates
class ProjectManage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        projectInfo: {},
        pageList: [],
        oldList:[],
        allPageList:[],
        selectTree: '',
        selectUrl: '',
        pageInfo:{
            title: '',
            projectId: '',
            url: '',
            templateId: 'Detail',
            describe: '',
            weight: 99,
            feature: ''
        },
        selectPage: '',
        selectPageParmes: {},
        pageConfig: {},
        loadingStatus: 'LOADING', //'LOADING', 'LOADED',
        editThePage: {},
        userInfo: getUserInfo() || {},
        nowSelectPage: sessions.getStorage('nowSelectPage') || null,
        listBarStatus: 'HIDE', //'SHOW', 'HIDE'
        modalTplList: [{text: '详情页模板', value: 'Detail'},{text: '详情页Uper模板', value: 'DetailRich'},
        {text: '编辑页模板', value: 'Modify'},{text: '新增页模板', value: 'Edit'},
        {text: '查询列表页模板', value: 'SearchList'},{text: 'Tab容器模板', value: 'TabLayout'},
        {text: 'Grid容器模板', value: 'GridLayout'},{text: '可编辑表格模板', value: 'EditTable'},
        {text: '卡片列表模板', value: 'CardsPage'},{text: '自定义编辑模板', value: 'AddPage'}],
        reRender: 'init', // init , shuldRender noRender
        keyWords: '',
        };
        this.featureTypes = [
            {text: 'NORMAL', value: ''},
            {text: 'NEW', value: 'new'},
            {text: 'HOT', value: 'hot'},
            {text: 'TOP', value: 'top'},
        ];
    }
    
    componentDidMount(){
        this.init();
    }
    
    init(){
        let obg = UrlSearch()
        this.setState({
            pageConfig: {}
        })
        this.getProject(obg);
        this.getProjectPage(obg);
        this.getAllPages();
    }

    // 获取项目详情
    getProject(obg){
        const self = this;
        Loader.show()
        getProjectInfo({
            id: obg.id,
        }).then((res)=>{
            Loader.hide()
            if(res.code=='0000'){
               self.setState({
                    projectInfo: res.data||{}
               })
            } else{
                Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
            }
        }).catch(()=>{
            Loader.hide()
        })
    }

    getAllPages(){
        const self = this;
        getProjectPages({
            current: 0,
            obj: {
            },
            size: 10
        }).then((res)=>{
            if(res.code=='0000'){
                self.setState({
                    allPageList: res.data,
                })
             } else{
                 Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
             }
        }).catch(()=>{

        })
    }

    // 获取项目下页面列表
    getProjectPage(obg){
        const self = this;
        const { nowSelectPage } = this.state;
        getProjectPages({
            current: 0,
            obj: {
                projectId: obg.id,
            },
            size: 10
        }).then((res)=>{
            if(res.code=='0000'){
                self.setState({
                    pageList: res.data,
                    oldList: res.data,
                })
                
                if(res.data.length > 0) {
                    if(nowSelectPage) {
                        self.changePage(nowSelectPage, 'doChange')
                    } else{
                        self.changePage(res.data[0], 'doChange')
                    }
                    
                }else{
                    self.setState({
                        pageList: [],
                        oldList: [],
                        loadingStatus: 'NODATA',
                    })
                }
                
             } else{
                 Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
             }
        }).catch(()=>{

        })
    }

    //新增页面
    addPages(callBack){
        let obg = UrlSearch()
        const self = this;
        const { pageInfo } = this.state;
        addProjectPages({
            title: pageInfo.title|| '',
            projectId: obg.id||'',
            url: pageInfo.url||'',
            templateId: pageInfo.templateId|| '',
            describe: pageInfo.describe||'',
            // createUserId: userInfo.id,
            status: pageInfo.status==true? 1: 0,
            isDIYPage: pageInfo.isDIYPage==true? 1: 0,
            weight: pageInfo.weight || 99,
            feature: pageInfo.feature || '',
            pageIcon: pageInfo.pageIcon
            // channelId: userInfo.channelId
        }).then((res)=>{
            if(res.code=='0000'){
                callBack()
                self.init()
            } else{
                Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
            }
        }).catch(()=>{

        })
    }

    //复制页面
    copyPages(callBack){
        let obg = UrlSearch()
        const self = this;
        const { pageInfo } = this.state;
        copyProjectPages({
            title: pageInfo.title|| '',
            projectId: obg.id||'',
            url: pageInfo.url||'',
            templateId: pageInfo.templateId|| '',
            describe: pageInfo.describe||'',
            // createUserId: userInfo.id,
            status: pageInfo.status==true? 1: 0,
            isDIYPage: pageInfo.isDIYPage==true? 1: 0,
            weight: pageInfo.weight || 99,
            feature: pageInfo.feature || '',
            pageIcon: pageInfo.pageIcon,
            configId: pageInfo.copyConfig
            // channelId: userInfo.channelId
        }).then((res)=>{
            if(res.code=='0000'){
                callBack()
                self.init()
            } else{
                Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
            }
        }).catch(()=>{

        })
    }

    // 修改page
    editPages(callBack){
        const { pageInfo } = this.state;
        const self = this;
        modifyProjectPages({
            id: pageInfo._id,
            title: pageInfo.title|| '',
            url: pageInfo.url||'',
            templateId: pageInfo.templateId|| '',
            describe: pageInfo.describe||'',
            status: pageInfo.status==true? 1: 0,
            isDIYPage: pageInfo.isDIYPage==true? 1: 0,
            weight: pageInfo.weight || 99,
            feature: pageInfo.feature||'',
            pageIcon: pageInfo.pageIcon
        }).then((res)=>{
            if(res.code=='0000'){
                self.init();
                Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true);
                callBack()
            }
        }).catch(()=>{
    
        })
    }
    

    //获取页面下未发布的配置 
    getEditConfig(page, callback){
        const self = this;
        this.setState({
            loadingStatus: 'LOADING'
        })
        Loader.show()
        pageConfigQry({
            current: 0,
            obj: {
                pageId: page._id,
                status: 0, //0-未发布，1-已发布，2-已删除
            },
            size: 10
        }).then((res)=>{
            Loader.hide();
            if(res.code=='0000'){
                if(res.data.length>0){
                    self.setState({
                        pageConfig: res.data[0],
                        loadingStatus: 'LOADED'
                    },()=>{ if(typeof callback == 'function'){callback()} })
                    
                } else {
                    //没有处于编辑状态的配置 调已发布的最新配置，去新增编辑配置
                    if(page.configId){
                        self.getPageConfig(page, callback)
                    }else{
                        self.setState({
                            pageConfig: {},
                            loadingStatus: 'LOADED'
                        })
                    }
                }
            } else{
                self.setState({
                    loadingStatus: 'ERROR'
                })
                Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
            }
            
        }).catch(()=>{
    
        })
    }
    

    //获取页面已绑定发布的配置
    getPageConfig(page, callback){
        // 绑定配置
        const self = this;
        this.setState({
            loadingStatus: 'LOADING'
        })
        if(page.configId) {
            pageConfigGet({
                id: page.configId,
            }).then((res)=>{
                if(res.code=='0000'){
                    self.setState({
                        pageConfig: res.data,
                        loadingStatus: 'LOADED'
                    },()=>{if(typeof callback == 'function'){callback()}})
                } else{
                    self.setState({
                        loadingStatus: 'ERROR'
                    })
                    Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
                }
            }).catch(()=>{
    
            })
        }
        
    }

    //新增页面配置
    changePageConfig(config){
        const { selectPage } = this.state;
        const self = this;
        if(!config.pageConfigId||(config.pageConfigId&&config.confitStatus===1)) {
            pageConfigAdd({
                pageId: selectPage._id,
                configJson: JSON.stringify(config),
                configVersion: '0.1',
                status: 0,
            }).then((res)=>{
                if(res.code=='0000'){
                    self.init();
                    Notification.toaster({ type: 'normal',  position: 'top', title: '保存成功', content: res.msg })
                }else{
                    Notification.toaster({ type: 'error',  position: 'top', title: '保存失败', content: res.msg })
                }
            }).catch((err)=>{
                Notification.toaster({ type: 'error',  position: 'top', title: '保存失败', content: err&&err.msg })
            })
        } else if(config.confitStatus==0&&config.pageConfigId&&config.pageConfigId!='') {
            pageConfigModify({
                id: config.pageConfigId,
                pageId: selectPage._id,
                configJson: JSON.stringify(config),
                configVersion: '0.1',
                status: 0,
                // createUserId: userInfo.id,
            }).then((res)=>{
                if(res.code=='0000'){
                    Notification.toaster({ type: 'normal',  position: 'top', title: '保存成功', content: res.msg })
                    self.init();
                }else{
                    Notification.toaster({ type: 'error',  position: 'top', title: '保存失败', content: res.msg })
                }
            }).catch((err)=>{
                Notification.toaster({ type: 'error',  position: 'top', title: '保存失败', content: err&&err.msg })
            })
        }

    }
    // 发布配置
    publicConfig(config){
        const { selectPage, userInfo } = this.state;
        const self = this;
        modifyProjectPages({
            id: selectPage._id,
            configId: config._id
        }).then((res)=>{
            if(res.code=='0000'){
                self.init();
                Notification.toaster({ type: 'success',  position: 'top', title: '保存成功', content: `页面配置发布${res.msg}` })
            }else{
                Notification.toaster({ type: 'error',  position: 'top', title: '失败', content: `${res.msg}` })
            }
        }).catch((err)=>{
            Notification.toaster({ type: 'error',  position: 'top', title: '失败', content: `${err&&err.msg}` })
        })

        pageConfigModify({
            id: config._id,
            pageId: selectPage._id,
            status: 1,
            createUserId: userInfo.id,
        }).then((res)=>{
            if(res.code=='0000'){
                self.init();
                Notification.toaster({ type: 'success',  position: 'top', title: '保存成功', content: `配置信息发布${res.msg}` })
            }else{
                Notification.toaster({ type: 'error',  position: 'top', title: '失败', content: `${res.msg}` })
            }
        }).catch((err)=>{
            Notification.toaster({ type: 'error',  position: 'top', title: '失败', content: `${err&&err.msg}` })
        })

        self.setState({
            nowSelectPage: null
        })
    }
    
    // 删除页面
    pageDelete(itm){
        const self = this
        deleteProjectPages({
            "id": itm._id,
        }).then((res)=>{
            if(res.code=="0000") {
                self.init();
                Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
            
            } else {
                Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
            }
        }).catch(()=>{

        })
    }
    

    goBack(){
         setTimeout(()=>{
            sessions.removeStorage('nowSelectPage');
            // sessions.removeAllStorage();
         }, 2000) 
        hashHistory.goBack();
    }

    setKey(key, v){
        let newPageInfo = this.state.pageInfo;
        newPageInfo[key] = v
        this.setState({
            pageInfo: newPageInfo
        })
    }
    
    // 初始化page
    newPage(status){
        const self = this;
        const {pageInfo, modalTplList, allPageList} = this.state;
        const actionOption = allPageList&&allPageList.length>0 ? allPageList.map((itm, idx)=>{
            return {text: itm.title, value: itm.url, config: itm.configId}
        }): []
        actionOption.unshift({text: '请选择', value: '', config: ''});
        Modal.formConfirm({ title: status=='Edit' ? '修改页面': '新建页面',
                    content: (
                    <Row className="padding-all">
                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">页面名称:</Col>
                                <Col span={16} className="line-height-3r">
                                    <Input
                                        value={status=='Edit'? pageInfo.title: ''}
                                        placeholder="请输入页面名称"
                                        maxLength={100}
                                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                        onChange={(e,t,v)=>{
                                            self.setKey('title', v)
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">页面描述:</Col>
                                <Col span={16} className="line-height-3r">
                                    <Input
                                        value={status=='Edit'? pageInfo.describe: ''}
                                        placeholder="页面描述能帮助理解页面内容"
                                        maxLength={100}
                                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                        onChange={(e,t,v)=>{
                                            self.setKey('describe', v)
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">页面路径:</Col>
                                <Col span={16} className="line-height-3r">
                                    <Input
                                        value={status=='Edit'? pageInfo.url: ''}
                                        placeholder="请输入页面路径"
                                        maxLength={100}
                                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                        onChange={(e,t,v)=>{
                                            self.setKey('url', v)
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">是否自定义页面:</Col>
                                <Col span={16} className="line-height-3r">
                                    <Switch value={status=='Edit' ? pageInfo.isDIYPage : false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                                        self.setKey('isDIYPage', data);}} />
                                </Col>
                            </Row>
                        </Col>

                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">模板:</Col>
                                <Col span={16} className="line-height-3r padding-top-p4r">
                                <Selects value={status=='Edit'? pageInfo.templateId: ''} onChange={(e,t,v)=>{
                                    self.setKey('templateId', v.value)
                                }} options={modalTplList} />
                                </Col>
                            </Row>
                        </Col>
                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">是否显示:</Col>
                                <Col span={16} className="line-height-3r">
                                    <Switch value={status=='Edit' ? pageInfo.status : false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                                        self.setKey('status', data);}} />
                                </Col>
                            </Row>
                        </Col>
                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">排序权重:</Col>
                                <Col span={16} className="line-height-3r">
                                    <Input
                                        value={status=='Edit'? pageInfo.weight: 99}
                                        placeholder="请输入权重越小越靠前"
                                        maxLength={2}
                                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                        onChange={(e,t,v)=>{
                                            self.setKey('weight', v)
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">特殊标记:</Col>
                                <Col span={16} className="line-height-3r">
                                  <Selects value={status=='Edit'? pageInfo.feature: ''} onChange={(e,t,v)=>{
                                      self.setKey('feature', v.value)
                                  }} options={this.featureTypes} />
                                </Col>
                            </Row>
                        </Col>
                        {status=='Copy'? <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">copy页面:</Col>
                                <Col span={16} className="line-height-3r">
                                  <Selects value={status=='Edit'? pageInfo.copyConfig: ''} onChange={(e,t,v)=>{
                                      console.log('v', v);
                                      self.setKey('copyConfig', v.config)
                                  }} options={actionOption} />
                                </Col>
                            </Row>
                        </Col>: ""}
                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">图标:</Col>
                                <Col span={16} className="line-height-3r">
                                    <SelectIcon value={status=='Edit'? pageInfo.pageIcon: ''}  onChange={(v)=>{
                                        self.setKey('pageIcon', v)
                                    }}/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    ),
                    style: '',
                    btnConStyle: 'right',
                    btnSure: {
                        text: '确认',
                        type: 'primary',
                        style: { 'height': '2rem', 'minWidth': '100px'}
                    },
                    btnCancle: {
                        text: '取消',
                        type: 'primary',
                        plain: true,
                        style: { 'height': '2rem', 'minWidth': '100px'}
                    }
                  },
                  (id, callback) => { 
                      if(status=='Edit') {
                        self.editPages(()=>{callback(id)});

                      } else if(status=='Copy'){
                        self.copyPages(()=>{callback(id)});
                      }else {
                        self.addPages(()=>{callback(id)});
                      }
                      
                  },
                  (id, callback) => { callback(id); });
    }

    changePage(page, status){
        const { selectUrl } = this.state;
        if(!status&&selectUrl==page.url) return;
        this.setState({
            selectTree: page.templateId,
            selectPage: page,
            selectUrl: page.url,
            loadingStatus: 'LOADING',
            nowSelectPage: page
        })
        this.getEditConfig(page)
        sessions.setStorage('nowSelectPage', page)
    }
    // button 跳转
    goPage(pageName, parmes, op){
        const { pageList } = this.state;
        const self = this;
        for(let i=0;i<pageList.length;i++){
            // 当前页面打开弹出页
            if(pageList[i].url == pageName){
                if(op.linkModal===true){
                    self.showModal(pageList, pageList[i], parmes, op.type, op.parentData)
                }else {
                    this.setState({
                        selectTree: pageList[i].templateId,
                        selectPage: pageList[i],
                        selectUrl: pageList[i].url,
                        selectPageParmes: parmes
                    })
                    this.getEditConfig(pageList[i])
                }
                
            }
        }
    }

    showModal(pageList, pages, parame, type, parentData){
        const self = this;
        const { reRender } = this.state
        let defaultAction = {
            go: (e, parame, op)=>{self.goPage(e, parame, op)},
            goBack: (e)=>{self.goPage(e)},
            saveConfig: (config)=>{ self.changePageConfig(config) },
            publicConfig: (config)=>{ self.publicConfig(config)},
            callback: ()=>{ self.hideMoral()}
        }
        PopModal.confirm({
        content: (<ListContext.Provider 
            value={{
                reRender: reRender,
                refreshCall: (res)=>{ 
                    self.setState({
                        reRender: 'shuldRender', // init , shuldRender noRender'
                    })
                }
            }}
          ><ShowView isModal={true} parame={parame} parentData={parentData}  pageList={pageList} publistatus={0} pagesInfo={pages} defaultAction={defaultAction} />
          </ListContext.Provider >),
            type: type ||'middle',
            title: pages.title,
            containerStyle: { },
            },
            (id, callback) => { 
            callback(id);
            });
    }

    hideMoral(){
        PopModal.closeAll()
    }

    renderTemple(selectTree){
        const self = this;
        const { pageList, pageConfig, selectPage, selectPageParmes, reRender } = this.state;
        let defaultAction = {
            go: (e, parame, op)=>{self.goPage(e, parame, op)},
            goBack: (e)=>{self.goPage(e)},
            saveConfig: (config)=>{ self.changePageConfig(config) },
            publicConfig: (config)=>{ self.publicConfig(config)},
            callback: ()=>{self.hideMoral()}
        }

        if((selectPage.url&&selectPage.url.indexOf('@') >= 0)&&selectPage.isDIYPage==1){
            let pages = selectPage.url.split('@')[1]
            const Components = Register.default[pages]
            if(Components){
                return <React.Suspense fallback={<LoadPage />}>
                <Components pageData={selectPage} pageParmes={selectPageParmes} pageList={pageList} pageConfig={pageConfig} ref={(r) => { self[`$$${pages}`] = r; }} {...defaultAction} />
                </React.Suspense>
            } else{
                return <LoadText className={"padding-top-5r minheight-80 bg-show"} loadStatus={'NODATA'} text={'未找到页面404'} />
            }
            
        }
        if(selectTree){
            const ModalComponent = ModalRegister.default[selectTree]
            if(ModalComponent){
                return <React.Suspense fallback={<LoadPage />}>
                <ModalComponent pageData={selectPage} pageParmes={selectPageParmes} pageList={pageList}  pageConfig={pageConfig} ref={(r) => { self[`$$${selectTree}`] = r; }} defaultAction={defaultAction} {...defaultAction} reRender={reRender} />
                </React.Suspense>
            } else{
                return <LoadText className={"padding-top-5r minheight-80 bg-show"} loadStatus={'NODATA'} text={'未找到页面404'} />
            }
        }
    }

    saveConfig(){
        const { selectTree } = this.state;
        const self = this;
        let config = self[`$$${selectTree}`].getConfig();
        self.changePageConfig(config)
    }

    toggelListBar(){
        const {listBarStatus} = this.state;
        let newStatus = ''
        if(listBarStatus=='SHOW') {
            newStatus= 'HIDE'
        } else {
            newStatus= 'SHOW'
        }
        this.setState({
            listBarStatus: newStatus
        })
    }
    search(keyWord, key){
        const { oldList } = this.state;
        let newList = []
        // console.log(keyWord, key, (/^[\u4e00-\u9fa5]+$/).test(keyWord))
        let isChina = false;
        if((/^[\u4e00-\u9fa5]+$/).test(keyWord)){
            isChina = true
        }
        for(let i=0;i<oldList.length;i++){
            if(isChina){
                if(oldList[i][key]&&(oldList[i][key]).indexOf(keyWord)>=0){
                    newList.push(oldList[i]);
                }
            }else if(oldList[i][key]&&(oldList[i][key].toUpperCase()).indexOf(keyWord.toUpperCase())>=0){
                newList.push(oldList[i]);
            }
        }
        
        if(keyWord==''){
            this.setState({
                pageList: oldList,
                keyWords: keyWord||''
            })
        }else if(newList.length>0){
            this.setState({
                pageList: newList,
                keyWords: keyWord||'',
            })
        }
    }
    render() {
        const self = this;
        const { selectTree, projectInfo, pageList, pageConfig, selectPage, loadingStatus, selectUrl, listBarStatus } = this.state;
        const treeListDom = pageList&&pageList.length>0 ? pageList.map((itm, idx)=>{
            return <Row className={`${selectUrl==itm.url ? 'bg-4698F9 border-radius-3f':''} padding-all`} key={`${idx}-itm`} >
             <Col span={19} className="" onClick={()=>{self.changePage(itm)}}>
             <div className={selectUrl==itm.url ? 'textcolor-fff text-overflow cursor-pointer': 'text-overflow cursor-pointer' } title={itm.title}>
                <Icon iconName={itm.pageIcon} size={'130%'} iconColor={selectUrl==itm.url ? '#fff': '#666'}
            />  {itm.title||itm.name} </div></Col>
             <Col span={5} className="cursor-pointer text-align-right">
             <PopOver  popContent={(
                <Row className="width-8r text-align-left">
                   <Col span={24} className="cursor-pointer line-height-2r" onClick={()=>{
                        self.setState({
                            pageInfo: itm
                        },()=>{
                            self.newPage('Edit');
                        })
                    }}>
                    <Icon iconName={'android-create'} size={'130%'} iconColor={selectUrl==itm.url ? '#4698F9': '#666'}/> 修改
                  </Col>
                    <Col span={24} className="cursor-pointer line-height-2r" onClick={()=>{
                        Modal.formConfirm({ title: '',
                        content: '确定删除该页面吗？',
                        style: '',
                        btnConStyle: 'right',
                        btnSure: {
                            text: '确认',
                            type: 'primary',
                            style: { 'height': '2rem', 'minWidth': '100px'}
                        },
                        btnCancle: {
                            text: '取消',
                            type: 'primary',
                            plain: true,
                            style: { 'height': '2rem', 'minWidth': '100px'}
                        }
                        },
                        (id, callback) => { 
                            callback(id);
                            self.pageDelete(itm)
                        },
                        (id, callback) => { callback(id); });
                    }}><Icon iconName={'android-cancel '} size={'130%'} iconColor={selectUrl==itm.url ? '#4698F9': '#666'}/> 删除 </Col>
             </Row>
             )}
            placement={'left'} selfkey={'1'}
                    >
                    <Icon iconName={'android-settings '} size={'130%'} iconColor={selectUrl==itm.url ? '#fff': '#666'}/>
                    </PopOver> </Col>
             </Row>
        }) : <div className="text-align-center">暂无数据</div>;

        return(
          <section className="bg-f5f5f5 scroller overflow-x-hide">
            {listBarStatus =='SHOW'?
            <AnTransition delay={300} act={'enter'} duration={166} enter={'listTem-enter'} leave={'listTem-leave'} >
            <Row className={`fixed left-0 bg-show padding-all-1r top-2 zindex-100 box-shadow cursor-pointer`} onClick={()=>{self.toggelListBar()}}>
                <Col>
                    <Icon iconName={'android-apps '} size={'130%'} />
                </Col>
            </Row></AnTransition>: ''}
            <Row className="padding-top-1r padding-left-1r padding-right-1r">
                <Col  span={listBarStatus =='SHOW' ? 0 : 4}  className={ listBarStatus =='SHOW' ? 'display-none' : 'display-inline-block zindex-10'} >
                <AnTransition delay={1} act={listBarStatus =='SHOW'? 'leave': 'enter'} duration={166} enter={'listTem-enter'} leave={'listTem-leave'} >
                    <Row className="padding-all-1r bg-show border-radius-3f ">
                        <Col className="line-height-3r border-bottom border-color-f5f5f5 text-overflow cursor-pointer" onClick={()=>{self.toggelListBar()}}><Icon iconName={'android-apps '} size={'130%'} /> PageList 页面列表</Col>
                        <Col className="border-bottom border-color-f5f5f5"><Searchs placeholder={'请输入关键词'} onChange={(v)=>{
                            self.search(v, 'title')
                        }} /></Col>
                        <Col className=" padding-bottom-1r border-bottom border-color-f5f5f5">
                            {treeListDom}
                        </Col>
                        <Col className="margin-top-1r ">
                            <Buttons
                                    text={(<div className="line-height-2r"><Icon iconName={'android-add '} iconColor={'#333'} size={'120%'} iconPadding={1} /> 新建页面</div>)}
                                    type={'primary'}
                                    size={'normal'}
                                    plain
                                    style={{color:'#333', borderRadius: '3rem'}}
                                    onClick={()=>{
                                        self.newPage();
                                    }}
                                />
                        </Col>
                        <Col className="margin-top-1r ">
                            <Buttons
                                    text={(<div className="line-height-2r"><Icon iconName={'android-add '} iconColor={'#333'} size={'120%'} iconPadding={1} /> 复制页面</div>)}
                                    type={'primary'}
                                    size={'normal'}
                                    plain
                                    style={{color:'#333', borderRadius: '3rem'}}
                                    onClick={()=>{
                                        self.newPage('Copy');
                                    }}
                                />
                        </Col>
                    </Row></AnTransition>
                </Col>
                <Col span={listBarStatus =='SHOW' ? 24: 19.8} className="fixed zindex-10 right-0 overflow-auto heightp-100" colgutter={10}>
                    <Row className="padding-left-2 ">
                        {selectTree && loadingStatus=='LOADED' ? <Col className="">
                        <Row className="margin-bottom-5x bg-show padding-all-1 border-radius-3f">
                            <Col span={7} className="border-radius-3f">
                                <Row className="padding-left-1r line-height-3r bg-show cursor-pointer" jusity={"flex-start"}>
                                    <Icon iconName={'android-arrow-back '} size={'140%'} iconPadding={1} onClick={()=>{ sessions.removeStorage('nowSelectPage'); this.goBack()}} /> 
                                    <div className=" padding-left-1r">{projectInfo.title} {selectPage!==''? `/ ${selectPage.title}`: ''}</div>
                                </Row>
                            </Col>
                            <Col span={5} className="line-height-3r text-align-right padding-right-1r"><FullScreen /> 页面效果预览</Col>
                            <Col span={12} className="line-height-3r ">
                                <Buttons
                                    text={'保存页面信息'}
                                    type={'success'}
                                    size={'small'}
                                    style={{color:'#fff', height: '3rem', borderRadius: '0.3rem', marginRight: '1rem'}}
                                    onClick={()=>{
                                    self.saveConfig()
                                    }}
                                    iconName={'ios-albums'}
                                    hasIcon
                                />
                                {pageConfig._id&&pageConfig.status===0 ? <Buttons
                                    text={'发布'}
                                    type={'success'}
                                    size={'small'}
                                    style={{color:'#fff',  height: '3rem', borderRadius: '0.3rem'}}
                                    onClick={()=>{
                                    self.publicConfig(pageConfig)
                                    }}
                                    iconName={'paper-airplane'}
                                    hasIcon
                                    />
                                : ''}
                            </Col>
                        </Row>
                        <ErrorBounDary >{self.renderTemple(selectTree)}</ErrorBounDary >
                        </Col> :  <Col className="bg-show width-100 padding-all line-height-3r"><LoadText className={"padding-top-2r"} loadStatus={loadingStatus} /></Col>}
                    </Row>
                </Col>
            </Row>

          </section>
        );
    }
}
export default ProjectManage;
