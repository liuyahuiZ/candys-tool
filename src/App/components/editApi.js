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
    Selects, Loader, Switch
  } = Components;

class EditApi extends Component {
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
        })
    }
    
    handelChange(){
        const { selectKey } = this.state;
        
        this.props.handelChange(selectKey);
        Loader.show()
        setTimeout(()=>{
            Loader.hide()
        }, 500)
    }

    render() {
        const self = this;
        const { selectKey } = this.state;

        return(
          <section>
              <Row className="bg-show padding-all">
                    <Col className="margin-top-1r">
                        <Row justify="center">
                            <Col span="8" className="line-height-3r text-align-right padding-right-1r">url: </Col>
                            <Col span="16"><Input
                                value={selectKey.url|| ''}
                                placeholder="请输入"
                                maxLength={100}
                                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                onChange={(e,t,v)=>{
                                    self.setKey('url', v)
                                }}
                                />
                            </Col>
                            <Col span="8" className="line-height-3r text-align-right padding-right-1r">method: </Col>
                            <Col span="16"><Input
                                value={selectKey.method ||''}
                                placeholder="请输入"
                                maxLength={100}
                                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                onChange={(e,t,v)=>{
                                    self.setKey('method', v)
                                }}
                                />
                            </Col>
                            <Col span="8" className="line-height-3r text-align-right padding-right-1r">header: </Col>
                            <Col span="16">
                                <Options datas={selectKey.header} onChange={(itm)=>{
                                    self.setKey('header', itm)
                                }} />
                            </Col>
                            <Col span="8" className="line-height-3r text-align-right padding-right-1r">接口请求参数: </Col>
                            <Col span="16">
                                <Options text={'新增参数'} datas={selectKey.options} onChange={(itm)=>{
                                    self.setKey('options', itm)
                                }} />
                            </Col>
                            <Col span="8" className="line-height-3r text-align-right padding-right-1r">配置返回码提示: </Col>
                            <Col span="16">
                                <Messages text={'新增参数'} datas={selectKey.codeTip} onChange={(itm)=>{
                                    self.setKey('codeTip', itm)
                                }} />
                            </Col>
                            <Col span="8" className="line-height-3r text-align-right padding-right-1r">TextKey: </Col>
                            <Col span="16"><Input
                                value={selectKey.textKey ||''}
                                placeholder="请输入"
                                maxLength={100}
                                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                onChange={(e,t,v)=>{
                                    self.setKey('textKey', v)
                                }}
                                />
                            </Col>
                            <Col span="8" className="line-height-3r text-align-right padding-right-1r">ValueKey: </Col>
                            <Col span="16"><Input
                                value={selectKey.valueKey ||''}
                                placeholder="请输入"
                                maxLength={100}
                                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                onChange={(e,t,v)=>{
                                    self.setKey('valueKey', v)
                                }}
                                />
                            </Col>
                            <Col span="8" className="line-height-3r text-align-right padding-right-1r">请求参数转换: </Col>
                            <Col span="16" className="line-height-3r">
                                <Selects value={selectKey.requestType||''} onChange={(e,t,v)=>{
                                    self.setKey('requestType', v.value)
                                }} options={[{text: '请选择', value: ''},{text: '字段转换', value: 'transKey'},{text: '隔层取值', value: 'fromKey'}]} />
                            </Col>
                            <Col span="8" className="line-height-3r text-align-right padding-right-1r">转换参数配置: </Col>
                            <Col span="16">
                            <Options text={'新增参数'} keyText={'keyWord'} valueText={'被转keyWord'} datas={selectKey.requestOption} onChange={(itm)=>{
                                    self.setKey('requestOption', itm)
                                }} />
                            </Col>
                            <Col span="8" className="line-height-3r text-align-right padding-right-1r">返回参数转换: </Col>
                            <Col span="16" className="line-height-3r">
                                <Selects value={selectKey.responType||''} onChange={(e,t,v)=>{
                                    self.setKey('responType', v.value)
                                }} options={[{text: '请选择', value: ''},{text: '字段转换', value: 'transKey'},{text: '隔层取值', value: 'fromKey'}]} />
                            </Col>
                            <Col span="8" className="line-height-3r text-align-right padding-right-1r">转换参数配置: </Col>
                            <Col span="16">
                            <Options text={'新增参数'} keyText={'keyWord'} valueText={'被转keyWord'} datas={selectKey.transOption} onChange={(itm)=>{
                                    self.setKey('transOption', itm)
                                }} />
                            </Col>
                            <Col span="8" className="line-height-3r text-align-right padding-right-1r">是否将结果缓存到数据字典: </Col>
                            <Col span="16" className="padding-top-1r">
                            <Switch value={ selectKey.isDirect}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                                self.setKey('isDirect', data);
                            }} /> {selectKey.isDirect ? '开启' : '关闭'}
                            </Col>
                            <Col span="8" className="line-height-3r text-align-right padding-right-1r">是否从缓存的数据字典读取数据: </Col>
                            <Col span="16" className="padding-top-1r">
                            <Switch value={ selectKey.isDirectRead}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                                self.setKey('isDirectRead', data);
                            }} /> {selectKey.isDirectRead ? '开启' : '关闭'}
                            </Col>
                            <Col span="8" className="line-height-3r"> </Col>
                            <Col span="16" className="font-size-8 textclolor-black-low">
                                开启后，再获取数据时先从数据字典中获取，获取不到，再调用接口
                            </Col>
                            { selectKey.isDirect ?
                                <Col><Row>
                                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">输入字典名称</Col>
                                    <Col span="16">
                                        <Input
                                        value={selectKey.directName ||''}
                                        placeholder="请输入"
                                        maxLength={100}
                                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                        onChange={(e,t,v)=>{
                                            self.setKey('directName', v)
                                        }}
                                        />
                                    </Col>
                                    <Col span="8" className="line-height-3r"> </Col>
                                    <Col span="16" className="font-size-8 textclolor-black-low">
                                        命名规范，例如：接口的api_返回valueKey  query_agent
                                    </Col>
                                </Row></Col>
                            : ''
                            }
                        </Row>
                    </Col>
                    
                    <Col>
                        <Row justify='flex-end' className="margin-top-1r border-top border-color-f5f5f5">
                        <Col span={4} className="margin-top-1r ">
                                <Buttons
                                    text={'提交'}
                                    type={'primary'}
                                    size={'normal'}
                                    style={{color:'#fff'}}
                                    onClick={()=>{
                                        self.handelChange()
                                    }}
                                />
                        </Col>
                        </Row>
                    </Col>
                </Row>
          </section>
        );
    }
}
export default EditApi;
