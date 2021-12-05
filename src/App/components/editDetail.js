import React , { Component }from 'react';
import { Components } from 'neo';
import KeyTags from './keyTags';
import Options from './options';

const {
    Row,
    Col,
    Icon,
    Input,
    Buttons,
    Selects,
    TagRadio,
    Modal, Loader
  } = Components;

class EditDetail extends Component {
    constructor(props) {
      super(props);
      this.state = {
          datas: this.props.datas||[],
          selectKey: {},
          cacheKey: {}
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
    handelChange(){
        const { datas, selectKey } = this.state;
        if(!this.checkInArr(datas, 'key', selectKey.key)) {
            let newData = datas
            newData.push(selectKey)
            this.setState({datas: newData},()=>{
                this.props.handelChange(newData)
            })
        } else{
            let newData = this.changeNode(datas, 'key', selectKey);
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
        this.props.handelChange(newData)

    }

    render() {
        const self = this;
        const { datas, selectKey } = this.state;
        return(
          <section>
              <Row className="bg-show padding-all font-size-9">
                    <Col span={4}>keyArr : </Col>
                    <Col span={20}>
                    <Row>
                    <KeyTags datas={datas} onChange={(itm)=>{ self.setState({ selectKey: itm}) }} delNode={(itm)=>{ self.delNode(itm);}} /> 
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
                        /></Col></Row>
                    </Col>
                    <Col className="margin-top-3">
                        <Row>
                            <Col span="8" className="line-height-3r">key: </Col>
                            <Col span="16"><Input
                            value={selectKey.key|| ''}
                            placeholder="请输入"
                            maxLength={100}
                            innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                            onChange={(e,t,v)=>{
                                self.setKey('key', v)
                            }}
                            />
                            </Col>
                            <Col span="8" className="line-height-3r">text: </Col>
                            <Col span="16"><Input
                            value={selectKey.text ||''}
                            placeholder="请输入"
                            maxLength={100}
                            innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                            onChange={(e,t,v)=>{
                                self.setKey('text', v)
                            }}
                            />
                            </Col>
                            <Col span="8" className="line-height-3r">format: </Col>
                            <Col span={16}>
                            <Selects value={selectKey.formatModel||''} onChange={(e,t,v)=>{
                               self.setKey('formatModel', v.value)
                            }} options={[{text: '不选择', value: ''},{text: '时间模式', value: 'date'},{text: '数组模式', value: 'array'}]} />
                            </Col>
                            {}
                            { selectKey.formatModel =='array' ? <Col>
                            <Options datas={eval(selectKey.format) ||{}} onChange={(itm)=>{
                                self.setKey('format', itm)
                            }} hasRender /></Col> : ''}
                            { selectKey.formatModel =='date' ? <Col span={24}><Input
                            value={ selectKey.formatDate ||"['date', 'yyyy-MM-dd hh:mm:ss']"}
                            placeholder="请输入"
                            maxLength={100}
                            innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                            onChange={(e,t,v)=>{
                                self.setKey('formatDate', v, ()=>{
                                    self.setKey('format', v)
                                })
                            }}
                            />
                            </Col> : '' }
                       
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
export default EditDetail;
