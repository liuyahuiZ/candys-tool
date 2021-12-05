import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as arrayUtils from '../../utils/array';
import styles from './style';
import SubMenu from './subMenu';
import themes from './theme';
import '../Style/comstyle.scss';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkArr: [],
      parent: {},
      parents: [],
      contradiction: '',
      activeNode: this.props.activeNode
    };
    this.setActive = this.setActive.bind(this);
  }
  componentDidMount() {
    const self = this;
    self.$$menu.onclick = function (ev) {
      let itm = {};
      if (ev.target.children.length > 0) {
        itm = ev.target.firstChild.dataset;
      } else {
        itm = ev.target.dataset;
      }
      if (itm && itm.content) {
        self.setActive(itm.content);
      }
    };
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.activeNode){
      this.setState({
        activeNode: nextProps.activeNode
      })
    }
    
  }
  setActive(iem) {
    // console.log('iem',JSON.parse(iem));
    let newIem = JSON.parse(iem);
    this.props.callBack ? this.props.callBack(newIem) : this.setState({ activeNode: newIem.id });
  }
  loop = (data, level) => data.map((item) => {
    const { display, theme, collapsed, transKey } = this.props;
    const { activeNode } = this.state;
    const actived = activeNode && activeNode === item.id;
    const levels = level||1;
    const iconNames = item.projectIcon || item.pageIcon || item.describe;
    if (item.display === 'none'||item.status==0) {
      return '';
    }
    if(transKey){
      let keys = Object.keys(transKey);
      let values = Object.values(transKey);
      for(let i = 0; i<keys.length;i++){
        if(item[values[i]]){
          item[keys[i]] = item[values[i]]
        }
      }
    }

    if (item.children) {
      return (
        <SubMenu
          prekey={item.keyID} key={item.key} keyID={item.key} level={levels} title={item.title} link={item.link}
          display={display} active={actived} iconName={iconNames} otherName={item.otherName}
          setActiveNode={this.setActive} themes={theme} collapseds={collapsed} item={item}
          callBack={(res)=>{}}
        >
          {this.loop(item.children, level+1)}
        </SubMenu>
      );
    }
    return (<SubMenu
      prekey={item.keyID} key={item.key} keyID={item.key} level={levels} title={item.title} link={item.link}
      active={actived} themes={theme} collapseds={collapsed} otherName={item.otherName}
      display={display} setActiveNode={this.setActive} iconName={iconNames} item={item}
      callBack={(res)=>{}}
    />);
  });

  render() {
    const data = this.props.Date;
    const { ulBg, ulborder } = themes[this.props.theme];
    const ulbg = { backgroundColor: ulBg, border: ulborder };
    const modalStyle = this.props.collapsed ? { width: '50px' } : '';
    return (
      <ul
        className="trans"
        style={arrayUtils.merge([styles.rootUl, ulbg, modalStyle])}
        ref={(r) => { this.$$menu = r; }}
      >
        {this.loop(data, 1)}
      </ul>
    );
  }
}

Menu.propTypes = {
  Date: PropTypes.arrayOf(PropTypes.shape({})),
  display: PropTypes.string,
  activeNode: PropTypes.string,
  theme: PropTypes.string,
  collapsed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

Menu.defaultProps = {
  Date: [],
  checkable: false,
  display: 'hide',
  activeNode: '',
  theme: '',
  collapsed: false,
  transKey: []
};


export default Menu;
