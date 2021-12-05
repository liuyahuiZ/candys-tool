import React from 'react'; // 引入 react
import { Component } from 'react';
import Row from '../Grid/Row';
import Col from '../Grid/Col';
import Icon from '../Icon';
import PickerScroll from '../Picker/scroll';
import PopOver from '../PopOver';

class Timer extends Component {
	constructor(props) {
        super(props);
        this.state={
            viewDate: this.props.viewDate|| ''
        }
        
    }
    componentDidMount(){
        const {viewDate} = this.state
        if(viewDate){
            this.initData(viewDate)
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.viewDate){
            let time = nextProps.viewDate.split(' ')[1]
            if(time&&time!==''){
                let timeArr = time.split(':');
                this.setState({
                    nowTime: time,
                    theHours: timeArr[0]=== '00' ? 0 : Number(timeArr[0]),
                    theMinuit: timeArr[1]=== '00' ? 0 : Number(timeArr[1]),
                    theSecond: timeArr[2]=== '00' ? 0 : Number(timeArr[2]),
                })
            }
        }
        
    }
    initData(viewDate){
        let time = viewDate.split(' ')[1]
        if(time&&time!==''){
            let timeArr = time.split(':');
            this.setState({
                nowTime: time,
                theHours: timeArr[0]=== '00' ? 0 : Number(timeArr[0]),
                theMinuit: timeArr[1]=== '00' ? 0 : Number(timeArr[1]),
                theSecond: timeArr[2]=== '00' ? 0 : Number(timeArr[2]),
            })
        }
    }
	handleSelectDay (date) {
		if (!this.props.canClick) {
			return ;
		}

		this.props.handleSelectDay(date);
	}
    setArr(num){
        let arr = []
        for(let i=0;i<num;i++){
            if(i<=9) { i = `0${i}`}
            arr.push({
                "text": i,
                "value": i
            })
        }
        return arr;
    }
    resetNum(num){
        num = Number(num);
        let newNum = num
        if(num<=9) { newNum = `0${num}`}
        return newNum
    }
    selectOver(){
        const { theHours, theMinuit, theSecond } = this.state;
        let nowTims = `${this.resetNum(theHours)}:${this.resetNum(theMinuit)}:${this.resetNum(theSecond)}`
        this.setState({
            nowTime: nowTims
        })
        this.props.callBack(nowTims);
    }

	render () {
        const self = this;
        const Hours = this.setArr(24);
        const Minuit = this.setArr(60);
        const Second = this.setArr(60);
        const { theHours, theMinuit, theSecond, nowTime } = this.state;
        const containerDom = (<Row>
              <Col span={24} className={'text-align-center'} style={{width: '200px'}}  >
                  <Row>
                      <Col span={12} className="text-align-left line-height-2r padding-all" onClick={() => {  }}>
                      <Icon iconName={"android-close"} size={'130%'} iconColor={'#000'} /></Col>
                      <Col span={12} className="text-align-right line-height-2r padding-all" onClick={() => {
                      self.selectOver() }}>完成</Col>
                  </Row>
              </Col>
              <Col span={8} className={'overflow-hide text-align-center line-height-2r'}>时</Col>
              <Col span={8} className={'overflow-hide text-align-center line-height-2r'}>分</Col>
              <Col span={8} className={'overflow-hide text-align-center line-height-2r'}>秒</Col>
              <Col><Row className="width-100 relative">
              <Col className="absolute width-100 border-top border-bottom" style={{height: '36px', borderColor:'#999', top: '50%'}}></Col>
              <Col span={8} className={'overflow-hide'}>
                  <PickerScroll data={{list: Hours, defaultValue: theHours||Hours[0],
                  displayValue (name) {
                      return name.text;
                  }}} 
                  onChange={(v)=>{
                      self.setState({
                        theHours: v.value
                      })
                  }} />
              </Col>
              <Col span={8} className={'overflow-hide'}>
              <PickerScroll data={{list: Minuit, defaultValue: theMinuit||Minuit[0],
                  displayValue (name) {
                      return name.text;
                  }}} 
                  onChange={(v)=>{
                    // theMinuit = v.value;
                    self.setState({
                        theMinuit: v.value
                      })
                  }} />
              </Col>
              <Col span={8} className={'overflow-hide'}>
              <PickerScroll data={{list: Second, defaultValue: theSecond||Second[0],
                  displayValue (name) {
                      return name.text;
                  }}} 
                  onChange={(v)=>{
                    // theSecond = v.value;
                    self.setState({
                        theSecond: v.value
                    })
                  }} />
              </Col>
              </Row></Col>
          </Row>)
		return (
			<div >
                <PopOver popContent={(containerDom)} placement={'bottom'} selfkey={'1'}>
                    <div style={{borderRadius: '0 0 10px 10px'}} className={'bg-show text-align-left text-overflow cursor-pointer'} style={{minWidth: '120px', height:'2.1rem'}}>{nowTime || '00:00:00'}</div>
                </PopOver>
            </div>
		);
	}
}

export default Timer;