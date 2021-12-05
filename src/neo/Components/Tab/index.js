import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as arrayUtils from '../../utils/array';
import styles from './style';
import '../Style/Animate.scss';
import './tab.scss';
import theme from '../Style/theme';
import { addClass, removeClass } from '../../utils/dom';

class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      tabContentStyle: '',
      active: this.props.active
    };
    this.changeActive = this.changeActive.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      options: nextProps.options,
      active: nextProps.active
    });
  }
  componentDidMount() {
    const self = this;
    self.setState({ options: this.props.options });
    // self.$$tabHeader.onclick = function (ev) {
    //   let itm = {};
    //   if (ev.target.children.length > 0) {
    //     itm = ev.target.firstChild.dataset;
    //   } else {
    //     itm = ev.target.dataset;
    //   }
    //   if (itm.content) {
    //     self.changeActive(itm.content);
    //   }
    // };
    let tabHeader = this.$$tabHeader
    let tabContainer = this.$$tabContainer
    tabHeader.addEventListener('mouseover', (e)=>{
      // console.log(e);
      removeClass(tabHeader, 'scroller-thin')
      addClass(tabHeader, 'scroller')
    })
    tabHeader.addEventListener('mouseout', (e)=>{
      // console.log(e);
      removeClass(tabHeader, 'scroller')
      addClass(tabHeader, 'scroller-thin')
    })
    tabContainer.addEventListener('mouseover', (e)=>{
      // console.log(e);
      removeClass(tabContainer, 'scroller-thin')
      addClass(tabContainer, 'scroller')
    })
    tabContainer.addEventListener('mouseout', (e)=>{
      // console.log(e);
      removeClass(tabContainer, 'scroller')
      addClass(tabContainer, 'scroller-thin')
    })
  }
  changeActive(itm) {
    const arr = this.state.options;
    for (let i = 0; i < arr.length; i++) {
      if (itm === arr[i].keyword) {
        arr[i].isActive = true;
        this.setState({ tabContentStyle: { marginLeft: `${0 - (100 * i)}%` } });
      } else {
        arr[i].isActive = false;
      }
    }
    this.props.onChange(itm);
    this.setState({ options: arr });
  }
  render() {
    let containerHead = styles.containerHead;
    let tabContentStyle = arrayUtils.merge([styles.tabContent,this.props.containerStyle]);
    let tabItem = styles.tabItem;
    let activeStyle = {borderBottom: `2px solid ${theme.primary}`, color: theme.primary} //styles.tabActive;
    let tabSpan = styles.tabSpan
    const {options} = this.state;
    if (this.props.modal && this.props.modal === 'MENULEFT') {
      containerHead = arrayUtils.merge([styles.containerHead,
        styles.floatLeft, styles.leftHeadWidth]);
      tabContentStyle = arrayUtils.merge([styles.tabContent,styles.leftContentWidth]);
      tabItem = arrayUtils.merge([styles.tabItem, styles.show]);
      activeStyle = {color: theme.primary}; //styles.leftTabActive
      tabSpan = arrayUtils.merge([styles.tabSpan, styles.borderNone]);
    }
    if (this.props.modal && this.props.modal === 'SMALLTAB') {
      tabItem = arrayUtils.merge([styles.tabItem, styles.smallTabItem]);
    }
    const tabHeader = options&&options.length > 0 ? options.map((itm) => {
      let tabStyle = '';
      if (itm.keyword === this.state.active) {
        tabStyle = activeStyle;
      }
      const span = (<div
        style={arrayUtils.merge([tabItem, tabStyle, itm.headStyle])} key={itm.keyword}
        data-content={itm.keyword} className={'tab-item'} onClick={()=>{
          this.changeActive(itm.keyword)
        }}
      >
        <div style={tabSpan} data-content={itm.keyword} className={'tab-span flex-1'}>{itm.tabName}</div>
      </div>);
      return span;
    }) : '';
    const tabContent = options&&options.length > 0 ? options.map((itm) => {
      let tabStyle = styles.hide;
      if (itm.keyword === this.state.active) {
        tabStyle = styles.show;
      }
      const span = (<div style={tabStyle} key={itm.keyword}>{itm.content}</div>);
      return span;
    }): '';
    return (
      <div style={styles.container} className={'neo-tab'}>
        <div style={containerHead} className={`row ${ this.props.modal === 'MENULEFT' ? 'menu-left' : ''} scroller-thin`} ref={(r) => { this.$$tabHeader = r; }}>
          {tabHeader}
        </div>
        <div className="trans scroller-thin" style={ this.state.active? tabContentStyle: {}} ref={(r) => { this.$$tabContainer = r; }}>
          {tabContent}
        </div>
      </div>
    );
  }
}

Tab.propTypes = {
  options: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({})), PropTypes.number]),
  modal: PropTypes.string,
  onChange: PropTypes.func,
  active: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Tab.defaultProps = {
  options: [],
  modal: '',
  onChange: () => {},
  active: 0
};


export default Tab;
