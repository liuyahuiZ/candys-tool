import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './index.scss';

const getIndex = (list, item) => {
  if (list && list.length < 1) {
    return 0;
  }
  let index1 = _.findIndex(list, item);
  let index2 = list.indexOf(item);
  let index = Math.max(index1, index2);
  if (index < 0) {
    // throw new Error('list数组中不存在defaultValue');
  }
  return index;
}
let scrollTimer;
class Picker extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.startY = 0;
    this.endY   = 0;
    //当前拖动的Y坐标
    this.currentY = 0;
    this.itemHeight = 36;
    this.selectedIndex = this.getInitialIndex();
    this.state = {style: {}};
    this._defaultValue = null;
  }

  // 初始化获得selectedIndex
  getInitialIndex() {
    let index = getIndex(
      this.props.data.list,
      this.props.data.defaultValue
    );
    if (!this.props.data.defaultValue && this.props.data.list.length > 3) {
      index = Math.floor(this.props.data.list.length / 2);
    }
    return index;
  }

  componentWillReceiveProps(nextProps) {

    const isEqual = _.isEqual(
      nextProps.data.defaultValue,
      this._defaultValue
    );
    if (!isEqual) {
      this._defaultValue = nextProps.data.defaultValue;
      this.selectedIndex = this.getReceivePropsIndex(nextProps.data);
    }
  }

  getReceivePropsIndex (data) {
    if (this._defaultValue) {
      this.selectedIndex = getIndex(
        data.list,
        data.defaultValue
      );
    }
    return this.selectedIndex;
  }
  // 计算list数组索引
  countListIndex (pageY) {
    let n = pageY / this.itemHeight;
    this.setState({
      nowIndex: Math.round(n),
      lock: true
    })
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(()=>{
      this.setState({
        lock: false
      },()=>{this.reCheckScroll(Math.round(n))})
    }, 500)

    this.setSelectedValue(Math.round(n));
  }

  // set选中值
  setSelectedValue (index) {
    const length = this.props.data.list.length;
    if (length === 0) {
      this.callback(null);
      return;
    }
    if (index < 0 || index > length -1) {
      // throw new Error('滑动取值索引数值出现错误'+ index);
    }
    const value = this.props.data.list[index];
    this.selectedIndex = index;

    this.callback(value)
  }

  // 回调
  callback (value) {
    this.props.onChange(value);
  }

  getSelectedClass (index) {
    if (this.selectedIndex === index) {
      return 'ui-picker-item-selected';
    }
    return '';
  }

  reCheckScroll(index){
    const { lock } = this.state;
    if(lock) return false;
    this.$$pickerCont.scrollTop = index * this.itemHeight;
  }

  componentDidMount () {
    this.setSelectedValue(this.selectedIndex);
    const self = this;
    this.$$pickerCont.addEventListener('scroll', (e)=>{
      let target = e.target
      // console.log('scroll', e, target.scrollHeight, target.scrollTop)
      self.countListIndex(target.scrollTop)
    })
  }


  render () {
    return (
      <div className="ui-picker-wrapper overflow-auto scoller scroller" ref={(r)=>{ this.$$pickerCont = r}}>
          <div className="ui-picker picker-cont">
            {
              this.props.data.list.map((data, index) => {
                const displayValue = this.props.data.displayValue(data);
                return <div key={`${index}-pick`}
                  className={ 'ui-picker-item ' + this.getSelectedClass(index)}>
                  {displayValue}
                </div>
              })
            }
          </div>
      </div>
    )
  }
}

Picker.propTypes = {
  // 数据源
  data: PropTypes.object.isRequired,
  // 当停止滑动选中立即回调onchange方法
  onChange: PropTypes.func.isRequired,
};

export default Picker;