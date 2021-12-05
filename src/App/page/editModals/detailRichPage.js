
import React , { Component }from 'react';
import { Components, utils } from 'neo';
import EditRichList from '../../components/editDetailRich';
import EditApi from '../../components/editApi';
import DetailRichPageView from '../modals/detailRichPageView';
import EditFuncModal from '../../components/editFuncModal';

const { sessions, storage } = utils
const { Row, Col, Icon, Tab, Buttons, Scroller } = Components;
  
class DetailRichPage extends Component {
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
          detailFuction: pageConfig.detailFuction,
          pageConfigId: configID
        })
      } else {
        this.setState({
          detailCondition: storage.getStorage(`detailCondition-${pageData.id}`) || [],
          detailUrlCondition: storage.getStorage(`detailUrlCondition-${pageData.id}`) || {},
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

    getConfig(){
      const {detailCondition, detailFuction, detailUrlCondition,  pageConfigId, confitStatus} = this.state;
      return {
        detailCondition: this.setValueNull(detailCondition),
        detailUrlCondition: detailUrlCondition,
        detailFuction: detailFuction,
        pageConfigId: pageConfigId,
        confitStatus: confitStatus
      }
    }


    render() {
        const {detailCondition, detailFuction, detailUrlCondition,  pageData, resourceKey} = this.state
        const self = this;

        let viewProps = Object.assign({}, this.props, {
          pageConfig: {configJson: self.getConfig()}
        })
        const tabOptions = [{ tabName: '编辑URL信息', keyword: '1', content: (<EditApi datas={detailUrlCondition} handelChange={(res)=>{
          this.setState({
            detailUrlCondition: res
          })
          storage.setStorage(`detailUrlCondition-${pageData.id}`, res)
        }} />) },
          { tabName: '编辑结果展示信息', keyword: '2', content: (<EditRichList datas={detailCondition} handelChange={(res)=>{
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
        }} />) }];
        return(
          <section className="bg-f5f5f5  ">
            <Row className="" >
                <Col span={15} className="padding-all-1 bg-show padding-bottom-1r border-right border-color-f5f5f5" >
                <Scroller style={{'height': '80vh','overflow':'auto'}} >
                  <DetailRichPageView {...viewProps} />
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
export default DetailRichPage;
