import React , { Component }from 'react';
import { Components } from 'neo';
import Options from './options';
import Messages from './messageConfig';

const {
    Row,
    Col,
    Icon,
    Input,
    Buttons,
    Selects, Loader,Switch
  } = Components;

class EditBtnAction extends Component {
    constructor(props) {
      super(props);
      this.state = {
          datas: this.props.datas||{},
          selectKey: this.props.datas || {},
      };
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            datas: nextProps.datas,
            selectKey: nextProps.datas || {},
        })
    }

    setKey(key, value) {
        const { selectKey } = this.state;
        let newSelectKey = selectKey
        newSelectKey[key] = value
        this.setState({
            selectKey: newSelectKey
        },()=>{
            this.props.handelChange(newSelectKey)
        })
    }
    
    renderOptions(keys){
        const self = this;
        const {selectKey} = this.state;
        const actionOption = self.props.pageList ? self.props.pageList.map((itm, idx)=>{
            return {text: itm.title, value: itm.url}
        }): []
        const apiDom = (<Row>
            <Col className="margin-bottom-1r">
                    <Row >
                        <Col span={8} className="line-height-3r text-align-right padding-right-1r font-size-9">接口请求路径:</Col>
                        <Col span={16} className="line-height-3r">
                            <Input
                                value={selectKey.url|| ''}
                                placeholder="请输入接口请求路径"
                                maxLength={100}
                                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                onChange={(e,t,v)=>{
                                    self.setKey('url', v)
                                    
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col className="margin-bottom-1r">
                    <Row >
                        <Col span={8} className="line-height-3r text-align-right padding-right-1r font-size-9">接口请求方式:</Col>
                        <Col span={16} className="line-height-3r">
                            <Input
                                value={selectKey.method|| ''}
                                placeholder="请输入接口请求方式"
                                maxLength={100}
                                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                onChange={(e,t,v)=>{
                                    self.setKey('method', v)
                                    
                                }}
                            />
                        </Col>
                        <Col span={8} className="line-height-3r text-align-right padding-right-1r">接口请求参数:</Col>
                        <Col span={12} className="padding-bottom-1r">
                        <Options text={'新增参数'} datas={selectKey.options|| []} onChange={(itm)=>{
                            self.setKey('options', itm)
                        }} />
                        </Col>
                        <Col span="8" className="line-height-3r text-align-right padding-right-1r font-size-9">header: </Col>
                        <Col span="16" className="">
                            <Options datas={selectKey.header} onChange={(itm)=>{
                                self.setKey('header', itm)
                            }} />
                        </Col>
                        <Col span="8" className="line-height-3r text-align-right padding-right-1r font-size-9">请求参数转换: </Col>
                        <Col span="16" className="line-height-3r">
                            <Selects value={selectKey.requestType||''} onChange={(e,t,v)=>{
                                self.setKey('requestType', v.value)
                            }} options={[{text: '请选择', value: ''},{text: '字段转换', value: 'transKey'},{text: '隔层取值', value: 'fromKey'}]} />
                        </Col>
                        <Col span="8" className="line-height-3r text-align-right padding-right-1r font-size-9">转换参数配置: </Col>
                        <Col span="16">
                        <Options text={'新增参数'} keyText={'keyWord'} valueText={'被转keyWord'} datas={selectKey.requestOption} onChange={(itm)=>{
                                self.setKey('requestOption', itm)
                            }} />
                        </Col>
                        <Col span="8" className="line-height-3r text-align-right padding-right-1r font-size-9">返回参数转换: </Col>
                        <Col span="16" className="line-height-3r">
                            <Selects value={selectKey.responType||''} onChange={(e,t,v)=>{
                                self.setKey('responType', v.value)
                            }} options={[{text: '请选择', value: ''},{text: '字段转换', value: 'transKey'},{text: '隔层取值', value: 'fromKey'}]} />
                        </Col>
                        <Col span="8" className="line-height-3r text-align-right padding-right-1r font-size-9">转换参数配置: </Col>
                        <Col span="16">
                        <Options text={'新增参数'} keyText={'keyWord'} valueText={'被转keyWord'} datas={selectKey.transOption} onChange={(itm)=>{
                                self.setKey('transOption', itm)
                            }} />
                        </Col>
                        <Col span="8" className="line-height-3r">配置返回码提示: </Col>
                        <Col span="16">
                            <Messages text={'新增参数'} datas={selectKey.codeTip} onChange={(itm)=>{
                                self.setKey('codeTip', itm)
                            }} />
                        </Col>
                    </Row>
                </Col>
        </Row>)
        switch(keys){
            case 'link':
                return (<Row>
                     <Col span={8} className="line-height-3r text-align-right padding-right-1r margin-bottom-1r">跳转页面: </Col>
                    <Col span={10} className="padding-top-p4r margin-bottom-1r">
                    <Selects value={selectKey.actionName||''} onChange={(e,t,v)=>{
                        self.setKey('actionName', v.value)
                        self.setKey('func', ()=>{self.props.go(v.value)})
                    }} options={actionOption} />
                    </Col>
                    <Col span={8} className="line-height-3r text-align-right padding-right-1r">页面显示规则:</Col>
                    <Col span={16} className="">
                        <div className="width-100 line-height-3r">
                        是否打开modal: {selectKey.linkModal} <Switch value={selectKey.linkModal || false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                            self.setKey('linkModal', data);
                        }} />
                        </div>
                    </Col>
                    { selectKey.linkModal ? <Col><Row>
                    <Col span={8} className="line-height-3r text-align-right padding-right-1r">提示框大小: </Col>
                    <Col span={16} className="line-height-3r">
                        <Selects value={selectKey.type||''} onChange={(e,t,v)=>{
                            self.setKey('type', v.value)
                        }} options={[{text: '请选择', value: ''},{text: '偏小', value: 'small'},{text: '中等', value: 'middle'},{text: '较大', value: 'large'}]} />
                    </Col></Row></Col> : ''}
                </Row>)
            case 'doAjax':
                return apiDom;
            case 'downLoad':
                return apiDom;
            case 'doParentSubmitAction':
                return apiDom;
            default: 
                return <div /> ;
        }
    }
    render() {
        const self = this;
        const { selectKey } = this.state;
        let otherDom = self.renderOptions(selectKey.modal, selectKey)
        return(
          <section>
              <Row className="">
                <Col className="margin-bottom-1r">
                    <Row >
                        <Col span={8} className="line-height-3r text-align-right padding-right-1r">类型:</Col>
                        <Col span={10} className="line-height-3r padding-top-p4r">
                        <Selects value={selectKey.modal||''} onChange={(e,t,v)=>{
                        self.setKey('modal', v.value)
                        // self.renderOptions(v.value, selectKey)
                        }} options={[{text: '跳转页面', value: 'link'},{text: '调用接口', value: 'doAjax'},{text: '下载', value: 'downLoad'},{text: '执行上层查询方法', value: 'doParentAction'},{text: '执行上层提交方法', value: 'doParentSubmitAction'}]} />
                        </Col>
                    </Row>
                </Col>
                <Col>{otherDom}</Col>
                </Row>
          </section>
        );
    }
}
export default EditBtnAction;
