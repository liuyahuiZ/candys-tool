import React , { Component }from 'react';
import { Components } from 'neo';
import KeyTags from './keyTags';

const {
    Row,
    Col,
    Icon,
    Input,
    Buttons,
    Selects, Loader, Modal, ExModal
  } = Components;

class FactorRules extends Component {
    constructor(props) {
      super(props);
      this.state = {
          datas: this.props.hasRender ? this.renderData(this.props.datas) : this.props.datas ||[],
          selectKey: {},
          activeFactor: this.props.activeFactor||[],
          passiveFactor: this.props.passiveFactor||[],
          text: this.props.text || '新增选项',
          hasRender: this.props.hasRender || false,
          MDdisplay: '',
          MDaction: '',
      };
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            datas: this.props.hasRender ? this.renderData(nextProps.datas) : nextProps.datas||[] ,
            hasRender: nextProps.hasRender || false
        })
    }

    renderData(data){
        let keys = Object.keys(data);
        let values = Object.values(data);
        let newArr = []
        for(let i=0;i<keys.length;i++){
            newArr[i] = {
                text: values[i],
                value: keys[i],
                key: keys[i],
            }
        }
        return newArr;
    }

    resetData(data){
        let newObg = {}
        for(let i=0;i<data.length;i++){
            newObg[data[i].value]=data[i].text;
        }
        return newObg;
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

    addNode(callback){
        const { datas, selectKey, hasRender } = this.state;
        const self = this;
        let newData = datas;
        if(!this.checkInArr(datas, 'key', selectKey.key)) {
            newData.push({
                text: selectKey.text,
                value: selectKey.value,
                linkDomKey: selectKey.linkDomKey,
                factorType: selectKey.factorType,
                key: selectKey.key,
            })
            this.setState({
                datas: newData
            },()=>{
                let resData = hasRender ? self.resetData(newData) : newData;
                callback()
                self.props.onChange(resData);
            })
        }
    }

    changeNode(callback){
        const { datas, hasRender, selectKey } = this.state;
        const self = this;
        let newData = JSON.parse(JSON.stringify(datas));
        for(let i=0;i<newData.length;i++){
            if(newData[i].key== selectKey.key) {
                newData[i] = selectKey
            }
        }
        this.setState({
            datas: newData
        },()=>{
            let resData = hasRender ? self.resetData(newData) : newData;
            callback()
            self.props.onChange(resData);
        })
    }

    delNode(itm){
        const { datas, hasRender } = this.state;
        const self = this;
        let newData = JSON.parse(JSON.stringify(datas));
        for(let i=0;i<newData.length;i++){
            if(newData[i].key== itm.key) {
                newData.splice(i, 1)
            }
        }
        this.setState({
            datas: newData
        },()=>{
            let resData = hasRender ? self.resetData(newData) : newData;
            self.props.onChange(resData);
        })

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
        const { selectKey, datas, text ,activeFactor, passiveFactor, MDdisplay, MDaction, status } = this.state;
   
        let actionOption = [...activeFactor, ...passiveFactor]
        actionOption = [{text: '请选择', value: ''}, ...actionOption];
        const formulaOption = [{text: '请选择', value: ''}, {text: '>', value: 'gt'}, {text: '<', value: 'lt'},{text: '>=', value: 'ltq'},{text: '<=', value: 'gtq'},{text: '=', value: 'eq'}];
        const calculationOption = [{text: '请选择', value: ''},{text: '+', value: 'add'},{text: '-', value: 'reduce'},{text: '*', value: 'ride'},{text: '/', value: 'division'},{text: '(', value: 'leftBrackets'},{text: ')', value: 'rightBrackets'}]
        const factorDom = datas&&datas.length>0? datas.map((itm,idx)=>{
            return <span key={`fat-${idx}`} className={'padding-all-1'}>{itm.text}</span>
        }) :'';
        return(
          <section>
              <Row className="bg-show font-size-9">
                    <Col>
                        <Row>
                            <KeyTags datas={datas} onChange={(itm)=>{ self.setState({ selectKey: itm},()=>{self.showModal('edit')}) }} delNode={(itm)=>{ self.delNode(itm);}} /> 
                            <Col span={12}>
                                <Buttons
                                    text={<div><Icon iconName={'android-add-circle '} size={'120%'} iconColor={'#fff'}  /> {text || '新增选项'}</div>}
                                    type={'primary'}
                                    size={'small'}
                                    style={{color:'#fff', borderRadius: '0.5rem'}}
                                    onClick={()=>{
                                        self.setState({ selectKey: {}},()=>{self.showModal()})
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col className="padding-top-1r padding-bottom-1r">因式输出：{factorDom}</Col>
                </Row>
                <ExModal display={MDdisplay} action={MDaction} options={{
                content: (<Row className="padding-all-1r">
                <Col className="line-height-3r font-size-12 padding-left-1r border-bottom border-color-f5f5f5">
                    <Row>
                        <Col span={20}>配置全局规则</Col>
                        <Col span={4} className="text-align-right cursor-pointer" onClick={()=>{self.hideModal()}}>
                        <Icon iconName={'android-cancel '} size={'140%'} iconColor={'#666'}  /></Col>
                    </Row>
                </Col>
                <Col className="margin-top-1r"><Row>
                <Col span="8" className="line-height-3r text-align-right padding-right-1r">类型: </Col>
                <Col span="16" className="line-height-3r">
                    <Selects value={selectKey.factorType||''} onChange={(e,t,v)=>{
                        self.setKey('factorType', v.value)
                    }} options={[{text: '请选择', value: ''},{text: '因子', value: 'Factor'},{text: '固定值', value: 'ConstValue'}, {text: '比较公式', value: 'Formula'}, {text: '计算公式', value: 'Calculation'}]} />
                </Col>
                <Col span="8" className="line-height-3r text-align-right padding-right-1r">取值: </Col>
                <Col span="16" className="line-height-3r">
                {selectKey.factorType == 'Factor'? <Selects value={selectKey.linkDomKey||''} onChange={(e,t,v)=>{
                        self.setKey('linkDomKey', v.value)
                        self.setKey('text', v.text)
                        self.setKey('value', v.value)
                    }} options={actionOption} />: ''}
                {selectKey.factorType == 'ConstValue'? <Input
                    value={selectKey.value ||''}
                    placeholder="请输入"
                    maxLength={100}
                    innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                    onChange={(e,t,v)=>{
                        self.setKey('value', v)
                        self.setKey('text', v)
                    }}
                />: ''}
                {selectKey.factorType == 'Formula'? <Selects value={selectKey.linkDomKey||''} onChange={(e,t,v)=>{
                        self.setKey('linkDomKey', v.value)
                        self.setKey('text', v.text)
                        self.setKey('value', v.value)
                    }} options={formulaOption} /> : ''}
                {selectKey.factorType == 'Calculation'? 
                    <Selects value={selectKey.linkDomKey||''} onChange={(e,t,v)=>{
                        self.setKey('linkDomKey', v.value)
                        self.setKey('text', v.text)
                        self.setKey('value', v.value)
                    }} options={calculationOption} /> : ''}
                </Col>
                
                <Col span="8" className="line-height-3r text-align-right padding-right-1r">key: </Col>
                <Col span="16" className="line-height-3r"><Input
                value={selectKey.key ||''}
                placeholder="请输入"
                maxLength={100}
                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                onChange={(e,t,v)=>{
                    self.setKey('key', v)
                }}
                />
                </Col>
                </Row></Col>
                <Col>
                <Row justify={'flex-end'} className="margin-top-1r border-top border-color-f5f5f5">
                    <Col span={4} className=" padding-all-1r">
                        <Buttons
                            text={'确定'}
                            type={'primary'}
                            size={''}
                            style={{color:'#fff'}}
                            onClick={()=>{
                                if(status) {
                                    self.changeNode(()=>{self.hideModal()})
                                } else {
                                    self.addNode(()=>{self.hideModal()})
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
            </Row>),
                type: 'top',
                containerStyle: { top: '2rem'},
                }} />
          </section>
        );
    }
}
export default FactorRules;