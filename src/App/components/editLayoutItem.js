import React , { Component }from 'react';
import { Components } from 'neo';
import { hashHistory } from 'react-router';
const {
    Row,
    Col,
    Icon,
    Input,
    Buttons, Loader, Selects
  } = Components;

class EditLayoutItem extends Component {
    constructor(props) {
      super(props);
      this.state = {
          confirmDirty: false,
          childrenCom: this.props.iconProps&&this.props.iconProps.childrenModal||{},
          selectKeys: this.props.selectKeys||{},
          keyData: this.props.keyData,
          pageList: this.props.pageList,
          iconProps: this.props.iconProps||{},
      };
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            selectKeys: nextProps.selectKeys,
            keyData: nextProps.keyData,
            iconProps: nextProps.iconProps||{},
            childrenCom: nextProps.iconProps&&nextProps.iconProps.childrenModal||{},
        })
    }

    handleClick(link) {
        if(link) {
            hashHistory.push(link);
        }
    }

    handelChange(){
        const {selectKeys, iconProps, childrenCom} = this.state;
        this.props.handelChange({
            selectKeys: selectKeys,
            iconProps: Object.assign({}, iconProps, {childrenModal: childrenCom})
        })
        Loader.show()
        setTimeout(()=>{
            Loader.hide()
        }, 500)
    }


    render() {
        const self = this;
        const { iconProps, keyData, childrenCom } = this.state;
        let keysDom = keyData ? keyData.map((item, id)=>{
            return (<Row key={`${id}-k`}>
                <Col span={10} className="line-height-3r">{item}: </Col>
                <Col span={14}><Input
                    value={iconProps[item] || ''}
                    placeholder="请输入"
                    maxLength={100}
                    innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                    onChange={(e,t,v)=>{
                        let newProps = iconProps;
                        newProps[item] = v
                        self.setState({'iconProps': newProps})
                    }}
                    />
                </Col>
            </Row>)
        }) : ''
        const actionOption = self.props.pageList ? self.props.pageList.map((itm, idx)=>{
            return {text: itm.title, value: itm.url}
        }): [];
        return(
          <section>
              <Row className="bg-show">
                    <Col>
                        <Row >
                        <Col span={10} className="line-height-3r">ChildrenModal: </Col>
                        <Col span={14}>
                        <Selects value={childrenCom||''} onChange={(e,t,v)=>{
                                self.setState({'childrenCom': v.value})
                            }} options={[{text: '请选择', value: ''},...actionOption]}
                            filter />
                        </Col>
                        </Row>
                    </Col>
                    <Col>{keysDom}</Col>
                    <Col>
                        <Buttons
                            text={'提交'}
                            type={'primary'}
                            size={'small'}
                            style={{color:'#fff', borderRadius: '3rem'}}
                            onClick={()=>{
                                self.handelChange()
                            }}
                        />
                    </Col>
                </Row>
          </section>
        );
    }
}
export default EditLayoutItem;
