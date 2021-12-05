import React , { Component }from 'react';
import { PropTypes } from 'prop-types';
import { Components } from 'neo';
import KeyTags from './keyTags';
import Options from './options';

const {
    Row,
    Col,
    Icon,
    Input,
    Buttons,
    Selects, Loader, Modal, Switch
  } = Components;

class EditFunc extends Component {
    constructor(props) {
      super(props);
      this.state = {
          datas: this.props.datas|| [],
          selectKey:  {
            ruleModal: false
          },
      };
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            datas: nextProps.datas,
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
        const { datas } = this.state;
        
        this.props.handelChange(datas);
        Loader.show()
        setTimeout(()=>{
            Loader.hide()
        }, 500)
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

    

    addPages(callback){
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

    editPages(callback){
        const { datas, selectKey } = this.state;
        if(!this.checkInArr(datas, 'key', selectKey.key)) {
            let newData = datas
            newData.push(selectKey)
            this.setState({datas: newData},()=>{
                callback()
            })
        } else{
            let newData = this.changeNode(datas, 'key', selectKey);
            this.setState({datas: newData},()=>{
                callback()
            })
        }

    }

    // 初始化page
    newPage(status){
        const self = this;
        const {selectKey} = this.state;
        Modal.formConfirm({ title: status ? '修改功能按钮': '新增功能按钮',
                    content: (
                    <Row className="padding-all">
                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">功能key:</Col>
                                <Col span={16} className="line-height-3r">
                                    <Input
                                        value={status? selectKey.key: ''}
                                        placeholder="请输入key"
                                        maxLength={100}
                                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                        onChange={(e,t,v)=>{
                                            self.setKey('key', v)
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">功能名称:</Col>
                                <Col span={16} className="line-height-3r">
                                    <Input
                                        value={status? selectKey.text: ''}
                                        placeholder="请输入功能名称"
                                        maxLength={100}
                                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                        onChange={(e,t,v)=>{
                                            self.setKey('text', v)
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">显示规则:</Col>
                                <Col span={16} className="">
                                    <div className="width-100 line-height-3r">
                                    默认显示{selectKey.ruleModal} <Switch value={status ? selectKey.ruleModal : false}  checkedText={'-'} unCheckText={'o'} onchange={(data)=>{ 
                                        self.setKey('ruleModal', data);
                                    }} />
                                    </div>
                                    <div className="width-100">
                                    <Options text={'新增规则'} datas={status? selectKey.rule: []} onChange={(itm)=>{
                                        self.setKey('rule', itm)
                                    }} />
                                    </div>
                                </Col>
                                <Col span={8}></Col>
                                <Col span={16} className="font-size-8 textclolor-black-low">注意：默认显示打开，当规则满足时不显示； 默认显示关闭，当规则满足时显示</Col>
                            </Row>
                        </Col>
                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">接口请求路径:</Col>
                                <Col span={16} className="line-height-3r">
                                    <Input
                                        value={status? selectKey.url: ''}
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
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">接口请求方式:</Col>
                                <Col span={16} className="line-height-3r">
                                    <Input
                                        value={status? selectKey.method: ''}
                                        placeholder="请输入接口请求方式"
                                        maxLength={100}
                                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                        onChange={(e,t,v)=>{
                                            self.setKey('method', v)
                                            
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col className="margin-bottom-1r">
                            <Row >
                                <Col span={8} className="line-height-3r text-align-right padding-right-1r">接口请求参数:</Col>
                                <Col span={16} className="">
                                <Options text={'新增参数'} datas={status? selectKey.options: []} onChange={(itm)=>{
                                    self.setKey('options', itm)
                                }} />
                                </Col>
                            </Row>
                        </Col>
                        
                        
                    </Row>
                    ),
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
                      if(status) {
                        self.editPages(()=>{callback(id)});

                      } else {
                        self.addPages(()=>{callback(id)});
                      }
                      
                  },
                  (id, callback) => { callback(id); });
    }

    render() {
        const self = this;
        const { datas } = this.state;

        return(
          <section>
              <Row className="bg-show padding-all font-size-9">
                    <Col className="margin-top-3">
                        <Row>
                        <Col span={5}>按钮功能 : </Col>
                        <Col span={19}>
                        <Row>
                            <KeyTags datas={datas} onChange={(itm)=>{ self.setState({ selectKey: itm}, ()=>{
                                self.newPage('edit')
                            }) }} delNode={(itm)=>{ self.delNode(itm);}} /> 
                            <Col span={9}>
                            <Buttons
                                text={<div><Icon iconName={'android-add-circle '} size={'150%'} iconColor={'#fff'}  /> 新增按钮功能</div>}
                                type={'primary'}
                                size={'small'}
                                style={{color:'#fff', borderRadius: '3rem'}}
                                onClick={()=>{
                                    self.setState({
                                        selectKey: {}
                                    }, ()=>{
                                        self.newPage()
                                    })
                                }}
                            />
                        </Col></Row>
                        </Col>
                    
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
                        </Row>
                    </Col>
                </Row>
          </section>
        );
    }
}

EditFunc.propTypes = {
    datas: PropTypes.oneOfType([PropTypes.array, PropTypes.number, PropTypes.shape({})]),
};
  
EditFunc.defaultProps = {
    datas: [],
};
export default EditFunc;
