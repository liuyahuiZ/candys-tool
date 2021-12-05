import React , { Component }from 'react';
import { Components, Templates } from 'neo';
import ShowView from './showView';
import { ThemeContext } from  'context';
const { Row } = Components;
const { AddPage } = Templates;
  
class AddPageView extends Component {
    constructor(props) {
      super(props);
      let pageConfig = this.props.pageConfig || {}
      this.state = {
          confirmDirty: false,
          pageData: this.props.pageData,
          pageConfig: pageConfig,
          initUrlInfo: {},
          editCondition: [],
          wholeRules: [],
          editFuction: {},
          pageConfigId: pageConfig._id||null,
          pageSetting: {}
      };
      this.getValue = this.getValue.bind(this);
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
    getValue(){
      if(this.$$AddView&&this.$$AddView.getValue){
          return this.$$AddView.getValue()
      }
      
    }
    initPage(pageConfig, pageData, configID){
      if(pageConfig&&JSON.stringify(pageConfig)!=='{}'){
        if(typeof pageConfig == 'string') {
          pageConfig = JSON.parse(pageConfig);
        }
        this.setState({
          initUrlInfo: pageConfig.initUrlInfo,
          editCondition: pageConfig.editCondition,
          editFuction: pageConfig.editFuction,
          pageConfigId: configID,
          pageSetting: pageConfig.pageSetting||{},
          wholeRules: pageConfig.wholeRules||[],
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

    resetButton(arr){
      const self = this
      if(arr&&arr.length!=0){
        let newArr = JSON.parse(JSON.stringify(arr));
        for(let i =0; i< newArr.length;i++){
          newArr[i].func = (rowIdx, items, op)=>{
            self.props.go(op.actionName, items, op)
          }
        }
        return newArr;
      }
      return null;
    }
    render() {
        const {initUrlInfo, editCondition, editFuction, pageData, pageSetting, wholeRules} = this.state
        const self = this;
        let newEditFuction = this.resetButton(editFuction);
        let pageProps = {
          initUrlInfo: initUrlInfo,
          editItemList: editCondition,
          funcButton: newEditFuction,
          callback: this.props.callback,
          pageData: pageData,
          pageSetting: pageSetting,
          wholeRules: wholeRules,
          getPages: (page, valueBack, s)=>{ return this.getPages(page, valueBack, s)}
        };
        return (
          <section className="bg-show">
            <Row className="width-100">
            <ThemeContext.Consumer>
                { context => {
                  return <AddPage {...this.props} {...pageProps} ref={(r)=>{ self.$$AddView = r }} contextParames={context.parames} />
              }
            }
            </ThemeContext.Consumer>
            </Row>
          </section>
        );
    }
}
export default AddPageView;
