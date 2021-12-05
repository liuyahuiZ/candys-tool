import React , { Component }from 'react';
import { Components } from 'neo';
import { checkInArr, changeNode } from '../utils/index'
import KeyTags from './keyTags';

const {
    Row,
    Col,
    Icon,
    Input,
    Buttons,
    Selects, Loader
  } = Components;

class EditTab extends Component {
    constructor(props) {
      super(props);
      this.state = {
          datas: this.props.datas||{},
          selectKey: {},
      };
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            datas: nextProps.datas
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
        const { datas, selectKey } = this.state;
        if(!checkInArr(datas, 'key', selectKey.key)) {
            let newData = datas
            newData.push(selectKey)
            this.setState({datas: newData},()=>{
                this.props.handelChange(newData)
            })
        } else{
            let newData = changeNode(datas, 'key', selectKey);
            this.setState({datas: newData},()=>{
                this.props.handelChange(newData)
            })
        }
        Loader.show()
        setTimeout(()=>{
            Loader.hide()
        }, 500)
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
        // this.props.handelChange(newData)
    }

    addNode(callback){
        const {datas, selectKey} = this.state;
        let newData = datas;
        newData.push(selectKey);
        this.setState({
            datas: newData
        },()=>{
            callback()
        });
        // this.props.handelChange(newData)
    }

    editNode(callback){
        const { datas, selectKey } = this.state;
        if(!checkInArr(datas, 'key', selectKey.key)) {
            let newData = datas
            newData.push(selectKey)
            this.setState({datas: newData},()=>{
                callback()
            })
        } else{
            let newData = changeNode(datas, 'key', selectKey);
            this.setState({datas: newData},()=>{
                callback()
            })
        }

    }

    render() {
        const self = this;
        const { datas, selectKey } = this.state;
        const actionOption = self.props.pageList ? self.props.pageList.map((itm, idx)=>{
            return {text: itm.title, value: itm.url}
        }): [];
        return(
          <section>
              <Row className="bg-show padding-all font-size-9">
                    <Col className="margin-top-3">
                        <Row>
                            <Col span={4}>keyArr : </Col>
                            <Col span={20}>
                                <Row><KeyTags datas={datas} onChange={(itm)=>{ self.setState({ selectKey: itm}) }} delNode={(itm)=>{ self.delNode(itm);}} />
                                    <Col span={9}>
                                        <Buttons
                                            text={<div><Icon iconName={'android-add-circle '} size={'150%'} iconColor={'#fff'}  /> 新增key</div>}
                                            type={'primary'}
                                            size={'small'}
                                            style={{color:'#fff', borderRadius: '3rem'}}
                                            onClick={()=>{
                                                self.setState({
                                                    selectKey: {}
                                                })
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            
                            <Col span="8" className="line-height-3r">tab名称: </Col>
                            <Col span="16"><Input
                            value={selectKey.text|| ''}
                            placeholder="请输入"
                            maxLength={100}
                            innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                            onChange={(e,t,v)=>{
                                self.setKey('text', v)
                            }}
                            />
                            </Col>
                            <Col span="8" className="line-height-3r">key: </Col>
                            <Col span="16"><Input
                            value={selectKey.key ||''}
                            placeholder="请输入"
                            maxLength={100}
                            innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                            onChange={(e,t,v)=>{
                                self.setKey('key', v)
                            }}
                            />
                            </Col>
                            <Col span="8" className="line-height-3r">content: </Col>
                            <Col span="16">
                            <Selects value={selectKey.actionName||''} onChange={(e,t,v)=>{
                                
                                self.setKey('actionName', v.value)
                            }} options={actionOption} />
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
export default EditTab;
