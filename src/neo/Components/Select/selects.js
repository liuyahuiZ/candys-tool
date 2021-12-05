import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './selectStyle';
import Icon from '../Icon';
import Row from '../Grid/Row';
import Col from '../Grid/Col';
import * as arrayUtils from '../../utils/array';
import theme from '../Style/theme';
import '../Style/comstyle.scss';
import fetch from '../../utils/request';
import config from '../../utils/config';
import * as sessions from '../../utils/sessions';
// import Toaster from '../Toaster';

class Selects extends Component {
  constructor(props) {
    super(props);
    const { value, options, hasRequest, initRequest, disabled } = this.props;
    let newOptions = eval(options);
    this.state = {
      value: value || (newOptions && newOptions[0] && newOptions[0].value),
      focus: false,
      text: (newOptions && newOptions[0] && newOptions[0].text),
      filterText: '',
      options: newOptions || [{}],
      hasRequest: hasRequest,
      initRequest: initRequest,
      disabled: disabled
    };
    this.handleChange = this.handleChange.bind(this);
    this.changeOptions = this.changeOptions.bind(this);
    this.initRequest = this.initRequest.bind(this);
    this.focus = this.focus.bind(this);
    this.setValue = this.setValue.bind(this);
    this.setDisable = this.setDisable.bind(this);
  }

  componentDidMount() {
    const self = this;
    const { onChange, hasRequest, enableOptionInitRequest } = this.props;
    this.initText()
    self.$$options.onclick = function (ev) {
      let itm = {};
      if (ev.target.children.length > 0) {
        itm = ev.target.firstChild.dataset;
      } else {
        itm = ev.target.dataset;
      }
      if (itm.content) {
        const content = JSON.parse(itm.content);
        if (content.value !== self.state.value) {
          self.setState({
            value: content.value,
            text: content.text,
            ...content
          });
          onChange(ev, self, {
            value: content.value,
            text: content.text,
            ...content
          });
        }

        self.focus();
      }
    };
    self.$$selects.onblur = function () {
      self.setState({ focus: false });
    };
    if(hasRequest==true&&enableOptionInitRequest==true){
      this.initRequest()
    }
  }
  componentWillReceiveProps(nextProps) {
    let options = nextProps.options.length>0? nextProps.options: this.state.options
    let newOptions = eval(options);
    if(nextProps.hasRequest==true&&nextProps.enableOptionInitRequest==true){
      this.initRequest({}, nextProps.value)
    } else{
      this.setState({
        value: nextProps.value,
        text: this.getText(nextProps.value),
        options: newOptions
      },()=>{this.initText()});
    }
  }

  componentWillUnmount(){
    this.setState({
      value: '',
      text: '',
      options: []
    });
  }

  initText(){
    const {options, value} = this.state;
    if(!options) return;
    let resValue = '';
    let resText = ''
    for (let i = 0; i < options.length; i++) {
      if (options[i].default) {
        resValue = options[i].value;
        resText = options[i].text;
        break;
      } else if (options[i].value === value) {
        resValue = options[i].value;
        resText = options[i].text;
        break;
      } else{
        resValue = options[0].value;
        resText = options[0].text
      }
    }
    this.setState({
      value: resValue,
      text: resText
    });
  }
  setValue(_value) {
    this.setState({ value: _value, text: this.getText(_value) });
  }
  setDisable(disabled){
    this.setState({ disabled: disabled });
  }
  setType(valueType, value){
    switch(valueType){
      case 'Number':
          return Number(value);
      case 'String':
          return value.toString();
      case 'Object':
          return JSON.parse(value);
      case 'JSON':
          return JSON.parse(value);
      default: 
          return value
      }
  }

  setReqs(condition, parmes){
    if(!parmes) return;
    let resp = {}
    if(!(condition&&condition.length)) return;
    for(let i=0;i<condition.length;i++){
      let resValue = condition[i].value ? condition[i].value :parmes[condition[i].key]
      if(condition[i].value&&condition[i].value.indexOf('$P.')>=0){
        const { pageData } = this.props
        if(pageData){
          resValue = pageData[condition[i].value.replace('$P.', '')] 
        }
      }
      if(condition[i].valueType){
        resValue = this.setType(condition[i].valueType, condition[i].value)
      }
      if(condition[i].optionCacheKey){
        let cache = sessions.getStorage('caches')
        resValue = cache[condition[i].optionCacheKey.keyName]
      }
      resp[condition[i].text] = resValue
    }
    return resp
  }

  initRequest(parems = {}, defaultValue){
    const { initRequest } = this.props;
    // console.log('initRequest', initRequest);
    
    const self = this;
    if(initRequest&&initRequest.url) {
      fetch(initRequest.url, {
        method: initRequest.method,
        data: Object.assign({}, self.setReqs(initRequest.options, {}), parems)
      }, initRequest.header||{}, initRequest).then((res) => {
        if (res.code === config.SUCCESS) {
          let options = arrayUtils.getOptions(res.data, initRequest.textKey, initRequest.valueKey)
          let allOptions = [{text: '请选择', value: ''}]
          allOptions.push(...options);
          let value = '';
          let text = ''
          for (let i = 0; i < allOptions.length; i++) {
            if (allOptions[i].default) {
              value = allOptions[i].value;
              text = allOptions[i].text;
              break;
            } else if (allOptions[i].value === defaultValue) {
              value = allOptions[i].value;
              text = allOptions[i].text;
              break;
            } else{
              value = allOptions[0].value;
              text = allOptions[0].text;
            }
          }
          self.setState({
            options: allOptions,
            value: value,
            text: text
          });
        } else {
          // Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
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

  handleChange(event) {
    const value = event.target.value;
    setTimeout(() => {
      this.setState({
        filterText: value
      });
    }, 500);
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
  render() {
    const { style, filter } = this.props;
    const { options, filterText, disabled } = this.state;
    const containerStyle = Object.assign({}, styles.container, typeof style =='string'? JSON.parse(style): style);
    const disabledStyle = disabled ? styles.disabled : '';
    const optionStyle = this.state.focus ? styles.show : styles.hide;
    const selectActive = this.state.focus ? arrayUtils.merge([styles.active,
      { outline: 0, boxShadow: `0 0 0 2px rgba(${theme.primaryRgb},.3)`, border: `1px solid rgb(${theme.primaryRgb})` }]) : '';
    // const selectActive = this.state.focus ?
    //  { outline: 0, boxShadow: `0 0 0 2px rgba(${theme.primaryRgb},.3)`,
    // border: `1px solid rgb(${theme.primaryRgb})` } : '';
    const filtInput = filter ?
    (<div style={arrayUtils.merge([styles.filter, optionStyle])}>
      <Row><Col span={4} style={styles.search}><Icon iconName={'ios-search-strong'} size={'100%'} /></Col>
      <Col span={20}><input type="text" style={styles.filterInput} onChange={this.handleChange} /></Col>
      </Row>
    </div>)
    : '';
    const tabIndex = filter ? '' : 0;
    const optionNode = options&&options.length>0? options.map((itm, id) => {
      const key = `${itm.value}-${id}`;
      let node = (<div
        style={styles.node}
        key={key} data-content={JSON.stringify({ value: itm.value, text: itm.text, ...itm })}
      >{itm.text}</div>);
      if (filterText && filterText !== '') {
        if ((itm.text).indexOf(filterText) < 0) {
          node = '';
        }
      }
      return node;
    }) : '';
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
          <div style={styles.text}>{this.state.text}</div>
          <span style={styles.icon}>
            <Icon iconName={'chevron-down'} size={'80%'} />
          </span>
        </div>
        <div className="options" style={arrayUtils.merge([styles.content, optionStyle])} ref={(r) => { this.$$options = r; }}>
          {filtInput}
          <div className="scroller" style={arrayUtils.merge([styles.options])}>{optionNode}</div>
        </div>
      </div>
    );
  }
}

Selects.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.shape({})]),
  disabled: PropTypes.bool,
  options: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.shape({})]),
  style: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  onChange: PropTypes.func,
  filter: PropTypes.bool,
  enableOptionInitRequest: PropTypes.bool,
  hasRequest: PropTypes.bool,
};

Selects.defaultProps = {
  value: '',
  disabled: false,
  options: [],
  style: {},
  onChange: () => {},
  filter: false,
  enableOptionInitRequest: true,
  hasRequest: false,
};

export default Selects;
