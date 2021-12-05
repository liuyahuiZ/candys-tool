import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style';
import Cell from './cell';
import Transition from '../Transition';
import '../Style/Animate.scss';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      id: 0,
    };
    this.rmMsg = this.rmMsg.bind(this);
    this.popMsg = this.popMsg.bind(this);
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
  toaster(arr) {
    arr.id = new Date().getTime();
    let newOptions = this.state.options||[];
    newOptions.push(arr);
    this.setState({ options: newOptions });
  }
  rmMsg(key) {
    const newOptions = this.state.options;
    const newarr = this.remove(newOptions, key);
    this.setState({ options: newarr });
  }
  popMsg(){
    const newOptions = this.state.options;
    const newarr =  newOptions
    newarr.pop()
    this.setState({ options: newarr });
  }
  render() {
    let contbg = '';
    let resumap = ''
    const self = this;
    const { options } = this.state;
    if (options.length > 0) {
      contbg = (<Transition
        act={'enter'}
        duration={166}
        enter={'modalbg-enter'}
        leave={'modalbg-leave'}
      ><div style={styles.boxbg} /></Transition>);
      resumap = options.map((itm, idx) => {
        const cell = (
          <Cell options={itm} key={`${idx}-cell`} callbackRM={self.rmMsg} />
        );
        return cell;
      });
    }
    
    return (
      <div style={styles.container} className="transition">
        {resumap}
        {contbg}
      </div>
    );
  }
}

Modal.propTypes = {
  callbackRM: PropTypes.func
  // style: PropTypes.shape({})
};

Modal.defaultProps = {
  options: [],
  callbackRM: () => {}
};

export default Modal;
