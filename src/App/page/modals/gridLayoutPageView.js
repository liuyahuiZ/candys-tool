import React , { Component }from 'react';
import { utils } from 'neo';
import EditLayoutDom from '../../components/editLayoutDom';

const { storage } = utils
  
class GridLayoutPageView extends Component {
    constructor(props) {
      super(props);
      let pageConfig = this.props.pageConfig || {}
      this.state = {
          pageData: this.props.pageData,
          pageConfig: pageConfig,
          gridCondition: [],
          pageConfigId: pageConfig._id||null,
          confitStatus: pageConfig.status || 0,
          pageParmes: this.props.pageParmes||{}
      };
    }
    
    componentWillReceiveProps(nextProps){
      let pageConfig = nextProps.pageConfig || {}
      this.setState({
        pageData: nextProps.pageData,
        pageConfig: nextProps.pageConfig,
        pageConfigId: pageConfig._id||null,
        confitStatus: pageConfig.status || 0,
        pageParmes: nextProps.pageParmes||{}
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
          gridCondition: pageConfig.gridCondition||[],
          pageConfigId: configID
        })
      } else {
        this.setState({
          gridCondition: storage.getStorage(`gridCondition-${pageData.id}`) || [],
        })
      }
    }

    render() {
        const {gridCondition} = this.state
        let newTree = JSON.parse(JSON.stringify(gridCondition));
        return(
          <section className="bg-f5f5f5  ">
           <EditLayoutDom tree={newTree} noEdit={true} {...this.props} />
          </section>
        );
    }
}
export default GridLayoutPageView;
