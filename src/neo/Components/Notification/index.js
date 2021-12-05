import React from 'react';
import ReactDOM from 'react-dom';
import Notification from './notification';

const div = document.createElement('div');
document.body.appendChild(div);

function create() {
  return (msg, closePre) => {
    msg.type = msg.type ? msg.type : 'normal';
    msg.content = msg.content ? msg.content : '';
    msg.time = msg.time ? msg.time : 10000;
    msg.position = msg.position ? msg.position : 'top';
    ReactDOM.render(<Notification />, div, function () {
      this.doToaster(msg, closePre);
    });
  };
}

export default {
  toaster: create()
};
