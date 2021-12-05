import React , { Component }from 'react';
import { Components } from 'neo';
import KeyTags from './keyTags';
import Options from './options';
import EditApi from './editApi';

const {
    Row,
    Col,
    Icon,
    Input,
    Buttons,
    Selects,
    TagRadio,Switch,
    Modal, Loader, ExModal, SortItem, PopContainer, Textarea
  } = Components;

class EditDetailRich extends Component {
    constructor(props) {
      super(props);
      this.state = {
          datas: this.props.datas||[{}],
          selectKey: {},
          cacheKey: {},
          MDdisplay: '',
          MDaction: '',
          formTypes: [{text: '请选择', value: ''},{text: 'text', value: 'text'},{text: 'selects', value: 'selects'},{text: 'date', value: 'date'},
          {text: 'switch', value: 'switch'},{text: 'textarea', value: 'textarea'},{text: 'number', value: 'number'},{text: 'Text', value: 'Text'},{text: 'InnerText', value: 'InnerText'},
          {text: 'Radio', value: 'Radio'},{text: 'Checkbox', value: 'Checkbox'},{text: 'TagRadio', value: 'TagRadio'},{text: 'Image', value: 'Image'},
          {text: 'NumFormPart', value: 'NumFormPart'},{text: 'SelectTablePart', value: 'SelectTablePart'} ]
      };
    }
    componentDidMount(){
        this.initData()
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            datas: nextProps.datas||[{}],
        }, ()=>{
            this.initData()
        })
        
    }

    initData(){
        const { datas } = this.state;
        let newData = [{key: ''}];
        if(datas.length == 0){
            this.setState({
                datas: newData
            })
        }
    }

    addArr(){
        const { datas } = this.state;
        let newArr = datas;
        newArr.push({});
        this.setState({
            datas: newArr
        })
    }
    deleteArr(itm, idx){
        const { datas } = this.state;
        let newArr = datas;
        newArr.splice(idx, 1);
        this.setState({
            datas: newArr
        })
    }
    setValue(key, idx, val){
        const { datas } = this.state;
        let newDate = datas[idx];
        newDate[key] = val;
        datas[idx] = newDate;
        this.setState({datas: datas});
    }
    addkey(datas=[]){
        const { selectKey } = this.state;
        let newData = datas || []
        if(!this.checkInArr(datas, 'key', selectKey.key)) {
            newData.push(selectKey)
            
        } else{
            newData = this.changeNode(datas, 'key', selectKey);
        }
        return newData
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
        const { datas } = this.state;
        this.props.handelChange(datas)
        Loader.show()
        setTimeout(()=>{
            Loader.hide()
        }, 500)
    }
    delNode(itm, keyArr, idx, atom){
        const { datas } = this.state;
        let newData = JSON.parse(JSON.stringify(datas));
        for(let i=0;i<keyArr.length;i++){
            if(keyArr[i].key== itm.key) {
                keyArr.splice(i, 1)
            }
        }
        atom.keyArr = keyArr
        newData[idx] = atom
        this.props.handelChange(newData)

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
    onSortItems(items){
        this.setState({
            datas: items
        });
    }

    renderOptions(keys, obg){
        const self = this;
        const radioDom = (<Row>
            <Col span="8" className="line-height-3r text-align-right padding-right-1r">options动态获取: </Col>
                    <Col span="16" className="padding-top-1r"><Switch value={obg.hasRequest} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                        self.setKey('hasRequest', date)
                    }} />
                    </Col>
                    {obg.hasRequest ? <Col><Row>
                        <Col span={8} className="text-align-right padding-right-1r">配置参数：</Col>
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
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">options: </Col>
                    <Col span="16">
                    <Options datas={eval(obg.options)} onChange={(itm)=>{
                                self.setKey('options', itm)
                    }} />
                    </Col></Row></Col>: ''}
        </Row>);

        const selectDom = (<Row>
            <Col span="8" className="line-height-3r text-align-right padding-right-1r">options动态获取: </Col>
            <Col span="16" className="padding-top-1r"><Switch value={obg.hasRequest} checkedText={'Y'} unCheckText={'N'} onchange={(date)=>{
                self.setKey('hasRequest', date)
            }} /> { obg.hasRequest ? '开启': '关闭'}
            </Col>
            {obg.hasRequest ? <Col><Row>
                <Col span={8} className="line-height-3r text-align-right padding-right-1r">是否开启初始化查询：</Col>
                <Col span={16} className="padding-top-1r"><Switch value={obg.enableOptionInitRequest} checkedText={'Y'} unCheckText={'N'} onchange={(date)=>{
                self.setKey('enableOptionInitRequest', date)
            }} /> { obg.enableOptionInitRequest ? '开启': '关闭'}</Col>
            </Row>
            <Row>
                <Col span={8} className="line-height-3r text-align-right padding-right-1r">配置参数：</Col>
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
                <Col span={8} className="line-height-3r text-align-right padding-right-1r">配置返回参数：</Col>
                <Col span={16}>
                    <DiyOptions datas={eval(obg.tableList)} onChange={(itm)=>{
                        self.setKey('tableList', itm)
                    }} />
                </Col>
            </Row></Col> : ''}
            {!obg.hasRequest ? <Col><Row>
            <Col span="8" className="line-height-3r text-align-right padding-right-1r">options: </Col>
            <Col span="16">
            <Options datas={eval(obg.options)} onChange={(itm)=>{
                self.setKey('options', itm)
            }} />
            </Col></Row></Col>: ''}

            <Col span="8" className="line-height-3r text-align-right padding-right-1r">filter: </Col>
            <Col span="16" className="padding-top-1r"><Switch value={obg.filter} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                self.setKey('filter', date)
            }} />
            </Col>
        </Row>)
        switch(keys){
            case 'text':
                return (<Row>
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">placeholder: </Col>
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
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">maxLength: </Col>
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
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">after: </Col>
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
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">默认值: </Col>
                    <Col span="16">
                        <Switch value={obg.defaultValue} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                        self.setKey('defaultValue', date)
                        }} />
                    </Col>
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">dateFormat: </Col>
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
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">model: </Col>
                    <Col span="16">
                    <Selects value={obg.model||''} onChange={(e,t,v)=>{
                        self.setKey('model', v.value)
                    }} options={[{text: '区间模式', value: 'simple'},{text: '月模式', value: 'month'},{text: '单体模式', value: 'date'}]} />
                    </Col>
                </Row>)
            case 'switch':
                return (<Row>
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">style: </Col>
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
                <Col span="8" className="line-height-3r text-align-right padding-right-1r">maxLength: </Col>
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
   
            case 'Radio':
                return radioDom;
            case 'Checkbox':
                return radioDom;
            case 'TagRadio':
                return radioDom;
  
            case 'Image': 
                return (<Row>
                <Col span="8" className="line-height-3r text-align-right padding-right-1r">拼接URL: </Col>
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
            
            case 'number':
                return (<Row>
                <Col span="8" className="line-height-3r text-align-right padding-right-1r">min: </Col>
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
                <Col span="8" className="line-height-3r text-align-right padding-right-1r">max: </Col>
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
            case 'InnerText':
            return (<Row>
                <Col span="8" className="line-height-3r text-align-right padding-right-1r">文本内容: </Col>
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
                <Col span="8" className="line-height-3r text-align-right padding-right-1r">字体大小: </Col>
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
                <Col span="8" className="line-height-3r text-align-right padding-right-1r">字体颜色: </Col>
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
        const { datas, selectKey, MDdisplay, MDaction, formTypes } = this.state;
        const tagDom = datas&&datas.length > 0 ? datas.map((itm, idx)=>{
            return (
                <Row key={`${idx}-tag`} className="border-bottom border-color-f5f5f5 padding-all-1r">
                <Col span={4} className="line-height-3r">key : </Col>
                <Col span={16}>
                <Input
                    value={itm.key|| ''}
                    placeholder="请输入"
                    maxLength={100}
                    innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                    onChange={(e,t,v)=>{
                        self.setValue('key', idx, v)
                    }}
                    />
                </Col>
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
                      self.deleteArr(itm, idx)
                  },
                  (id, callback) => { callback(id); });
                    
                }}><Icon iconName={'close-circled '} size={'150%'} iconColor={'#F55936'}  /></Col>
                <Col span={4} className="line-height-3r">字段集合 : </Col>
                <Col span={20} className="padding-top-2">
                    <Row>
                   {itm.keyArr ? <KeyTags datas={itm.keyArr} onChange={(itm)=>{ self.setState({ selectKey: itm})
                    self.showModal('edit')
                    }} 
                    delNode={(im)=>{ self.delNode(im, itm.keyArr, idx, itm);}} /> : '' }
                    <Col span={9}>
                    <Buttons
                        text={<div><Icon iconName={'android-add-circle '} size={'150%'} iconColor={'#fff'}  /> 新增字段</div>}
                        type={'primary'}
                        size={'small'}
                        style={{color:'#fff', borderRadius: '3rem'}}
                        onClick={()=>{
                            self.setState({'selectKey': {}}, ()=>{
                                self.setKey('idx', idx)
                                self.showModal()
                            })
                        }}
                    /></Col>
                    </Row>
                </Col>
                <Col span={4} className="line-height-3r">模式 : </Col>
                <Col span={20} className="padding-top-2">
                    <Selects value={itm.moldal||''} onChange={(e,t,v)=>{
                        self.setValue('moldal', idx, v.value)
                    }} options={[{text: '不选择', value: ''},{text: '表格模式', value: 'TABLE'},{text: '文本模式', value: 'TEXT'}]} />
                </Col>
            </Row>)
        }) : '';
        let otherDom = self.renderOptions(selectKey.type, selectKey)
        const actionOption = self.props.pageList ? self.props.pageList.map((itm, idx)=>{
            return {text: itm.title, value: itm.url}
        }): [];

        return(
          <section>
              <Row className="bg-show padding-all font-size-9" justify={'center'}>
                <Col>{tagDom}</Col>
                <Col span={8} className="margin-top-1r">
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
                <Col span={8} className="margin-top-1r">
                    <Buttons
                        text={'新增组合'}
                        type={'success'}
                        size={'small'}
                        style={{color:'#fff', borderRadius: '3rem'}}
                        onClick={()=>{
                            self.addArr()
                        }}
                    />
                </Col>
                
            </Row>
            <ExModal display={MDdisplay} action={MDaction} options={{
                content: (<Row className="padding-all-1r" justify={'center'}>
                <Col className="margin-bottom-1r line-height-3r border-bottom border-color-f5f5f5 font-size-12">{status ? '修改功能按钮': '新增功能按钮'}</Col>
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">key: </Col>
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
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">text: </Col>
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
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">title: </Col>
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
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">contStyle: </Col>
                    <Col span="16">
                    <Options datas={eval(selectKey.contStyle)} onChange={(itm)=>{
                        self.setKey('contStyle', itm)
                    }} />
                    </Col>
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">textContStyle: </Col>
                    <Col span="16">
                    <Options datas={eval(selectKey.textContStyle)} onChange={(itm)=>{
                        self.setKey('textContStyle', itm)
                    }} />
                    </Col>
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">labelStyle: </Col>
                    <Col span="16">
                    <Options datas={eval(selectKey.labelStyle)} onChange={(itm)=>{
                        self.setKey('labelStyle', itm)
                    }} />
                    </Col>
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">调用模板: </Col>
                    <Col span="16" className="padding-top-1r"><Switch value={selectKey.hasTmplate} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                        self.setKey('hasTmplate', date)
                    }} /> { selectKey.hasTmplate ? '开启': '关闭'}
                    </Col>
                    {selectKey.hasTmplate ? <Col><Row>
                        <Col span={8} className="line-height-3r text-align-right padding-right-1r">选择模板 </Col>
                    <Col span="16">
                    <Selects value={selectKey.actionName||''} onChange={(e,t,v)=>{
                        
                        self.setKey('actionName', v.value)
                    }} options={actionOption} />
                    </Col></Row></Col>: ''}
                    {!selectKey.hasTmplate ? <Col><Row>
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">表单类型: </Col>
                    <Col span="16"><Selects value={selectKey.type||''} onChange={(e,t,v)=>{
                        self.setKey('type', v.value)
                        self.renderOptions(v.value, selectKey)
                    }} options={formTypes} />
                    </Col>
                    <Col>
                        {otherDom}
                    </Col></Row></Col> : ''}
                    <Col span="8" className="line-height-3r text-align-right padding-right-1r">format: </Col>
                    <Col span={16}>
                    <Selects value={selectKey.formatModel||''} onChange={(e,t,v)=>{
                        self.setKey('formatModel', v.value)
                    }} options={[{text: '不选择', value: ''},{text: '时间模式', value: 'date'},{text: '数组模式', value: 'array'}]} />
                    </Col>
                    {}
                    { selectKey.formatModel =='array' ? <Col><Row>
                    <Col span={8} className="line-height-3r text-align-right padding-right-1r">选项: </Col>
                    <Col span={16}>
                    <Options datas={eval(selectKey.formatStr) ||{}} onChange={(itm)=>{
                        self.setKey('formatStr', itm)
                    }} hasRender /></Col></Row></Col> : ''}
                    { selectKey.formatModel =='date' ? <Col span={24}><Row>
                    <Col span={8} className="line-height-3r text-align-right padding-right-1r">选项: </Col>
                    <Col span={16}><Input
                    value={ selectKey.formatDate ||"['date', 'yyyy-MM-dd hh:mm:ss']"}
                    placeholder="请输入"
                    maxLength={100}
                    innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                    onChange={(e,t,v)=>{
                        self.setKey('formatStr', v)
                    }}
                    /></Col></Row></Col> : '' }
                    {selectKey.formatModel =='link' ? <Col><Row>
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
                    <Col span={24} className="margin-top-1r padding-right-1r text-align-right">
                    <Buttons
                        text={'更新Dom'}
                        type={'primary'}
                        size={'small'}
                        style={{color:'#fff', borderRadius: '0.3rem', width: '100px', marginRight: '1rem'}}
                        onClick={()=>{
                            let newData = self.addkey(datas[selectKey.idx].keyArr || [])
                            self.setValue('keyArr', selectKey.idx, newData)
                            self.hideModal()
                        }}
                    />
                    <Buttons
                        text={'取消'}
                        type={'primary'}
                        size={'small'}
                        plain
                        style={{ borderRadius: '0.3rem', width: '100px'}}
                        onClick={()=>{
                            self.hideModal()
                        }}
                    />
                    </Col>
                </Row>),
                type: 'top',
                containerStyle: { top: '2rem'},
                }} />
          </section>
        );
    }
}
export default EditDetailRich;
