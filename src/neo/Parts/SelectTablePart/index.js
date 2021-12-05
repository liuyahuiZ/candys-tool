import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './selectStyle';
import { Icon, Row, Col, Input } from '../../Components'
import * as arrayUtils from '../../utils/array';
import theme from '../../Components/Style/theme';
import fetch from '../../utils/request';
import config from '../../utils/config';

class SelectTablePart extends Component {
  constructor(props) {
    super(props);
    const { value, options, hasRequest, initRequest, tableList, keys } = this.props;
    let newOptions = eval(options);
    this.state = {
      value: value || (newOptions && newOptions[0] && newOptions[0].value),
      focus: false,
      text: (newOptions && newOptions[0] && newOptions[0].text),
      filterText: '',
      options: newOptions || [{}],
      tableList: tableList,
      hasRequest: hasRequest,
      initRequest: initRequest,
      keys: keys
    };
    this.changeOptions = this.changeOptions.bind(this);
    this.focus = this.focus.bind(this);
  }

  componentDidMount() {
    const self = this;
    const { options, value, hasRequest } = this.props;
    let newOptions = eval(options) || [{}];
    // self.$$selects.onblur = function () {
    //   self.setState({ focus: false });
    // };
    
    for (let i = 0; i < newOptions.length; i++) {
      if (newOptions[i].default) {
        self.setState({
          value: newOptions[i].value,
          text: newOptions[i].text
        });
      } else if (newOptions[i].value === value) {
        self.setState({
          value: newOptions[i].value,
          text: newOptions[i].text
        });
      }
    }
    if(hasRequest==true){
      this.initRequestAction()
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
      text: this.getText(nextProps.value),
      // options: eval(nextProps.options),
    });
  }

  initRequestAction(req={}){
    const { initRequest } = this.props;
    // console.log('initRequest', initRequest, req);
    const self = this;
    if(initRequest&&initRequest.url) {
      fetch(initRequest.url, {
        method: initRequest.method,
        data: Object.assign({}, arrayUtils.setReq(initRequest.options, {}), req)
      }, initRequest.header||{}, initRequest).then((res) => {
        if (res.code === config.SUCCESS) {
          self.setState({
            options: res.data
          });
        } else {
          Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
        }
      }).catch((err)=>{
        // console.log(err);
      });
    }
  }

  getText(value) {
    const { options } = this.state;
    let text = '';
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === value) {
        text = options[i].text;
      }
    }
    return text;
  }
  getValue() {
    return this.state.value;
  }

  changeOptions(options, defaultValue) {
    if (!options || !options.length) {
      return;
    }
    let idx = 0;
    if (defaultValue) {
      idx = options&&options.map(it => it.value).indexOf(defaultValue);
    }
    const { value, text } = options[idx > 0 ? idx : 0];
    const { value: old } = this.state;
    const { onChange } = this.props;
    this.setState({
      options,
      value,
      text,
    });
    if (old !== value) {
      onChange(null, null, {
        text,
        value,
      });
    }
  }

  focus() {
    if (this.props.disabled) return;
    let status = this.state.focus;
    if (status) {
      status = false;
    } else {
      status = true;
    }
    this.setState({ focus: status });
  }
  setOptions(itm, self){
    const { keys }= self.state;
    // console.log('keys,', keys);
    this.setState({
      text: itm[keys],
      value: itm[keys]
    })
    this.props.onChange(itm)
    this.focus();
  }
  getHeader(){
    const { tableList } = this.state;

    const tableDom = tableList&&tableList.length > 0 ? tableList.map((itm, idx)=>{
      return <div className="minwidth-7 padding-left-3 padding-right-3" key={`${idx}-th`}>{itm.text}</div>
    }) : '';
    return <Row className={"heighr-3 line-height-3r"}>{tableDom}</Row>
  }
  getOptions(){
    const { tableList, options } = this.state;
    const self = this;
    let optionsDom = options&&options.length > 0 ? options.map((ops, oidx)=>{
    const tableDom = tableList&&tableList.length > 0 ? tableList.map((itm, idx)=>{
      return <div className="minwidth-7 padding-left-3 padding-right-3" key={`${idx}-td`}>{ops[itm.key]}</div>
    }) : '';
    return <Row key={`${oidx}-td`} className={"heighr-3 line-height-3r font-size-8"} onClick={()=>{
      self.setOptions(ops, self);
    }}>{tableDom}</Row>
   }) : ''; 
   return optionsDom
  }
  render() {
    const { style, disabled, filter } = this.props;
    const { filterText, text, keys } = this.state;
    const self = this;
    const containerStyle = Object.assign({}, styles.container, typeof style =='string'? JSON.parse(style): style);
    const disabledStyle = disabled ? styles.disabled : '';
    const optionStyle = this.state.focus ? styles.show : styles.hide;
    const selectActive = this.state.focus ? arrayUtils.merge([styles.active,
      { outline: 0, boxShadow: `0 0 0 2px rgba(${theme.primaryRgb},.3)`, border: `1px solid rgb(${theme.primaryRgb})` }]) : '';
    
    const filtInput = (<div style={arrayUtils.merge([styles.filter, optionStyle])}>
      <Row><Col span={3} style={styles.search}><Icon iconName={'ios-search-strong'} size={'130%'} /></Col>
      <Col span={21}>
        <Input
          value={filterText|| ''}
          placeholder="请输入"
          maxLength={100}
          innerStyle={{'lineHeight':'2.5rem', 'height': '2.5rem'}}
          onChange={(e,t,v)=>{
              self.setState({
                filterText: v
              })
              // console.log('key',keys, v)
              self.initRequestAction({
                [keys]: v
              })
          }}
          />
      </Col>
      </Row>
    </div>);
    const tabIndex = filter ? '' : 0;
    return (
      <div
        style={containerStyle}
        ref={(r) => { this.$$selects = r; }}
        tabIndex={tabIndex}
        className="selects"
      >
        <div
          style={arrayUtils.merge([styles.select, selectActive, disabledStyle])}
          onClick={() => { this.focus(); }}
        >
          <div style={styles.text}>{text}</div>
          <span style={styles.icon}>
            <Icon iconName={'chevron-down'} size={'80%'} />
          </span>
        </div>
        <div className="options" style={arrayUtils.merge([styles.content, optionStyle])} ref={(r) => { this.$$options = r; }}>
          {filtInput}
          {this.getHeader()}
          {this.getOptions()}
        </div>
      </div>
    );
  }
}

SelectTablePart.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.shape({})]),
  disabled: PropTypes.bool,
  options: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.shape({})]),
  tableList: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.shape({})]),
  style: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  onChange: PropTypes.func,
  filter: PropTypes.bool,
};

SelectTablePart.defaultProps = {
  value: '',
  disabled: false,
  options: [],
  style: {},
  tableList: [],
  onChange: () => {},
  filter: false,
};

export default SelectTablePart;
