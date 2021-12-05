
import React , { Component }from 'react';
import { Components, utils } from 'neo';
import EditSearch from '../../components/editSearch';
import EditUrl from '../../components/editUrl';
import EditWholeRules from '../../components/editWholeRules';
import EditPageView from '../modals/editPageView';

const { sessions, storage } = utils
const { Row, Col, Icon, Tab, Buttons, Scroller } = Components;
class EditPage extends Component {
    constructor(props) {
      super(props);
      let pageConfig = this.props.pageConfig || {}
      this.state = {
          confirmDirty: false,
          pageData: this.props.pageData,
          pageConfig: pageConfig,
          editCondition: [],
          editUrlCondition: {},
          wholeRules: [],
          resourceKey: '1',
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
          editCondition: pageConfig.editCondition,
          editUrlCondition: pageConfig.editUrlCondition,
          pageConfigId: configID,
          wholeRules: pageConfig.wholeRules
        })
      } else {
        this.setState({
          editCondition: storage.getStorage(`editCondition-${pageData.id}`) || [],
          editUrlCondition: storage.getStorage(`editUrlCondition-${pageData.id}`) || {},
        })
      }
    }

    tabChange(v){
      const self = this;
      self.setState({
        'resourceKey': v
      });
    }

    getConfig(){
      const {editCondition, editUrlCondition, pageConfigId, confitStatus, wholeRules} = this.state;
      return {
        editCondition: editCondition,
        editUrlCondition: editUrlCondition,
        pageConfigId: pageConfigId,
        confitStatus: confitStatus,
        wholeRules: wholeRules
      }
    }

    render() {
          const {editCondition, editUrlCondition, pageData, resourceKey, wholeRules} = this.state
          const self = this;
          const tabOptions = [{ tabName: '编辑URL信息', keyword: '1', content: (<EditUrl datas={editUrlCondition} handelChange={(res)=>{
            this.setState({
              editUrlCondition: res
            })
            storage.setStorage(`editUrlCondition-${pageData.id}`, res)
          }} />) },
            { tabName: '编辑字段信息', keyword: '2', content: (<EditSearch {...self.props} datas={editCondition} handelChange={(res)=>{
              this.setState({
                editCondition: res
              })
              storage.setStorage(`editCondition-${pageData.id}`, res)
          }} />) },
          { tabName: '编辑全局校验', keyword: '3', content: (<EditWholeRules {...self.props} datas={wholeRules} formItem={editCondition} handelChange={(res)=>{
            this.setState({
              wholeRules: res
            })
            storage.setStorage(`wholeRules-${pageData.id}`, res)
          }} />) }];

          let viewProps = Object.assign({}, this.props, {
            pageConfig: {configJson: self.getConfig()},
          })
        return(
          <section className="bg-f5f5f5  ">
            <Row className="" >
                <Col span={15} className="padding-all-1 bg-show padding-bottom-1r border-right border-color-f5f5f5" >
                  <Scroller style={{'height': '80vh','overflow':'auto'}} >
                    <div className="padding-top-1r" >
                    <EditPageView {...viewProps} />
                    </div>
                  </Scroller>
                </Col>
                <Col span={9} >
                  <Tab options={tabOptions} active={resourceKey} containerStyle={{'height': '75vh','overflow':'auto'}} onChange={(v)=>{
                    this.tabChange(v);
                  }} />
                </Col>
            </Row>
          </section>
        );
    }
}
export default EditPage;
