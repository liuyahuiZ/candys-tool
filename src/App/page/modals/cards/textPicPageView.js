import React , { Component }from 'react';
import { Cards } from 'neo';
import { ThemeContext } from  'context';
const { TextPic } = Cards;
  
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
          pageConfigId: configID,
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
        const {detailCondition, pageParmes, detailUrlCondition} = this.state
        let pageProps = {
          itmsConfig: detailCondition,
          cardBgConfig: detailUrlCondition,
          pageParmes: pageParmes,
          respData: null,
          callback: this.props.callback,
        };
        return(
          <>
            <ThemeContext.Consumer>
                { context => { 
                  return (
                <TextPic {...pageProps} reRender={context.reRender} contextParames={context.parames} ref={(r)=>{this.$$DetailView = r}} />)
                }
              }
              </ThemeContext.Consumer>
          </>
        );
    }
}
export default DetailPageView;
