import React , { Component }from 'react';
import { Templates } from 'neo';
import { ThemeContext } from  'context';
const { ListPage } = Templates;

class SearchListPageView extends Component {
    constructor(props) {
      super(props);
      let pageConfig = this.props.pageConfig || {}
      this.state = {
          confirmDirty: false,
          pageData: this.props.pageData,
          pageConfig: pageConfig,
          pageParmes: this.props.pageParmes,
          searchCondition: [],
          listFormat: [],
          urlCondition: {},
          buttons: [],
          listConfig: {},
          operations: [],
          batchOperations: [],
          pageConfigId: pageConfig._id||null,
      };
      this.getValue = this.getValue.bind(this);
    }
    
    componentWillReceiveProps(nextProps){
      this.setState({
        pageData: nextProps.pageData,
        pageConfig: nextProps.pageConfig,
        pageParmes: nextProps.pageParmes,
      })
      this.initPage(nextProps.pageConfig&&nextProps.pageConfig.configJson, nextProps.pageData, nextProps.pageConfig._id);
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
          searchCondition: pageConfig.searchCondition||[],
          listFormat: pageConfig.listFormat||[],
          urlCondition: pageConfig.urlCondition||{},
          buttons: pageConfig.buttons,
          operations: pageConfig.operations,
          listConfig: pageConfig.listConfig,
          batchOperations: pageConfig.batchOperations,
          pageConfigId: configID,
        })
      }
    }

    resetButton(arr){
      const self = this;
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

    getValue(){
      if(this.$$ListPageView&&this.$$ListPageView.getValue){
          return this.$$ListPageView.getValue()
      }
      
    }

    render() {
        const {searchCondition, listFormat, urlCondition, operations, buttons, listConfig, pageParmes, batchOperations } = this.state
        let newButtons = this.resetButton(buttons)
        let newOperations = this.resetButton(operations);
        let newBatchOperations = this.resetButton(batchOperations)
        const self = this;
        let pageProps = {
          searchCondition,
          searchUrl: urlCondition.url,
          method: urlCondition.method || 'POST',
          header: urlCondition.header,
          respon: urlCondition.respon || {},
          listFormat,
          buttons: newButtons,
          operations: newOperations,
          batchOperations: newBatchOperations,
          listConfig: listConfig,
          urlConfig: urlCondition,
          pageParmes: pageParmes,
          operationsFix: listConfig? listConfig.operationsFix: false,
          // operationsRule
        };
        return(
          <section className="bg-show  ">
             <ThemeContext.Consumer>
                { context => {
                return <ListPage {...pageProps} contextParames={context.parames} reRender={context.reRender} {...self.props} ref={(r)=>{ self.$$ListPageView = r }}   />
                }
              }
              </ThemeContext.Consumer>
          </section>
        );
    }
}
export default SearchListPageView;
