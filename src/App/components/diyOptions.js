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
    Selects, Loader, Modal
  } = Components;

class DiyOptions extends Component {
    constructor(props) {
      super(props);
      this.state = {
          datas: this.props.hasRender ? this.renderData(this.props.datas) : this.props.datas ||[],
          selectKey: {},
          text: this.props.text || '新增选项',
          hasRender: this.props.hasRender || false
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

    addNode(){
        const { datas, selectKey, hasRender } = this.state;
        const self = this;
        let newData = datas;
        newData.push({
            text: selectKey.text,
            value: selectKey.value,
            key: selectKey.value,
        })
        this.setState({
            datas: newData
        },()=>{
            let resData = hasRender ? self.resetData(newData) : newData;
            self.props.onChange(resData);
        })
    }

    changeNode(itm){
        const { datas, hasRender } = this.state;
        const self = this;
        let newData = JSON.parse(JSON.stringify(datas));
        for(let i=0;i<newData.length;i++){
            if(newData[i].key== itm.key) {
                newData[i] = itm
            }
        }
        this.setState({
            datas: newData
        },()=>{
            let resData = hasRender ? self.resetData(newData) : newData;
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

    addNewOption(status){
        const self = this;
        const { selectKey, text } = this.state;
        Modal.formConfirm({ title: text || '新增选项',
        content: (<Row className="padding-all">
            <Col span="8" className="line-height-3r text-align-right padding-right-1r">title: </Col>
            <Col span="16" className="line-height-3r"><Input
            value={selectKey.text|| ''}
            placeholder="请输入"
            maxLength={100}
            innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
            onChange={(e,t,v)=>{
                self.setKey('text', v)
            }}
            />
            </Col>
            <Col span="8" className="line-height-3r text-align-right padding-right-1r">key: </Col>
            <Col span="16" className="line-height-3r"><Input
            value={selectKey.value ||''}
            placeholder="请输入"
            maxLength={100}
            innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
            onChange={(e,t,v)=>{
                self.setKey('value', v)
            }}
            />
            </Col>
            <Col span="8" className="line-height-3r text-align-right padding-right-1r">format: </Col>
            <Col span={16}>
            <Selects value={selectKey.formatModel||''} onChange={(e,t,v)=>{
                self.setKey('formatModel', v.value)
            }} options={[{text: '不选择', value: ''},{text: '时间模式', value: 'date'},{text: '数组模式', value: 'array'}]} />
            </Col>
            { selectKey.formatModel =='array' ? <Col>
            <Options datas={eval(selectKey.format) ||{'00':'成功','99':'失败'}} onChange={(itm)=>{
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
        </Row>),
        style: '',
        btnConStyle: 'right',
        btnSure: {
            text: '确认',
            type: 'primary',
            style: { 'height': '2rem', 'minWidth': '100px'}
        },
        btnCancle: {
            text: '取消',
            type: 'primary',
            plain: true,
            style: { 'height': '2rem', 'minWidth': '100px'}
        }
        },
        (id, callback) => { 
            callback(id);
            if(status) {
                self.changeNode(selectKey)
            } else {
                self.addNode()
            }
            
        },
        (id, callback) => { callback(id); });
    }
    render() {
        const self = this;
        const { datas, text } = this.state;

        return(
          <section>
              <Row className="bg-show font-size-9">
                    <Col>
                        <Row>
                            <KeyTags datas={datas} onChange={(itm)=>{ self.setState({ selectKey: itm},()=>{self.addNewOption('edit')}) }} delNode={(itm)=>{ self.delNode(itm);}} /> 
                            <Col span={12}>
                                <Buttons
                                    text={<div><Icon iconName={'android-add-circle '} size={'120%'} iconColor={'#fff'}  /> {text || '新增选项'}</div>}
                                    type={'primary'}
                                    size={'small'}
                                    style={{color:'#fff', borderRadius: '0.5rem'}}
                                    onClick={()=>{
                                        self.setState({ selectKey: {}},()=>{self.addNewOption()})
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
export default DiyOptions;
