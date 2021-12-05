import React , { Component }from 'react';
import { Components } from 'neo';

const {
    Row,
    Col,
    Icon,
    Buttons,
  } = Components;
  
class ForgetPass extends Component {
    constructor(props) {
      super(props);
      this.state = {
        values: this.props.values || [],
        defaultLength: [0,1,2,3,4,5]
      };
    }
    componentWillReceiveProps(newProps){
        this.setState({
            values: newProps.values
        })
    }

    render(){
        const {values, defaultLength} = this.state;
        let itemDome = defaultLength.length > 0 ? defaultLength.map((itm, idx)=>{
            let text = values.length > idx ? '*' : ''; 
            return (<Col span={4} className={`heighr-3 line-height-3r text-align-center ${(idx+1)==defaultLength.length?'':'border-right border-color-999'}`} key={`${idx}-e`}>{text}</Col>)
        }) : <div/>;
        return (
            <Row justify={'center'} className={"margin-top-1r margin-bottom-1r"}>
                <Col span={20} className={'border-all border-radius-9 '}>
                <Row>{itemDome}</Row></Col>
            </Row>
        )
    }
}
export default ForgetPass;