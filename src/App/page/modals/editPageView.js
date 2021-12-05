import React , { Component }from 'react';
import { Components, Templates } from 'neo';
import ShowView from './showView';

const { Row } = Components;
const { EditPage } = Templates;
  
class EditPageView extends Component {
    constructor(props) {
      super(props);
      let pageConfig = this.props.pageConfig || {}
      this.state = {
          confirmDirty: false,
          pageData: this.props.pageData,
          pageConfig: pageConfig,
          editCondition: [],
          editUrlCondition: {},
          editConfig: {},
          wholeRules:[],
          pageConfigId: pageConfig._id||null
      };
    }

    componentWillReceiveProps(nextProps){
      let pageConfig = nextProps.pageConfig || {}
      this.setState({
        pageData: nextProps.pageData,
        pageConfig: nextProps.pageConfig,
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
          editCondition: pageConfig.editCondition,
          editUrlCondition: pageConfig.editUrlCondition,
          editConfig: pageConfig.editConfig||{},
          wholeRules: pageConfig.wholeRules||[],
          pageConfigId: configID
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
      let parame = itm.value ? itm.value : {};
      return (<ShowView isModal={true} parame={parame}  pageList={pageList} publistatus={1} pagesInfo={pages} defaultAction={defaultAction} valueBack={valueBack} ref={(r) => { if(itm.key) s[`$$${itm.key}`] = r; }} />)
    }
    render() {
        const {editCondition, editUrlCondition, editConfig, wholeRules} = this.state
        let pageProps = {
          editItemList: editCondition,
          urlInfo: editUrlCondition,
          editConfig: editConfig,
          callback: this.props.callback,
          wholeRules: wholeRules,
          getPages: (page, valueBack, self)=>{ return this.getPages(page, valueBack, self)}
        };
        return (
          <section className="bg-show">
            <Row className="width-100">
            <EditPage {...pageProps} ref={(r)=>{this.$$Edit = r}} />
            </Row>
          </section>
        );
    }
}
export default EditPageView;
