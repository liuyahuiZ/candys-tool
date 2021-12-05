import React , { Component }from 'react';
import { Components } from 'neo';
import Options from './options';

const {
    Row,
    Col,
    Icon,
    Input,
    Buttons,
    Selects,
    TagRadio,
    Modal, Loader, ExModal, SortItem, PopContainer
  } = Components;

class EditFactorRules extends Component {
    constructor(props) {
      super(props);
      this.state = {
          datas: this.props.datas||[],
          selectKey: {},
          cacheKey: {},
          activeFactor: this.props.activeFactor||[],
          passiveFactor: this.props.passiveFactor||[],
      };
    }
    componentDidMount(){
        this.initData()
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            datas: nextProps.datas||[],
        }, ()=>{
            this.initData()
        })
        
    }

    initData(){
        const { datas } = this.state;
        let newData = [];
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

    onSortItems(items){
        this.setState({
            datas: items
        });
    }

    render() {
        const self = this;
        const { datas } = this.state;
        const { activeFactor, passiveFactor } = this.props;
        let actionOption = [...activeFactor, ...passiveFactor]
        actionOption = [{text: '请选择', value: ''}, ...actionOption];
        const tagDom = datas&&datas.length > 0 ? datas.map((itm, idx)=>{
            return (<SortItem
                key={`${idx}-co`}
                onSortItems={(e)=>{this.onSortItems(e)}}
                items={datas}
                className={'col minwidth-40 margin-bottom-1 margin-right-1' }
                sortId={idx}>
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
                <Col span="4" className="line-height-3r">选择因子: </Col>
                <Col span="20" className="line-height-3r">
                    <Selects value={itm.linkDomKey||''} onChange={(e,t,v)=>{
                        self.setValue('text', idx, v.text)
                        self.setValue('linkDomKey', idx, v.value)
                    }} options={actionOption} />
                </Col>
                <Col span={4} className="line-height-3r">字段集合 : </Col>
                <Col span={20} className="padding-top-2">
                    <Options text={'新增规则'} datas={ itm.rule|| []} onChange={(itm)=>{
                                self.setValue('rule', idx, itm)
                            }} />
                </Col>
                <Col span={4} className="line-height-3r">求值方式 : </Col>
                <Col span={20} className="padding-top-2">
                    <Selects value={itm.moldal||''} onChange={(e,t,v)=>{
                        self.setValue('moldal', idx, v.value)
                        // self.renderOptions(v.value, selectKey)
                        }} options={[{text: '请选择', value: ''},{text: '或集', value: 'OR'},{text: '交集', value: 'AND'}]} />
                </Col>
            </Row> </SortItem>)
        }) : '';

        return(
          <section>
              <Row className="bg-show font-size-9" justify={'center'}>
                <Col>{tagDom}</Col>
                {datas&&datas.length > 0 ? <Col span={8} className="margin-top-1r">
                    <Buttons
                        text={'保存规则组'}
                        type={'primary'}
                        size={'small'}
                        style={{color:'#fff', borderRadius: '3rem'}}
                        onClick={()=>{
                            self.handelChange()
                        }}
                    />
                </Col> : ''}
                <Col span={8} className="margin-top-1r">
                    <Buttons
                        text={'新增规则组合'}
                        type={'success'}
                        size={'small'}
                        style={{color:'#fff', borderRadius: '3rem'}}
                        onClick={()=>{
                            self.addArr()
                        }}
                    />
                </Col>
                
            </Row>
          </section>
        );
    }
}
export default EditFactorRules;
