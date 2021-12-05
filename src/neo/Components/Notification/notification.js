import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from './message';


class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      id: 0,
    };
    this.doToaster = this.doToaster.bind(this);
    this.rmMsg = this.rmMsg.bind(this);
  }
  doToaster(msg, closePre) {
    this.toaster(msg, closePre);
  }
  remove(arr, id) {
    this.arr = arr;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        arr.splice(i, 1);
      }
    }
    return arr;
  }
  move(arr, id){
    this.arr = arr;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        arr[i].action = 'leave';
      }
    }
    return arr;
  }
  toaster(obj, closePre) {
    const Newid = this.state.id + 1;
    obj.id = Newid;
    obj.action = 'enter';
    let newOptions = this.state.options;
    if (closePre) {
      newOptions = [obj];
    } else {
      newOptions.push(obj);
    }

    this.setState({ id: Newid });
    this.setState({ options: newOptions });
  }
  rmMsg(key) {
    const self = this;
    const newOptions = this.state.options;
    const newarr = this.move(newOptions, key);
    this.setState({ options: newarr });
    setTimeout(()=>{
      const resultArr = this.remove(newOptions, key);
      self.setState({ options: resultArr });
    }, 2000)
  }
  render() {
    return (
    <Message options={this.state.options} callbackRM={this.rmMsg} />
    );
  }
}

Notification.propTypes = {
  style: PropTypes.shape({})
};

Notification.defaultProps = {
  style: {}
};

export default Notification;
