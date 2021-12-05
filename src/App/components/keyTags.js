import React , { Component }from 'react';
import { Components } from 'neo';
const {
    Row,
    Col,
    Icon,
    Input,
    Buttons,
    Selects, Modal, SortItem
  } = Components;

class KeyTags extends Component {
    constructor(props) {
      super(props);
      this.state = {
        datas: this.props.datas || [],
        selectKey: {}
      };
    }
    
    componentDidMount(){
      
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            datas: nextProps.datas
        })
    }
    onSortItems(items){
        this.setState({
            datas: items
        });
    }
    render() {
        const self = this;
        const { datas, selectKey } = this.state;
        let keysDom = datas&&datas.length > 0 ? datas.map((itm, idx)=>{
            return <SortItem
            key={`${idx}-co`}
            onSortItems={(e)=>{this.onSortItems(e)}}
            items={datas}
            className={'col minwidth-40 margin-bottom-1 margin-right-1' }
            sortId={idx}>
            <Row className={`${`${selectKey.key}-${selectKey.keyId}`==`${itm.key}-${itm.keyId}`? 'border-color-4698F9 bg-4698F9' :'border-color-999 bg-show'} border-radius-5f border-all overflow-hide padding-all-2`  } >
            <Col span={15} className={`${`${selectKey.key}-${selectKey.keyId}`==`${itm.key}-${itm.keyId}`? 'textcolor-fff' : 'textclolor-333'} padding-all font-size-8  cursor-pointer`} onClick={()=>{
                self.setState({
                    selectKey: itm
                })
                self.props.onChange(itm)
            }}>{itm.text}</Col>
            <Col span={4} className="cursor-pointer" onClick={()=>{
                self.setState({
                    selectKey: itm
                })
                self.props.onChange(itm)
            }}><Icon iconName={'edit '} size={'120%'} iconColor={`${selectKey.key}-${selectKey.keyId}`==`${itm.key}-${itm.keyId}`? '#fff' :'#5D8EFF'}  /></Col>
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
                      self.props.delNode(itm)
                  },
                  (id, callback) => { callback(id); });
            }}><Icon iconName={'android-remove-circle '} size={'140%'} iconColor={`${selectKey.key}-${selectKey.keyId}`==`${itm.key}-${itm.keyId}`? '#fff' :'#F55936'}  /></Col>
        </Row></SortItem>
        }) : '';

        return keysDom;
    }
}
export default KeyTags;
