import React , { Component }from 'react';
import { Components, utils } from 'neo';
import EditLayoutItem from '../../components/editLayoutItem';
import EditLayoutDom from '../../components/editLayoutDom';

const {
    Row,
    Col,
    Icon,
    Input,
    Buttons,
    Textarea,
    Selects,
    TagRadio,
    Toaster,
    Item,
    Modal, Scroller
  } = Components;
const { sessions, storage } = utils

class GridLayout extends Component {
    constructor(props) {
      super(props);
      let pageConfig = this.props.pageConfig || {}
      this.state = {
        pageData: this.props.pageData,
        pageConfig: pageConfig,
        pageConfigId: pageConfig._id||null,
        confitStatus: pageConfig.status || 0,

        selectKeys: '',
        selectComponent: 'Icon',
        keyData: [],
        iconProps: {},
        pageTree: storage.getStorage('pageTree')||{},
        components: [{text: 'Icon', value: 'Icon', checked: true},
        {text: 'Row', value: 'Row'},{text: 'Col', value: 'Col'},
        {text: 'Text', value: 'Text'}],
        selectTree: 'pageTree'
      };
      this.getConfig = this.getConfig.bind(this);
    }

    componentDidMount(){
        const { pageConfig, pageData, pageConfigId }= this.state;
        if(pageConfig&&JSON.stringify(pageConfig)=='{}'){
            this.initConfig()
        }
        
        this.initPage(pageConfig.configJson, pageData, pageConfigId);
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
      
    initPage(pageConfig, pageData, configID){
        if(pageConfig&&JSON.stringify(pageConfig)!=='{}'){

          if(typeof pageConfig == 'string') {
            pageConfig = JSON.parse(pageConfig);
          }
          this.setState({
            pageTree: pageConfig.gridCondition||[],
            pageConfigId: configID
          })
        } else {
          this.setState({
            pageTree: storage.getStorage(`gridCondition-${pageData.id}`) || [],
          })
          this.initConfig()
        }
    }

    getConfig(){
        const {pageTree, pageConfigId, confitStatus} = this.state;
        return {
            gridCondition: pageTree,
            pageConfigId: pageConfigId,
            confitStatus: confitStatus
        }
    }
    // 选中组件，进行编辑属性
    doRepeat(selectkey ,className){
        const { iconProps, pageTree } = this.state;
        let newIconProps = iconProps;
        if(!Components[selectkey&&selectkey.split('-')[0]]) return
        let keys = Object.keys(Components[selectkey&&selectkey.split('-')[0]].defaultProps);
        const self = this;
        // newIconProps[selectkey] = Object.assign({}, newIconProps[selectkey],  {className: className});
        this.setState({
            selectKeys: selectkey,
            keyData: {
                [selectkey] : keys
            }
        })
        // 将缓存的数据merge到编辑模式
        this.findNode( pageTree, selectkey, (res)=>{
            newIconProps[selectkey] = Object.assign({}, newIconProps[selectkey], res.props, {className: className});
            self.setState({
                iconProps: newIconProps
            })
        }) 
    }

    initConfig(){
      let newPage = [{
        tagName: 'Row', key: 'Row-1', props: { dataKey: 'Row-1', className: 'minheight-30 bg-f5f5f5 padding-all' }, childrenNode:[{
            tagName: 'Col', key: 'Col-1', props: {key: 'Col-1', span: 12, className: 'minheight-20 bg-e9f5fa padding-all', 'dataKey': 'Col-1'}
        }]
      }]
      storage.setStorage('pageTree', newPage);
      this.setState({
        pageTree: newPage
      })
    }

    checkInArr(arr, key, value){
        let status = false;
        for(let i=0;i<arr.length;i++){
            if(arr[i][key]== value) {
                status = true
            }
        }
        return status
    }

    findNode(arr, key, callBack){
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].key !== key) {
              if (arr[i].childrenNode) {
                this.findNode(arr[i].childrenNode, key, callBack)
              }
            } else {
                callBack(arr[i]);
            }
        }
    }

    findAndAddNode(arr, key, tagName, status, props, config){
        const self = this;
        if(tagName=='Col'){
            props = Object.assign({}, props, {className: 'minheight-20 padding-all'})
        }
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].key !== key) {
              if (arr[i].childrenNode) {
                this.findAndAddNode(arr[i].childrenNode, key, tagName, status, props, config)
              }
            } else {
                if(status ==='ADDNODE'){
                    let rootNode = arr[i];
                    if(config&&(config.type=='top'||config.type=='bottom')){
                        rootNode = arr
                    }
                    arr = self.addNode(tagName, rootNode, props, config)
                    break;
                } else if(status ==='CHANGEPROPS'&&props){
                    arr[i].props = Object.assign({}, arr[i].props, props) 
                } else if(status ==='DELNODE'){
                    arr.splice(i, 1)
                } else if(status ==='MOVE'){
                    self.moveNode(arr, config)
                    break;
                }
            }
        }
        return arr;
    }

    moveNode(arr, config){
        let swap= '';
        let preNum = '';
        let nowNum = Number(config.key.num);
        if(config.type=='top'){
            preNum = (nowNum - 1) <=0 ? 0: (nowNum - 1);
           
        } else if(config.type=='bottom'){
            preNum = nowNum + 1;
        }
        swap = arr[preNum];
        arr[preNum] = arr[nowNum];
        arr[nowNum] = swap;
        // return arr;
    }
    addNode(tagName, arr, props, config){
        let timeStr = new Date().getTime();
        let newNode = {
            tagName: tagName, key: `${tagName}-${timeStr}`, props: { dataKey: `${tagName}-${timeStr}`, ...props}
        }
        if(tagName=='Row') {
            newNode = {
                tagName: tagName, key: `${tagName}-${timeStr}`, props: { dataKey: `${tagName}-${timeStr}`, className: 'minheight-30 bg-e9f5fa', ...props},
                childrenNode:[{
                    tagName: 'Col', key: `Col-${timeStr}`, props: { dataKey: `Col-${timeStr}`, className: 'minheight-20 bg-e9f5fa'},
                }]
            }
        }
        if(!arr.childrenNode){
            arr.childrenNode = []
        }
        if(config&&JSON.stringify(config)!=='{}'){
            if(config.type=='top') {
                arr.splice(Number(config.key.num), 0, newNode)
            }else if(config.type=='bottom'){
                arr.splice(Number(config.key.num)+1, 0, newNode)
            }else if(config.type=='inner'){
                arr.childrenNode.push(newNode)
            }
        } else{
            arr.childrenNode.push(newNode)
        }
        
        return arr;
    }

    render() {
        const self = this;
        const { components, selectKeys, selectComponent,  iconProps, keyData, pageTree } = this.state;
        let newTree = JSON.parse(JSON.stringify(pageTree));
        return(
          <section className="width-100 bg-f5f5f5  ">
            <Row className="" gutter={12}>
                <Col span={4} className="" colgutter={10} >
                    <Row className="padding-all-1r bg-show">
                        <Col className="line-height-3r"><Icon iconName={'android-apps '} size={'130%'} /> 组件库</Col>
                        <Col>
                            <TagRadio options={components}
                            checkStyle={{"backgroundColor":"#33cd75","color": '#fff'}} normalStyle={{"backgroundColor":"#f5f5f5","color": '#1a1a1a'}}
                            onChange={(e,v)=>{
                                self.setState({
                                    selectComponent: v.value 
                                })
                            }} 
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={14} className="" colgutter={10}>
                    <Scroller style={{'height': '80vh'}} >
                    <Row className="bg-show padding-all-1r">
                        <Col>
                            <Row>
                                <Col span={10}>selectKeys: {selectKeys}</Col>
                                <Col span={5} colgutter={8}>
                                {selectKeys ? <Buttons
                                    text={`add ${selectComponent}`}
                                    type={'primary'}
                                    size={'small'}
                                    style={{color:'#fff', borderRadius: '3rem'}}
                                    onClick={()=>{
                                        let arr = self.findAndAddNode(pageTree, selectKeys, selectComponent, 'ADDNODE', {color: '', size: '200%'})
                                        self.setState({
                                            pageTree: arr
                                        })
                                    }}
                                /> : ''}
                                </Col>
                                <Col span={5} colgutter={8}>
                                {selectKeys ? <Buttons
                                    text={`del ${selectKeys&&selectKeys.split('-')[0]}`}
                                    type={'error'}
                                    size={'small'}
                                    style={{color:'#fff', borderRadius: '3rem'}}
                                    onClick={()=>{
                                        let arr = self.findAndAddNode(pageTree, selectKeys, selectComponent, 'DELNODE', {color: '', size: '200%'});
                                        self.setState({
                                            pageTree: arr
                                        })
                                    }}
                                /> : ''}
                                </Col>
                                
                            </Row>
                        </Col>
                        <Col className={'margin-top-2'}>
                           <EditLayoutDom tree={newTree} domFocus={(res)=>{
                               self.doRepeat(res.data.keynum, res.className);
                           }} addNode={(res, type)=>{
                            let arr = self.findAndAddNode(pageTree, selectKeys, selectComponent, 'ADDNODE', {color: '', size: '200%'}, {key: res, type: type});
                            self.setState({
                                pageTree: arr
                            })
                           }} delNode={(res, type)=>{
                            let arr = self.findAndAddNode(pageTree, selectKeys, selectComponent, 'DELNODE', {color: '', size: '200%'});
                            self.setState({
                                pageTree: arr
                            })
                           }} moveNode={(res, type)=>{
                            let arr = self.findAndAddNode(pageTree, selectKeys, selectComponent, 'MOVE', {color: '', size: '200%'}, {key: res, type: type});
                            self.setState({
                                pageTree: arr
                            })
                           }} {...this.props} /> 
                        </Col>
                        <Col className="margin-top-2r">
                        </Col>
                    </Row>
                    </Scroller>
                </Col>

                <Col span={6} className="" colgutter={10}>
                    <Row className="padding-all-1r bg-show">
                        <Col><EditLayoutItem selectKeys={selectKeys} keyData={keyData[selectKeys]} iconProps={iconProps[selectKeys]} handelChange={(res)=>{
                            let newIconProps = iconProps;
                            newIconProps[res.selectKeys] = res.iconProps
                            self.setState({
                                iconProps: newIconProps
                            })
                            let arr = self.findAndAddNode(pageTree, res.selectKeys, '', 'CHANGEPROPS', res.iconProps );
                            self.setState({
                                pageTree: arr
                            })
                        }} {...this.props} /></Col>
                    </Row>
                </Col>
            </Row>
          </section>
        );
    }
}
export default GridLayout;
