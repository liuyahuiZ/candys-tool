import React , { Component }from 'react';
import { Components } from 'neo';
import { hashHistory } from 'react-router';
const {
    Row,
    Col,
    Icon,
    Input,
    Buttons, Loader
  } = Components;

class EditItem extends Component {
    constructor(props) {
      super(props);
      this.state = {
          confirmDirty: false,
          childrenCom: '',
          selectKeys: this.props.selectKeys||{},
          keyData: this.props.keyData,
          iconProps: {}
      };
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            selectKeys: nextProps.selectKeys,
            keyData: nextProps.keyData,
            iconProps: nextProps.iconProps||{}
        })
    }

    handleClick(link) {
        if(link) {
            hashHistory.push(link);
        }
    }

    handelChange(){
        const {selectKeys, iconProps} = this.state;
        this.props.handelChange({
            selectKeys: selectKeys,
            iconProps: iconProps
        })
        Loader.show()
        setTimeout(()=>{
            Loader.hide()
        }, 500)
    }

    render() {
        const self = this;
        const { iconProps, keyData } = this.state;
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
        return(
          <section>
              <Row className="bg-show">
                    <Col>{keysDom}
                    </Col>
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
export default EditItem;
