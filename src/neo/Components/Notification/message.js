import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import Transition from '../Transition';
import '../Style/notifition.scss';
import theme from '../Style/theme';
import Row from '../Grid/Row';
import Col from '../Grid/Col';
class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.hide = this.hide.bind(this);
    this.clearTime = this.clearTime.bind(this);
  }
  hide(index) {
    this.props.callbackRM(index);
  }
  timeHide(index, timeout) {
    const self = this;
    self.timmer = setTimeout(() => {
      self.hide(index);
    }, timeout);
  }
  clearTime() {
    clearTimeout(this.timmer);
  }
  render() {
    const self = this;
    const options = self.props.options;
    // const leftCon = Object.assign({}, styles.leftCon);
    // const rightX = Object.assign({}, styles.rightX);
    const IconArr = { success: 'checkmark-circled', warning: 'android-alert', 
    error: 'android-cancel', normal: 'android-alert'};
    const resumap = options.map((itm) => {
      const selfStye = itm.type ;
      const positionStyle = itm.position ;
      if (itm.msgtype !== 'error') {
        self.timeHide(itm.id, itm.time);
      } else {
        self.timeHide(itm.id, 6000);
      }
      return (
        <Transition
        act={itm.action||'enter'}
        duration={166}
        enter={'notification-enter'}
        leave={'notification-leave'}
        key={itm.id}
      >
        <Row className={`notification-megStyle ${selfStye} ${positionStyle}`} key={`${itm.id}-toast`} >
          <Col span={3} className="text-align-center"><Icon iconName={IconArr[itm.type]} size={'160%'} iconColor={theme[itm.type]} />
          </Col>
          <Col span={21}>
            <Row>
              <Col span={18} className="font-size-12">{itm.title}</Col>
              <Col span={6} className="text-align-right text-gray" onClick={() => { self.hide(itm.id); }}><Icon iconName={'close-circled'} size={'160%'} iconColor={'#666'} /></Col>
              <Col>{itm.content}</Col>
            </Row>
          </Col>
        </Row>
        </Transition>
      );
    });
    return (
      <div className="notificationGroup" >
          {resumap}
      </div>
    );
  }
}

Message.propTypes = {
  callbackRM: PropTypes.func
  // style: PropTypes.shape({})
};

Message.defaultProps = {
  options: [],
  callbackRM: {}
};

export default Message;
