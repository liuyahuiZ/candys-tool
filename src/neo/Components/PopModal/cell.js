import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import styles from './style';
import Row from '../Grid/Row';
import Col from '../Grid/Col';
import Transition from '../Transition';
import * as arrayUtils from '../../utils/array';
import '../Style/Animate.scss';


class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      action: 'enter'
    };
    this.hide = this.hide.bind(this);
  }
  hide(index) {
    this.setState({
      action: 'leave'
    });
    setTimeout(() => {
      this.props.callbackRM(index);
    }, 600);
  }
  render() {
    const self = this;
    const options = this.props.options;
    const contentMaxHeight = options.maxHeight ? { maxHeight: options.maxHeight } : '';

    return (
      <div style={arrayUtils.merge([styles.box])} >
        <Transition
          act={self.state.action}
          duration={166}
          enter={'modals-enter'}
          leave={'modals-leave'}
        >
          <Row style={arrayUtils.merge([styles.continer, styles[options.type],
              options.containerStyle])}>
              <Col className="line-height-3r font-size-12 padding-left-1fr border-bottom border-color-f5f5f5">
              <Row><Col span={20}>{options.title||''}</Col>
              <Col span={4} className="text-align-right cursor-pointer" onClick={()=>{self.hide(options.id)}}>
              <Icon iconName={'android-cancel '} size={'140%'} iconColor={'#666'}  /></Col></Row>
              </Col>
              <Col id="pop-modal" className="padding-top-1r scroller scroller-dark overflow-y-scroll heighth-45 padding-all-1fr" style={arrayUtils.merge([styles.content, contentMaxHeight])}> 
                {options.content}
              </Col>
            </Row>
        </Transition>
      </div>
    );
  }
}

Cell.propTypes = {
  callbackRM: PropTypes.func,
  options: PropTypes.shape({})
};

Cell.defaultProps = {
  options: {
    type: 'middle',
    style: 'normal'
  },
  callbackRM: () => {}
};

export default Cell;
