import React , { Component }from 'react';
import { Components, utils } from 'neo';
import EditSearch from '../../components/editSearch';
import EditUrl from '../../components/editUrl';
import EditDetail from '../../components/editDetail';
import ModifyPageView from '../modals/modifyPageView';
import EditWholeRules from '../../components/editWholeRules';

const { sessions, storage } = utils
const { Row, Col, Icon, Tab, Buttons, Scroller, Switch } = Components;
  
class ModifyPage extends Component {
    constructor(props) {
      super(props);
      let pageConfig = this.props.pageConfig || {}
      this.state = {
          confirmDirty: false,
          pageData: this.props.pageData,
          pageConfig: pageConfig,
          pageParmes: this.props.pageParmes,
          modifyUrlCondition: {}, //编辑查询url信息
          modifySearchCondition: {}, //编辑查询字段信息
          modifySaveUrlCondition: {}, //编辑保存url信息
          editCondition: [], //编辑字段信息
          wholeRules:[],
          resourceKey: '1',
          pageConfigId: pageConfig._id||null,
          confitStatus: pageConfig.status || 0,
          editConfig: {},
      };
      this.getConfig = this.getConfig.bind(this);
    }
    
    componentWillReceiveProps(nextProps){
      let pageConfig = nextProps.pageConfig || {}
      this.setState({
        pageData: nextProps.pageData,
        pageConfig: pageConfig,
        pageParmes: nextProps.pageParmes,
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
          modifyUrlCondition: pageConfig.modifyUrlCondition, //编辑查询url信息
          modifySearchCondition: pageConfig.modifySearchCondition, //编辑查询字段信息
          modifySaveUrlCondition: pageConfig.modifySaveUrlCondition, //编辑保存url信息
          editCondition: pageConfig.editCondition, //编辑字段信息
          pageConfigId: configID,
          editConfig: pageConfig.editConfig||{},
          wholeRules: pageConfig.wholeRules
        })
      } else {
        this.setState({
          modifyUrlCondition: storage.getStorage(`modifyUrlCondition-${pageData.id}`) || {},
          modifySearchCondition: storage.getStorage(`modifySearchCondition-${pageData.id}`) || [],
          modifySaveUrlCondition: storage.getStorage(`modifySaveUrlCondition-${pageData.id}`) || {},
          editCondition: storage.getStorage(`editCondition-${pageData.id}`) || [],
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
      const { editConfig } = this.state;
      let newSelectKey = editConfig;
      newSelectKey[key] = value
      this.setState({
        editConfig: newSelectKey
      })
    }

    getConfig(){
      const {editCondition, modifyUrlCondition, modifySearchCondition, modifySaveUrlCondition, pageConfigId, confitStatus, editConfig, wholeRules} = this.state;
      return {
        editCondition: editCondition, //编辑字段信息
        modifyUrlCondition: modifyUrlCondition,  //编辑查询url信息
        modifySearchCondition: modifySearchCondition, //编辑查询字段信息
        modifySaveUrlCondition: modifySaveUrlCondition, //编辑保存url信息
        pageConfigId: pageConfigId,
        confitStatus: confitStatus,
        editConfig: editConfig,
        wholeRules: wholeRules
      }
    }

    render() {
          const {editCondition, modifyUrlCondition, modifySearchCondition, modifySaveUrlCondition, pageData, resourceKey, editConfig, wholeRules} = this.state
          const self = this;

          let viewProps = Object.assign({}, this.props, {
            pageConfig: {configJson: self.getConfig()}
          })

          const tabOptions = [{ tabName: '查询URL信息', keyword: '1', content: (<EditUrl datas={modifyUrlCondition} handelChange={(res)=>{
            this.setState({
              modifyUrlCondition: res
            })
            storage.setStorage(`modifyUrlCondition-${pageData.id}`, res)
          }} />) },
          { tabName: '查询字段信息', keyword: '2', content: (<EditDetail datas={modifySearchCondition} handelChange={(res)=>{
              this.setState({
                modifySearchCondition: res
              })
              storage.setStorage(`modifySearchCondition-${pageData.id}`, res)
          }} />) },
          { tabName: '保存请求URL信息', keyword: '4', content: (<EditUrl datas={modifySaveUrlCondition} handelChange={(res)=>{
            this.setState({
              modifySaveUrlCondition: res
            })
            storage.setStorage(`modifySaveUrlCondition-${pageData.id}`, res)
          }} />) },
          { tabName: '编辑字段信息', keyword: '3', content: (<EditSearch {...self.props} datas={editCondition} handelChange={(res)=>{
              this.setState({
                editCondition: res
              })
              storage.setStorage(`editCondition-${pageData.id}`, res)
          }} />) },
          { tabName: '配置DetailPage', keyword: '5', content: (
            <Row className="bg-show padding-all font-size-9">
  
              <Col span="8" className="line-height-3r">是否开启initRequest: </Col>
              <Col span="16" className="padding-top-1r"> <Switch value={editConfig&&editConfig.enableInitRequst || false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                      self.setKey('enableInitRequst', data);
                  }} /> { editConfig&&editConfig.enableInitRequst ? '开启': '关闭'}
              </Col>
              <Col span="8" className="line-height-3r">是否展示提交按钮: </Col>
              <Col span="16" className="padding-top-1r"> <Switch value={editConfig&&editConfig.showSubmit || false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                      self.setKey('showSubmit', data);
                  }} /> { editConfig&&editConfig.showSubmit ? '显示': '隐藏'}
              </Col>
            </Row>
          ) },{ tabName: '编辑全局校验', keyword: '6', content: (<EditWholeRules {...self.props} datas={wholeRules} formItem={editCondition} handelChange={(res)=>{
            this.setState({
              wholeRules: res
            })
            storage.setStorage(`wholeRules-${pageData.id}`, res)
          }} />) }];
        return(
          <section className="bg-f5f5f5  ">
            <Row className="" >
                <Col span={15} className=" bg-show padding-bottom-1r padding-all-1 border-right border-color-f5f5f5" >
                  <Scroller style={{'height': '80vh','overflow':'auto'}} >
                    <div className="padding-top-1r">
                      <ModifyPageView {...viewProps} />
                    </div>
                  </Scroller>
                </Col>
                <Col span={9}>
                  <Tab options={tabOptions} active={resourceKey} containerStyle={{'height': '75vh','overflow':'auto'}} onChange={(v)=>{
                    this.tabChange(v);
                  }} />
                </Col>
            </Row>
          </section>
        );
    }
}
export default ModifyPage;
