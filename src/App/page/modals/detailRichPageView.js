import React , { Component }from 'react';
import { Templates } from 'neo';

const { DetailRichPage } = Templates;
  
class DetailRichPageView extends Component {
    constructor(props) {
      super(props);
      let pageConfig = this.props.pageConfig || {}
      this.state = {
          confirmDirty: false,
          pageData: this.props.pageData,
          pageConfig: pageConfig,
          pageParmes: this.props.pageParmes,
          detailCondition:  [],
          detailFuction: [],
          detailUrlCondition: {},
          pageConfigId: pageConfig._id||null
      };
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

    initPage(pageConfig, pageData, configID){
      if(pageConfig&&JSON.stringify(pageConfig)!=='{}'){
        if(typeof pageConfig == 'string') {
          pageConfig = JSON.parse(pageConfig);
        }
        this.setState({
          detailCondition: pageConfig.detailCondition,
          detailUrlCondition: pageConfig.detailUrlCondition,
          detailFuction: pageConfig.detailFuction,
          pageConfigId: configID
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
        const { detailCondition,detailFuction, pageParmes, detailUrlCondition } = this.state
        let newDetailFuction = this.resetButton(detailFuction);
        let pageProps = {
          detailList: detailCondition,
          urlInfo: detailUrlCondition,
          pageParmes: pageParmes,
          funcButton: newDetailFuction,
          respData: null,
          callback: this.props.callback
        };
        return(
          <section className="bg-show  ">
            <DetailRichPage {...pageProps} />
          </section>
        );
    }
}
export default DetailRichPageView;
