import React , { Component }from 'react';
import { PropTypes } from 'prop-types';
import { Components } from 'neo';
import KeyTags from './keyTags';
import FactorOptions from './factorOptions';
import FactorRules from './factorRules';
import EditApi from './editApi';
import Options from './options';
import EditFactorRules from './editFactorRules';

const {
    Row,
    Col,
    Icon,
    Input,
    Buttons,
    Selects, Loader, Switch, PopContainer, ExModal
  } = Components;

class EditWholeRules extends Component {
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
            this.props.handelChange(newData)
        } else{
            let newData = this.changeNode(datas, 'key', selectKey);
            this.setState({datas: newData},()=>{
                callback()
            })
            this.props.handelChange(newData)
        }
        

    }

    editOnChangeRequest(){
        const { selectKey } = this.state;
        const self = this;
        PopContainer.confirm({
            content: (<Row justify="center">
                <Col className="line-height-3r font-size-12 padding-left-1r border-bottom border-color-f5f5f5">
                <Row>
                    <Col span={20}>??????Api</Col>
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
            containerStyle: { top: '5rem', maxHeight: '80vh'},
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
            return {text: itm.text, value: itm.key}
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
                                    text={<div><Icon iconName={'android-add-circle '} size={'150%'} iconColor={'#fff'}  /> ??????????????????</div>}
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
                                    <Col span={20}>??????????????????</Col>
                                    <Col span={4} className="text-align-right cursor-pointer" onClick={()=>{self.hideModal()}}>
                                    <Icon iconName={'android-cancel '} size={'140%'} iconColor={'#666'}  /></Col>
                                </Row>
                            </Col>
                            <Col span={18} className="padding-top-1r">
                                <Row>
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">????????????:</Col>
                                <Col span={16} className="line-height-3r">
                                    <Input
                                        value={selectKey.text|| ''}
                                        placeholder="?????????????????????"
                                        maxLength={100}
                                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                        onChange={(e,t,v)=>{
                                            self.setKey('text', v)
                                        }}
                                    />
                                </Col>
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">??????key:</Col>
                                <Col span={16} className="line-height-3r">
                                    <Input
                                        value={selectKey.key||""}
                                        placeholder="?????????key"
                                        maxLength={100}
                                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                        onChange={(e,t,v)=>{
                                            self.setKey('key', v)
                                        }}
                                    />
                                </Col>
                                </Row>
                            </Col>
                            <Col span={18} className="padding-top-1r">
                                <Row>
                                <Col span="8" className="line-height-3r text-align-right padding-right-1r">????????????: </Col>
                                <Col span="16" className="padding-top-1">
                                    <FactorOptions text={'??????????????????'} datas={ selectKey.activeFactor|| []} onChange={(itm)=>{
                                        // console.log('activeFactor', itm)
                                        self.setKey('activeFactor', itm)
                                    }} options={actionOption} />
                                </Col>
                                </Row>
                            </Col>
                            <Col span={18} className="padding-top-1r">
                                <Row>
                                <Col span="8" className="line-height-3r text-align-right padding-right-1r">????????????: </Col>
                                <Col span="16" className="padding-top-1">
                                    <FactorOptions text={'??????????????????'} datas={ selectKey.passiveFactor|| []} onChange={(itm)=>{
                                        self.setKey('passiveFactor', itm)
                                    }} options={actionOption} />
                                </Col>
                                </Row>
                            </Col>
                            <Col span={18} className="padding-top-1r">
                                <Row>
                                <Col span="8" className="line-height-3r text-align-right padding-right-1r">????????????: </Col>
                                <Col span="16" className="padding-top-1">
                                <Selects value={selectKey.vaildType||''} onChange={(e,t,v)=>{
                                    self.setKey('vaildType', v.value)
                                }} options={[{text: '?????????', value: ''},{text: '????????????', value: 'Factor'},{text: '????????????', value: 'Rules'}]} />
                                </Col>
                                </Row>
                            </Col>
                            {selectKey.vaildType=='Factor' ? <Col ><Row justify="center">
                                <Col span={18} className="padding-top-1r">
                                    <Row justify="center">
                                    <Col span={8} className="line-height-3r text-align-right padding-right-1r">????????????: </Col>
                                    <Col span={16} className="padding-top-1">
                                        <FactorRules text={'????????????'} datas={ selectKey.factors|| []} onChange={(itm)=>{
                                            self.setKey('factors', itm)
                                        }} options={actionOption} activeFactor={selectKey.activeFactor} passiveFactor={selectKey.passiveFactor} />
                                    </Col>
                                    <Col span={8}></Col>
                                    <Col span={16} className="font-size-8 textclolor-black-low">?????????????????????????????????????????????</Col>
                                    <Col span={8} className="line-height-3r text-align-right padding-right-1r">????????????: </Col>
                                    <Col span={16} className="padding-top-1">
                                        <Selects value={selectKey.changeType||''} onChange={(e,t,v)=>{
                                            self.setKey('changeType', v.value)
                                        }} options={[{text: '?????????', value: ''},{text: 'onChange?????????', value: 'onChange'},{text: '???????????????', value: 'onSubmit'}]} />
                                    </Col>
                                    <Col span={8} className="line-height-3r text-align-right padding-right-1r">????????????: </Col>
                                    <Col span={16} className=" padding-top-1">
                                        <Selects value={selectKey.actionType||''} onChange={(e,t,v)=>{
                                            self.setKey('actionType', v.value)
                                        }} options={[{text: '?????????', value: ''},{text: 'valid??????', value: 'valid'},{text: '?????????????????????', value: 'toValue'}]} />
                                    </Col>
                                    {selectKey.actionType == 'valid'? <Col ><Row justify="center">
                                    <Col span={8} className="line-height-3r text-align-right padding-right-1r">????????????: </Col>
                                    <Col span={16} className=" padding-top-1">
                                    <Input
                                        value={selectKey.errorMsg||""}
                                        placeholder="?????????errMsg"
                                        maxLength={100}
                                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                        onChange={(e,t,v)=>{
                                            self.setKey('errorMsg', v)
                                        }}
                                    />
                                    </Col></Row> </Col>: '' }
                                    </Row>
                                </Col>
                            </Row></Col>: ''}

                            {selectKey.vaildType=='Rules' ? <Col ><Row justify="center">
                                <Col span={18} className="padding-top-1r">
                                    <Row justify="center">
                                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">????????????: </Col>
                                    <Col span="16">
                                        <div className="width-100">
                                        <EditFactorRules datas={selectKey.ruleArr} handelChange={(arr)=>{ 
                                            self.setKey('ruleArr', arr) 
                                        }} activeFactor={selectKey.activeFactor} passiveFactor={selectKey.passiveFactor} />
                                        </div>
                                    </Col>
                                   </Row>
                                    <Row className="width-100">
                                        <Col span={8} className="line-height-3r text-align-right padding-right-1r">??????????????????:</Col>
                                        <Col span={10} className="line-height-3r padding-top-p4r">
                                        <Selects value={selectKey.ruleModalType||''} onChange={(e,t,v)=>{
                                        self.setKey('ruleModalType', v.value)
                                        // self.renderOptions(v.value, selectKey)
                                        }} options={[{text: '?????????', value: ''},{text: '??????', value: 'OR'},{text: '??????', value: 'AND'}]} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={8} className="line-height-3r text-align-right padding-right-1r">????????????:</Col>
                                        <Col span={10} className="line-height-3r padding-top-p4r">
                                            <Selects value={selectKey.ruleActionType||''} onChange={(e,t,v)=>{
                                            self.setKey('ruleActionType', v.value)
                                            // self.renderOptions(v.value, selectKey)
                                            }} options={[{text: '?????????', value: ''},{text: '????????????', value: 'checkShow'},{text: 'onChange????????????', value: 'toApi'},
                                            {text: 'onChange??????', value: 'toValue'},{text: 'onChange???????????????', value: 'toInit'}]} />
                                        </Col>
                                        <Col span={8}></Col>
                                        <Col span={16} className="font-size-8 textclolor-black-low">???????????????????????????????????????????????????</Col>
                                    </Row>
                                    {selectKey.ruleActionType=='checkShow' ? <Row className="margin-top-1r">
                                        <Col span={8} className="line-height-3r text-align-right padding-right-1r">????????????</Col>
                                        <Col span={16} className="font-size-8 textclolor-black-low">
                                            <div className="width-100 line-height-3r">
                                            ????????????{selectKey.ruleModal} <Switch value={ selectKey.ruleModal || false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                                                self.setKey('ruleModal', data);
                                            }} /> {selectKey.ruleModal ? '??????' : '??????'}
                                            </div>
                                        </Col>
                                        <Col span={8}></Col>
                                        <Col span={16} className="font-size-8 textclolor-black-low">???????????????????????????????????????????????????????????? ?????????????????????????????????????????????</Col>
                                    </Row> : ''}
                                </Col>
                                {selectKey.ruleActionType=='toApi' ? <Col span={18} className="margin-top-1r">
                                    <Row>
                                    <Col span={8} className="line-height-3r text-align-right padding-right-1r">onChange????????????: </Col>
                                    <Col span={16} className="line-height-3r"><Switch value={selectKey.hasChangeRequest} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                                        self.setKey('hasChangeRequest', date)
                                    }} />
                                    </Col>
                                    <Col span={8}></Col>
                                    <Col span={16} className="font-size-8 textclolor-black-low">???????????????????????????????????????????????????????????????</Col>
                                    </Row>
                                    {selectKey.hasChangeRequest ? <Row className="margin-top-1r">
                                    <Col span={8} className="text-align-right padding-right-1r">??????Api??????: </Col>
                                    <Col span={6}><Buttons
                                        text={<div><Icon iconName={'android-add-circle '} size={'150%'} iconColor={'#fff'}  /> ????????????</div>}
                                        type={'primary'}
                                        size={'small'}
                                        style={{color:'#fff', borderRadius: '3rem'}}
                                        onClick={()=>{
                                            self.editOnChangeRequest()
                                        }}
                                    /></Col>
                                    </Row> : ''}
                                </Col>: ''}
                                

                                {selectKey.ruleActionType=='toValue' ? <Col span={18} className="margin-top-1r">
                                    <Row>
                                    <Col span={8} className="line-height-3r text-align-right padding-right-1r">onChange??????: </Col>
                                    <Col span={16} className="line-height-3r"><Switch value={selectKey.hasChangeTo} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                                        self.setKey('hasChangeTo', date)
                                    }} />
                                    </Col>
                                    <Col span={8}></Col>
                                    <Col span={16} className="font-size-8 textclolor-black-low">??????????????????????????????????????????????????????????????????????????????</Col>
                                    </Row>
                                    {selectKey.hasChangeTo ? <Row className="margin-top-1r">
                                    <Col span={8} className="text-align-right padding-right-1r">????????????key: </Col>
                                    <Col span={16}>
                                    <Options text={'????????????key'} datas={ selectKey.toKey|| []} onChange={(itm)=>{
                                        self.setKey('toKey', itm)
                                    }} />
                                    </Col>
                                    </Row> : ''}
                                </Col>: ''}
                                

                                {selectKey.ruleActionType=='toInit' ? <Col span={18} className="margin-top-1r">
                                    <Row>
                                    <Col span={8} className="line-height-3r text-align-right padding-right-1r">onChange???????????????: </Col>
                                    <Col span={16} className="line-height-3r"><Switch value={selectKey.hasChangeInit} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                                        self.setKey('hasChangeInit', date)
                                    }} />
                                    </Col>
                                    <Col span={8}></Col>
                                    <Col span={16} className="font-size-8 textclolor-black-low">?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</Col>
                                    </Row>
                                    {selectKey.hasChangeInit ? <Row className="margin-top-1r">
                                    <Col span={8} className="text-align-right padding-right-1r">????????????key: </Col>
                                    <Col span={16}>
                                    <Options text={'????????????key'} datas={ selectKey.InitKey|| []} onChange={(itm)=>{
                                        self.setKey('InitKey', itm)
                                    }} />
                                    </Col>
                                </Row> : ''}
                                </Col> : ''}
                                
                            </Row></Col> : ''}
                        <Col>
                        <Row justify={'flex-end'} className="margin-top-1r border-top border-color-f5f5f5">
                            <Col span={4} className=" padding-all-1r">
                                <Buttons
                                    text={'??????'}
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
                                    text={'??????'}
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

EditWholeRules.propTypes = {
    datas: PropTypes.oneOfType([PropTypes.array, PropTypes.number, PropTypes.shape({})]),
};
  
EditWholeRules.defaultProps = {
    datas: [],
};
export default EditWholeRules;
