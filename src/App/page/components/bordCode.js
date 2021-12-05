import React , { Component }from 'react';
import { Components } from 'neo';

const {
    Row,
    Col,
    Icon,
    Buttons,
    Input
  } = Components;
  
class BordCode extends Component {
    constructor(props) {
      super(props);
      this.state = {
        values: '',
        sendText: "发送验证码",
        sendDisabled: false,
      };
    }

    sendCode(){
        const { sendDisabled } = this.state
        if (sendDisabled) {
          return false
        }
        
        this.props.sendCode();
        this.setState({
            secend: 60,
            sendDisabled: true,
            sendText: 60 + "s"
        },()=>{
            this.settime();
        })
        
    }
    settime() {
        const self = this;
        const { secend } = this.state;
        if (secend == 0) {
            self.setState({
                secend: 60,
                sendDisabled: false,
                sendText: "发送验证码"
            }) 
        } else {
            let theSecend = secend
            theSecend = theSecend - 1;
            self.setState({
                secend: theSecend,
                sendText: theSecend + "s"
            },()=>{
                setTimeout(function() { 
                    self.settime() 
                },1000);
            }) 
            
        } 
    } 

    render(){
        const {values, sendText} = this.state;
        return (
            <Row justify={'center'} className={"margin-top-1r margin-bottom-1r"}>
                <Col span={20} className={'border-all border-color-e5e5e5 border-radius-9 overflow-hide'}>
                    <Row>
                        <Col span={17}>
                            <Input
                              value={values}
                              type="number"
                              placeholder=""
                              autoFocus={true}
                              style={{
                                'border':'1px solid #fff',
                                'borderRadius':'9px'
                              }}
                              innerStyle={{
                                'textAlign':'center'
                              }}
                              maxLength={100}
                              onChange={(e,t,v)=>{
                                  this.setState({values:v})
                                  this.props.callback(v);
                              }}
                              />
                        </Col>
                        <Col span={7}
                            style={{color:'#fff'}}
                            className="font-size-9 row flex-direction-column flex-justify-center flex-items-center bg-F55936 textcolor-fff"
                            onClick={()=>{
                                this.sendCode()
                            }}>
                            {sendText}
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}
export default BordCode;