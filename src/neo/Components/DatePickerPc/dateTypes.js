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