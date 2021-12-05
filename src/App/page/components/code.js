import React , { Component }from 'react';
import { Components } from 'neo';

const {
    Row,
    Col,
    Icon,
    Buttons,
  } = Components;
  
class Code extends Component {
    constructor(props) {
      super(props);
      this.state = {
        secend: 0,
        sendText: "发送验证码",
        sendDisabled: false,
        isDisable: this.props.isDisable
      };
    }
    componentWillReceiveProps(newProps){
        this.setState({
            isDisable: newProps.isDisable
        })
    }
    sendCode(){
        const { sendDisabled, isDisable } = this.state
        if (sendDisabled) {
          return false
        }
        if(isDisable){
            return false
        }
        this.props.callBack();
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
        const { sendText } = this.state;
        return (
            <div><Buttons  
                text={sendText}
                type={'primary'}
                size={'small'}
                style={{backgroundColor: '#F55936', color:'#fff'}}
                onClick={()=>{
                    this.sendCode()
                }} />
            </div>
        )
    }
}
export default Code;