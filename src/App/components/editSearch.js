import React , { Component }from 'react';
import { Components } from 'neo';
import KeyTags from './keyTags';
import Options from './options';
import DiyOptions from './diyOptions';
import EditApi from './editApi';
import EditFormChange from './editFormChange';
import GetCache from './getCache';

const {
    Row,
    Col,
    Icon,
    Input,
    Buttons,
    Selects,
    Switch,
    TagRadio,
    Textarea, Modal, Loader, PopContainer, DragCont, SortItem
  } = Components;

class EditSearch extends Component {
    constructor(props) {
      super(props);
      this.state = {
          datas: this.props.datas||[],
          selectKey: {},
          cacheKey: {},
          items: [1,2,3,4],
          formTypes: [{text: '请选择', value: ''},{text: 'text', value: 'text'},{text: 'selects', value: 'selects'},{text: 'date', value: 'date'},
          {text: 'switch', value: 'switch'},{text: 'textarea', value: 'textarea'},{text: 'number', value: 'number'},{text: 'Text', value: 'Text'},{text: 'Editor', value: 'Editor'},{text: 'InnerText', value: 'InnerText'},
          {text: 'Radio', value: 'Radio'},{text: 'Checkbox', value: 'Checkbox'},{text: 'TagRadio', value: 'TagRadio'},{text: 'FileUp', value: 'FileUp'},{text: 'Image', value: 'Image'},{text: 'ImageArr', value: 'ImageArr'},
          {text: 'NumFormPart', value: 'NumFormPart'},{text: 'SelectTablePart', value: 'SelectTablePart'}, {text: 'EditTablePart', value: 'EditTablePart'}, {text: 'LookBack', value: 'LookBack'},{text: 'DynamicNumFormPart', value: 'DynamicNumFormPart'} ]
      };
    }
    componentDidMount(){
        this.initSelectKey()
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            datas: nextProps.datas||[],
        })
    }

    initSelectKey(){
        this.setState({
            selectKey: {
                hasOnchange: false,
                isShow: true,
                disabled: false
                
            }
        })
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

    renderOptions(keys, obg){
        const self = this;
        const actionOption = self.props.pageList ? self.props.pageList.map((itm, idx)=>{
            return {text: itm.title, value: itm.url}
        }): [];
        const radioDom = (<Row>
                    <Col span="8" className="line-height-3r">options动态获取: </Col>
                    <Col span="16" className="padding-top-1r"><Switch value={obg.hasRequest} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                        self.setKey('hasRequest', date)
                    }} />
                    </Col>
                    {obg.hasRequest ? <Col><Row>
                        <Col span={8}>配置参数：</Col>
                        <Col span={16}><Buttons
                            text={<div><Icon iconName={'android-add-circle '} size={'150%'} iconColor={'#fff'}  /> 点击配置</div>}
                            type={'primary'}
                            size={'small'}
                            style={{color:'#fff', borderRadius: '3rem'}}
                            onClick={()=>{
                                self.editOptionConfig()
                            }}
                        /></Col>
                    </Row></Col> : ''}
                    {!obg.hasRequest ? <Col><Row>
                    <Col span="8" className="line-height-3r">options: </Col>
                    <Col span="16">
                    <Options datas={eval(obg.options)} onChange={(itm)=>{
                                self.setKey('options', itm)
                    }} />
                    </Col></Row></Col>: ''}
        </Row>);

        const selectDom = (<Row>
            <Col span="8" className="line-height-3r">options动态获取: </Col>
            <Col span="16" className="padding-top-1r"><Switch value={obg.hasRequest} checkedText={'Y'} unCheckText={'N'} onchange={(date)=>{
                self.setKey('hasRequest', date)
            }} /> { obg.hasRequest ? '开启': '关闭'}
            </Col>
            {obg.hasRequest ? <Col><Row>
                <Col span={8} className="line-height-3r">是否开启初始化查询：</Col>
                <Col span={16} className="padding-top-1r"><Switch value={obg.enableOptionInitRequest} checkedText={'Y'} unCheckText={'N'} onchange={(date)=>{
                self.setKey('enableOptionInitRequest', date)
            }} /> { obg.enableOptionInitRequest ? '开启': '关闭'}</Col>
            </Row>
            <Row>
                <Col span={8} className="line-height-3r">配置参数：</Col>
                <Col span={16}><Buttons
                    text={<div><Icon iconName={'android-add-circle '} size={'150%'} iconColor={'#fff'}  /> 点击配置</div>}
                    type={'primary'}
                    size={'small'}
                    style={{color:'#fff', borderRadius: '3rem'}}
                    onClick={()=>{
                        self.editOptionConfig()
                    }}
                /></Col>
            </Row>
            <Row className="margin-top-1r">
                <Col span={8} className="line-height-3r">配置返回参数：</Col>
                <Col span={16}>
                    <DiyOptions datas={eval(obg.tableList)} onChange={(itm)=>{
                        self.setKey('tableList', itm)
                    }} />
                </Col>
            </Row></Col> : ''}
            {!obg.hasRequest ? <Col><Row>
            <Col span="8" className="line-height-3r">options: </Col>
            <Col span="16">
            <Options datas={eval(obg.options)} onChange={(itm)=>{
                self.setKey('options', itm)
            }} />
            </Col></Row></Col>: ''}

            <Col span="8" className="line-height-3r">filter: </Col>
            <Col span="16" className="padding-top-1r"><Switch value={obg.filter} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                self.setKey('filter', date)
            }} />
            </Col>
        </Row>)
        switch(keys){
            case 'text':
                return (<Row>
                    
                    <Col span="8" className="line-height-3r">placeholder: </Col>
                    <Col span="16"><Input
                    value={obg.placeholder}
                    placeholder="请输入"
                    maxLength={100}
                    innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                    onChange={(e,t,v)=>{
                        self.setKey('placeholder', v)
                    }}
                    />
                    </Col>
                    <Col span="8" className="line-height-3r">maxLength: </Col>
                    <Col span="16"><Input
                    value={obg.maxLength}
                    placeholder="请输入"
                    maxLength={100}
                    innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                    onChange={(e,t,v)=>{
                        self.setKey('maxLength', v)
                    }}
                    />
                    </Col>
                    <Col span="8" className="line-height-3r">after: </Col>
                    <Col span="16"><Input
                    value={obg.after}
                    placeholder="请输入"
                    maxLength={100}
                    innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                    onChange={(e,t,v)=>{
                        self.setKey('after', v)
                    }}
                    />
                    </Col>
                </Row>)
            case 'selects':
                return (selectDom);
            case 'SelectTablePart':
                return selectDom
            case 'date':
                return (<Row>
                    <Col span="8" className="line-height-3r">默认值: </Col>
                    <Col span="16" className="padding-top-1r">
                        <Switch value={obg.defaultValue} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                        self.setKey('defaultValue', date)
                        }} />
                    </Col>
                    <Col span="8" className="line-height-3r">dateFormat: </Col>
                    <Col span="16"><Input
                    value={obg.dateFormat}
                    placeholder="请输入,例如'YYYY-MM-DD'"
                    maxLength={100}
                    innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                    onChange={(e,t,v)=>{
                        self.setKey('dateFormat', v)
                    }}
                    />
                    </Col>
                    <Col span="8" className="line-height-3r">模式: </Col>
                    <Col span="16" >
                    <Selects value={obg.model||''} onChange={(e,t,v)=>{
                        self.setKey('model', v.value)
                    }} options={[{text: '区间模式', value: 'simple'},{text: '月模式', value: 'month'},{text: '单体模式', value: 'date'},{text: '时分秒模式', value: 'time'}]} />
                    </Col>
                    <Col span="8" className="line-height-3r">是否展示时分秒: </Col>
                    <Col span="16" className="padding-top-1r">
                        <Switch value={obg.showHour} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                        self.setKey('showHour', date)
                        }} /> { obg.showHour ? '显示': '关闭'}
                    </Col>
                </Row>)
            case 'switch':
                return (<Row>
                    <Col span="8" className="line-height-3r">style: </Col>
                    <Col span="16"><Input
                    value={''}
                    placeholder="请输入"
                    maxLength={100}
                    innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                    onChange={(e,t,v)=>{
                        
                    }}
                    />
                    </Col>
                </Row>)
            case 'textarea':
            return (<Row>
                <Col span="8" className="line-height-3r">maxLength: </Col>
                <Col span="16"><Input
                value={obg.maxLength}
                placeholder="请输入"
                maxLength={100}
                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                onChange={(e,t,v)=>{
                    self.setKey('maxLength', v)
                }}
                />
                </Col>
            </Row>)
            case 'NumFormPart': 
            return (<Row>
                <Col span="8" className="line-height-3r">keyText: </Col>
                <Col span="16"><Input
                value={obg.keyText}
                placeholder="请输入"
                maxLength={100}
                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                onChange={(e,t,v)=>{
                    self.setKey('keyText', v)
                }}
                />
                </Col>
                <Col span="8" className="line-height-3r">valueText: </Col>
                <Col span="16"><Input
                value={obg.valueText}
                placeholder="请输入"
                maxLength={100}
                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                onChange={(e,t,v)=>{
                    self.setKey('valueText', v)
                }}
                />
                </Col>
            </Row>)
            case 'Radio':
                return radioDom;
            case 'Checkbox':
                return radioDom;
            case 'TagRadio':
                return radioDom;
            case 'FileUp':
                return (<Row>
                    <Col span="8" className="line-height-3r">typeModel: </Col>
                    <Col span="16">
                    <Selects value={obg.typeModel||''} onChange={(e,t,v)=>{
                        self.setKey('typeModel', v.value)
                    }} options={[{text: '图像模式', value: 'View'},{text: '列表模式', value: 'Button'}]} />
                    </Col>
                    <Col span="8" className="line-height-3r">fileModel: </Col>
                    <Col span="16">
                    <Selects value={obg.fileModel||''} onChange={(e,t,v)=>{
                        self.setKey('fileModel', v.value)
                    }} options={[{text: '单文件模式', value: 'SINGEL'},{text: '多文件模式', value: 'MULTIPLE'}]} />
                    </Col>
                    <Col span="8" className="line-height-3r">文字描述: </Col>
                    <Col span="16"><Input
                    value={obg.description}
                    placeholder="请输入"
                    maxLength={100}
                    innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                    onChange={(e,t,v)=>{
                        self.setKey('description', v)
                    }}
                    />
                    </Col>
                    <Col span="8" className="line-height-3r">拼接URL: </Col>
                    <Col span="16"><Input
                    value={obg.defalutURl}
                    placeholder="请输入例如：http://xx.xx.x.x:xxx/xx/${content}"
                    maxLength={100}
                    innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                    onChange={(e,t,v)=>{
                        self.setKey('defalutURl', v)
                    }}
                    />
                    </Col>
                    <Col span="8" className="line-height-3r">可选文件格式: </Col>
                    <Col span="16"><Input
                    value={obg.accept}
                    placeholder="请输入 如：image/*"
                    maxLength={100}
                    innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                    onChange={(e,t,v)=>{
                        self.setKey('accept', v)
                    }}
                    />
                    </Col>

                    <Col span="8" className="line-height-3r">文件编码格式: </Col>
                    <Col span="16">
                    <Selects value={obg.fileType||''} onChange={(e,t,v)=>{
                        self.setKey('fileType', v.value)
                    }} options={[{text: 'base64', value: 'base64'},{text: 'blob', value: 'blob'}]} />
                    </Col>
                    <Col span="8" className="line-height-3r">文件大小限制: </Col>
                    <Col span="16"><Input
                    value={obg.limitSize}
                    placeholder="请输入 (单位字节)"
                    maxLength={100}
                    innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                    onChange={(e,t,v)=>{
                        self.setKey('limitSize', v)
                    }}
                    />
                    </Col>
                    {obg.typeModel == 'View' ? <Col><Row>
                    <Col span="8" className="line-height-3r">开启压缩: </Col>
                    <Col span="16" className="padding-top-1r">
                    <Switch value={obg.compress} checkedText={'Y'} unCheckText={'N'} onchange={(date)=>{
                        self.setKey('compress', date)
                    }} /> { obg.compress ? '开启': '关闭'}
                    </Col>
                    </Row></Col>: ''}
                    {obg.compress ? <Col><Row>
                    <Col span="8" className="line-height-3r">压缩质量: </Col>
                    <Col span="16"><Input
                    value={obg.quality}
                    placeholder="请输入0~100"
                    maxLength={100}
                    innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                    onChange={(e,t,v)=>{
                        self.setKey('quality', v)
                    }}
                    />
                    </Col>
                    </Row></Col>: ''}
                    <Col><Row>
                        <Col span={8}>上传接口：</Col>
                        <Col span={16}><Buttons
                            text={<div><Icon iconName={'android-add-circle '} size={'150%'} iconColor={'#fff'}  /> 点击配置</div>}
                            type={'primary'}
                            size={'small'}
                            style={{color:'#fff', borderRadius: '3rem'}}
                            onClick={()=>{
                                self.editOptionConfig('doRequest')
                            }}
                        /></Col>
                    </Row></Col>

                    <Col span="8" className="line-height-3r">是否显示已上传文件: </Col>
                    <Col span="16" className="padding-top-1r">
                    <Switch value={obg.showFiles} checkedText={'Y'} unCheckText={'N'} onchange={(date)=>{
                        self.setKey('showFiles', date)
                    }} /> { obg.showFiles ? '显示': '隐藏'}
                    </Col>
                </Row>)
            case 'Image': 
                return (<Row>
                <Col span="8" className="line-height-3r">拼接URL: </Col>
                <Col span="16"><Input
                value={obg.imageURl}
                placeholder="请输入例如：http://xx.xx.x.x:xxx/xx/${content}"
                maxLength={100}
                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                onChange={(e,t,v)=>{
                    self.setKey('imageURl', v)
                }}
                />
                </Col>
            </Row>)
            case 'ImageArr': 
            return (<Row>
            <Col span="8" className="line-height-3r">拼接URL: </Col>
            <Col span="16"><Input
            value={obg.imageURl}
            placeholder="请输入例如：http://xx.xx.x.x:xxx/xx/${content}"
            maxLength={100}
            innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
            onChange={(e,t,v)=>{
                self.setKey('imageURl', v)
            }}
            />
            </Col>
            <Col span="8" className="line-height-3r">动态获取: </Col>
            <Col span="16" className="padding-top-1r"><Switch value={obg.hasRequest} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                self.setKey('hasRequest', date)
            }} />
            </Col>
            {obg.hasRequest ? <Col><Row>
                <Col span={8}>配置参数：</Col>
                <Col span={16}><Buttons
                    text={<div><Icon iconName={'android-add-circle '} size={'150%'} iconColor={'#fff'}  /> 点击配置</div>}
                    type={'primary'}
                    size={'small'}
                    style={{color:'#fff', borderRadius: '3rem'}}
                    onClick={()=>{
                        self.editOptionConfig('imgArrRequest')
                    }}
                /></Col>
            </Row></Col> : ''}
            </Row>)
            case 'LookBack':
                return (<Row>
                    <Col span={8} className="line-height-3r">选择模板 </Col>
                <Col span="16">
                <Selects value={obg.actionName||''} onChange={(e,t,v)=>{
                    self.setKey('actionName', v.value)
                }} options={actionOption} />
                </Col>
                <Col span={8} className="line-height-3r">带回模式 </Col>
                <Col span="16">
                <Selects value={obg.selectModal||''} onChange={(e,t,v)=>{
                    self.setKey('selectModal', v.value)
                }} options={[{text: '单选模式', value: 'SINGEL'},{text: '多选模式', value: 'MULTIPLE'}]} />
                </Col>
                <Col span={8} className="line-height-3r">展示字段配置 </Col>
                <Col span="16">默认展示配置的第一个key
                <Options datas={eval(obg.showKey)} onChange={(itm)=>{
                        self.setKey('showKey', itm)
                    }} />
                </Col>
                </Row>)
            case 'number':
                return (<Row>
                <Col span="8" className="line-height-3r">min: </Col>
                <Col span="16"><Input
                value={obg.min}
                placeholder="请输入"
                maxLength={100}
                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                onChange={(e,t,v)=>{
                    self.setKey('min', v)
                }}
                />
                </Col>
                <Col span="8" className="line-height-3r">max: </Col>
                <Col span="16"><Input
                value={obg.max}
                placeholder="请输入"
                maxLength={100}
                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                onChange={(e,t,v)=>{
                    self.setKey('max', v)
                }}
                />
                </Col>
            </Row>)
            case 'DynamicNumFormPart':
            return (
                <Row>
                <Col span="8" className="line-height-3r">动态模板: </Col>
                <Col span="16">
                    <Selects value={obg.dynamicName||''} onChange={(e,t,v)=>{
                        self.setKey('dynamicName', v.value)
                    }} options={actionOption} />
                </Col>
                <Col span="8" className="line-height-3r">是否开启手动编辑个数: </Col>
                <Col span="16" className="padding-top-1r">
                    <Switch value={obg.showEdit} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                        self.setKey('showEdit', date)
                    }} /> { obg.showEdit ? '开启' : '关闭' }
                </Col>
                
                </Row>
            )
            case 'InnerText':
            return (<Row>
                <Col span="8" className="line-height-3r">文本内容: </Col>
                <Col span="16"><Textarea
                value={obg.content}
                placeholder="请输入"
                maxLength={100}
                innerStyle={{'lineHeight':'1.5rem', 'height': '3rem'}}
                onChange={(v)=>{
                    
                    self.setKey('content', v)
                }}
                />
                </Col>
                <Col span="8" className="line-height-3r">字体大小: </Col>
                <Col span="16"><Input
                value={obg.fontSize}
                placeholder="请输入"
                maxLength={100}
                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                onChange={(e,t,v)=>{
                    
                    self.setKey('fontSize', v)
                }}
                />
                </Col>
                <Col span="8" className="line-height-3r">字体颜色: </Col>
                <Col span="16"><Input
                value={obg.color}
                placeholder="请输入"
                maxLength={100}
                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                onChange={(e,t,v)=>{
                    self.setKey('color', v)
                }}
                />
                </Col>
            </Row>)
            default: 
                return <div /> ;

        }
    }

    setKey(key, value) {
        const { selectKey } = this.state;
        let newSelectKey = selectKey
        newSelectKey[key] = value
        this.setState({
            selectKey: newSelectKey
        })
    }

    checkInArr(arr, key, value, keyId, valueId){
        let status = false;
        if(!arr) return status;
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
    handelChange(){
        const { datas, selectKey } = this.state;
        let releData = datas
        if(JSON.stringify(datas)=='{}'){
            releData = []
        }
        if(!this.checkInArr(releData, 'key', selectKey.key, 'keyId', selectKey.keyId)) {
            let newData = releData|| []
            newData.push(selectKey)
            this.setState({datas: newData},()=>{
                this.props.handelChange(newData)
            })
        } else{
            let newData = this.changeNode(releData, 'key', selectKey);
            this.setState({datas: newData},()=>{
                this.props.handelChange(newData)
            })
        }
        Loader.show()
        setTimeout(()=>{
            Loader.hide()
        }, 500)
    }

    render() {
        const self = this;
        const { datas, selectKey, formTypes } = this.state;
        let otherDom = self.renderOptions(selectKey.type, selectKey)
        const actionOption = self.props.pageList ? self.props.pageList.map((itm, idx)=>{
            return {text: itm.title, value: itm.url}
        }): [];

        return(
          <section>
              <Row className="bg-show padding-all margin-top-3 font-size-9">
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
                                self.initSelectKey()
                            }}
                        />
                    </Col></Row>
                    </Col>
                    <Col className="margin-top-3">
                        <Row >
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
                            <Col span="8" className="line-height-3r">标题文本: </Col>
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
                            <Col span="8" className="line-height-3r">默认值: </Col>
                            <Col span="16"><Input
                            value={selectKey.value|| ''}
                            placeholder="请输入"
                            maxLength={100}
                            innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                            onChange={(e,t,v)=>{
                                self.setKey('value', v)
                            }}
                            />
                            <GetCache defalut={selectKey.cacheKey} onChange={(v)=>{ self.setKey('cacheKey', v) }} />
                            </Col>
                            <Col span="8" className="line-height-3r">默认显示: </Col>
                            <Col span="16" className="padding-top-1r">
                            <Switch value={selectKey.isShow!==undefined ? selectKey.isShow: true} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                                self.setKey('isShow', date)
                            }} /> { selectKey.isShow ? '显示': '隐藏'}
                            </Col>
                            <Col span="8" className="line-height-3r">是否启用: </Col>
                            <Col span="16" className="padding-top-1r">
                            <Switch value={selectKey.disabled!==undefined ? selectKey.disabled: false} checkedText={'N'} unCheckText={'Y'} onchange={(date)=>{
                                self.setKey('disabled', date)
                            }} /> { selectKey.disabled ? '禁用': '启用'}
                            </Col>
                            <Col span="8" className="line-height-3r">contStyle: </Col>
                            <Col span="16">
                            <Options datas={eval(selectKey.contStyle)} onChange={(itm)=>{
                                self.setKey('contStyle', itm)
                            }} />
                            </Col>
                            <Col span="8" className="line-height-3r">textContStyle: </Col>
                            <Col span="16">
                            <Options datas={eval(selectKey.textContStyle)} onChange={(itm)=>{
                                self.setKey('textContStyle', itm)
                            }} />
                            </Col>
                            <Col span="8" className="line-height-3r">labelStyle: </Col>
                            <Col span="16">
                            <Options datas={eval(selectKey.labelStyle)} onChange={(itm)=>{
                                self.setKey('labelStyle', itm)
                            }} />
                            </Col>
                            <Col span="8" className="line-height-3r">valid校验: </Col>
                            <Col span="16">
                            <Selects value={selectKey.valid||''} onChange={(e,t,v)=>{
                                self.setKey('valid', v.value)
                            }} options={[{text: '请选择', value: null},{text: '必填', value: 'required'},{text: '数字', value: 'number'},{text: '百分比', value: 'percent'}, 
                            {text: '手机号', value: 'mobile'},{text: '自定义', value: 'diy'}]} />
                            </Col>
                            {selectKey.valid=='diy' ? <Row className="width-100">
                                <Col span="8" className="line-height-3r">自定义valid: </Col>
                                <Col span="16"><Input
                                value={ selectKey.validDiy ||''}
                                placeholder="请输入"
                                maxLength={100}
                                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                onChange={(e,t,v)=>{
                                    self.setKey('validDiy', v)
                                }}
                                />
                                </Col>
                            </Row> : ''}
                            {selectKey.valid ? <Row className="width-100">
                                <Col span="8" className="line-height-3r">错误提示: </Col>
                                <Col span="16"><Input
                                value={ selectKey.errorMsg ||''}
                                placeholder="请输入"
                                maxLength={100}
                                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                onChange={(e,t,v)=>{
                                    self.setKey('errorMsg', v)
                                }}
                                />
                                </Col>
                            </Row> : ''}
                            <Col span="8" className="line-height-3r">调用模板: </Col>
                            <Col span="16" className="padding-top-1r"><Switch value={selectKey.hasTmplate} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                                self.setKey('hasTmplate', date)
                            }} /> { selectKey.hasTmplate ? '开启': '关闭'}
                            </Col>
                            {selectKey.hasTmplate ? <Col><Row>
                                <Col span={8} className="line-height-3r">选择模板 </Col>
                            <Col span="16">
                            <Selects value={selectKey.actionName||''} onChange={(e,t,v)=>{
                                
                                self.setKey('actionName', v.value)
                            }} options={actionOption} />
                            </Col></Row></Col>: ''}
                            {!selectKey.hasTmplate ? <Col><Row>
                            <Col span="8" className="line-height-3r">表单类型: </Col>
                            <Col span="16"><Selects value={selectKey.type||''} onChange={(e,t,v)=>{
                                self.setKey('type', v.value)
                                self.renderOptions(v.value, selectKey)
                            }} options={formTypes} />
                            </Col>
                            <Col>
                                {otherDom}
                            </Col></Row></Col> : ''}
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
                            <Options datas={eval(selectKey.formatStr)||eval(selectKey.format)} onChange={(itm)=>{
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
                            <Col span={8} className="line-height-3r">onChange: </Col>
                            <Col span={16} className="padding-top-1r"><Switch value={selectKey.hasOnchange} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                                self.setKey('hasOnchange', date)
                            }} /> { selectKey.hasOnchange ? '开启': '关闭'}
                            </Col>
                            {selectKey.hasOnchange ? 
                            <Col><EditFormChange datas={selectKey.changeConfigs} formItem={datas} handelChange={(res)=>{
                                self.setKey('changeConfigs', res)
                            }} /></Col> : ''}
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
export default EditSearch;
