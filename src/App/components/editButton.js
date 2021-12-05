import React , { Component }from 'react';
import { Components } from 'neo';
import SelectIcon from './selectIcon';

const {
    Row,
    Col,
    Input,
    Buttons,
    Selects,
    Loader, Switch, Textarea
  } = Components;

class EditButton extends Component {
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
                              <Col span="8" className="line-height-3r text-align-right padding-right-1r">类型: </Col>
                              <Col span="16">
                              <Selects value={selectKey.type||''} onChange={(e,t,v)=>{
                                self.setKey('type', v.value)
                                // self.renderOptions(v.value, selectKey)
                                }} options={[{text: 'primary', value: 'primary'},{text: 'success', value: 'success'},
                                {text: 'warning', value: 'warning'},{text: 'error', value: 'error'},{text: 'link', value: 'link'}]} />
                              </Col>
                              <Col span="8" className="line-height-3r text-align-right padding-right-1r">大小: </Col>
                              <Col span="16">
                              <Selects value={selectKey.size||''} onChange={(e,t,v)=>{
                                self.setKey('size', v.value)
                                // self.renderOptions(v.value, selectKey)
                                }} options={[{text: 'small', value: 'small'},{text: 'normal', value: ''},{text: 'large', value: 'large'}]} />
                              </Col>
                              <Col span="8" className="line-height-3r text-align-right padding-right-1r">幽灵按钮: </Col>
                              <Col span="16" className="padding-top-1r">
                               <Switch value={selectKey.plain || false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                                    self.setKey('plain', data);
                                }} />  { selectKey.plain ? '开启': '关闭'}
                              </Col>
                              <Col span="8" className="line-height-3r text-align-right padding-right-1r">是否有Icon: </Col>
                              <Col span="16" className="padding-top-1r">
                               <Switch value={selectKey.hasIcon || false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                                    self.setKey('hasIcon', data);
                                }} />  { selectKey.hasIcon ? '有': '无'}
                              </Col>
                              { selectKey.hasIcon ? <Col className={'margin-top-1r'}><Row><Col span="8" className="line-height-3r text-align-right padding-right-1r">选择Icon: </Col>
                              <Col span="16">
                                <SelectIcon value={selectKey.iconName|| ''}  onChange={(v)=>{
                                    self.setKey('iconName', v)
                                }}/>
                              </Col></Row></Col> : ''}
                              <Col span="8" className="line-height-3r text-align-right padding-right-1r">操作前是否有提示: </Col>
                              <Col span="16" className="padding-top-1r">
                               <Switch value={selectKey.modalCheckStatus || false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                                    self.setKey('modalCheckStatus', data);
                                }} />  { selectKey.modalCheckStatus ? '有': '无'}
                              </Col>
                              { selectKey.modalCheckStatus ? <Col><Row>
                                <Col span="8" className="line-height-3r text-align-right padding-right-1r">提示标题: </Col>
                                <Col span="16">
                                    <Input
                                        value={selectKey.modalTitle|| ''}
                                        placeholder="请输入提示标题"
                                        maxLength={100}
                                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                        onChange={(e,t,v)=>{
                                            self.setKey('modalTitle', v)
                                        }}
                                    />
                                </Col>
                                <Col span="8" className="line-height-3r text-align-right padding-right-1r">提示内容: </Col>
                                <Col span="16">
                                    <Textarea
                                        value={selectKey.modalContent|| ''}
                                        placeholder="请输入提示内容"
                                        maxLength={100}
                                        innerStyle={{'lineHeight':'1.5rem', 'height': '3rem'}}
                                        onChange={(v)=>{
                                            self.setKey('modalContent', v)
                                        }}
                                    />
                                </Col>
                              </Row></Col> : ''}
                              
                              <Col >
                                <Row justify={'center'}>
                                <Col span={8}  className="padding-all-1r">
                                    <Buttons
                                        text={'提交'}
                                        type={'primary'}
                                        size={''}
                                        style={{color:'#fff'}}
                                        onClick={()=>{
                                            self.handelChange()
                                        }}
                                    />
                                </Col>
                                </Row>
                              </Col>
                          </Row>
                      </Col>
                  </Row>
            </section>
          );
      }
}
export default EditButton;
