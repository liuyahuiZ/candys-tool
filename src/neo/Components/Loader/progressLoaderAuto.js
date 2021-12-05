import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as arrayUtils from '../../utils/array';
import styles from './style';

let timmer = {};
class ProgressLoaderAuto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      status: this.props.status||'success', // success, error
      percent: 0,
      classNames: ''
    };
    this.hide = this.hide.bind(this);
    this.showProgress = this.showProgress.bind(this);
  }
  componentDidMount(){
    const {status} = this.state
    if(status!=='success') {
      this.showProgress()
    }
  }
  componentWillReceiveProps(nextProps){
    // console.log('nextProps', nextProps)
    this.setState({
      status: nextProps.status
    })
    if(nextProps.status=='success'){
      this.hide()
    }else if(nextProps.status=='error'){
      this.setState({ percent: 100, classNames: 'transition' });
      clearInterval(timmer);
    }
  }
  showProgress(status) {
    if (status && status !== '') {
      this.hide();
    } else {
      this.setState({ percent: 0, classNames: '', status: 'show' });
      timmer = setInterval(() => {
        this.changePercent();
      }, 10);
    }
  }
  hide() {
    this.setState({ percent: 100, classNames: 'transition' });
    setTimeout(() => {
      this.setState({ status: 'success' });
    }, 600);
    clearInterval(timmer);
  }

  changePercent() {
    let per = this.state.percent;
    if (per < 30) {
      per += 0.1;
      this.setState({
        percent: per
      });
    } else if (per < 60) {
      per += 0.05;
      this.setState({
        percent: per
      });
    } else if (per < 95) {
      per += 0.01;
      this.setState({
        percent: per
      });
    } else {
      clearInterval(timmer);
    }
  }
  render() {
    const { radius, loaderStyle } = this.props;
    const { percent, status, classNames } = this.state;
    const borderRadius = { borderRadius: radius };
    const barColorArr = {show: 'rgb(65, 150, 252)', error: '#F55936'};

    const barWidth = { width: `${percent}%`, backgroundColor: barColorArr[status], boxShadow: `1px 1px 2px ${barColorArr[status]}`, borderRadius: radius };

    // console.log('barWidth', barWidth)
    const loaders = status !== 'success' ? (<div style={arrayUtils.merge([styles.loaderAuto, loaderStyle])} className={classNames}>
    <div style={arrayUtils.merge([styles.progressContainer, borderRadius])}>
      <div style={arrayUtils.merge([styles.bar, barWidth])} />
    </div>
    </div>) : (<div />);
    return loaders;
  }
}

ProgressLoaderAuto.propTypes = {
  barColor: PropTypes.string,
  radius: PropTypes.number,
  boxShad: PropTypes.string,
  loaderStyle: PropTypes.shape({})
};

ProgressLoaderAuto.defaultProps = {
  barColor: 'rgb(65, 150, 252)',
  boxShad: '1px 1px 2px rgba(65, 150, 252, 0.6)',
  radius: 0,
  loaderStyle: {}
};


export default ProgressLoaderAuto;
