import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Components, utils } from 'neo';
import '../../style/navTag.scss'
import Theme from '../../config/headerTheme';
const { Row, Col, Icon } = Components;
const { sessions } = utils;

class NavTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: this.props.options||[],
      activeId:this.props.activeId,
      showAction: false,
      scrollLeft: 0,
      limitScroll: 0,
      step: 100,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
        options: nextProps.options||[],
        activeId: nextProps.activeId,
    },()=>{
      this.checkLength();
    });
  }
  componentDidMount() {
    // console.log('activeId',this.state.activeId)
  }
  onClick = res => {
    this.setState({
        activeId:res.id
    })
    sessions.setStorage('activeMenu', res)
    this.props.onMenuClick(res);
  };
  //   关闭菜单
  onClose = res => {
    let newArr=this.state.options.filter(item=>item.id!==res.id);
    if(res.id===this.state.activeId && newArr.length>0){
        let newActiveId = newArr[0].id;
        this.setState({
            activeId:newActiveId
        })
        this.onClick(newArr[0]);
    }
    this.checkLength()
    this.setState({
        options:newArr
    })
    sessions.setStorage('navCache', newArr)
  };
  checkLength(){
    const { activeId } = this.state;
    let tabContent = this.$$tabContent;
    let tabs = this.$$tabs;
    // console.log('checkLength', tabs.offsetWidth, tabContent.offsetWidth)
    let showAction = false
    let scrollLeft = 0;
    if(tabs.offsetWidth>tabContent.offsetWidth){
      showAction =  true
      scrollLeft = tabContent.offsetWidth - tabs.offsetWidth
    }

    if(this[`$$${activeId}`]&&(this[`$$${activeId}`].offsetLeft< Math.abs(scrollLeft)))
    {
      scrollLeft = - this[`$$${activeId}`].offsetLeft
    }
    this.setState({
      showAction: showAction,
      limitScroll: tabs.offsetWidth - tabContent.offsetWidth,
      scrollLeft: scrollLeft
    })
    
  }
  preMove(){
    const { step } = this.state;
    let scrollLeft = this.state.scrollLeft
    scrollLeft += step 
    if(scrollLeft > 0) {
      scrollLeft = 0
    }
    this.setState({
      scrollLeft: scrollLeft
    })
  }
  nextMove(){
    const { limitScroll, step } = this.state;
    let scrollLeft = this.state.scrollLeft
    scrollLeft -= step 
    if(scrollLeft< -limitScroll){
      scrollLeft = 0
    }
    this.setState({
      scrollLeft: scrollLeft
    })
  }
  render() {
    const {options,activeId, showAction, scrollLeft} = this.state;
    const self = this;
    let copy= options.concat().reverse()||[];
    
    const tabHeader = copy && copy.length > 0 ? copy.map((item) => {
        const dom = (<div
          key={item.id}
          data-content={item.id}
          className={`tab-item transf ${activeId===item.id ? 'active-style' : ''}`}
          ref={(r)=>{self[`$$${item.id}`] = r}}
        >
          <span onClick={()=>{
            this.onClick(item)
          }}>{item.title}</span>
          <Icon className='cnt-close' iconName={'android-cancel '} size={'120%'} iconColor={'#999'} onClick={()=>{
            this.onClose(item)
          }} />
        </div>);
        return dom;
      }) : <div />;
    return (
      <Row className={`candys-nav-tab ${Theme.headerBg}`} >
        {showAction ? <Col span={1} className={'line-height-3r cursor-pointer'} onClick={()=>{
            this.preMove()
          }}>
          <Icon className='cnt-close' iconName={'ios-arrow-back '} size={'120%'} iconColor={'#999'}  />
        </Col> : ''}
        <Col span={22}>
          <div className={`cnt-bd overflow-hide transf text-align-left`} ref={(r)=>{ self.$$tabContent = r}}>
              <div className="transf row display-inline-block" ref={(r)=>{ self.$$tabs = r}} style={{left: scrollLeft, position: 'relative'}}>
              {tabHeader}
              </div>
          </div>
        </Col>
        {showAction ? <Col span={1} className={'line-height-3r cursor-pointer'} onClick={()=>{
            this.nextMove()
          }}>
          <Icon className='cnt-close' iconName={'ios-arrow-forward '} size={'120%'} iconColor={'#999'}  />
        </Col> : ''}
      </Row>
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
