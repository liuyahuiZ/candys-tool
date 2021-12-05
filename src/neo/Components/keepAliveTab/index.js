import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as arrayUtils from '../../utils/array';
import theme from '../Style/theme';
import { addClass, removeClass } from '../../utils/dom';

class KeepAlive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: this.props.options || [],
    };
    this.changeActive = this.changeActive.bind(this);
  }
  componentDidMount() {
   
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      options: nextProps.options,
    });
  }

  changeActive(itm) {
    const {options} = this.state;
    // console.log('itm', itm);
    for(let i=0;i<options.length;i++){
        if (itm.id==options[i].id) { 
            this[`$$${itm.id}-ke`].style.display = 'inline-block';
        } else{
            this[`$$${options[i].id}-ke`].style.display = 'none'
        }
    }
    
  }
  render() {
    const {options} = this.state;
    const self = this;
    // console.log('options', options)
    const tabContent = options&&options.length > 0 ? options.map((itm, idx) => {
      const span = (<div key={`${idx}-t`} style={{ display: 'none' }} ref={(r)=>{ self[`$$${itm.id}-ke`] = r}}>{itm.content}</div>);
      return span;
    }): '';
    return (
        <div className="width-100">
          {tabContent}
        </div>
    );
  }
}

KeepAlive.propTypes = {
  options: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({})), PropTypes.number]),
  modal: PropTypes.string,
  onChange: PropTypes.func,
  active: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

KeepAlive.defaultProps = {
  options: [],
  modal: '',
  onChange: () => {},
  active: 0
};


export default KeepAlive;
