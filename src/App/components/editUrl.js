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
    Selects, Loader
  } = Components;

class EditUrl extends Component {
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
              <Row className="bg-show padding-all font-size-9">
                    <Col className="margin-top-3">
                        <Row>
                            <Col span="8" className="line-height-3r">url: </Col>
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
                            <Col span="8" className="line-height-3r">method: </Col>
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
                            <Col span="8" className="line-height-3r">header: </Col>
                            <Col span="16">
                            <Options datas={selectKey.header} onChange={(itm)=>{
                                self.setKey('header', itm)
                            }} />
                            </Col>
                            <Col span="8" className="line-height-3r">接口请求参数: </Col>
                            <Col span="16">
                                <Options text={'新增参数'} datas={selectKey.options} onChange={(itm)=>{
                                    self.setKey('options', itm)
                                }} />
                            </Col>
                            <Col span="8" className="line-height-3r">respon: </Col>
                            <Col span="16">
                            <Options datas={selectKey.respon} onChange={(itm)=>{
                                self.setKey('respon', itm)
                            }} />
                            </Col>
                            <Col span="8" className="line-height-3r">配置返回码提示: </Col>
                            <Col span="16">
                                <Messages text={'新增参数'} datas={selectKey.codeTip} onChange={(itm)=>{
                                    self.setKey('codeTip', itm)
                                }} />
                            </Col>
                            <Col span="8" className="line-height-3r ">请求参数转换: </Col>
                            <Col span="16" className="line-height-3r">
                                <Selects value={selectKey.requestType||''} onChange={(e,t,v)=>{
                                    self.setKey('requestType', v.value)
                                }} options={[{text: '请选择', value: ''},{text: '字段转换', value: 'transKey'},{text: '隔层取值', value: 'fromKey'}]} />
                            </Col>
                            <Col span="8" className="line-height-3r">转换参数配置: </Col>
                            <Col span="16">
                            <Options text={'新增参数'} keyText={'keyWord'} valueText={'被转keyWord'} datas={selectKey.requestOption} onChange={(itm)=>{
                                    self.setKey('requestOption', itm)
                                }} />
                            </Col>
                            <Col span="8" className="line-height-3r ">返回参数转换: </Col>
                            <Col span="16" className="line-height-3r">
                                <Selects value={selectKey.responType||''} onChange={(e,t,v)=>{
                                    self.setKey('responType', v.value)
                                }} options={[{text: '请选择', value: ''},{text: '字段转换', value: 'transKey'},{text: '隔层取值', value: 'fromKey'}]} />
                            </Col>
                            <Col span="8" className="line-height-3r">转换参数配置: </Col>
                            <Col span="16">
                            <Options text={'新增参数'} keyText={'keyWord'} valueText={'被转keyWord'} datas={selectKey.transOption} onChange={(itm)=>{
                                    self.setKey('transOption', itm)
                                }} />
                            </Col>
                            <Col span={8}>
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
          </section>
        );
    }
}
export default EditUrl;
