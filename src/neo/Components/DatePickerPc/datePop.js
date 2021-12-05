import React from 'react';
import ReactDOM from 'react-dom';
import  DatePickerCom  from './date_picker'; 

const div = document.createElement('div');
document.body.appendChild(div);

function create() {
  return (msg, closePre) => {

    ReactDOM.render(<DatePickerCom ref={(r) => { dom.$$DatePickerCom = r; }} />, div, function () {
      this.show(msg);
    });
  };
}

export default {
  show: create(),
  hide: () => { dom.$$DatePickerCom.hide(); }
};
