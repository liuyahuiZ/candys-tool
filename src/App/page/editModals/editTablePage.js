
import React , { Component }from 'react';
import { Components, utils } from 'neo';
import EditSearch from '../../components/editSearch';
import EditApi from '../../components/editApi';
import EditTableView from '../modals/editTableView';
import EditWholeRules from '../../components/editWholeRules';

const { sessions, storage } = utils
const { Row, Col, Icon, Tab, Buttons, Scroller, Switch, PopContainer } = Components;
class EditTablePage extends Component {
    constructor(props) {
      super(props);
      let pageConfig = this.props.pageConfig || {}
      this.state = {
          confirmDirty: false,
          pageData: this.props.pageData,
          pageConfig: pageConfig,
          editCondition: [],
          editUrlCondition: {},
          resourceKey: '1',
          pageConfigId: pageConfig._id||null,
          confitStatus: pageConfig.status || 0,
          editConfig: {},
          wholeRules: []
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
          editConfig: pageConfig.editConfig||{},
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
    setKey(key, value) {
      const { editConfig } = this.state;
      let newSelectKey = editConfig;
      newSelectKey[key] = value
      this.setState({
        editConfig: newSelectKey
      })
    }
    editOptionConfig(key='initRequest'){
      const { editConfig } = this.state;
      const self = this;
      PopContainer.confirm({
          content: (<Row justify="center">
              <Col className="line-height-3r font-size-12 padding-left-1r border-bottom border-color-f5f5f5">
              <Row>
                  <Col span={20}>配置选项接口</Col>
                  <Col span={4} className="text-align-right cursor-pointer" onClick={()=>{PopContainer.closeAll()}}>
                  <Icon iconName={'android-cancel '} size={'140%'} iconColor={'#666'}  /></Col>
              </Row>
              </Col>
              <Col span={18} className="padding-top-1r overflow-y-scroll heighth-45">
                  <EditApi datas={editConfig[key]} handelChange={(res)=>{
                      self.setKey(key, res)
                      PopContainer.closeAll()
                  }} />
              </Col>
            </Row>
            ),
          type: 'top',
          containerStyle: { top: '5rem'},
          },
          (id, callback) => { 
          callback(id);
          },
          (id, callback) => { callback(id); });
    }
    getConfig(){
      const {editCondition, editUrlCondition, pageConfigId, confitStatus, editConfig, wholeRules} = this.state;
      return {
        editCondition: editCondition,
        editUrlCondition: editUrlCondition,
        pageConfigId: pageConfigId,
        editConfig:editConfig,
        confitStatus: confitStatus,
        wholeRules: wholeRules
      }
    }

    render() {
          const {editCondition, editUrlCondition, pageData,  resourceKey, editConfig, wholeRules} = this.state
          const self = this;
          const tabOptions = [{ tabName: '编辑URL信息', keyword: '1', content: (<EditApi datas={editUrlCondition} handelChange={(res)=>{
            self.setState({
              editUrlCondition: res
            })
            storage.setStorage(`editUrlCondition-${pageData.id}`, res)
          }} />) },
            { tabName: '编辑字段信息', keyword: '2', content: (<EditSearch datas={editCondition} handelChange={(res)=>{
              self.setState({
                editCondition: res
              })
              storage.setStorage(`editCondition-${pageData.id}`, res)
          }} />) },
          { tabName: '编辑全局校验', keyword: '3', content: (<EditWholeRules {...self.props} datas={wholeRules} formItem={editCondition} handelChange={(res)=>{
            this.setState({
              wholeRules: res
            })
            storage.setStorage(`wholeRules-${pageData.id}`, res)
          }} />) },
          { tabName: '配置EditTabel', keyword: '6', content: (
            <Row className="bg-show padding-all font-size-9">
             
              <Col span="8" className="line-height-3r">是否开启checkBox: </Col>
              <Col span="16" className="padding-top-1r"> <Switch value={editConfig&&editConfig.showCheckBox || false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                      self.setKey('showCheckBox', data);
                  }} /> { editConfig&&editConfig.showCheckBox ? '显示': '关闭'}
              </Col>
              <Col span="8" className="line-height-3r">是否开启分页: </Col>
              <Col span="16" className="padding-top-1r"> <Switch value={editConfig&&editConfig.showPage || false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                      self.setKey('showPage', data);
                  }} /> { editConfig&&editConfig.showPage ? '开启': '关闭'}
              </Col>
              
              <Col span="8" className="line-height-3r">是否开启initRequest: </Col>
              <Col span="16" className="padding-top-1r"> <Switch value={editConfig&&editConfig.enableInitRequst || false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                      self.setKey('enableInitRequst', data);
                  }} /> { editConfig&&editConfig.enableInitRequst ? '开启': '关闭'}
              </Col>
              
              <Col span="8" className="line-height-3r">操作栏是否固定: </Col>
              <Col span="16" className="padding-top-1r"> <Switch value={editConfig&&editConfig.operationsFix || false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                      self.setKey('operationsFix', data);
                  }} /> { editConfig&&editConfig.operationsFix ? '固定': '不固定'}
              </Col>
              <Col span={8} className="line-height-3r">表头动态获取: </Col>
              <Col span={16} className="padding-top-1r"><Switch value={editConfig&&editConfig.hasHeaderRequest} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                  self.setKey('hasHeaderRequest', date)
              }} /> { editConfig&&editConfig.hasHeaderRequest ? '开启': '关闭'}
              </Col>
              {editConfig.hasHeaderRequest ? <Col className="margin-top-3"><Row>
                  <Col span={8}>配置参数：</Col>
                  <Col span={16} className="text-align-left"><Buttons
                      text={<div><Icon iconName={'android-add-circle '} size={'150%'} iconColor={'#fff'}  /> 点击配置</div>}
                      type={'primary'}
                      size={'small'}
                      style={{color:'#fff', borderRadius: '3rem'}}
                      onClick={()=>{
                          self.editOptionConfig('headerRequest')
                      }}
                  /></Col>
              </Row></Col> : ''}
            </Row>
          ) },];

          let viewProps = Object.assign({}, this.props, {
            pageConfig: {configJson: self.getConfig()},
          })
        return(
          <section className="bg-f5f5f5  ">
            <Row className="" >
                <Col span={15} className="padding-all-1 bg-show padding-bottom-1r border-right border-color-f5f5f5" >
                  <Scroller style={{'height': '80vh','overflow':'auto'}} >
                    <div className="padding-top-1r" >
                    <EditTableView {...viewProps} />
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
export default EditTablePage;
