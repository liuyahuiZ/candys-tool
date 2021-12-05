import React , { Component }from 'react';
import { Templates } from 'neo';
import { ThemeContext } from  'context';
const { DetailPage } = Templates;
  
class DetailPageView extends Component {
    constructor(props) {
      super(props);
      let pageConfig = this.props.pageConfig || {}
      this.state = {
          confirmDirty: false,
          pageData: this.props.pageData,
          pageConfig: pageConfig,
          pageParmes: this.props.pageParmes,
          detailCondition:  [],
          detailSearchCondition:  [],
          detailFuction: [],
          detailUrlCondition: {},
          editConfig: {},
          pageConfigId: pageConfig._id||null
      };
      this.getValue = this.getValue.bind(this);
    }
    componentWillReceiveProps(nextProps){
      let pageConfig = nextProps.pageConfig || {}
      this.setState({
        pageData: nextProps.pageData,
        pageConfig: nextProps.pageConfig,
        pageParmes: nextProps.pageParmes,
        pageConfigId: pageConfig._id||null,
      })
      this.initPage(pageConfig.configJson, nextProps.pageData, pageConfig._id);
    }
    
    componentDidMount(){
      this.initPage(this.state.pageConfig.configJson, this.state.pageData, this.state.pageConfigId);
    }

    getValue(){
      if(this.$$DetailView&&this.$$DetailView.getValue){
          return this.$$DetailView.getValue()
      }
      
    }

    initPage(pageConfig, pageData, configID){
      if(pageConfig&&JSON.stringify(pageConfig)!=='{}'){
        if(typeof pageConfig == 'string') {
          pageConfig = JSON.parse(pageConfig);
        }
        this.setState({
          detailCondition: pageConfig.detailCondition,
          detailUrlCondition: pageConfig.detailUrlCondition,
          detailSearchCondition:  pageConfig.detailSearchCondition,
          detailFuction: pageConfig.detailFuction,
          pageConfigId: configID,
          editConfig: pageConfig.editConfig,
        })
      }
    }
    resetButton(arr){
      if(arr&&arr.length!=0){
        let newArr = JSON.parse(JSON.stringify(arr));
        for(let i =0; i< newArr.length;i++){
          newArr[i].func = (rowIdx, items, op)=>{
            this.props.go(op.actionName, items, op)
          }
        }
        return newArr;
      }
      return null;
    }

    render() {
        const {detailCondition,detailFuction, detailSearchCondition, pageParmes, detailUrlCondition, editConfig} = this.state
        let newDetailFuction = this.resetButton(detailFuction);
        let pageProps = {
          detailList: detailCondition,
          urlInfo: detailUrlCondition,
          searchCondition: detailSearchCondition,
          pageParmes: pageParmes,
          funcButton: newDetailFuction,
          respData: null,
          callback: this.props.callback,
          editConfig: editConfig
        };
        if(!(pageProps.detailList&&pageProps.detailList.length>0)) return '';
        return(
          <section className="bg-show  ">
            <ThemeContext.Consumer>
                { context => { 
                  return (
                <DetailPage {...pageProps} reRender={context.reRender} contextParames={context.parames} ref={(r)=>{this.$$DetailView = r}} />)
                }
              }
              </ThemeContext.Consumer>
          </section>
        );
    }
}
export default DetailPageView;
