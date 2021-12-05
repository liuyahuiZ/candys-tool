
import PropTypes from 'prop-types';
import React , { Component }from 'react';
import { Components, utils } from 'neo';
import EditSearch from '../../components/editSearch';
import EditList from '../../components/editList';
import EditUrl from '../../components/editUrl';
import Options from '../../components/options';
import EditFuncModal from '../../components/editFuncModal';
import CardsPageView from '../modals/cardsPageView';

const { sessions, storage } = utils
const { Row, Col, Icon, Tab, Buttons, Scroller, Input, Switch } = Components;
  
class CardsPage extends Component {
    constructor(props) {
      super(props);
      let pageConfig = this.props.pageConfig || {}
      this.state = {
          confirmDirty: false,
          pageData: this.props.pageData,
          pageConfig: pageConfig,
          searchCondition: [],
          listFormat: [],
          urlCondition: {},
          buttons: [],
          operations: [],
          batchOperations: [],
          resourceKey: '1',
          pageConfigId: pageConfig._id||null,
          confitStatus: pageConfig.status || 0, //0-未发布，1-已发布，2-已删除
          listConfig: {
            showSearchCondition: true
          }
      };
      this.getConfig = this.getConfig.bind(this);
    }

    componentWillReceiveProps(nextProps){
      let pageConfig = nextProps.pageConfig || {}
      this.setState({
        pageData: nextProps.pageData,
        pageConfig: pageConfig,
        pageList: nextProps.pageList,
        publicConfig: pageConfig._id,
        confitStatus: pageConfig.status
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
          searchCondition: pageConfig.searchCondition,
          listFormat: pageConfig.listFormat,
          urlCondition: pageConfig.urlCondition,
          buttons: pageConfig.buttons,
          operations: pageConfig.operations,
          listConfig: pageConfig.listConfig||{},
          batchOperations: pageConfig.batchOperations,
          pageConfigId: configID
        })
      } else {
        this.setState({
          searchCondition: storage.getStorage(`searchCondition-${pageData.id}`) || [],
          listFormat: storage.getStorage(`listFormat-${pageData.id}`) || [],
          urlCondition: storage.getStorage(`urlCondition-${pageData.id}`) || {},
          buttons: storage.getStorage(`buttons-${pageData.id}`) || [],
          operations: storage.getStorage(`operations-${pageData.id}`) || [],
          batchOperations: storage.getStorage(`batchOperations-${pageData.id}`) || [],
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
      const { listConfig } = this.state;
      let newSelectKey = listConfig;
      newSelectKey[key] = value
      this.setState({
        listConfig: newSelectKey
      })
    }

    getConfig(){
      const {searchCondition, listFormat, urlCondition, buttons, operations, pageConfigId, confitStatus, listConfig, batchOperations} = this.state;
      return {
        searchCondition: searchCondition,
        listFormat: listFormat,
        urlCondition: urlCondition,
        buttons: buttons,
        operations: operations,
        pageConfigId: pageConfigId,
        confitStatus: confitStatus,
        listConfig: listConfig,
        batchOperations: batchOperations
      }
    }

    render() {
        const {searchCondition, listFormat, urlCondition, resourceKey, buttons, operations, pageData, listConfig, batchOperations} = this.state
        const self = this;
        
        const tabOptions = [{ tabName: '编辑URL信息', keyword: '1', content: (<EditUrl datas={urlCondition} handelChange={(res)=>{
          this.setState({
            urlCondition: res
          })
          storage.setStorage(`urlCondition-${pageData.id}`, res)
        }} />) },
          { tabName: '编辑查询字段', keyword: '2', content: (<EditSearch datas={searchCondition} handelChange={(res)=>{
            this.setState({
              searchCondition: res
            })
            storage.setStorage(`searchCondition-${pageData.id}`, res)
        }} />) },
        { tabName: '配置CardList', keyword: '6', content: (
          <Row className="bg-show padding-all font-size-9">
            <Col span="8" className="line-height-3r">是否显示搜索条件: </Col>
            <Col span="16" className="padding-top-1r"> <Switch value={listConfig&&listConfig.showSearchCondition }  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                            self.setKey('showSearchCondition', data);
                        }} /> { listConfig&&listConfig.showSearchCondition ? '显示': '关闭'}
            </Col>
            <Col span="8" className="line-height-3r">是否显示分页: </Col>
            <Col span="16" className="padding-top-1r"> <Switch value={listConfig&&listConfig.showPage || false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                            self.setKey('showPage', data);
                        }} /> { listConfig&&listConfig.showPage ? '显示': '关闭'}
            </Col>
            <Col span="8" className="line-height-3r">是否显示checkBox: </Col>
            <Col span="16" className="padding-top-1r"> <Switch value={listConfig&&listConfig.showCheckBox || false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                            self.setKey('showCheckBox', data);
                        }} /> { listConfig&&listConfig.showCheckBox ? '显示': '关闭'}
            </Col>
            <Col span="8" className="line-height-3r">Card样式: </Col>
            <Col span="16" className="">
              <Options datas={eval(listConfig&&listConfig.cardStyle || [])} onChange={(itm)=>{
                console.log('itm', itm)
                  self.setKey('cardStyle', itm)
              }} />
            </Col>
            <Col span="8" className="line-height-3r">Card宽度: </Col>
            <Col span="16" className="">
              <Input
                value={listConfig.span}
                placeholder="请输入(1-24)"
                maxLength={100}
                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                onChange={(e,t,v)=>{
                    self.setKey('span', v)
                }}
                />
            </Col>
          </Row>
        ) },
          { tabName: '编辑结果字段', keyword: '3', content: (<EditSearch datas={listFormat} handelChange={(res)=>{
            this.setState({
              listFormat: res
            })
            storage.setStorage(`listFormat-${pageData.id}`, res)
        }} />) },
          { tabName: '编辑功能按钮', keyword: '4', content: (<EditFuncModal datas={buttons} {...self.props} handelChange={(res)=>{
          this.setState({
            buttons: res
          })
          storage.setStorage(`buttons-${pageData.id}`, res)
        }} />) },
        { tabName: '编辑结果操作按钮', keyword: '5', content: (<EditFuncModal datas={operations} {...self.props} handelChange={(res)=>{
          this.setState({
            operations: res
          })
          storage.setStorage(`operations-${pageData.id}`, res)
        }} />) },
        { tabName: '编辑批量操作按钮', keyword: '7', content: (<EditFuncModal datas={batchOperations} {...self.props} handelChange={(res)=>{
          this.setState({
            batchOperations: res
          })
          storage.setStorage(`batchOperations-${pageData.id}`, res)
        }} />) }];

        let viewProps = Object.assign({}, this.props, {
          pageConfig: {configJson: this.getConfig()}
        })

        return(
          <section className="bg-f5f5f5  ">
            <Row className="" >
                <Col span={15} className="bg-show padding-bottom-1r padding-all-1 border-right border-color-f5f5f5" >
                  <Scroller style={{'height': '80vh','overflow':'auto'}} >
                    <CardsPageView {...viewProps}/>
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
CardsPage.propTypes = {
  children: PropTypes.oneOfType([PropTypes.shape({}),
    PropTypes.array, PropTypes.func]),
  pageData: PropTypes.shape({}),
  pageConfig: PropTypes.shape({}),

};

CardsPage.defaultProps = {
  pageData: {},
  pageConfig:{},
 
};
export default CardsPage;
