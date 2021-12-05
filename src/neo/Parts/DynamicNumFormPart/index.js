import React , { Component }from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Icon,
    Buttons,
    Modal, Loader
  } from '../../Components';


class DynamicNumFormPart extends Component {
    constructor(props) {
      super(props);
      this.state = {
          datas: this.props.value||[{id:1}],
          dynamicName: this.props.dynamicName||"",
          selectKey: {},
          cacheKey: {},
          dataNum: 1,
      };
      this.getValue = this.getValue.bind(this);
      this.setValue = this.setValue.bind(this);
    }
    componentDidMount(){
        this.initData()
    }
    
    componentWillReceiveProps(nextProps){
        if(nextProps.value){
            this.setState({
                datas: nextProps.value
            }, ()=>{
                this.initData()
            })
        }
        
    }

    getValue(){
        const { datas } = this.state;
        let newArr = []
        for(let i=0;i<datas.length;i++){
            let value = this[`$$dynamic-${i}`].getValue()
            if(!value){
                return '';
            }
            newArr.push(value);
        }
        return newArr
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
    resetArr(){
        const { dataNum } = this.state;
        let newArr = [];
        for(let i=0;i<dataNum;i++){
          newArr.push({ value: '', text: i+1, id: i+1});
        }
        this.setState({
            datas: newArr
        })
    }
    setValue(value){
        if(!value||value=='') return;
        this.setState({
            dataNum: value
        }, ()=>{
            this.resetArr()
        })
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
    // setValue(key, idx, val){
    //     const { datas } = this.state;
    //     let newDate = datas[idx];
    //     newDate[key] = val;
    //     datas[idx] = newDate;
    //     this.setState({datas: datas});
    // }
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
        const { datas, dynamicName } = this.state;
        const { showEdit } = this.props;
        const tagDom = datas&&datas.length > 0 ? datas.map((itm, idx)=>{
            return (
                <Row key={`${idx}-tag`} className="relative border-bottom border-color-f5f5f5">
                <Col>{self.props.renderTpl({actionName: dynamicName, value:itm, key: `dynamic-${idx}` }, (res)=>{
                }, self)}</Col>
                { showEdit ?  <Col span={4} className="cursor-pointer absolute right-0 text-align-right" onClick={()=>{
                    Modal.formConfirm({ title: '',
                    content: (' 确定删除吗？'),
                    style: '',
                    type: 'small',
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
                    
                }}><Icon iconName={'close-circled '} size={'150%'} iconColor={'#F55936'}  /></Col> : ''}
            </Row>)
        }) : '';

        return(
          <section>
              <Row className="bg-show font-size-9" justify={'center'}>
                <Col>{tagDom}</Col>
                {showEdit ? <Col span={5} className="text-align-center margin-top-1r">
                    <Buttons
                        text={'新增'}
                        type={'success'}
                        size={'middle'}
                        style={{color:'#fff', borderRadius: '3rem'}}
                        onClick={()=>{
                            self.addArr()
                        }}
                    />
                </Col> : ''}
                
            </Row>
          </section>
        );
    }
}
DynamicNumFormPart.propTypes = {
    value: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.array, PropTypes.string]),
    showEdit: PropTypes.bool,
  };
  
DynamicNumFormPart.defaultProps = {
    showEdit: true,
    value: '',
};
  
export default DynamicNumFormPart;
