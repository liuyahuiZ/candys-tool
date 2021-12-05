import React , { Component }from 'react';
import { Components, utils } from 'neo';
import ShowView from './showView';

const { storage } = utils
const { Tab } = Components;
  
class TabLayoutPageView extends Component {
    constructor(props) {
      super(props);
      let pageConfig = this.props.pageConfig || {}
      this.state = {
          confirmDirty: false,
          pageData: this.props.pageData,
          pageConfig: pageConfig,
          tabCondition: [],
          resourceKey: '2',
          pageConfigId: pageConfig._id||null,
          confitStatus: pageConfig.status || 0,
      };
    }
    
    componentWillReceiveProps(nextProps){
      let pageConfig = nextProps.pageConfig || {}
      this.setState({
        pageData: nextProps.pageData,
        pageConfig: nextProps.pageConfig,
        pageConfigId: pageConfig._id||null,
        confitStatus: pageConfig.status || 0,
      })
      this.initPage(pageConfig.configJson, nextProps.pageData, pageConfig._id);
    }
    
    componentDidMount(){
      this.initPage(this.state.pageConfig.configJson, this.state.pageData, this.state.pageConfigId);
    }
    
    initPage(pageConfig, pageData, configID){
      if(pageConfig&&JSON.stringify(pageConfig)!=='{}'){
        if(typeof pageConfig == 'string') {
          pageConfig = JSON.parse(pageConfig);
        }
        this.setState({
          tabCondition: pageConfig.tabCondition||[],
          pageConfigId: configID
        })
      } else {
        this.setState({
          tabCondition: storage.getStorage(`tabCondition-${pageData.id}`) || [],
        })
      }
    }

    tabChange(v){
      const self = this;
      self.setState({
        'resourceKey': v
      });
    }


    getPages(itm){
      const { pageList, defaultAction } = this.props;
      let pages = {}
      for(let i=0;i<pageList.length;i++){
          // 当前页面打开弹出页
          if(pageList[i].url == itm.actionName){
            pages = pageList[i]
          }
      }
      return (<ShowView isModal={true} pageList={pageList} publistatus={1} pagesInfo={pages} defaultAction={defaultAction} />)
    }

    resetOptions(tabCondition){
      let newArr = []
      for(let i=0;i<tabCondition.length;i++){
        newArr.push({
          tabName: tabCondition[i].text,
          keyword: tabCondition[i].key,
          content: this.getPages(tabCondition[i]),
        })
      }
      return newArr;
    }

    render() {
        const { tabCondition, resourceKey } = this.state
        
        let newTabCondition = this.resetOptions(tabCondition)
        return(
          <section className="bg-f5f5f5  ">
            <Tab options={newTabCondition} modal="SMALLTAB" active={resourceKey} onChange={(v)=>{
                this.tabChange(v);
              }} />
          </section>
        );
    }
}
export default TabLayoutPageView;
