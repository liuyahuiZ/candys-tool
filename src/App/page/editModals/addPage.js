import React , { Component }from 'react';
import { Components, utils } from 'neo';
import EditSearch from '../../components/editSearch';
import EditUrl from '../../components/editUrl';
import AddPageView from '../modals/addPageView';
import EditFuncModal from '../../components/editFuncModal';
import EditWholeRules from '../../components/editWholeRules';

const { sessions, storage } = utils
const { Row, Col, Icon, Tab, Switch, Scroller } = Components;
class AddPage extends Component {
    constructor(props) {
      super(props);
      let pageConfig = this.props.pageConfig || {}
      this.state = {
          confirmDirty: false,
          pageData: this.props.pageData,
          pageConfig: pageConfig,
          initUrlInfo: {},
          editCondition: [],
          editFuction: [],
          wholeRules: [],
          resourceKey: '1',
          pageConfigId: pageConfig._id||null,
          confitStatus: pageConfig.status || 0,
          pageSetting: {}
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
        wholeRules: pageConfig.wholeRules
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
          initUrlInfo: pageConfig.initUrlInfo,
          editCondition: pageConfig.editCondition,
          editFuction: pageConfig.editFuction||[],
          pageConfigId: configID,
          pageSetting: pageConfig.pageSetting || {},
          wholeRules: pageConfig.wholeRules
        })
      } else {
        this.setState({
          editCondition: storage.getStorage(`editCondition-${pageData.id}`) || [],
          editFuction: storage.getStorage(`editFuction-${pageData.id}`) || {},
        })
      }
    }

    tabChange(v){
      const self = this;
      self.setState({
        'resourceKey': v
      });
    }

    setKey(key, value) {
      const { pageSetting } = this.state;
      let newSelectKey = pageSetting;
      newSelectKey[key] = value
      this.setState({
        pageSetting: newSelectKey
      })
    }

    getConfig(){
      const {initUrlInfo, editCondition, editFuction, pageConfigId, confitStatus, pageSetting, wholeRules} = this.state;
      return {
        initUrlInfo: initUrlInfo,
        editCondition: editCondition,
        editFuction: editFuction,
        pageConfigId: pageConfigId,
        confitStatus: confitStatus,
        pageSetting: pageSetting,
        wholeRules: wholeRules
      }
    }

    render() {
          const {initUrlInfo, editCondition, editFuction, pageData, resourceKey, pageSetting, wholeRules} = this.state
          const self = this;
          const tabOptions = [
            { tabName: 'init请求接口信息', keyword: '3', content: (<EditUrl {...self.props} datas={initUrlInfo} handelChange={(res)=>{
              this.setState({
                initUrlInfo: res
              })
              storage.setStorage(`initUrlInfo-${pageData.id}`, res)
          }} />) }, { tabName: '编辑字段信息', keyword: '2', content: (<EditSearch {...self.props} datas={editCondition} handelChange={(res)=>{
              this.setState({
                editCondition: res
              })
              storage.setStorage(`editCondition-${pageData.id}`, res)
          }} />) },{ tabName: '编辑全局校验', keyword: '5', content: (<EditWholeRules {...self.props} datas={wholeRules} formItem={editCondition} handelChange={(res)=>{
            this.setState({
              wholeRules: res
            })
            storage.setStorage(`wholeRules-${pageData.id}`, res)
          }} />) },{ tabName: '编辑按钮', keyword: '1', content: (<EditFuncModal datas={editFuction} {...self.props} handelChange={(res)=>{
            this.setState({
              editFuction: res
            })
            storage.setStorage(`editFuction-${pageData.id}`, res)
          }} />) },{ tabName: '配置listTabel', keyword: '4', content: (
            <Row className="bg-show padding-all font-size-9">
              <Col span="8" className="line-height-3r">label是否换行: </Col>
              <Col span="16" className="padding-top-1r"> <Switch value={pageSetting&&pageSetting.wordBreak }  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                  self.setKey('wordBreak', data);
              }} /> { pageSetting&&pageSetting.wordBreak ? '换行': '不换行'}
              </Col>
            </Row>
          ) }];

          let viewProps = Object.assign({}, this.props, {
            pageConfig: {configJson: self.getConfig()},
          })
        return(
          <section className="bg-f5f5f5  ">
            <Row className="" >
                <Col span={15} className="padding-all-1 bg-show padding-bottom-1r border-right border-color-f5f5f5" >
                  <Scroller style={{'height': '80vh','overflow':'auto'}} >
                    <div className="padding-top-1r" >
                    <AddPageView {...viewProps} />
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
export default AddPage;
