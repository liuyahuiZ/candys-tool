import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { hashHistory } from 'react-router';
import { getProjectInfo, getProjectPages } from '../api/index';
import { UrlSearch } from '../utils/index';
import ShowView from './modals/showView';

const { Row, Col, Icon, Item, PopModal, Carousel } = Components;
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
        isPhone: false,
      };
    }

    componentDidMount(){
        let obg = UrlSearch()
        this.getProject(obg);
        this.getProjectPage(obg);
        const cardView = this.$$cardView;
        if(cardView && cardView.offsetWidth) {
            if(cardView.offsetWidth <  800) {
                this.setState({
                    isPhone: true
                })
            }
        }
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
        const { selectTree, projectInfo, pageList, selectPage, loadingStatus, selectUrl, selectPageParmes, isPhone } = this.state;

        let defaultAction = {
            go: (e, parame, op)=>{self.goPage(e, parame, op)},
            goBack: (e)=>{self.goPage(e)},
            callback: ()=>{self.hideMoral()}
        }

        const carouselMap = pageList&&pageList.length>0? pageList.map((itm, idx)=>{
            return {tabName: itm.title, content: (<div className="card-item" key={`${idx}-itm`} >
            <ShowView pageList={pageList} parame={selectPageParmes} pagesInfo={itm} publistatus={1} defaultAction={defaultAction}  />
        </div>), isActive: false}
        }) : [];
        
        const carousDom = (<Carousel options={carouselMap} height={100} showDotsText={true} haderStyle={{bottom: '10px'}} dotDefaultStyle={{color: '#666'}} dotActiveStyle={{color: '#000'}} />);
        return(
          <section className="bg-f5f5f5 width-100 heighth-100 overflow-x-hide scroller" ref={(r) => { this.$$cardView = r; }}>
            <Row className="" justify="center"  >
                <div className="phone-container">{carousDom}</div>
            </Row>
          </section>
        );
    }
}
export default ProjectView;
