import React , { Component }from 'react';
import { PropTypes } from 'prop-types';
import { Components } from 'neo';
import KeyTags from './keyTags';
import EditButton from './editButton';
import EditRules from './editRules';
import EditBtnAction from './editBtnAction';
import EditBtnActionArr from './editBtnActionArr';

const {
    Row,
    Col,
    Icon,
    Input,
    Buttons,
    Selects, Loader, Modal, Switch, ExModal, PopContainer
  } = Components;

class EditFuncModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
          datas: this.props.datas|| [],
          MDdisplay: '',
          MDaction: '',
          selectKey:  {
            ruleModal: false,
            modal: 'link',
            linkModal: false,
            ruleArr: []
          },
      };
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            datas: nextProps.datas||[],
        })
    }

    setKey(key, value) {
        const { selectKey } = this.state;
        let newSelectKey = selectKey
        newSelectKey[key] = value
        this.setState({
            selectKey: newSelectKey
        })
    }
    
    handelChange(){
        const { datas } = this.state;
        
        this.props.handelChange(datas);
        Loader.show()
        setTimeout(()=>{
            Loader.hide()
        }, 500)
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

    changeNode(arr, key, node){
        for(let i=0;i<arr.length;i++){
            if(arr[i][key]== node[key]) {
                arr[i] = node
            }
        }
        return arr;
    }

    editOptionConfig(){
        const { selectKey } = this.state;
        const self = this;
        PopContainer.confirm({
            content: (<Row justify="center">
                <Col className="line-height-3r font-size-12 padding-left-1r border-bottom border-color-f5f5f5">
                <Row>
                    <Col span={20}>配置按钮类型</Col>
                    <Col span={4} className="text-align-right cursor-pointer" onClick={()=>{PopContainer.closeAll()}}>
                    <Icon iconName={'android-cancel '} size={'140%'} iconColor={'#666'}  /></Col>
                </Row>
                </Col>
                <Col span={18} className="padding-top-1r overflow-y-scroll heighth-45">
                    <EditButton datas={selectKey.btnStyle} handelChange={(res)=>{
                        self.setKey('btnStyle', res)
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

    delNode(itm){
        const { datas } = this.state;
        let newData =  JSON.stringify(datas)=='{}' ? [] : JSON.parse(JSON.stringify(datas));
        for(let i=0;i<newData.length;i++){
            if(newData[i].key== itm.key) {
                newData.splice(i, 1)
            }
        }
        this.setState({
            datas: newData
        });
        // this.props.handelChange(newData)

    }

    

    addPages(callback){
        const {datas, selectKey} = this.state;
        let newData =  JSON.stringify(datas)=='{}' ? [] : JSON.parse(JSON.stringify(datas));
        newData.push(selectKey);
        this.setState({
            datas: newData
        },()=>{
            callback()
        });
        // this.props.handelChange(newData)
    }

    editPages(callback){
        const { datas, selectKey } = this.state;
        if(!this.checkInArr(datas, 'key', selectKey.key)) {
            let newData = datas
            newData.push(selectKey)
            this.setState({datas: newData},()=>{
                callback()
            })
        } else{
            let newData = this.changeNode(datas, 'key', selectKey);
            this.setState({datas: newData},()=>{
                callback()
            })
        }

    }

    showModal(status){
        this.setState({
            MDdisplay: 'show',
            MDaction: 'enter',
            status: status || null
        })
    }
    hideModal(){
        this.setState({
            MDdisplay: 'hide',
            MDaction: 'leave'
        })
    }

    render() {
        const self = this;
        const { datas, selectKey, status, MDdisplay, MDaction } = this.state;
        

        return(
          <section>
              <Row className="bg-show padding-all font-size-9">
                    <Col className="margin-top-3">
                        <Row>
                        <Col span={5}>按钮功能 : </Col>
                        <Col span={19}>
                        <Row>
                            <KeyTags datas={datas} onChange={(itm)=>{ self.setState({ selectKey: Object.assign({}, {modal: 'link',linkModal: false},itm)}, ()=>{
                                self.showModal('edit')
                            }) }} delNode={(itm)=>{ self.delNode(itm);}} /> 
                            <Col span={9}>
                            <Buttons
                                text={<div><Icon iconName={'android-add-circle '} size={'150%'} iconColor={'#fff'}  /> 新增按钮功能</div>}
                                type={'primary'}
                                size={'small'}
                                style={{color:'#fff', borderRadius: '3rem'}}
                                onClick={()=>{
                                    self.setState({
                                        selectKey: Object.assign({}, {modal: 'link',linkModal: false, ruleModal: false})
                                    }, ()=>{
                                        self.showModal()
                                    })
                                }}
                            />
                        </Col></Row>
                        </Col>
                    
                        <Col span={8} className="margin-top-1r">
                        <Buttons
                            text={'更新Dom'}
                            type={'primary'}
                            size={'small'}
                            style={{color:'#fff', borderRadius: '3rem'}}
                            onClick={()=>{
                                self.handelChange()
                            }}
                        />
                        </Col>
                        </Row>
                    </Col>
                </Row>
                <ExModal display={MDdisplay} action={MDaction} options={{
                content: (<Row className="padding-all-1r">
                <Col span={20} className="margin-bottom-1r line-height-3r border-bottom border-color-f5f5f5 font-size-12">{status ? '修改功能按钮': '新增功能按钮'}</Col>
                <Col span={4} className="text-align-right cursor-pointer" onClick={()=>{self.hideModal()}}>
                                    <Icon iconName={'android-cancel '} size={'140%'} iconColor={'#666'}  /></Col>
                <Col className="margin-bottom-1r">
                    <Row >
                        <Col span={8} className="line-height-3r text-align-right padding-right-1r">功能key:</Col>
                        <Col span={16} className="line-height-3r">
                            <Input
                                value={selectKey.key||""}
                                placeholder="请输入key"
                                maxLength={100}
                                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                onChange={(e,t,v)=>{
                                    self.setKey('key', v)
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col className="margin-bottom-1r">
                    <Row >
                        <Col span={8} className="line-height-3r text-align-right padding-right-1r">功能名称:</Col>
                        <Col span={16} className="line-height-3r">
                            <Input
                                value={selectKey.text|| ''}
                                placeholder="请输入功能名称"
                                maxLength={100}
                                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                onChange={(e,t,v)=>{
                                    self.setKey('text', v)
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col className="margin-bottom-1r">
                    <Row >
                        <Col span={8} className="line-height-3r text-align-right padding-right-1r">按钮样式:</Col>
                        <Col span={16} className="">
                        <Buttons
                            text={<div><Icon iconName={'android-add-circle '} size={'150%'} iconColor={'#fff'}  /> 点击配置</div>}
                            type={'primary'}
                            size={'small'}
                            style={{color:'#fff', borderRadius: '3rem'}}
                            onClick={()=>{
                                self.editOptionConfig()
                            }}
                        />
                        </Col>
                    </Row>
                </Col>
                <Col className="margin-bottom-1r">
                    <Row >
                        <Col span={8} className="line-height-3r text-align-right padding-right-1r">显示规则:</Col>
                        <Col span={16} className="">
                            <div className="width-100 line-height-3r">
                            默认 <Switch value={ selectKey.ruleModal}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                                self.setKey('ruleModal', data);
                            }} /> {selectKey.ruleModal ? '显示' : '隐藏'}
                            </div>
                            <div className="width-100">
                            <EditRules datas={selectKey.ruleArr} handelChange={(arr)=>{ 
                                self.setKey('ruleArr', arr) 
                            }} />
                            {/* <Options text={'新增规则'} datas={ selectKey.rule|| []} onChange={(itm)=>{
                                self.setKey('rule', itm)
                            }} /> */}
                            </div>
                        </Col>
                        <Col span={8}></Col>
                        <Col span={16} className="font-size-8 textclolor-black-low">注意：默认显示打开，当规则满足时不显示； 默认显示关闭，当规则满足时显示</Col>
                    </Row>
                    <Row className="width-100">
                        <Col span={8} className="line-height-3r text-align-right padding-right-1r">规则求值方式:</Col>
                        <Col span={10} className="line-height-3r padding-top-p4r">
                        <Selects value={selectKey.ruleModalType||''} onChange={(e,t,v)=>{
                        self.setKey('ruleModalType', v.value)
                        // self.renderOptions(v.value, selectKey)
                        }} options={[{text: '请选择', value: ''},{text: '或集', value: 'OR'},{text: '交集', value: 'AND'}]} />
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Row >
                        <Col span={8} className="line-height-3r text-align-right padding-right-1r">按钮类型组合:</Col>
                        <Col span={10} className="line-height-3r ">
                        <div className="width-100 line-height-3r">
                            默认 <Switch value={ selectKey.actionModal}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                                self.setKey('actionModal', data);
                            }} /> {selectKey.actionModal ? '开启' : '关闭'} 
                        </div>
                        </Col>
                        <Col span={8}></Col>
                        <Col span={16} className="font-size-8 textclolor-black-low">注意：组合开启时，会按照组合数组的顺序执行操作</Col>
                    </Row>
                </Col>
                {!selectKey.actionModal?<Col className="margin-bottom-1r">
                    <EditBtnAction datas={selectKey} pageList={this.props.pageList} handelChange={(arr)=>{ 
                        self.setState({
                            selectKey: arr
                        })
                    }} />
                </Col> : ''}
                {selectKey.actionModal?<Col className="">
                    <EditBtnActionArr datas={selectKey.actionArray} pageList={this.props.pageList} handelChange={(arr)=>{ 
                        self.setKey('actionArray', arr);
                        }} />
                </Col>: ''}
                <Col >
                    <Row justify={'center'}>
                        <Col span={5}  className="padding-all-1r">
                            <Buttons
                            text={'确定'}
                            type={'primary'}
                            size={'normal'}
                            style={{color:'#fff'}}
                            onClick={()=>{
                                if(status) {
                                    self.editPages(()=>{self.hideModal()});
            
                                  } else {
                                    self.addPages(()=>{self.hideModal()});
                                  }
                            }}
                        />
                        </Col>
                        <Col span={5} className="  padding-all-1r">
                            <Buttons
                                text={'取消'}
                                type={'primary'}
                                size={'normal'}
                                style={{}}
                                onClick={()=>{
                                    self.hideModal()
                                }}
                                plain
                            />
                        </Col>
                    </Row>
                    
                </Col>
                </Row>),
                type: 'top',
                containerStyle: { top: '2rem'},
                }} />
          </section>
        );
    }
}

EditFuncModal.propTypes = {
    datas: PropTypes.oneOfType([PropTypes.array, PropTypes.number, PropTypes.shape({})]),
};
  
EditFuncModal.defaultProps = {
    datas: [],
};
export default EditFuncModal;
