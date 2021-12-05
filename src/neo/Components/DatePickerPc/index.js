import React from 'react'; // 引入 react
import { Component } from 'react';
import  DatePickerCom  from './date_picker'; // 引入组件
import  DatePickerArea  from './datePickerArea'; // 引入组件
import { getDefaultDate, formatViewMonth, addListenerForWebviewDidAppear, getLastDate} from '../../utils/date'
import '../Style/datePicker.scss';
import Icon from '../Icon';
import Row from '../Grid/Row';
import Col from '../Grid/Col';
import Buttons from '../Button/button';
import {getDateTimeStr} from '../../utils/timeStamp';
import Theme from '../Style/theme';
import moment from 'moment'; 
import Timer from './timer';

class DatePicker extends Component {
    constructor(props) {
        super(props);
        let value = this.props.value ||  (new Date());
        this.state={
            datePickerVisible:false,
            startDate: moment(value).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            endDate: moment(value).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            nextMounthStartDate: moment(value).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            nextMounthEndDate: moment(value).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            areaStartDate: moment(value).subtract(30, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            areaEndDate: moment(value).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            dateType: this.props.model || 'days',
            model: this.props.model|| 'simple',
            allowToday: this.props.allowToday || true,
            disabled: this.props.disabled||false,
            positionX: 0,
            positionY: 0,
            screenX: 0
        }
        this.getValue = this.getValue.bind(this);
        this.setDisable = this.setDisable.bind(this);
    }

    componentDidMount () {
        this.backFromDatePicker();
        if(this.props.initChange){
            let resStartDate = this.getValue();
            this.props.onChange(resStartDate);
        }   
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.value) {
            let nextValue = nextProps.value;
            if(nextValue.length>8){
                nextValue = nextValue.substring(0,8)
            }
            this.setState({
                startDate:  moment(nextValue).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                endDate:  moment(nextValue).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                nextMounthStartDate: moment(nextValue).subtract(-30, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                nextMounthEndDate: moment(nextValue).subtract(-30, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                model: nextProps.model,
                allowToday: nextProps.allowToday,
                areaStartDate: moment(nextValue).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                areaEndDate: moment(nextValue).subtract(-30, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            })
        } else{
            const { startDate } =this.state;
            if(startDate == nextProps.startDate) {
                this.setState({
                    areaStartDate: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                areaEndDate: moment().subtract(-30, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                })
                return;
            }
            this.setState({
                startDate:  moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                endDate:  moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                nextMounthStartDate: moment().subtract(-30, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                nextMounthEndDate: moment().subtract(-30, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                dateType: nextProps.model || 2,
                model: nextProps.model,
                allowToday: nextProps.allowToday,
                areaStartDate: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                areaEndDate: moment().subtract(-30, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            })
        }
        
    }

    toDateString(date){
        let dateString = new Date(date).getTime()
        return dateString
    }
    getValue() {
        const {model, areaStartDate, areaEndDate} = this.state;
        const { dateFormat } = this.props;
        let startDate = getDateTimeStr(this.state.startDate);
        let endDate = getDateTimeStr(this.state.endDate)
        if(model == 'date') {
            if(dateFormat) {
                return moment(this.state.startDate).format(dateFormat);
            }
            return startDate;
        }
        if(model == 'simple'){
            if(dateFormat) {
                return {startDate : areaStartDate&&areaStartDate!=='' ? moment(areaStartDate).format(dateFormat) : '', endDate: areaEndDate&&areaEndDate!=='' ? moment(areaEndDate).format(dateFormat) : ''};
            }
            return {startDate : getDateTimeStr(areaStartDate), endDate: getDateTimeStr(areaEndDate)};
        }

        if(model == 'month'){
            if(dateFormat) {
                return moment(this.state.startDate).format(dateFormat);
            }
            return startDate;
        }

        if(model == 'time'){
            return this.state.startDate
        }

        return {startDate : startDate, endDate: endDate};
    }

    setDisable(disabled){
        this.setState({ disabled: disabled });
    }

    backFromDatePicker () {
        addListenerForWebviewDidAppear(() => {
            const date = Storage.getItem('datePicker');

            if (date && date.selected) {
                this.props.handleDateChange && this.props.handleDateChange(date);

                Storage.removeItem('datePicker');
            }
        });
    }

    openDatePicker (e) {
        //打开前调用
        const {model, disabled, datePickerVisible} = this.state;
        let newVisible = datePickerVisible;
        if(newVisible) {
            newVisible = false
        } else {
            newVisible = true
        }
        if(disabled) return;
        if(this.props.handleDateBefore){ this.props.handleDateBefore()}
        let client = e.nativeEvent
        let containW = 640
        if(model !== 'simple'){
            containW = 320
        }
        let containH = 370
        let positionX = client.clientX;
        let positionY =  client.clientY;
        let screenWidth = document.body.clientWidth;
        let screenHeight = document.body.clientHeight;
        let mainContent = document.getElementById('main-content');
        let popContent = document.getElementById('pop-modal');
        
        if(mainContent) {
            // console.log('mainContent', mainContent);
            screenWidth = mainContent.clientWidth;
            screenHeight = mainContent.clientHeight;
        }
        if(popContent) {
            // console.log('popContent', popContent);
            screenWidth = popContent.clientWidth;
            screenHeight = popContent.clientHeight;
        }
        // console.log( client.clientX, screenWidth)
        if(client.clientX + Number(containW) >= screenWidth){
            positionX = screenWidth - containW - 60
        } else {
            positionX = 0
        }
        // console.log( client.clientY, screenHeight)
        if(client.clientY + Number(containH) >= screenHeight){
            positionY = screenHeight - containH - 30
        } else {
            positionY = 0
        }
        this.setState({
            datePickerVisible: newVisible,
            positionX: positionX,
            positionY: positionY,
        })
    }
    dataPickerCallback(data){
        this.setState({
            startDate: data.startDate || moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            endDate: data.endDate || moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            dateType: data.type || 2,
            datePickerVisible:false
        })
        const {model} = this.state;
        const { dateFormat } = this.props;
        if(model == 'date') {
            if(dateFormat) {
                let newData = moment(data.startDate).format(dateFormat)
                this.props.onChange(newData);
                this.props.callback(newData);
            }else{
                let startDate = getDateTimeStr(data.startDate);
                this.props.onChange(startDate);
                this.props.callback(startDate);
            }

        } else{
            this.props.onChange(data);
            this.props.callback(data);
        }

    }
    lastDatePicker(){
        if(this.props.startDate!=this.props.endDate) return
        let date=getLastDate(this.props.startDate)
        this.props.callback(
            {
                selected: true,
                startDate:date,
                endDate: date,
                type: 2
            }
        );
    }
    nextDatePicker(){
        if(this.props.allowToday){
            if(this.props.startDate!=this.props.endDate || this.props.startDate==getRecentDate()) return
        }else{
            if(this.props.startDate!=this.props.endDate || this.props.startDate==getDefaultDate()) return
        }
        let date=getNextDate(this.props.startDate)
        this.props.callback(
            {
                selected: true,
                startDate: date,
                endDate: date,
                type: 2
            }
        );
    }
    getLiClass(isNext){
        let className="per3"
        if(this.props.startDate==this.props.endDate){
            className+=" show"
        }
        if(this.props.allowToday){
            if(isNext &&  this.props.startDate==getRecentDate()){
                className+=" deny"
            }
        }else{
            if(isNext &&  this.props.startDate==getDefaultDate()){
                className+=" deny"
            }
        }
        return className

    }

    getAreaValue(){
       let startData = this.$$startDateArea.getValue();
       let endData = this.$$endDateArea.getValue();
       this.setState({
        areaStartDate: startData.startDate,
        areaEndDate: endData.startDate,
        datePickerVisible: false
       },()=>{
        this.dataPickerCallback(startData)
       })
    }
    getDefalutValue(){
       let startData = this.$$DefaultDate.getValue();
       this.setState({
        startData: startData.startDate,
        datePickerVisible: false
       },()=>{
           this.dataPickerCallback(startData)
       })

    }

    checkData(date1, date2){
        let result = true
        if(date2&&date2.indexOf(':')>0){
            let arr1 = date2.split(' ')[0].split('-')
            let arr2 = date2.split(' ')[1].split(':')
            date2 = [...arr1, ...arr2]
        }
        if(date1&&date1.indexOf(':')>0){
            let darr1 = date1.split(' ')[0].split('-')
            let darr2 = date1.split(' ')[1].split(':')
            date1 = [...darr1, ...darr2]
        }
        let dateStr1 = date1;
        let dateStr2 = date2;
        for(let i=0;i<dateStr1.length;i++){
            if(Number(dateStr1[i])==Number(dateStr2[i])){
                continue
            }
            else if(Number(dateStr1[i])>Number(dateStr2[i])){
                result = true; break;
            } else{
                result = false; break;
            }
        }
        return result;
    }

    showValue(value){
        const { showHour , model} = this.props
        if(model=='time'){
            return moment(value).format('HH:mm:ss');
        }
        if(value&&value.indexOf(':')>0&&showHour==false){
            let arr1 = value.split(' ')[0]
            if(model=='month'){
                let arr2 = arr1.split('-');
                return  `${arr2[0]}-${arr2[1]}`
            }
            return arr1
        }
        
        return value
    }

    handelSelectTimer(time){
		// let startDateTime = this.state.startDate;
		// console.log('startDate', startDateTime, `${startDateTime} ${time}`)
		this.setState({
            startDate: time,
        })
	}

    render(){
        const {model, startDate, endDate, dateType, allowToday, nextMounthStartDate, nextMounthEndDate, areaStartDate, areaEndDate, positionX, positionY, disabled, datePickerVisible} = this.state;
        const {style, defaultValue, showTime} = this.props
        if(model == 'simple')
            return(
                <div className={`com-datepick date-area overflow-hide ${showTime ? '' :'no-time'} ${this.props.className||''} ${ disabled ? 'disabled' : ''}`} style={typeof style =='string'? JSON.parse(style): style}>
                    <div className={`inside ${showTime ? '' :'no-time'}`} onClick={this.openDatePicker.bind(this)}>
                        <Row justify={'flex-end'}>
                            {showTime ? <Col span={21} className="cursor-pointer">{ areaStartDate&&areaStartDate!=='' ? <span className="font-size-8">{this.showValue(areaStartDate)} 至 {this.showValue(areaEndDate)}</span> : 
                                <span style={{color: Theme.grey}}>开始日期 至 结束日期</span> }</Col> : ''}
                            <Col span={3} style={{minWidth: '30px'}}><Icon iconName={'calendar'} size={'120%'} iconColor={Theme.grey}  /></Col>
                        </Row>
                    </div>
                    <Row style={Object.assign({}, positionX ? {left: positionX} : {}, positionY ? {top: positionY} : {})} className={`${this.state.datePickerVisible ? '': 'display-none'} fixed bg-show date-pick-container zindex-100`}>
					<Col span={12} className="padding-right-1r border-right border-color-d9d8d8">
                        <DatePickerArea
                            query={{
                                start_date: areaStartDate,
                                end_date: areaStartDate,
                                date_type: dateType,
                                allow_today: allowToday,
                            }}
                            callback={(res)=>{
                                // console.log('callback', res)
                                this.setState({
                                    areaStartDate: res.startDate,
                                    startDate: res.startDate,
                                    endDate: res.endDate
                                })
                            }}
                            monthCheck={(res)=>{
                                // console.log(res, nextMounthStartDate)
                                let status = this.checkData(res, nextMounthStartDate)
                                // console.log('nxtCheckData status', status)
                                return !status
                            }}
                            preCheckData={(res)=>{
                                return true
                            }}
                            nxtCheckData={(res)=>{
                                // console.log(res, nextMounthStartDate)
                                let status = this.checkData(res, nextMounthStartDate)
                                // console.log('nxtCheckData status', status)
                                return !status
                            }}
                            visible={this.state.datePickerVisible}
                            ref={(r)=>{this.$$startDateArea=r}}
                        ></DatePickerArea>
					</Col>
					<Col span={12} className="">
                        <DatePickerArea
                            query={{
                                start_date: nextMounthStartDate,
                                end_date: nextMounthEndDate,
                                date_type: dateType,
                                allow_today: allowToday,
                            }}
                            callback={(res)=>{
                                // console.log('callback',res, startDate)
                                this.setState({
                                    nextMounthStartDate: res.startDate,
                                    nextMounthEndDate: res.endDate,
                                    areaEndDate:res.endDate
                                })
                            }}
                            monthCheck={(res)=>{
                                let status = this.checkData(res, startDate)
                                // console.log('nxtCheckData status', status)
                                return status
                            }}
                            preCheckData={(res)=>{
                                // console.log(res, startDate)
                                let status = this.checkData(res, startDate)
                                // console.log('preCheckData status', status)
                                return status
                            }}
                            nxtCheckData={(res)=>{
                                return true
                            }}
                            visible={this.state.datePickerVisible}
                            ref={(r)=>{this.$$endDateArea=r}}
                        ></DatePickerArea>
					</Col>
                    <Col className="">
                    {this.state.datePickerVisible ?<Row className="btn-group">
                        <Col span={8} className="text-align-left" onClick={()=>{
                            this.setState({
                                datePickerVisible:false
                            })
                        }}>
                            <Buttons
                                text={'取消'}
                                type={'primary'}
                                size={'small'}
                                plain
                            />
                        </Col>
                        <Col span={8} />
                        <Col span={8} className="text-align-right" onClick={()=>{
                            this.getAreaValue()
                        }}>
                            <Buttons
                                text={'确定'}
                                type={'primary'}
                                size={'small'}
                            />
                        </Col>
                    </Row>: ''}
                    </Col>
				</Row> 
                { datePickerVisible ?<div className="fixed width-100 heighth-100 left-0 top-0 zindex-10" onClick={()=>{
                        this.setState({datePickerVisible: false})
                    }}></div> : ''}
                </div>
            )
        else if(model == 'time'){
            return <div className={`com-datepick time ${ disabled ? 'disabled' : ''}`}>
                <Timer viewDate={startDate} callBack={(time)=>{this.handelSelectTimer(time)}} />
            </div>
        }
        else
            return(
                <div className={`com-datepick ${ disabled ? 'disabled' : ''}`}>
                    <Row className="inside overflow-hide text-overflow text-align-center" onClick={this.openDatePicker.bind(this)}>
                        <Col span={21} className="cursor-pointer">
                        { startDate&&startDate!=='' ? <span className="font-size-8">{this.showValue(startDate)}</span> : 
                                <span style={{color: Theme.grey}}>请选择日期</span> }
                        </Col>
                        <Col span={3} className=""><Icon iconName={'calendar'} size={'120%'} iconColor={Theme.grey}  /></Col>
                    </Row>
                    <div style={Object.assign({}, positionX ? {left: positionX} : {}, positionY ? {top: positionY} : {})} className={`${this.state.datePickerVisible ? '': 'display-none'} fixed bg-show zindex-100`}>
                    <DatePickerArea
                            containStyle={{width: '20rem'}}
                            query={{
                                start_date: startDate,
                                end_date: endDate,
                                date_type: model,
                                allow_today: allowToday,
                            }}
                            callback={(res)=>{
                                this.setState({
                                    startDate: res.startDate,
                                    endDate: res.endDate,
                                    dateType: res.type
                                })
                            }}
                            monthCheck={(res)=>{
                                return true
                            }}
                            preCheckData={(res)=>{
                                return true
                            }}
                            nxtCheckData={(res)=>{
                                return true
                            }}
                            model={model}
                            visible={this.state.datePickerVisible}
                            ref={(r)=>{this.$$DefaultDate=r}}
                        ></DatePickerArea>
                        {this.state.datePickerVisible ?<Row >
                        <Col span={8} className="text-align-left" onClick={()=>{
                            this.setState({
                                datePickerVisible:false
                            })
                        }}>
                            <Buttons
                                text={'取消'}
                                type={'primary'}
                                size={'small'}
                                plain
                            />
                        </Col>
                        <Col span={8} />
                        <Col span={8} className="text-align-right" onClick={()=>{
                            this.getDefalutValue()
                        }}>
                            <Buttons
                                text={'确定'}
                                type={'primary'}
                                size={'small'}
                            />
                        </Col>
                    </Row>: ''}
                    </div>
                    { datePickerVisible ?<div className="fixed width-100 heighth-100 left-0 top-0 zindex-10" onClick={()=>{
                        this.setState({datePickerVisible: false})
                    }}></div> : ''}
                </div>
            );
            
    }
}
DatePicker.defaultProps = {
    allowToday: true,
    handleDateChange: function () {},
    model: 'simple',
    dateType: 'simple',
    startDate: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    defaultValue: true,
    dateFormat: '',
    showHour: false,
    showTime: true,
};
// DatePicker.propTypes = {
// 	startDate: PropTypes.string.isRequired,
// 	endDate: PropTypes.string.isRequired,
// 	dateType: PropTypes.number.isRequired,
// 	handleDateChange: PropTypes.func
// };

export default DatePicker;