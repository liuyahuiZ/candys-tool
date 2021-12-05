import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Components, utils } from 'neo';
import '../style/navTag.scss'
const { Row, Icon } = Components;
const { sessions } = utils;

class NavTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: this.props.options,
      activeId:this.props.activeId
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
        options: nextProps.options,
        activeId: nextProps.activeId,
    });
  }
  componentDidMount() {
    // console.log('activeId',this.state.activeId)
  }
  onClick = res => {
    this.setState({
        activeId:res._id
    })
    sessions.setStorage('activeMenu', res)
    this.props.onMenuClick(res);
  };
  //   关闭菜单
  onClose = res => {
    let newArr=this.state.options.filter(item=>item._id!==res._id).reverse();
    if(res._id===this.state.activeId && newArr.length>0){
        let newActiveId = newArr[0]._id;
        this.setState({
            activeId:newActiveId
        })
        this.onClick(newArr[0]);
    }
    this.setState({
        options:newArr
    })
    sessions.setStorage('navCache', newArr)
  };
  render() {
    const {options,activeId} = this.state;

    let copy=options?options.reverse():[];
    const tabHeader = copy && copy.length > 0 ? copy.map((item) => {
        const dom = (<div
          key={item._id}
          data-content={item._id}
          className={`tab-item transf ${activeId===item._id ? 'active-style' : ''}`}
        >
          <span onClick={()=>{
            this.onClick(item)
          }}>{item.title}</span>
          <Icon className='cnt-close' iconName={'android-cancel '} size={'140%'} iconColor={'#FC5C4B'} onClick={()=>{
            this.onClose(item)
          }} />
        </div>);
        return dom;
      }) : <div />;
    return (
      <div className='candys-nav-tab'>
        <Row className={`cnt-bd overflow-hide scroller bg-show `}>
            {tabHeader}
        </Row>
      </div>
    );
  }
}

NavTag.propTypes = {
  options: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.shape({})]),
  onMenuClick: PropTypes.func,
  activeId: PropTypes.string
};

NavTag.defaultProps = {
  options: [],
  onMenuClick: () => {},
  activeId: ''
};


export default NavTag;
