import React from 'react'; // 引入 react
import { Component } from 'react';
import moment from 'moment'; // 引入时间计算插件
import Icon from '../Icon';
import Buttons from '../Button/button';
import Row from '../Grid/Row';
import Col from '../Grid/Col';
import Timer from './timer';

export default class DatePickerArea extends Component {
	constructor(props) {
		super(props);

		const query = this.props.query; // 获取 props 中的携带参数
		let _startDate = query.start_date ;
		let _endDate = query.end_date;
		let _days = getDays(_startDate, _endDate, _startDate);
		let _type = query.date_type;
		let _hideType =(query.hide_type)
		let _canClick = true;
		let allowToday = query.allow_today;
		let nowDate = query.start_date;
		const dateNum = - 20*365
		if (allowToday === true) {
			nowDate = query.start_date
		}

		let _months = [];
		let _year = moment(_endDate).year();
		let _selectedMonth = moment(_endDate).format('YYYY-MM');
		
		_months = getMonths(_year, _selectedMonth);
		

		this.nowDate = {
			startDate: nowDate,
			endDate: nowDate
		};

		this.canSelectDate = {
			startDate: moment().subtract(dateNum, 'days').format('YYYY-MM-DD'),
			endDate: moment().subtract(dateNum, 'days').format('YYYY-MM-DD')
		}
		this.datePicker = {
			selected: false,
			startDate: _startDate,
			endDate: _endDate,
			type: _type
		};

		this.types = [
			{
				text: "最近7天",
				selected: false,
				func: this.handleLast7Days.bind(this)
			},
			{
				text: "最近30天",
				selected: false,
				func: this.handleLast30Days.bind(this)
			},
			{
				text: "日",
				selected: true,
				func: this.handleDay.bind(this)
			},
			{
				text: "周",
				selected: false,
				func: this.handleWeek.bind(this)
			},
			{
				text: "月",
				selected: false,
				func: this.handleMonth.bind(this)
			}
		];

		let _types = selectType(this.types, _type);

		this.state = {
			startDate: _startDate,
			endDate: _endDate,
			viewDate: _endDate,//moment(_endDate).format('YYYY年MM月'),
			days: _days,
			types: _types,
			type: _type,
			canClick: _canClick,
			allowToday:allowToday,
			months: _months,
			year: _year,
			selectedMonth: _selectedMonth,
			selectedTime: '00:00:00',
			showPoint: true,
            showCom:false, //是否显示弹窗
			hideType: _hideType,
			model: this.props.model
		};

		this.mmnt = moment(_endDate);
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
		this.getValue = this.getValue.bind(this);
	}

    componentWillReceiveProps(nextProps) {
		// console.log('componentWillReceiveProps', nextProps)
		const query = nextProps.query; 
		this.setState({
			startDate: query.start_date,
			endDate: query.end_date,
			viewDate: query.start_date,
			model: nextProps.model
		})
        if(nextProps.visible){
        	this.toggleCom(true)
		}else{
            this.toggleCom(false)
		}
	}
	show(){
		this.toggleCom(true)
	}
	hide(){
		this.toggleCom(false)
	}
	getValue(){
		return this.state;
	}
	handleBtnRightClick () {
		this.datePicker = {
			selected: true,
			startDate: this.state.startDate,
			endDate: this.state.endDate,
			type: this.state.type
		};

        if(typeof (this.props.callback) == 'function'){
            this.propsCallback(this.datePicker)
        }
	}

	handleMonthPre () {
		const { startDate } = this.state
		let newDate = moment(startDate).subtract(1, 'months').endOf('month').startOf('day').format('YYYY-MM-DD HH:mm:ss');
		let newEndDate = moment(startDate).subtract(1, 'months').endOf('month').startOf('day').format('YYYY-MM-DD HH:mm:ss');
		let _days = getDays(newDate, newEndDate, newDate);
		let status = this.props.preCheckData(newDate);
		if(!status) {
			return 
		}
		let newYear = moment(newDate).format('YYYY')
		let _months = getMonths(newYear, this.state.selectedMonth);
		this.setState({
			selectedMonth: moment(newDate).format('YYYY-MM'),
			year: newYear,
			startDate: newDate,
			endDate: newEndDate,
			viewDate: newDate,//moment(newDate).format('YYYY年MM月'),
			days: _days,
			months: _months
		},()=>{
			this.propsCallback(this.state)
		});
	}

	handleMonthNxt () {
		const { startDate } = this.state
		let newDate = moment(startDate).add(1, 'months').startOf('month').startOf('day').format('YYYY-MM-DD HH:mm:ss');
		let newEndDate = moment(startDate).add(1, 'months').endOf('month').startOf('day').format('YYYY-MM-DD HH:mm:ss');
		let _days = getDays(newDate, newEndDate, newDate);
		let status = this.props.nxtCheckData(newDate);
		if(!status) {
			return;
		}
		let newYear = moment(newDate).format('YYYY')
		let _months = getMonths(newYear, this.state.selectedMonth);
		this.setState({
			selectedMonth: moment(newDate).format('YYYY-MM'),
			year: newYear,
			startDate: newDate,
			endDate: newEndDate,
			viewDate: newDate,//moment(newDate).format('YYYY年MM月'),
			days: _days,
			months: _months
		},()=>{
			this.propsCallback(this.state)
		});
	}

	handleYearPre () {
		let newYear = this.state.year - 1;
		let _months = getMonths(newYear, this.state.selectedMonth);

		this.setState({
			year: newYear,
			months: _months
		});
	}

	handleYearNxt () {
		let newYear = this.state.year + 1;
		let _months = getMonths(newYear, this.state.selectedMonth);

		this.setState({
			year: newYear,
			months: _months
		});
	}

	handleLast30Days () {
		let newDate = moment();
		// let currDate = newDate.format('YYYY-MM-DD');
		let _endDate = newDate.subtract(1, 'days').format('YYYY-MM-DD');
		let _startDate = newDate.subtract(29, 'days').format('YYYY-MM-DD');

		const datePicker = {
			selected: true,
			startDate: _startDate,
			endDate: _endDate,
			type: 1
		};
		if(typeof (this.props.callback) == 'function'){
            this.propsCallback(datePicker)
		}
	}

	handleLast7Days () {
		let newDate = moment();
		// let currDate = newDate.format('YYYY-MM-DD');
		let _endDate = newDate.subtract(1, 'days').format('YYYY-MM-DD');
		let _startDate = newDate.subtract(6, 'days').format('YYYY-MM-DD');
		const datePicker = {
			selected: true,
			startDate: _startDate,
			endDate: _endDate,
			type: 0
		};

        if(typeof (this.props.callback) == 'function'){
            this.propsCallback(datePicker)
        }
	}

	handleDay () {
		this.setState({
			showPoint: true
		});

		let _types = selectType(this.types, 2);
		let _days = getDays(this.nowDate.startDate, this.nowDate.endDate, this.nowDate.startDate);

		this.setState({
			types: _types,
			days: _days,
			startDate: this.nowDate.startDate,
			endDate: this.nowDate.endDate,
			viewDate: this.nowDate.endDate,//moment(this.nowDate.endDate).format('YYYY年MM月'),
			canClick: true,
			type: 2
		});

		this.mmnt = moment(this.nowDate.endDate);
	}

	handleWeek () {
		this.setState({
			showPoint: true
		});

		let _types = selectType(this.types, 3);

		let _startDate = moment(this.nowDate.startDate).subtract(1, 'days').startOf('week').add(1, 'days').format('YYYY-MM-DD');
		let _endDate = moment(this.nowDate.startDate).subtract(1, 'days').endOf('week').add(1, 'days').format('YYYY-MM-DD');

		if (!moment(this.nowDate.startDate).isSame(_endDate)) {
			_startDate = moment(this.nowDate.startDate).subtract(8, 'days').startOf('week').add(1, 'days').format('YYYY-MM-DD');
			_endDate = moment(this.nowDate.startDate).subtract(8, 'days').endOf('week').add(1, 'days').format('YYYY-MM-DD');
		}

		let _days = getDays(_startDate, _endDate, _endDate, false);

		this.setState({
			types: _types,
			days: _days,
			startDate: _startDate,
			endDate: _endDate,
			viewDate: _endDate,//moment(_endDate).format('YYYY年MM月'),
			canClick: true,
			type: 3
		});

		this.mmnt = moment(_endDate);
	}

	handleMonth () {
		this.setState({
			showPoint: true
		});

		let _types = selectType(this.types, 4);
		let mmnt = moment();
		let _year = mmnt.year();
		let _selectedMonth = mmnt.subtract(1, 'months').format('YYYY-MM');
		let _months = getMonths(_year, _selectedMonth);
		let _startDate = moment(_selectedMonth).startOf('month').startOf('day').format('YYYY-MM-DD HH:mm:ss');
		let _endDate = moment(_selectedMonth).endOf('month').endOf('day').format('YYYY-MM-DD HH:mm:ss');

		this.setState({
			year: _year,
			selectedMonth: _selectedMonth,
			months: _months,
			startDate: _startDate,
			endDate: _endDate,
			type: 4,
			types: _types
		});
	}

	handleSelectMonth (selectedMonth) {
		const { model } = this.state;
		let _startDate = moment(selectedMonth).startOf('month').startOf('day').format('YYYY-MM-DD HH:mm:ss');
		let status = this.props.monthCheck(_startDate);
		if(!status) {
			return 
		}
		const _months = getMonths(this.state.year, selectedMonth);
		let _endDate = moment(selectedMonth).endOf('month').startOf('day').format('YYYY-MM-DD HH:mm:ss');

		let _days = getDays(_startDate, _endDate, _endDate, false);
		let obg = {
			selectedMonth: selectedMonth,
			months: _months,
			startDate: _startDate,
			endDate: _endDate,
			viewDate: _startDate,
			days:_days
		}
		if(model=='month'){
			obg = Object.assign({}, obg, {type: 'month'})
		}else{
			obg = Object.assign({}, obg, {type: 'days'})
		}
		
		this.setState(obg,()=>{
			this.propsCallback(this.state)
		});
	}

	handelSelectTimer(time){
		let startDateTime = this.state.startDate;
		// console.log('startDate', startDateTime, `${startDateTime} ${time}`)
		if(startDateTime.indexOf(':')>0){
			startDateTime = startDateTime.split(' ')[0]
		}
		let _startDate = moment(`${startDateTime} ${time}`).format('YYYY-MM-DD HH:mm:ss');
		// console.log('_startDate', _startDate)
		let status = this.props.monthCheck(_startDate);
		if(!status) {
			return 
		}
		this.setState({
			selectedTime: time,
			startDate: _startDate,
			viewDate: _startDate,
		},()=>{
			this.propsCallback(this.state)
		});
	}

	propsCallback(state){
		let startDateTime = state.startDate
		if(startDateTime.indexOf(':')<0){
			startDateTime = `${startDateTime} ${state.selectedTime}`
		}
		state.startDate = startDateTime
		this.props.callback(state)
	}
	handleSelectDay (date) {
		let _days = [];

		let _startDate = moment(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
		let _endDate = date;
		// let _mmntDate = date;

		// if (moment(date).isAfter(this.canSelectDate.startDate)) {
		// 	console.log('时间选择出错，请重新选择');

		// 	return ;
		// }
		let status = this.props.monthCheck(_startDate);
		if(!status) {
			return 
		}

		let selectedMonth = moment(date).format('YYYY-MM');
		// let startDate = moment(selectedMonth).startOf('month').format('YYYY-MM-DD');
		let endDate = moment(selectedMonth).endOf('month').format('YYYY-MM-DD');
		_days = getDays(date, endDate, endDate);

		this.setState({
			days: _days,
			startDate: _startDate,
			endDate: _endDate,
			viewDate: _endDate, //moment(_endDate).format('YYYY年MM月')
		},()=>{
			this.propsCallback(this.state)
		});

		this.mmnt = moment(_endDate);
	}

	handleSelectYear(year){
		const _months = getMonths(year, `${year}-1`);
		let _days = getDays(`${year}-1-1`, `${year}-1-31`, `${year}-1-31`);
		this.setState({
			day:_days,
			year: year,
			months: _months,
			type: 'month'
		});
	}
	/*开关组件*/
    toggleCom(bool){
    	if(bool)
    		this.setState({showCom:true})
		else
            this.setState({showCom:false})
	}

	renderContainer(type){
		switch(type){
			case 'month':
				return (<Months year={this.state.year} months={this.state.months} handleSelectMonth={this.handleSelectMonth.bind(this)}/>)
			case 'year':
				return (<Years viewDate={this.state.viewDate} selectYear={(year)=>{ this.handleSelectYear(year) }}/>)
			case 'days':
				return (<div><ComWeekend viewDate={this.state.viewDate} btnLeftFn={this.handleMonthPre.bind(this)} btnRightFn={this.handleMonthNxt.bind(this)}/>
				<Days days={this.state.days} showPoint={this.state.showPoint} handleSelectDay={this.handleSelectDay.bind(this)} canClick={this.state.canClick}/>
				</div>)
			case 'time':
				<Timer viewDate={this.state.viewDate} callBack={(time)=>{this.handelSelectTimer(time)}} />
				return 
			default:
				return (<Row>
				<Col><ComWeekend viewDate={this.state.viewDate} btnLeftFn={this.handleMonthPre.bind(this)} btnRightFn={this.handleMonthNxt.bind(this)}/>
					<Days days={this.state.days} showPoint={this.state.showPoint} handleSelectDay={this.handleSelectDay.bind(this)} canClick={this.state.canClick}/>
					</Col></Row>)
		}
	}
	/**
	 * 页面渲染方法
	 */
	render () {
		if(!this.state.showCom) return(null)
		const { type, model } = this.state;
		// console.log('type', type)
		let renderType = type;
		let containerDom = this.renderContainer(renderType)
		return (
			<div className={`date-pick-area g-body bg-show ${model}`} >
				<ComMonthend model={model} viewDate={this.state.viewDate} btnLeftFn={this.handleMonthPre.bind(this)} btnRightFn={this.handleMonthNxt.bind(this)} 
					monthClick={()=>{ this.setState({type: 'month'}) }} yearClick={()=>{ this.setState({type: 'year'}) }} 
					handelSelectTimer={this.handelSelectTimer.bind(this)}/>
				{containerDom}
				{/* {
					(this.state.type === 2 || this.state.type === 3 || this.state.type === 4) &&
					<BtnGroup btnLeftFn={this.props.closeCom} btnRightFn={this.handleBtnRightClick.bind(this)}/>
				} */}
			</div>
		);
	}
}

function selectType (types, index) {
	return types.map((val, _index) => {
		if (_index === index) {
			return Object.assign({}, val, {
				selected: true
			});
		}

		return Object.assign({}, val, {
			selected: false
		});
	})
}

function getMonths (year, selectedMonth) {
	let mmnt = moment(selectedMonth);
	let _selectedMonth = mmnt.format('YYYY-MM');
	let lastYear = year - 1;
	// let month = mmnt.month();
	// let currMonth = moment().startOf('month').format('YYYY-MM-DD');

	const _months = [];
	const _nextMonths = [];

	for (let i = 0; i < 12; i++) {
		_months.push({
			text: i + 1,
			month: moment([year, i]).format('YYYY-MM'),
			selected: moment([year, i]).format('YYYY-MM') === _selectedMonth,
			// disabled: !moment([year, i]).endOf('month').isBefore(currMonth)
		});
	}

	for (let i = 0; i < 12; i++) {
		_nextMonths.push({
			text: i + 1,
			month: moment([lastYear, i]).format('YYYY-MM'),
			selected: moment([lastYear, i]).format('YYYY-MM') === _selectedMonth,
			// disabled: !moment([lastYear, i]).endOf('month').isBefore(currMonth)
		});
	}

	return [
		{
			year: year,
			data: _months
		},
		{
			year: lastYear,
			data: _nextMonths
		}
	];
}

function getDays (startDate, endDate, currDate, notWeek = true) {
	const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	const _endDate = new Date(endDate);
	const _startDate = new Date(startDate);
	const _currDate = new Date(currDate);
	const days = [];
	const todayStr = moment().format('YYYY-MM-DD');
	const startOfWeek = moment().subtract(1, 'days').startOf('week').add(1, 'days').format('YYYY-MM-DD');

	let year = _currDate.getFullYear();
	let month = _currDate.getMonth();

	let lastYear = month > 0 ? year : year - 1;
	let nextYear = month < 11 ? year : year + 1;

	
	let lastMonth = month > 0 ? month - 1 : 11;
	let nextMonth = month < 11 ? month + 1 : 0;
	
	if ((year % 4 === 0) && (year % 100 !== 0) || year % 400 === 0) {
		months[1] = 29;
	}

	let weekStart = moment([year, month, "01"]).days();
	let weekEnd = moment([year, month, months[month]]).days();

	if (0 !== weekStart) {
		for (let i = weekStart, j = months[lastMonth]; i > 0; i--, j--) {
			days.unshift({
				text: j,
				date: moment([lastYear, lastMonth, j]).format('YYYY-MM-DD'),
				isCurrMonth: false,
				isDuration: false,
				isPoint: 0,
				disabled: false
			});
		}
	}

	for (let i = 1; i <= months[month]; i++) {
		days.push({
			text: i,
			date: moment([year, month, i]).format('YYYY-MM-DD'),
			isCurrMonth: true,
			isDuration: false,
			isPoint: 0,
			disabled: false
		});
	}

	if (6 !== weekEnd) {
		for (let i = 1, j = 6 - weekEnd; i <= j; i++) {
			days.push({
				text: i,
				date: moment([nextYear, nextMonth, i]).format('YYYY-MM-DD'),
				isCurrMonth: false,
				isDuration: false,
				isPoint: 0,
				isToday: false,
				disabled: false
			});
		}
	}

	if (startDate === endDate) {
		days.map(val => {
			if(startDate&&startDate.indexOf(':')>0){
				startDate= startDate.split(' ')[0]
			}
			if (val.date === startDate) {
				val.isDuration = true;
				val.isPoint = 1;
			}

			if (val.date === todayStr) {
				val.isToday = true;
			}

			if (!moment(val.date).isBefore(moment(todayStr)) && val.date !== todayStr) {
				val.disabled = true;
			}
			return val;
		});
	} else {
		let minDateTime = days&&days[0]?(new Date(days[0].date)).getTime(): new Date().getTime();
		let startDateTime = _startDate.getTime();
		let endDateTime = _endDate.getTime();
		let isDuration = false;

		if ((minDateTime - startDateTime >= 0) && (endDateTime - minDateTime >= 0)) {
			isDuration = true;
		}

		days.map(val => {
			if (isDuration) {
				val.isDuration = true;			
			}

			if(startDate&&startDate.indexOf(':')>0){
				startDate= startDate.split(' ')[0]
			}
			if (val.date === startDate) {
				isDuration = true;
				val.isDuration = true;
				val.isPoint = 1;
			}


			if (val.date === todayStr) {
				val.isToday = true;
			}

			if (notWeek) {
				if (moment(val.date).isBefore(startDate)|| moment(val.date).isAfter(endDate)) {
					val.disabled = true;
				}
			} else {
				if (!moment(val.date).isBefore(startOfWeek)) {
					val.disabled = true;
				}
			}
			return val;
		});
	}

	return days;
}

/**
 * 日期类型选择组件
 */
class DateTypes extends Component {
	constructor(props) {
		super(props);
	}

	render () {
		return (
			<ul className="m-list-5">
				{
					this.props.types.map((val, index) => {
						return <li className={val.selected ? 'active '+val.class : val.class} key={index} onClick={val.func}>{val.text}</li>
					})
				}
			</ul>
		);
	}
}

DateTypes.defaultProps = {
	types: [
		{
			text: "最近7天",
			selected: false,
			func: () => {},
		},
		{
			text: "最近30天",
			selected: false,
			func: () => {}
		},
		{
			text: "日",
			selected: true,
			func: () => {}
		},
		{
			text: "周",
			selected: false,
			func: () => {}
		},
		{
			text: "月",
			selected: false,
			func: () => {}
		}
	]
};

// DateTypes.propTypes = {
// 	types: PropTypes.arrayOf(PropTypes.shape({
// 		text: PropTypes.string.isRequired,
// 		selected: PropTypes.bool.isRequired
// 	}).isRequired).isRequired
// };
// 日期类型选择组件 end
/*
* 月份选择组件
* */
class ComMonthend extends Component {
    constructor(props) {
		super(props);
		
	}
    render () {
		const { model } = this.props
		if(model=='time') {
			return <Row className="m-month-weekend line-height-2r month">
			<Col span={24} className="monthArea">
			<Timer viewDate={this.props.viewDate} callBack={(time)=>{this.props.handelSelectTimer(time)}} />
			</Col></Row>
		}
        return (
			<div className="m-month-weekend">
				<Row className="month">
					<Col span={2} className="arrow-left cursor-pointer" onClick={this.props.btnLeftFn}>
					<Icon iconName={'ios-arrow-back'} size={'100%'} iconColor={''} iconPadding={'0'} />
					</Col>
					<Col span={20} >
					<Row  justify={'center'}>
					<Col span={9} className="text-align-right cursor-pointer yearArea" onClick={()=>{this.props.yearClick()}}>{moment(this.props.viewDate).format('YYYY年')}</Col>
					<Col span={5} className="text-align-left cursor-pointer monthArea" onClick={()=>{this.props.monthClick()}}>{moment(this.props.viewDate).format('MM月')}</Col>
					{model!=='month' ?<Col span={10} className="monthArea"><Timer viewDate={this.props.viewDate} callBack={(time)=>{this.props.handelSelectTimer(time)}} /></Col>: '' }
					</Row>
					</Col>
					<Col  span={2} className="arrow-right cursor-pointer" onClick={this.props.btnRightFn}>
					<Icon iconName={'ios-arrow-forward'} size={'100%'} iconColor={''} iconPadding={'0'} />
					</Col>
				</Row>
			</div>
        );
    }
}

/**
 * 周组件
 */
class ComWeekend extends Component {
	constructor(props) {
		super(props);
	}

	render () {
		return (
			<div className="m-month-weekend">
				<ul className="weekend">
					{
						this.props.week.map((val, index) => <li key={index}>{val}</li>)
					}
				</ul>
			</div>
		);
	}
}

ComWeekend.defaultProps = {
	week: [
		"日",
		"一",
		"二",
		"三",
		"四",
		"五",
		"六"
	]
};

// MonthAndWeekend.propTypes = {
// 	viewDate: PropTypes.string.isRequired,
// 	week: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
// 	btnLeftFn: PropTypes.func.isRequired,
// 	btnRightFn: PropTypes.func.isRequired
// };
// 月份和周组件 end

/**
 * 年份组件
 */
class Month extends Component {
	constructor(props) {
		super(props);
	}

	render () {
		return (
			<div className="m-month-weekend">
				<div className="month">
					<span className="arrow-right cursor-pointer" onClick={this.props.btnRightFn}></span>
					<span className="arrow-left cursor-pointer" onClick={this.props.btnLeftFn}></span>
					<span><Row ><Col span={12} className="text-align-right" onClick={()=>{this.props.yearClick()}}>{moment(this.props.viewDate).format('YYYY年')}</Col>
					<Col span={12} className="text-align-left" onClick={()=>{this.props.monthClick()}}>{moment(this.props.viewDate).format('MM月')}</Col></Row></span>
				</div>
			</div>
		);
	}
}


class Years extends Component {
	constructor(props) {
		super(props);
		this.state={
			nowYear: Number(moment(this.props.viewDate).format('YYYY'))
		}
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			nowYear: Number(moment(nextProps.viewDate).format('YYYY'))
		})
	}
	renderYears(){
	 const { nowYear } = this.state;
	 let yearArr = [];
	 let yearLimit = 9;
	 for(let i=0; i<yearLimit;i++){
		yearArr.push({year: nowYear-i})
	 }
	 return yearArr
	}

	preYear(){
		const { nowYear } = this.state
		this.setState({
			nowYear: Number(nowYear) - 9
		})
	}

	nexYear(){
		const { nowYear } = this.state
		this.setState({
			nowYear: Number(nowYear) + 9
		})
	}

	render () {
		const years = this.renderYears()
		const { nowYear } = this.state;
		return (
			<Row className="m-year line-height-3r">
				<Col span={8} className="text-align-left padding-left-1r cursor-pointer" onClick={()=>{this.preYear()}}>
				<Icon iconName={'ios-arrow-back'} size={'100%'} iconColor={''} iconPadding={'0'} />
				</Col>
				<Col span={8} className="text-align-center">{nowYear} - {years[years.length-1].year}</Col>
				<Col span={8} className="text-align-right padding-right-1r cursor-pointer" onClick={()=>{this.nexYear()}}>
				<Icon iconName={'ios-arrow-forward'} size={'100%'} iconColor={''} iconPadding={'0'} /></Col>
				<Col className="padding-all-1r"><Row>
				{
					years&&years.length>0? years.map((val, index) => {
						return (
							<Col span={8} className={`${val.year==nowYear? 'active': ''} border-radius-5f line-height-3r text-align-center cursor-pointer`} key={`year${index}`} onClick={()=>{this.props.selectYear(val.year)}}>
								<span >{val.year}年</span>
							</Col>
						);
					}): ''
				}</Row></Col>
			</Row>
		);
	}
}
// Month.propTypes = {
// 	viewDate: PropTypes.string.isRequired,
// 	btnLeftFn: PropTypes.func.isRequired,
// 	btnRightFn: PropTypes.func.isRequired
// };
// 年份组件 end

/**
 * 月份组件
 */
class Months extends Component {
	constructor(props) {
		super(props);

		this.clientPoint = {
			x: 0,
			y: 0
		};

		let iosVersion = navigator.userAgent.match(/iOS\s(\d+)\..*;\s/);
		this.iosVersion = iosVersion?iosVersion[1]:0;
	}

	handleTouchStart (e) {
		this.clientPoint.x = e.touches[0].clientX;
		this.clientPoint.y = e.touches[0].clientY;
	}

	handleTouchEnd (e, fn) {
		if (this.clientPoint.x === e.changedTouches[0].clientX && this.clientPoint.y === e.changedTouches[0].clientY) {
			fn();
		} else {
			return false;
		}
	}

	render () {
		return (
			<div className="m-months">
				{
					this.props.months.map((val, index) => {
						return (
							<div key={`year${index}`}>
								<p className="tt">{val.year}年</p>
								{
				
									<ul className="months">
										{
											val.data.map((val, index) => {
												return (
													<li className={val.disabled ? 'disabled' : 'cursor-pointer'} key={`month-${index}`} onClick={() => this.props.handleSelectMonth(val.month)}>
														<span className={val.selected ? 'active' : ''}>{val.text}月</span>
													</li>
												);
											})
										}
									</ul> 
									// ||
									// <ul className="months">
									// 	{
									// 		val.data.map((val, index) => {
									// 			return (
									// 				<li className={val.disabled ? 'disabled' : ''} key={`month-${index}`} onTouchStart={(e) => this.handleTouchStart(e)} onTouchEnd={(e) => this.handleTouchEnd(e, () => this.props.handleSelectMonth(val.month))}>
									// 					<span className={val.selected ? 'active' : ''}>{val.text}月</span>
									// 				</li>
									// 			);
									// 		})
									// 	}
									// </ul>
								}
							</div>
						);
					})
				}
			</div>
		);
	}
}

// Months.propTypes = {
	
// };
// 月份和周组件 end

/**
 * 天数组件
 */
class Days extends Component {
	constructor(props) {
		super(props);
	}

	handleSelectDay (date) {

		this.props.handleSelectDay(date);
	}

	render () {
		return (
			<ul className="m-days">
				{
					this.props.days.map((val, index) => {
						return (
							<li className={'active cursor-pointer'} key={`day-${index}`} onClick={this.handleSelectDay.bind(this, val.date)}>
								<span className={["content-bg"].join('')}>
									<span className={["content", val.isPoint !== 0 && this.props.showPoint ? ' active' : '', val.isToday ? ' today' : ''].join('')}>{val.text}</span>
								</span>
							</li>
						);
					})
				}
			</ul>
		);
	}
}

// Days.propTypes = {
// 	days: PropTypes.arrayOf(PropTypes.shape({
// 		text: PropTypes.number.isRequired,
// 		isCurrMonth: PropTypes.bool.isRequired,
// 		isDuration: PropTypes.bool.isRequired,
// 		isPoint: PropTypes.number.isRequired
// 	}).isRequired).isRequired,

// 	handleSelectDay: PropTypes.func.isRequired,
// 	canClick: PropTypes.bool.isRequired
// };
// 天数组件

/**
 * 按钮组件
 */
class BtnGroup extends Component {
	constructor(props) {
		super(props);
	}

	render () {
		return (
			<Row className="btn-group">
				<Col span={8} onClick={this.props.btnLeftFn}>
					<Buttons
						text={this.props.btnLeft}
						type={'primary'}
						size={'small'}
						plain
					/>
				</Col>
				<Col span={8} />
				<Col span={8} className="text-align-right" onClick={this.props.btnRightFn}>
					<Buttons
						text={this.props.btnRight}
						type={'primary'}
						size={'small'}
					/>
				</Col>
			</Row>
		);
	}
}

BtnGroup.defaultProps = {
	btnLeft: "取消",
	btnRight: "确定"
};

// BtnGroup.propTypes = {
// 	btnLeft: PropTypes.string.isRequired,
// 	btnRight: PropTypes.string.isRequired,
// 	btnLeftFn: PropTypes.func.isRequired,
// 	btnRightFn: PropTypes.func.isRequired
// };
// 按钮组件 end
