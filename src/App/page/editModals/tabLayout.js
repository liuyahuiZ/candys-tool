import React , { Component }from 'react';
import { Components, utils } from 'neo';
import EditTab from '../../components/editTab';
import TabLayoutPageView from '../modals/tabLayoutPageView';

const { sessions, storage } = utils
const { Row, Col, Icon, Tab, Buttons } = Components;
  
class TabLayout extends Component {
    constructor(props) {
      super(props);
      let pageConfig = this.props.pageConfig || {}
      this.state = {
          confirmDirty: false,
          pageData: this.props.pageData,
          pageConfig: pageConfig,
          tabCondition: [],
          resourceKey: '2',
          funcResourceKey: '1',
          pageConfigId: pageConfig._id||null,
          confitStatus: pageConfig.status || 0,
      };
      this.getConfig = this.getConfig.bind(this);
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

    funTabChange(v){
      const self = this;
      self.setState({
        'funcResourceKey': v
      });
    }

    getConfig(){
      const {tabCondition, pageConfigId, confitStatus} = this.state;
      return {
        tabCondition: tabCondition,
        pageConfigId: pageConfigId,
        confitStatus: confitStatus
      }
    }

    render() {
        const {tabCondition, pageData, funcResourceKey} = this.state
        const self = this;
        const tabOptions = [
          { tabName: '编辑字段信息', keyword: '1', content: (<EditTab datas={tabCondition} {...self.props} handelChange={(res)=>{
            this.setState({
              tabCondition: res
            })
            storage.setStorage(`tabCondition-${pageData.id}`, res)
        }} />) }];


        let viewProps = Object.assign({}, this.props, {
          pageConfig: {configJson: this.getConfig()}
        })

        return(
          <section className="bg-f5f5f5  ">
            <Row className="" >
                <Col span={15} className="bg-show padding-bottom-1r border-right border-color-f5f5f5" >
                  <Row>
                    <Col className="padding-top-1r">
                      <TabLayoutPageView {...viewProps} />
                    </Col>
                  </Row>
                </Col>
                <Col span={9}>
                  <Tab options={tabOptions} active={funcResourceKey} onChange={(v)=>{
                    this.funTabChange(v);
                  }} />
                </Col>
            </Row>
          </section>
        );
    }
}
export default TabLayout;
