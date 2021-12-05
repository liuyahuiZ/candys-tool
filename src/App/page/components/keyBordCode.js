import React from 'react';
import {Components} from 'neo';
import BordCode from './BordCode';

const {
  Row,
  Col,
  Icon,
  PopContainer,
} = Components;

function mformConfirm(option, sendCode, callback, finish) {
    const content = (<div>
    <Row className="border-bottom border-color-e5e5e5">
      <Col span={4} className={'text-align-center line-height-3r'} onClick={() => { PopContainer.closeAll() }} >
          <Icon iconName={"android-close"} size={'180%'} iconColor={'#000'} />
      </Col>
      <Col span={16} className={'text-align-center line-height-3r'}>{option.title}</Col>
      <Col span={4} className="text-align-center line-height-3r font-size-9" onClick={finish}>完成</Col>
    </Row>
    <Row>
      <Col className="bg-f5f5f5">
        <BordCode sendCode={sendCode}  callback={callback}/>
      </Col>
    </Row>
    </div>);
    PopContainer.confirm({
      content: content,
      type: 'bottom',
      containerStyle: { top: '3rem'},
    });
}


export default {
  confirm: mformConfirm,
  close: () => { PopContainer.closeAll() }
};
