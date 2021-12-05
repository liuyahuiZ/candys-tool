import React, { Component } from 'react';
import Row from '../Grid/Row';
import Col from '../Grid/Col';
class RandNum extends Component {
    constructor(props) {
        super(props);
        var valString = this.props.value || '0'
        var par= {};
        this.state = {
            randomValue: '0',
            value: valString,
            valueStr: valString.toString(),
            length: valString.toString().length,
            runNumJson:{
                width:par.width || 13.5,
                height:par.height || 30,
                speed:par.speed || 1000,
            }
        };
    }

    componentDidMount(){
        this.init()
    }

    componentWillReceiveProps(nextProps){
        const { value } = this.state
        if(value == nextProps.value) return;
        this.setState({
            value: nextProps.value||0,
            valueStr: nextProps.value.toString(),
            length: nextProps.value.toString().length
        },()=>{
            this.init()
        })
    }

    init(){
        const { randomValue, length, value } = this.state;
        let str = '';
        for(let i=0;i<length;i++){
            str = str + '0'
        }
        this.setState({
            randomValue: str
        }, ()=>{
            setTimeout(() => {
                this.setState({
                    randomValue: value.toString()
                })
            }, 500);
        })
    }
    _list(json) {
        const { randomValue, length } = this.state;
        const arr = [];
        for(let i=0;i<length;i++){
            arr.push(i);
        }
        const jsonDom = length>0? arr.map((itm, idx)=>{
            let w=json.width*idx;
            let t=json.height*parseInt(randomValue[idx]) || 0;
            let h=json.height*10;
            let j = [0,1,2,3,4,5,6,7,8,9,'.'];
            if(randomValue[idx]=='.'){
                t = json.height*10
            }
            let str = j.map((it, id)=>{
                return <div key={`${id}-s`} className={'text-align-center'} style={{'height': json.height, 'lineHeight': `${json.height}px`, 'width': '100%', 'display': 'block'}}>{`${it}`}</div>
            });
            return (<Col className="transi-slow absolute " style={{'width': json.width, 'left': w, 'top': -t, 'height': h}} key={`${idx}-li`}>{str} </Col>)
        }): '';
        return jsonDom
    }

    render() {
        const { style, value } = this.props;
        const { randomValue, runNumJson } = this.state;
        const list = this._list(runNumJson)
        return value ? (
        <Row className="nemo-rate width-100 relative height-30 overflow-hide" style={style} >
            {list}
        </Row>
        ) : '';
    }
}

export default RandNum;
