import React , { Component }from 'react';
import { PropTypes } from 'prop-types';
import { Components } from 'neo';
import KeyTags from './keyTags';
import Options from './options';
import EditApi from './editApi';

const {
    Row,
    Col,
    Icon,
    Input,
    Buttons,
    Selects, Loader, Modal, Switch, PopContainer, ExModal
  } = Components;

class EditFormChange extends Component {
    constructor(props) {
      super(props);
      this.state = {
          datas: this.props.datas|| [],
          formItem: this.props.formItem|| [],
          MDdisplay: '',
          MDaction: '',
          selectKey:  {
            ruleModal: false
          },
      };
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            datas: nextProps.datas,
            formItem: nextProps.formItem,
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

    delNode(itm){
        const { datas } = this.state;
        let newData = JSON.parse(JSON.stringify(datas));
        for(let i=0;i<newData.length;i++){
            if(newData[i].key== itm.key) {
                newData.splice(i, 1)
            }
        }
        this.setState({
            datas: newData
        });
        this.props.handelChange(newData)

    }

    

    addPages(callback){
        const {datas, selectKey} = this.state;
        let newData = datas;
        newData.push(selectKey);
        this.setState({
            datas: newData
        },()=>{
            callback()
        });
        this.props.handelChange(newData)
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
        this.props.handelChange(newData)

    }

    editOnChangeRequest(){
        const { selectKey } = this.state;
        const self = this;
        PopContainer.confirm({
            content: (<Row justify="center">
                <Col className="line-height-3r font-size-12 padding-left-1r border-bottom border-color-f5f5f5">
                <Row>
                    <Col span={20}>配置Api</Col>
                    <Col span={4} className="text-align-right cursor-pointer" onClick={()=>{PopContainer.closeAll()}}>
                    <Icon iconName={'android-cancel '} size={'140%'} iconColor={'#666'}  /></Col>
                </Row>
                </Col>
                <Col span={18} className="padding-top-1r overflow-y-scroll heighth-45">
                    <EditApi datas={selectKey.changeRequest} handelChange={(res)=>{
                        self.setKey('changeRequest', res)
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
        const { datas, selectKey, MDdisplay, MDaction, formItem, status } = this.state;
        let actionOption = formItem&&formItem.length > 0 ? formItem.map((itm, idx)=>{
            return {text: itm.text, value: `${itm.key}${itm.keyId?itm.keyId:''}`}
        }) :[];
        return(
          <section>
              <Row className="bg-show padding-all-1r">
                    <Col className="">
                        <Row>
                            <Col >
                            <Row>
                                <KeyTags datas={datas} onChange={(itm)=>{ self.setState({ selectKey: itm}, ()=>{
                                    self.showModal('edit')
                                }) }} delNode={(itm)=>{ self.delNode(itm);}} /> 
                                <Col span={9}>
                                <Buttons
                                    text={<div><Icon iconName={'android-add-circle '} size={'150%'} iconColor={'#fff'}  /> 新增联动配置</div>}
                                    type={'primary'}
                                    size={'small'}
                                    style={{color:'#fff', borderRadius: '3rem'}}
                                    onClick={()=>{
                                        self.setState({
                                            selectKey: {
                                                ruleModal: false
                                            }
                                        }, ()=>{
                                            self.showModal()
                                        })
                                    }}
                                />
                            </Col></Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <ExModal display={MDdisplay} action={MDaction} options={{
                content: (<Row className="padding-all-1r">
                    <Col >
                        <Row justify="center">
                            <Col className="line-height-3r font-size-12 padding-left-1r border-bottom border-color-f5f5f5">
                                <Row>
                                    <Col span={20}>配置OnChange选项</Col>
                                    <Col span={4} className="text-align-right cursor-pointer" onClick={()=>{self.hideModal()}}>
                                    <Icon iconName={'android-cancel '} size={'140%'} iconColor={'#666'}  /></Col>
                                </Row>
                            </Col>
                            <Col span={18} className="padding-top-1r overflow-y-scroll heighth-45">
                            <Row className="bg-show padding-all">
                                <Col className="margin-top-3">
                                    <Row justify="center">
                                        <Col span="8" className="line-height-3r text-align-right padding-right-1r">联动表单: </Col>
                                        <Col span="16">
                                            <Selects value={selectKey.linkDomKey||''} onChange={(e,t,v)=>{
                                                self.setKey('linkDomKey', v.value)
                                                self.setKey('text', v.text)
                                                self.setKey('key',  v.value)
                                            }} options={actionOption} />
                                        </Col>
                                        <Col span="8" className="line-height-3r text-align-right padding-right-1r">显示规则: </Col>
                                        <Col span="16">
                                            <div className="width-100 line-height-3r">
                                            默认显示{selectKey.ruleModal} <Switch value={ selectKey.ruleModal || false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                                                self.setKey('ruleModal', data);
                                            }} />
                                            </div>
                                            <div className="width-100">
                                            <Options text={'新增规则'} datas={ selectKey.rule|| []} onChange={(itm)=>{
                                                self.setKey('rule', itm)
                                            }} />
                                            </div>
                                        </Col>
                                    <Col span={8}></Col>
                                    <Col span={16} className="font-size-8 textclolor-black-low">注意：默认显示打开，当规则满足时不显示； 默认显示关闭，当规则满足时显示</Col>
                            
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={18}>
                            <Row>
                            <Col span={8} className="line-height-3r text-align-right padding-right-1r">onChange调用接口: </Col>
                            <Col span={16} className="line-height-3r"><Switch value={selectKey.hasChangeRequest} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                                self.setKey('hasChangeRequest', date)
                            }} />
                            </Col>
                            <Col span={8}></Col>
                            <Col span={16} className="font-size-8 textclolor-black-low">注意：开启配置时，当值改变时，会调用接口</Col>
                            </Row>
                        </Col>
                        {selectKey.hasChangeRequest ? <Col span={18} className="margin-top-1r"><Row>
                            <Col span={8} className="text-align-right padding-right-1r">配置Api参数: </Col>
                            <Col span={6}><Buttons
                                text={<div><Icon iconName={'android-add-circle '} size={'150%'} iconColor={'#fff'}  /> 点击配置</div>}
                                type={'primary'}
                                size={'small'}
                                style={{color:'#fff', borderRadius: '3rem'}}
                                onClick={()=>{
                                    self.editOnChangeRequest()
                                }}
                            /></Col>
                        </Row></Col> : ''}

                        <Col span={18} className="margin-top-1r">
                            <Row>
                            <Col span={8} className="line-height-3r text-align-right padding-right-1r">onChange赋值: </Col>
                            <Col span={16} className="line-height-3r"><Switch value={selectKey.hasChangeTo} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                                self.setKey('hasChangeTo', date)
                            }} />
                            </Col>
                            <Col span={8}></Col>
                            <Col span={16} className="font-size-8 textclolor-black-low">注意：开启配置时，当值改变时，会调用赋值给联动表单</Col>
                            </Row>
                        </Col>
                        {selectKey.hasChangeTo ? <Col span={18} className="margin-top-1r"><Row>
                            <Col span={8} className="text-align-right padding-right-1r">配置结果key: </Col>
                            <Col span={16}>
                            <Options text={'配置结果key'} datas={ selectKey.toKey|| []} onChange={(itm)=>{
                                self.setKey('toKey', itm)
                            }} />
                            </Col>
                        </Row></Col> : ''}

                        <Col span={18} className="margin-top-1r">
                            <Row>
                            <Col span={8} className="line-height-3r text-align-right padding-right-1r">onChange赋值初始化: </Col>
                            <Col span={16} className="line-height-3r"><Switch value={selectKey.hasChangeInit} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                                self.setKey('hasChangeInit', date)
                            }} />
                            </Col>
                            <Col span={8}></Col>
                            <Col span={16} className="font-size-8 textclolor-black-low">注意：开启配置时，当值改变时，会调用赋值给联动表单，并调用联动表单初始化方法</Col>
                            </Row>
                        </Col>
                        {selectKey.hasChangeInit ? <Col span={18} className="margin-top-1r"><Row>
                            <Col span={8} className="text-align-right padding-right-1r">配置结果key: </Col>
                            <Col span={16}>
                            <Options text={'配置结果key'} datas={ selectKey.InitKey|| []} onChange={(itm)=>{
                                self.setKey('InitKey', itm)
                            }} />
                            </Col>
                        </Row></Col> : ''}

                        <Col>
                        <Row justify={'center'}>
                        <Col span={4} className=" padding-all-1r">
                            <Buttons
                                text={'确定'}
                                type={'primary'}
                                size={''}
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
                        <Col span={4} className="  padding-all-1r">
                            <Buttons
                                text={'取消'}
                                type={'error'}
                                size={''}
                                style={{}}
                                onClick={()=>{
                                    self.hideModal()
                                }}
                                plain
                            />
                        </Col>
                        </Row></Col>
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

EditFormChange.propTypes = {
    datas: PropTypes.oneOfType([PropTypes.array, PropTypes.number, PropTypes.shape({})]),
};
  
EditFormChange.defaultProps = {
    datas: [],
};
export default EditFormChange;
