import React , { Component }from 'react';
import { Components, utils } from 'neo';
import EditBg from '../../../components/editBg';
import VideoPageView from '../../modals/cards/videoPageView';
import EditSearch from '../../../components/editSearch';
import EditVideo from '../../../components/editVideo';

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
          detailVideoCondition: {},
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
          detailVideoCondition: pageConfig.detailVideoCondition,
          pageConfigId: configID,
        })
      } else {
        this.setState({
          detailCondition: storage.getStorage(`detailCondition-${pageData.id}`) || [],
          detailUrlCondition: storage.getStorage(`detailUrlCondition-${pageData.id}`) || {},
          detailVideoCondition: storage.getStorage(`detailVideoCondition-${pageData.id}`) || {},
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
      const {detailCondition, detailUrlCondition, detailVideoCondition,  pageConfigId, confitStatus} = this.state;
      return {
        detailCondition: this.setValueNull(detailCondition),
        detailUrlCondition: detailUrlCondition,
        detailVideoCondition: detailVideoCondition,
        pageConfigId: pageConfigId,
        confitStatus: confitStatus,
      }
    }


    render() {
        const {detailCondition, detailUrlCondition, detailVideoCondition, pageData, resourceKey} = this.state
        const self = this;

        let viewProps = Object.assign({}, this.props, {
          pageConfig: {configJson: self.getConfig()}
        })
        const tabOptions = [{ tabName: '编辑卡片信息', keyword: '1', content: (<EditBg datas={detailUrlCondition} handelChange={(res)=>{
          this.setState({
            detailUrlCondition: res
          })
          storage.setStorage(`detailUrlCondition-${pageData.id}`, res)
        }} />) },
        { tabName: '编辑video信息', keyword: '2', content: (<EditVideo datas={detailVideoCondition} handelChange={(res)=>{
          this.setState({
            detailVideoCondition: res
          })
          storage.setStorage(`detailVideoCondition-${pageData.id}`, res)
        }} />) },
        { tabName: '编辑字段信息', keyword: '3', content: (<EditSearch datas={detailCondition} handelChange={(res)=>{
            this.setState({
              detailCondition: res
            })
            storage.setStorage(`detailCondition-${pageData.id}`, res)
        }} />) },
        ];
        return(
          <section className="bg-f5f5f5  ">
            <Row className="" >
                <Col span={15} className="padding-all-1 bg-show border-right border-color-f5f5f5" >
                <Row justify="center" className="bg-f5f5f5 padding-top-1r padding-bottom-1r">
                  <div className="phone-container" >
                    <VideoPageView {...viewProps} />
                  </div>
                </Row>
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
