import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { hashHistory } from 'react-router';
import { getProjects, addProject, deleteProject, modifyProject , downLoadProject } from '../api/index';
import SelectIcon from '../components/selectIcon';
import ImportBord from './components/importBord';
import ExportBord from './components/exportBord';
import { goLink } from '../utils/common';
const { Row, Col, Icon, Modal, Input, Selects , Textarea, Toaster, Loader, Checkbox, AnTransition , Radio , ExModal , Buttons ,FileUpWithData, LoadPage} = Components;
const { sessions, storage } = utils;
class Projects extends Component {
    constructor(props) {
      super(props);
      this.state = {
          confirmDirty: false,
          projectList: [],
          name: '',
          nowProject: {},
          userInfo: sessions.getStorage('userInfo') || {},
          pageList:[], //导出获取子页面
          exportType:'0',//导出方式
          pageStr:'',//导出页面string
          importParams:{
            status:'',
            vision:'',
            importPage:'',
            configJson:'',
          },
          pageInfo: {},
          showImportBord: false,
          showExportBord: false,
      };
      this.featureTypes = [
          {text: 'NORMAL', value: ''},
          {text: 'CARD', value: 'Card'},
          {text: 'TOP', value: 'top'},
      ];
    }
    
    componentDidMount(){
        this.getProjectList();
    }

    handleClick(link, itm) {
        if(link) {
            hashHistory.push({
                pathname: link,
                query: itm || ''
            });
        }
    }

    projectDelete(itm){
        const self = this
        deleteProject({
            "id": itm._id,
        }).then((res)=>{
            if(res.code=="0000") {
                Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
                self.getProjectList()
                
            } else {
                Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
            }
        }).catch(()=>{

        })
    }
    // 获取项目列表
    getProjectList(){
        const self = this;
        Loader.show()
        getProjects({
            "current": 0,
            "size": 50,
            "obj": {
                // "channelId": userInfo.channelId,
                // "createUserId": userInfo.id,
            }
        }).then((res)=>{
            Loader.hide()
            if(res.code=="0000") {
                self.setState({
                    projectList: res.data
                })
            } else {
                Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
            }
        }).catch(()=>{
            Loader.hide()
        })
    }

    //新增项目
    addProjects(){
        const {title, describe, weight, feature, projectIcon} = this.state;
        const self = this;
        addProject({
            "describe": describe,
            "title": title,
            "weight": weight,
            "feature": feature,
            // "createUserId": userInfo.id,
            "projectIcon": projectIcon
        }).then((res)=>{
            if(res.code=='0000'){
                self.getProjectList()
            } else{
                Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
            }
        }).catch((err)=>{

        })
    }

    //修改项目
    modifyProjects(){
        const {title, describe, nowProject, projectIcon, weight, feature} = this.state;
        const self = this;
        modifyProject({
            "id": nowProject._id,
            // "channelId": userInfo.channelId,
            "describe": describe,
            "title": title,
            "weight": weight,
            "feature": feature,
            "projectIcon": projectIcon
            // "createUserId": userInfo.id
        }).then((res)=>{
            if(res.code=='0000'){
                self.getProjectList()
            } else{
                Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
            }
        }).catch((err)=>{

        })
    }

    // 创建新项目form
    newProgect(status, itm){
        const self = this;
        Modal.formConfirm({ title: status ? '修改功能' : '新增功能',
                    content: (
                    <Row className="padding-all">
                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">功能名称:</Col>
                                <Col span={16} className="line-height-3r">
                                    <Input
                                        value={status&&status!==''? itm.title: ''}
                                        placeholder="请输入项目名称"
                                        maxLength={100}
                                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                        onChange={(e,t,v)=>{ 
                                            self.setState({
                                                title: v
                                            })
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col >
                            <Row >
                            <Col span={8} className="line-height-3r text-align-right padding-right-1r">功能描述:</Col>
                            <Col span={16} className="line-height-3r">
                                <Textarea
                                    value={status&&status!==''? (itm.describe||'') :''}
                                    placeholder="请输入功能描述"
                                    maxLength={100}
                                    maxLengthShow={false}
                                    innerStyle={{'lineHeight':'2rem', 'height': '3rem'}}
                                    onChange={(value)=>{
                                        self.setState({
                                            describe: value
                                        })
                                    }}
                                />
                            </Col>
                            </Row>
                        </Col>
                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">排序权重:</Col>
                                <Col span={16} className="line-height-3r">
                                    <Input
                                        value={status? itm.weight: 99}
                                        placeholder="请输入权重越小越靠前"
                                        maxLength={2}
                                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                        onChange={(e,t,v)=>{
                                            self.setState({weight : v})
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">特殊标记:</Col>
                                <Col span={16} className="line-height-3r">
                                  <Selects value={status? itm.feature: ''} onChange={(e,t,v)=>{
                                      self.setState({feature : v.value})
                                  }} options={this.featureTypes} />
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                        <Row >
                            <Col span={8} className="line-height-3r text-align-right padding-right-1r">功能描述:</Col>
                            <Col span={16} className="line-height-3r">
                                <SelectIcon value={status? itm.projectIcon: ''}  onChange={(v)=>{
                                    self.setState({'projectIcon': v})
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
                      callback(id);
                      if(status){
                        self.modifyProjects()
                      } else{
                        self.addProjects()
                      }
                  },
                  (id, callback) => { callback(id); });
    }
    // 选择当前页面导出
    handleExport(itm){
        console.log('itm', itm);
        this.setState({
            showExportBord: true,
            pageInfo: itm
        },()=>{
            this.$$ExportBord.showModal()
        })
        // this.downProject({_id: itm._id, title: itm.title});
    }
    // 选择当前页面导入
    handleImport(itm){
        this.setState({
            showImportBord: true,
            pageInfo: itm
        }, ()=>{
            this.$$ImportBord.showModal()
        })
    }

    downAllProject(){
        this.downProject();
    }
    downProject(reqData={}){
        downLoadProject(reqData).then((res)=>{
            let blob = new Blob([res], {type: 'application/octet-stream'})
            let URL = window.URL || window.webkitURL
            let objectUrl = URL.createObjectURL(blob)
            console.log(objectUrl)
            let fileName = reqData ? `${reqData.title}.json` : 'allProjects.json';
            if (fileName) {
                var a = document.createElement('a')
                // safari doesn't support this yet
                if (typeof a.download === 'undefined') {
                    window.location = objectUrl
                } else {
                    a.href = objectUrl
                    a.download = fileName
                    this.$$projectContent.append(a)
                    a.click()
                    a.remove();
                }
            } else {
                window.location = objectUrl
            }
            console.log('res', res)
        }).catch(()=>{

        })
        // let a = document.createElement('a');
        // a.download = 'allProjects.json';
        // a.href = 'candy_api/project/downLoadProject';
        // this.$$projectContent.append(a);
        // a.click()
    }
    
    logOut(){
        this.setState({
            showResetModal:false,
          })
        Modal.formConfirm({ title: '提示',
        content: '是否确认退出？',
        style: '',
        type: 'small',
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
            storage.removeAllStorage();
            sessions.removeAllStorage();
            goLink('/LoginPage')
        },
        (id, callback) => { callback(id); });
            
    }


    resetTime(value){
        let newValue = ''
        if(!value) return newValue;
        for(let i=0;i<value.length;i++){
            if(i==3) break;
            newValue = newValue + value[i] + (i<2 ? '-': '')
        }
        return newValue
    }
    render() {
        const { projectList, showImportBord, showExportBord, importParams, pageInfo, userInfo} = this.state;
        const self = this;
        return(
          <section className="bg-f5f5f5 heighth-100 overflow-auto scroller" ref={(r)=>{ this.$$projectContent = r}}>
            <Row className={"padding-left-2r margin-top-1r margin-bottom-1r padding-right-2r  font-size-12"}>
                <Col span={8} className={'cursor-pointer'} onClick={()=>{
                    hashHistory.goBack()
                }}>
                    <div className="width-4r line-height-2r margin-right-1r text-align-center border-radius-9r bg-4698F9 display-inline-block"><Icon iconName={'chevron-left '} size={'100%'} iconColor={'#fff'}  /></div>
                    功能模块（编辑模式）
                </Col>
                <Col span={9} className="text-align-right cursor-pointer" >
                    <div onClick={()=>{ this.newProgect() }} className="line-height-2r textcolor-fff padding-right-1r font-size-8 margin-right-1r text-align-center border-radius-9r bg-4698F9 display-inline-block">
                        <Icon iconName={'android-add-circle  '} size={'140%'} iconColor={'#fff'}  /> 新增功能
                    </div>
                    <div onClick={()=>{ this.downAllProject() }} className="line-height-2r textcolor-fff padding-right-1r font-size-8 margin-right-1r text-align-center border-radius-9r bg-4698F9 display-inline-block">
                        <Icon iconName={'android-add-circle  '} size={'140%'} iconColor={'#fff'}  /> 导出项目
                    </div>
                </Col>
                <Col span={7}>
                    <div className={'cursor-pointer relative'} onClick={()=>{self.logOut()}}>
                        <div className="line-height-2r padding-left-1r padding-right-1r text-align-center bg-6E9EFB margin-right-1r border-radius-9r display-inline-block textcolor-fff"><Icon iconName={'android-contact '} size={'100%'} iconColor={'#fff'}  /> {userInfo.loginName||""}</div>
                        <div className="middle-round-2 line-height-2r text-align-center bg-6E9EFB margin-right-1r border-radius-3r display-inline-block"><Icon iconName={'android-exit'} size={'100%'} iconColor={'#fff'}  /></div>
                    </div>
                </Col>
            </Row>
            <Row className="padding-left-2r padding-right-2r padding-top-1r project-height overflow-auto scroller" >
            {projectList&&projectList.length>0? projectList.map((itm, idx)=>{
                return <div key={`${idx}-pro`}  className="padding-left-1r relative padding-right-1r hover-itm bg-show border-radius-3f width-14r heighr-10 margin-right-1r margin-bottom-1r">
                <Row className="line-height-2r" >
                    <Col className="relative line-height-3r text-overflow font-size-12 textcolor-313132"> {itm.projectIcon ? <Icon iconName={itm.projectIcon} size={'130%'} iconColor={'#555'}  /> : ''} {itm.title} </Col>
                    {/* <Col className="relative text-overflow font-size-12">{itm.describe} </Col> */}
                    {/* <Col className="font-size-8 textclolor-black-low">创建时间 {itm.createTime}</Col> */}
                    <Col span={4.5} className={'cursor-pointer text-align-left'} title={'设置'} onClick={()=>{
                        self.setState({
                            name: itm.name,
                            describe: itm.describe,
                            nowProject: itm
                        },()=>{
                            self.newProgect('edit', itm)
                        })
                        
                    }}>
                        <Icon iconName={'android-settings '} size={'150%'} iconColor={'#666'}  />
                    </Col>
                                    
                    <Col span={4.5} className={'cursor-pointer text-align-left'} title={'编辑'} onClick={()=>{
                        if(itm.feature === 'Card') {
                            this.handleClick('/CardManage', {id: itm._id})
                        } else {
                            this.handleClick('/ProjectManage', {id: itm._id})
                        }
                    }}>
                        <Icon iconName={'android-create  '} size={'150%'} iconColor={'#5D8EFF'}  />
                                     
                    </Col>
                    
                    <Col span={4.5} className={'cursor-pointer text-align-left'} title={'预览'} onClick={()=>{
                        if(itm.feature === 'Card') {
                            this.handleClick('/CardView', {id: itm._id})
                        } else {
                            this.handleClick('/ProjectView', {id: itm._id})
                        }
                    }}>
                        <Icon iconName={'android-list  '} size={'150%'} iconColor={'#68CE45'}  />
                    </Col>
                    <Col span={4.5} className={'cursor-pointer text-align-left'} title={'删除'} onClick={()=>{
                        Modal.formConfirm({ title: '',
                        content: '确定删除该功能吗？',
                        style: '',
                        type: 'small',
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
                            self.projectDelete(itm)
                        },
                        (id, callback) => { callback(id); });
                        
                    }}>
                        <Icon iconName={'android-cancel '} size={'150%'} iconColor={'#ff4949'}  />
                    </Col>
                    {/* 导出功能 */}
                    <Col span={4.5} className={'cursor-pointer text-align-left'} title={'导出配置'} onClick={()=>{
                        this.handleExport(itm)
                    }}>
                        <Icon iconName={'android-download  '} size={'160%'} iconColor={'#52c418'}  />
                    </Col>
                    {/* 导入功能 */}
                    <Col span={4.5} className={'cursor-pointer text-align-left'} title={'上传配置'} onClick={()=>{
                        this.handleImport(itm)
                    }}>
                        <Icon iconName={'android-upload  '} size={'150%'} iconColor={'#2391e5'}  />
                    </Col>
                    <Col className="absolute right-0 padding-left-1r padding-right-1r text-align-right bottom-0 text-overflow font-size-8 textclolor-black-low">
                        <Row><Col span={16} className="text-align-left">{self.resetTime(itm.updateTime)}</Col>
                        <Col span={8}><span>排序: </span>
                        {itm.weight} </Col></Row>
                    </Col>
                </Row>
            </div>
            }) : <Col ></Col>} 

                <div className="padding-all-2r bg-show width-14r heighr-10 margin-right-1r hover-itm cursor-pointer" onClick={()=>{
                    this.newProgect()
                    }}>
                    <Row className="line-height-2r text-align-center " >
                        <Col span={24}>新增功能组 </Col>
                        <Col span={24}> <Icon iconName={'plus-round  '} size={'140%'} iconColor={'#4698F9'}  /></Col>
                    </Row>
                </div>
                
            </Row>
            <Row className="absolute width-100 bottom-1r">
                <Col className="text-align-center padding-left-2r textcolor-aeaeae cursor-pointer" onClick={()=>{
                    hashHistory.goBack()
                }}>
                Powered By Candys-tools
                </Col>
            </Row>
            {showImportBord ? <ImportBord pageInfo={pageInfo} ref={(r)=>{ this.$$ImportBord = r}} />: ''}
            {showExportBord ? <ExportBord downProject={(res)=>{ this.downProject(res)}} pageInfo={pageInfo} ref={(r)=>{ this.$$ExportBord = r}} />: ''}
          </section>
        );
    }
}
export default Projects;
