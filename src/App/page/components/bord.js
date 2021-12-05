import React , { Component }from 'react';
import { Components } from 'neo';
import ForgetPass from './forgetPass';

const {
    Row,
    Col,
    Icon,
    Buttons,
} = Components;
class Bord extends Component {
    constructor(props) {
      super(props);
      this.state = {
        values: [],
        row1:[{key:'1', value: '1'},{key:'2', value: '2'},{key:'3', value: '3'}],
        row2:[{key:'4', value: '4'},{key:'5', value: '5'},{key:'6', value: '6'}],
        row3:[{key:'7', value: '7'},{key:'8', value: '8'},{key:'9', value: '9'}],
        row4:[{key:'0', value: '0'}]
      };
    }

    componentDidMount() {
        if(this.props.rows){
            this.setValue('row1',this.props.rows[0]);
            this.setValue('row2',this.props.rows[1]);
            this.setValue('row3',this.props.rows[2]);
            this.setValue('row4',this.props.rows[3]);
        }
    }

    setValue(key,val){
        this.setState({[key]: val});
    }

    buntunHandle(v){
        let { values } = this.state;
        if(values.length>=6) return;
        let newValue = values
        newValue.push(v);
        this.setState({
            values: newValue
        })
        this.props.callback(newValue)
    }
    delHandle(){
        let { values } = this.state;
        if(values.length==0) return;
        let newValue = values
        newValue.pop();
        this.setState({
            values: newValue
        })
        this.props.callback(newValue)
    }
    renderBord(arr){
        let row1Dom = arr.length>0 ? arr.map((itm, idx)=>{
            return (<Col key={`${idx}-d`} className={`${(idx+1)==arr.length ? '': 'border-right'} border-bottom border-color-e5e5e5 text-align-center`} span={8}>
                            <Buttons text={itm.key}
                            type={'normal'}
                            size={'large'}
                            style={{'backgroundColor': '#fff', 'color': '#000'}}
                            onClick={()=>{
                                this.buntunHandle(itm.value)
                            }} />
                        </Col>)
            }) : <Col></Col>;
        return row1Dom
    }

    render(){
        const {row1, row2, row3, row4, values} = this.state;
        let row1Dom = this.renderBord(row1);
        let row2Dom = this.renderBord(row2);
        let row3Dom = this.renderBord(row3);
        return (
            <div>
                {this.props.showPwd && <ForgetPass values={values} />}
                <Row className="border-top border-color-e5e5e5">{row1Dom}</Row>
                <Row>{row2Dom}</Row>
                <Row>{row3Dom}</Row>
                <Row>
                    <Col className={"text-align-center bg-show border-right border-color-e5e5e5"} span={8}></Col>
                    <Col className={"text-align-center border-right border-color-e5e5e5"} span={8}>
                        <Buttons text={row4[0].key}
                        type={'normal'}
                        size={'large'}
                        style={{'backgroundColor': '#fff', 'color': '#000'}}
                        onClick={()=>{
                            this.buntunHandle(row4[0].value)
                        }} />
                    </Col>
                    <Col className={"text-align-center"} span={8}>
                        <Buttons text={<Icon iconName={"backspace "} size={'180%'} iconColor={'#000'} />}
                        type={'normal'}
                        size={'large'}
                        style={{'backgroundColor': '#fff', 'color': '#000'}}
                        onClick={()=>{
                            this.delHandle();
                        }} />
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Bord;