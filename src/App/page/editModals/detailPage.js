import React , { Component }from 'react';
import { Components, utils } from 'neo';
import EditDetail from '../../components/editDetail';
import EditUrl from '../../components/editUrl';
import DetailPageView from '../modals/detailPageView';
import EditFuncModal from '../../components/editFuncModal';
import EditSearch from '../../components/editSearch';

const { sessions, storage } = utils
const { Row, Col, Icon, Tab, Buttons, Scroller, Switch } = Components;
  
class DetailPage extends Component {
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

    setValueNull(itm){
      if(!(itm&&itm.length>0)) return 
      for(let i=0;i<itm.length;i++){
        itm[i].value = ''
      }
      return itm;
    }

    initPage(pageConfig, pageData, configID){
      if(pageConfig&&JSON.stringify(pageConfig)!=='{}'){
        if(typeof pageConfig == 'string') {
          pageConfig = JSON.parse(pageConfig);
        }
        this.setState({
          detailCondition: this.setValueNull(pageConfig.detailCondition),
          detailUrlCondition: pageConfig.detailUrlCondition,
          detailSearchCondition:  pageConfig.detailSearchCondition,
          detailFuction: pageConfig.detailFuction,
          pageConfigId: configID,
          editConfig: pageConfig.editConfig||{},
        })
      } else {
        this.setState({
          detailCondition: storage.getStorage(`detailCondition-${pageData.id}`) || [],
          detailUrlCondition: storage.getStorage(`detailUrlCondition-${pageData.id}`) || {},
          detailSearchCondition: storage.getStorage(`detailSearchCondition-${pageData.id}`) || [],
          detailFuction: storage.getStorage(`detailFuction-${pageData.id}`) || [],
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
      const {detailCondition, detailFuction, detailUrlCondition, detailSearchCondition,  pageConfigId, confitStatus, editConfig} = this.state;
      return {
        detailCondition: this.setValueNull(detailCondition),
        detailUrlCondition: detailUrlCondition,
        detailSearchCondition: detailSearchCondition,
        detailFuction: detailFuction,
        pageConfigId: pageConfigId,
        confitStatus: confitStatus,
        editConfig: editConfig
      }
    }


    render() {
        const {detailCondition, detailFuction, detailUrlCondition, detailSearchCondition,  pageData, resourceKey, editConfig} = this.state
        const self = this;

        let viewProps = Object.assign({}, this.props, {
          pageConfig: {configJson: self.getConfig()}
        })
        const tabOptions = [{ tabName: '编辑URL信息', keyword: '1', content: (<EditUrl datas={detailUrlCondition} handelChange={(res)=>{
          this.setState({
            detailUrlCondition: res
          })
          storage.setStorage(`detailUrlCondition-${pageData.id}`, res)
        }} />) },
        { tabName: '编辑查询字段信息', keyword: '3', content: (<EditDetail datas={detailSearchCondition} handelChange={(res)=>{
          this.setState({
            detailSearchCondition: res
          })
          storage.setStorage(`detailSearchCondition-${pageData.id}`, res)
        }} />) },
          { tabName: '编辑结果字段信息', keyword: '2', content: (<EditSearch datas={detailCondition} handelChange={(res)=>{
            this.setState({
              detailCondition: res
            })
            storage.setStorage(`detailCondition-${pageData.id}`, res)
        }} />) },
        { tabName: '编辑功能', keyword: '4', content: (<EditFuncModal datas={detailFuction} {...self.props} handelChange={(res)=>{
          this.setState({
            detailFuction: res
          })
          storage.setStorage(`detailFuction-${pageData.id}`, res)
        }} />) },
        { tabName: '配置DetailPage', keyword: '5', content: (
          <Row className="bg-show padding-all font-size-9">

            <Col span="8" className="line-height-3r">是否开启initRequest: </Col>
            <Col span="16" className="padding-top-1r"> <Switch value={editConfig&&editConfig.enableInitRequst || false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                    self.setKey('enableInitRequst', data);
                }} /> { editConfig&&editConfig.enableInitRequst ? '开启': '关闭'}
            </Col>
            
          </Row>
        ) }];
        return(
          <section className="bg-f5f5f5  ">
            <Row className="" >
                <Col span={15} className="padding-all-1 bg-show padding-bottom-1r border-right border-color-f5f5f5" >
                <Scroller style={{'height': '80vh','overflow':'auto'}} >
                  <DetailPageView {...viewProps} />
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
export default DetailPage;
