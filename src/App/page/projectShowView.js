import React , { Component }from 'react';
import { Components } from 'neo';
import { hashHistory } from 'react-router';
import ShowView from './modals/showView';
import { ListContext } from  'context';

const { Row, Col, Icon, Item, PopModal, LoadText } = Components;
class ProjectShowView extends Component {
    constructor(props) {
      super(props);
      this.state = {
        projectInfo: this.props.projectInfo||{},
        pageList: [],
        selectTree: '',
        selectUrl: '',
        selectPage: '',
        selectPageParmes: {},
        loadingStatus: 'LOADING', //'LOADING', 'LOADED'
        pageId:  this.props.pageId || '',
        pageInfo: this.props.pageInfo,
        allPagse: this.props.allPagse,
        refresh: 'init', // init , shuldRender noRender
      };
    }

    componentDidMount(){
        this.changePage(this.state.pageInfo)
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            pageId: nextProps.pageId,
            pageInfo: nextProps.pageInfo,
            allPagse: nextProps.allPagse,
            projectInfo: nextProps.projectInfo,
            loadingStatus: nextProps.pageId ? 'SUCCESS' : 'NODATA'
        }, ()=>{
            this.changePage(nextProps.pageInfo)
        })
    }

    
    
    handleClick(link) {
        if(link) {
            hashHistory.push(link);
        }
    }

    changePage(page){
        const { allPagse } = this.state;
        if(page&&page.templateId&&page.url){
            let father = this.loopAndFindFather(allPagse, page.url)
            this.setState({
                selectTree: page.templateId,
                selectPage: page,
                selectUrl: page.url,
                pageList: father
            })
        }
    }

    loopAndFindOne(data, name){
        let result = '';
        for(let i=0;i<data.length;i++){
            if(data[i].url == name){
                result = data[i];
                break
            }
            if(result==''&&data[i].children){
                result = this.loopAndFindOne(data[i].children, name)
            }
        }
        
        return result
    } 
    
    loopAndFindFather(data, name){
        let result = '';
        for(let i=0;i<data.length;i++){
            if(data[i].url == name){
                result = data;
                break
            }
            if(result==''&&data[i].children){
                result = this.loopAndFindFather(data[i].children, name)
            }
        }
        
        return result
    } 

    // button 跳转
    goPage(pageName, parmes, op){
        const { allPagse } = this.state;
        const self = this;

        let result = self.loopAndFindOne(allPagse, pageName)
        let father = self.loopAndFindFather(allPagse, pageName)
        if(result!==''){
            if(op.linkModal===true){
                self.showModal(father, result, parmes, op.type, op.parentData)
            }else {
                this.setState({
                    selectTree: result.templateId,
                    selectPage: result,
                    selectUrl: result.url,
                    selectPageParmes: parmes,
                    pageList: father
                })
            }
        }
    }

    showModal(pageList, pages, parame, type, parentData){
        const self = this;
        const { refresh } = this.state
        let defaultAction = {
            go: (e, parame, op)=>{self.goPage(e, parame, op)},
            goBack: (e)=>{self.goPage(e)},
            callback: ()=>{self.hideMoral()}
        }
        PopModal.confirm({
            content: (<ListContext.Provider 
            value={{
                reRender: refresh,
                refreshCall: (res)=>{ 
                    self.setState({
                        refresh: 'shuldRender'
                    })
                    // console.log('refreshCall.Provider', res)
                }
            }}
          ><ShowView pageList={pageList} parame={parame} parentData={parentData} isModal={true} pagesInfo={pages} publistatus={1}   defaultAction={defaultAction} />
          </ListContext.Provider >),
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
        const { selectTree, projectInfo, pageList, selectPage, loadingStatus, selectPageParmes, refresh } = this.state;

        let defaultAction = {
            go: (e, parame, op)=>{self.goPage(e, parame, op)},
            goBack: (e)=>{self.goPage(e)},
            callback: ()=>{self.hideMoral()}
        }
        return(
          <section className="bg-F5F6FA width-100 minheight-90  overflow-x-hide">
            <Row className="padding-top-1fr padding-left-1fr padding-right-1fr padding-bottom-1fr">
                <Col span={24} className="bg-show overflow-y-scroll border-radius-9">
                    {selectPage&&selectPage.id=="dashBord" ? '' :<Row className="padding-left-1fr bg-show line-height-3r" jusity={"flex-start"}>
                        <div className="">{projectInfo.title} {selectPage!==''? `/ ${selectPage.title}`: ''}</div>
                    </Row>}
                    <Row className="bg-show padding-left-1fr padding-right-1fr padding-bottom-1r">
                    {selectTree  ? <Col className="">
                        <ShowView pageList={pageList} pagesInfo={selectPage} parame={selectPageParmes} publistatus={1} defaultAction={defaultAction}  refresh={refresh} />
                        </Col>:  <Col className="width-100">
                            <LoadText loadStatus={loadingStatus}  />
                        </Col>}
                    </Row>
                </Col>
            </Row>

          </section>
        );
    }
}
export default ProjectShowView;
