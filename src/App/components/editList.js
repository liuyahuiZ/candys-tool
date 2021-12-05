import React , { Component }from 'react';
import { Components } from 'neo';
import Options from './options';
import EditApi from './editApi';

const {
    Row, Col, Icon, Input, Buttons, Selects, TagRadio, Modal, Loader, SortItem, PopContainer, Switch
} = Components;

class EditList extends Component {
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

    setKey(key, value, callback) {
        const { selectKey } = this.state;
        let newSelectKey = selectKey
        newSelectKey[key] = value
        this.setState({
            selectKey: newSelectKey
        },()=>{
            if(callback&& typeof callback == 'function'){
                callback()
            }
        })
    }

    checkInArr(arr, key, value, keyId, valueId){
        let status = false;
        for(let i=0;i<arr.length;i++){
            if(`${arr[i][key]}-${arr[i][keyId]}`== `${value}-${valueId}`) {
                status = true
            }
        }
        return status
    }

    changeNode(arr, key, node){
        for(let i=0;i<arr.length;i++){
            if(`${arr[i][key]}-${arr[i].keyId}`== `${node[key]}-${node.keyId}` ) {
                arr[i] = node
            }
        }
        return arr;
    }
    handelChange(){
        const { datas, selectKey } = this.state;
        if(!this.checkInArr(datas, 'key', selectKey.key, 'keyId', selectKey.keyId)) {
            let newData =  JSON.stringify(datas)=='{}' ? [] : JSON.parse(JSON.stringify(datas));
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
    onSortItems(items){
        this.setState({
            datas: items
        });
    }

    editOptionConfig(key='initRequest'){
        const { selectKey } = this.state;
        const self = this;
        PopContainer.confirm({
            content: (<Row justify="center">
                <Col className="line-height-3r font-size-12 padding-left-1r border-bottom border-color-f5f5f5">
                <Row>
                    <Col span={20}>配置选项接口</Col>
                    <Col span={4} className="text-align-right cursor-pointer" onClick={()=>{PopContainer.closeAll()}}>
                    <Icon iconName={'android-cancel '} size={'140%'} iconColor={'#666'}  /></Col>
                </Row>
                </Col>
                <Col span={18} className="padding-top-1r overflow-y-scroll heighth-45">
                    <EditApi datas={selectKey[key]} handelChange={(res)=>{
                        self.setKey(key, res)
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

    render() {
        const self = this;
        const { datas, selectKey } = this.state;
        let keysDom = datas&&datas.length > 0 ? datas.map((itm, idx)=>{
            return <SortItem
            key={`${idx}-co`}
            onSortItems={(e)=>{this.onSortItems(e)}}
            items={datas}
            className={'minwidth-40 margin-bottom-1 margin-right-3'}
            sortId={idx}>
            <Row className={`${`${selectKey.key}-${selectKey.keyId}`==`${itm.key}-${itm.keyId}`? 'border-color-4698F9 bg-4698F9' :'border-color-999 bg-show'} border-radius-5f border-all overflow-hide padding-left-3 padding-right-3 `} >
            <Col span={14} className={`${ `${selectKey.key}-${selectKey.keyId}`==`${itm.key}-${itm.keyId}` ? 'textcolor-fff' : 'textclolor-333'} padding-all font-size-8  cursor-pointer`} onClick={()=>{
                self.setState({
                    selectKey: itm
                })
            }}>{itm.title}</Col>
            <Col span={4} className="cursor-pointer" onClick={()=>{
                self.setState({
                    selectKey: itm
                })
            }}><Icon iconName={'edit '} size={'140%'} iconColor={`${selectKey.key}-${selectKey.keyId}`==`${itm.key}-${itm.keyId}`? '#fff' :'#5D8EFF'}  /></Col>
            <Col span={4} className="cursor-pointer" onClick={()=>{
                  Modal.formConfirm({ title: '',
                    content: (' 确定删除吗？'),
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
                      self.delNode(itm);
                  },
                  (id, callback) => { callback(id); });
            }}><Icon iconName={'android-remove-circle '} size={'150%'} iconColor={`${selectKey.key}-${selectKey.keyId}`==`${itm.key}-${itm.keyId}`? '#fff' :'#F55936'}  /></Col>
        </Row></SortItem>
        }) : '';

        return(<section>
            <Row className="bg-show padding-all font-size-9">
                <Col className="margin-top-3">
                    <Row>
                        <Col span={4} >keyArr : </Col>
                        <Col span={20}>
                        <Row>{keysDom} 
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
                    </Row>
                </Col>
                <Col className="margin-top-3">
                    <Row>
                        <Col span="8" className="line-height-3r">唯一标识: </Col>
                        <Col span="16"><Input
                        value={selectKey.keyId|| ''}
                        placeholder="请输入"
                        maxLength={100}
                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                        onChange={(e,t,v)=>{
                            self.setKey('keyId', v)
                        }}
                        />
                        </Col>
                        <Col span="8" className="line-height-3r">字段key: </Col>
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
                        <Col span="8" className="line-height-3r">title: </Col>
                        <Col span="16"><Input
                        value={selectKey.title ||''}
                        placeholder="请输入"
                        maxLength={100}
                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                        onChange={(e,t,v)=>{
                            self.setKey('title', v)
                        }}
                        />
                        </Col>
                        <Col span="8" className="line-height-3r">format: </Col>
                        <Col span={16} className="padding-top-1r">
                            <Selects value={selectKey.formatModel||''} onChange={(e,t,v)=>{
                                
                               self.setKey('formatModel', v.value)
                               if(v.value=='date'){
                                self.setKey('formatStr', 'yyyy-MM-dd hh:mm:ss')
                               }
                            }} options={[{text: '不选择', value: ''},{text: '时间模式', value: 'date'},{text: '取绝对值', value: 'absolute'},
                            {text: '字母变大写', value: 'uppercase'},{text: '字母变小写', value: 'lowercase'},{text: '固定字典', value: 'array'},
                            {text: '取小数点后几位', value: 'fixed'},{text: '替换字符串', value: 'replace'},{text: '调用接口', value: 'link'},
                            {text: '动态字典', value: 'direct'}]} />
                            </Col>
                            { selectKey.formatModel =='array' ? <Col>
                            <Options datas={eval(selectKey.formatStr) ||{'00':'成功','99':'失败'}} onChange={(itm)=>{
                                self.setKey('formatStr', itm)
                            }} hasRender /></Col> : ''}
                            { selectKey.formatModel =='date'||selectKey.formatModel =='fixed'||selectKey.formatModel=='replace' ? <Col span={24}><Input
                            value={ selectKey.formatStr}
                            placeholder="请输入"
                            maxLength={100}
                            innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                            onChange={(e,t,v)=>{
                                self.setKey('formatStr', v)
                            }}
                            />
                            </Col> : '' }
                            { selectKey.formatModel=='replace' ? <Col span={24}><Input
                            value={ selectKey.replaceStr}
                            placeholder="请输入要替换的字符串"
                            maxLength={100}
                            innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                            onChange={(e,t,v)=>{
                                self.setKey('replaceStr', v)
                            }}
                            />
                            </Col> : '' }
                            {selectKey.formatModel =='link'||selectKey.formatModel =='direct' ? <Col><Row>
                                <Col span={8}>调用接口：</Col>
                                <Col span={16}><Buttons
                                    text={<div><Icon iconName={'android-add-circle '} size={'150%'} iconColor={'#fff'}  /> 点击配置</div>}
                                    type={'primary'}
                                    size={'small'}
                                    style={{color:'#fff', borderRadius: '3rem'}}
                                    onClick={()=>{
                                        self.editOptionConfig('FormatRequest')
                                    }}
                                /></Col></Row></Col> : ''
                            }
    
                    </Row>
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
          </section>);
    }
}
export default EditList;
