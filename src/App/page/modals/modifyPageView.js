import React , { Component }from 'react';
import { Templates, utils } from 'neo';
import ShowView from './showView';
const { storage } = utils
const { ModifyPage } = Templates;
import { ThemeContext } from  'context';

class ModifyPageView extends Component {
    constructor(props) {
      super(props);
      let pageConfig = this.props.pageConfig || {}
      this.state = {
          confirmDirty: false,
          pageData: this.props.pageData,
          pageConfig: pageConfig,
          pageParmes: this.props.pageParmes,
          modifyUrlCondition: {}, //编辑查询url信息
          modifySearchCondition: {}, //编辑查询字段信息
          modifySaveUrlCondition: {}, //编辑保存url信息
          editCondition: [], //编辑字段信息
          resourceKey: '1',
          pageConfigId: pageConfig._id||null,
          confitStatus: pageConfig.status || 0,
          editConfig: pageConfig.editConfig,
      };
      this.getValue = this.getValue.bind(this);
    }
    
    componentWillReceiveProps(nextProps){
      let pageConfig = nextProps.pageConfig || {}
      this.setState({
        pageData: nextProps.pageData,
        pageConfig: pageConfig,
        pageParmes: nextProps.pageParmes,
      })
      this.initPage(pageConfig.configJson, nextProps.pageData, pageConfig._id);
    }
    
    componentDidMount(){
      this.initPage(this.state.pageConfig.configJson, this.state.pageData, this.state.pageConfigId);
    }

    getValue(){
      if(this.$$ModifyPageView&&this.$$ModifyPageView.getValue){
          return this.$$ModifyPageView.getValue()
      }
    }
    initPage(pageConfig, pageData, configID){
      if(pageConfig&&JSON.stringify(pageConfig)!=='{}'){
        if(typeof pageConfig == 'string') {
          pageConfig = JSON.parse(pageConfig);
        }
        this.setState({
          modifyUrlCondition: pageConfig.modifyUrlCondition, //编辑查询url信息
          modifySearchCondition: pageConfig.modifySearchCondition, //编辑查询字段信息
          modifySaveUrlCondition: pageConfig.modifySaveUrlCondition, //编辑保存url信息
          editCondition: pageConfig.editCondition, //编辑字段信息
          pageConfigId: configID,
          editConfig: pageConfig.editConfig,
        })
      } else {
        this.setState({
          modifyUrlCondition: storage.getStorage(`modifyUrlCondition-${pageData.id}`) || {},
          modifySearchCondition: storage.getStorage(`modifySearchCondition-${pageData.id}`) || [],
          modifySaveUrlCondition: storage.getStorage(`modifySaveUrlCondition-${pageData.id}`) || {},
          editCondition: storage.getStorage(`editCondition-${pageData.id}`) || [],
        })
      }
    }

    getPages(itm, valueBack, s){
      const { pageList, defaultAction } = this.props;
      let pages = {}
      for(let i=0;i<pageList.length;i++){
          // 当前页面打开弹出页
          if(pageList[i].url == itm.actionName){
            pages = pageList[i]
          }
      }
      let parame = itm.value ? itm.value : {}
      
      return (<ShowView isModal={true} parame={parame} pageList={pageList} publistatus={1} pagesInfo={pages} defaultAction={defaultAction} valueBack={valueBack} ref={(r) => { if(itm.key) s[`$$${itm.key}`] = r; }} />)
    }

    render() {
          const {editCondition, modifyUrlCondition, modifySearchCondition, modifySaveUrlCondition, pageParmes, editConfig} = this.state
          let pageProps = {
            searchUrlCondition: modifyUrlCondition,
            searchCondition: modifySearchCondition,
            urlInfo: modifySaveUrlCondition,
            editItemList: editCondition,
            pageParmes: pageParmes,
            callback: this.props.callback,
            editConfig: editConfig,
            getPages: (page, valueBack, self)=>{ return this.getPages(page, valueBack, self)}
          };
        if(!(pageProps.editItemList&&pageProps.editItemList.length>0)) return '';
        return(
          <section className="bg-show padding-top-1r">
            <ThemeContext.Consumer>
                { context => { 
                  return (<ModifyPage {...pageProps} reRender={context.reRender} contextParames={context.parames} ref={(r)=>{this.$$ModifyPageView = r}} />)
                }}
              </ThemeContext.Consumer>
          </section>
        );
    }
}
export default ModifyPageView;
