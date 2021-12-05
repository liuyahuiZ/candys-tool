import React from 'react';
import ReactDOM from 'react-dom';
import Toaster from './toaster';

const div = document.createElement('div');
document.body.appendChild(div);
let dom = {};
function create() {
  return (msg, closePre) => {
    const type = msg.type ? msg.type : 'normal';
    const content = msg.content ? msg.content : '';
    const time = msg.time ? msg.time : 5000;
    const position = msg.position ? msg.position : 'top';
    ReactDOM.render(<Toaster ref={(r) => { dom.$$Toaster = r; }}  />, div, function () {
      this.doToaster(type, content, time, closePre, position);
    });
  };
}

export default {
  toaster: create(),
  closeAll: () => { 
    dom.$$Toaster && dom.$$Toaster.rmAll(); }
};
