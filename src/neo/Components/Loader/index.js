import React from 'react';
import ReactDOM from 'react-dom';
import Loader from './loader';
import ProgressLoader from './progressLoader';

let status = '';
let proStatus = '';
const div = document.createElement('div');
document.body.appendChild(div);

const pro = document.createElement('div');
document.body.appendChild(pro);

function calls() {
  this.showLoading(status);
}

function callbacks() {
  this.showProgress(proStatus);
}

function create(tstatus) {
  return () => {
    status = tstatus;
    ReactDOM.render(<Loader />, div, calls);
  };
}
function createProgress(tstatus) {
  return () => {
    proStatus = tstatus;
    ReactDOM.render(<ProgressLoader />, pro, callbacks);
  };
}
export default {
  show: create(),
  hide: create('hide'),
  showProgress: createProgress(),
  hideProgress: createProgress('hide'),
};
