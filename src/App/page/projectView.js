import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { hashHistory } from 'react-router';
import { getProjectInfo, getProjectPages } from '../api/index';
import { UrlSearch } from '../utils/index';
import ShowView from './modals/showView';

const { Row, Col, Icon, Item, PopModal } = Components;
const { sessions, storage } = utils
class ProjectView extends Component {
    constructor(props) {
      super(props);
      this.state = {
        projectInfo: {},
        pageList: [],
        selectTree: '',
        selectUrl: '',
        selectPage: '',
        selectPageParmes: {},
        loadingStatus: 'LOADING', //'LOADING', 'LOADED',
      };
    }

    componentDidMount(){
        let obg = UrlSearch()
        this.getProject(obg);
        this.getProjectPage(obg);
    }

    // 获取项目详情
    getProject(obg){
        const self = this;
        getProjectInfo({
            id: obg.id,
        }).then((res)=>{
            if(res.code=='0000'){
               self.setState({
                    projectInfo: res.data
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
        getProjectPages({
            current: 0,
            obj: {
                projectId: obg.id,
            },
            size: 10
        }).then((res)=>{
            if(res.code=='0000'){
                self.setState({
                    pageList: res.data
                })
                if(res.data.length > 0) {
                    self.initPage(res.data)
                }else{
                    self.setState({
                        pageList: [],
                        loadingStatus: 'NODATA',
                    })
                }
             } else{
                self.setState({
                    pageList: [],
                    loadingStatus: 'ERROR'
                })
                Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
             }
        }).catch(()=>{
        })
    }
    
    initPage(pageList){
        let sholdRendPage = {}
        const self = this;
        for(let i=0;i<pageList.length;i++){
            if(pageList[i].status === 1) {
                sholdRendPage = pageList[i]
            }
        }
        self.changePage(sholdRendPage)
        
    }
    
    handleClick(link) {
        if(link) {
            hashHistory.push(link);
        }
    }

    changePage(page){
        const { selectUrl } = this.state;
        if(selectUrl==page.url) return;
        this.setState({
            selectTree: page.templateId,
            selectPage: page,
            selectUrl: page.url
        })
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
                }
                
            }
        }
    }

    showModal(pageList, pages, parame, type, parentData){
        const self = this;
        let defaultAction = {
            go: (e, parame, op)=>{self.goPage(e, parame, op)},
            goBack: (e)=>{self.goPage(e)},
            callback: ()=>{self.hideMoral()}
        }
        PopModal.confirm({
            content: <ShowView pageList={pageList} parame={parame} parentData={parentData} isModal={true} pagesInfo={pages} publistatus={1}   defaultAction={defaultAction} />,
            type: type ||'middle',
            title: pages.title,
            containerStyle: { },
            },
            (id, callback) => { 
            callback(id);
            },
            (id, callback) => { callback(id); });
    }

    hideMoral(){
        PopModal.closeAll()
    }

    render() {
        const self = this;
        const { selectTree, projectInfo, pageList, selectPage, loadingStatus, selectUrl, selectPageParmes } = this.state;

        const pageListDom = pageList&&pageList.length>0 ? pageList.map((itm, idx)=>{
            if(itm.status===0) return;
            return <Item key={`${idx}-itm`} leftContent={{text: (<div className={selectUrl==itm.url  ? 'textcolor-5D8EFF cursor-pointer': 'cursor-pointer'} title={itm.title}>
                <Icon iconName={itm.describe} size={'130%'} iconColor={selectUrl==itm.url ? '#5D8EFF': ''}
            /> {itm.title}</div>)}} style={{padding: '0 0.5rem'}} 
            onClick={()=>{self.changePage(itm)}} />
        }) : <div className="text-align-center padding-all-1r">暂无数据</div>;

        let defaultAction = {
            go: (e, parame, op)=>{self.goPage(e, parame, op)},
            goBack: (e)=>{self.goPage(e)},
            callback: ()=>{self.hideMoral()}
        }
        return(
          <section className="bg-f5f5f5 width-100 heighth-100 overflow-x-hide scroller">
            {/* <Item leftContent={{text:'微信端项目'}} style={{padding: '0 0.5rem'}} /> */}
            <Row className="padding-top-1r padding-left-1r padding-right-1r" gutter={12}>
                <Col span={4} className="" colgutter={10} >
                    <Row className="padding-all-1r bg-show border-radius-3f">
                        <Col className="line-height-3r border-bottom border-color-f5f5f5 text-overflow font-size-12" onClick={()=>{hashHistory.goBack()}}>
                        <Icon iconName={'android-arrow-back '} size={'130%'}   /> 
                        <span className="padding-left-1r">页面列表</span>
                        </Col>
                        <Col >
                            {pageListDom}
                        </Col>
                    </Row>
                </Col>
                <Col span={20} className="" colgutter={10}>
                    <Row className="padding-left-1r bg-show padding-top-1r line-height-3r" jusity={"flex-start"}>
                        <div className=" ">{projectInfo.name} {selectPage!==''? `/ ${selectPage.title}`: ''}</div>
                    </Row>
                    <Row className="bg-show padding-all-1r padding-bottom-1r">
                    {selectTree  ? <Col className="">
                        <ShowView pageList={pageList} parame={selectPageParmes} pagesInfo={selectPage} publistatus={1} defaultAction={defaultAction}  />
                        </Col>:  <Col className="width-100 padding-all">{loadingStatus=='ERROR' ? '加载失败' : (loadingStatus == 'NODATA'? '暂无数据' : '加载中...')}</Col>}
                    </Row>
                </Col>
            </Row>

          </section>
        );
    }
}
export default ProjectView;
