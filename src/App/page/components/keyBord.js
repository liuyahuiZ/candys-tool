import React from 'react';
import {Components, utils} from 'neo';
import Bord from './bord';
import { getKeyboard } from '../api/common'

const {
  Buttons,
  Toaster,
  Row,
  Col,
  Icon,
  PopContainer,
  Loade
} = Components;
const { sessions } = utils

/*获取密码键盘*/
function getKeyboardFun(option, callback, bordReadyback){
  const customerId = sessions.getStorage('customerId');
  Loade.show();
  getKeyboard({"customerId": customerId}).then((res) => {
    Loade.hide();
    if (res.code !== '0000') { Toaster.toaster({type: 'error', content: res.msg, time: 3000}); return; }
    let keyBoardVos =  res.responseData.keyBoardVos;
    let keyBoardId = keyBoardVos[0].keyBoardId;
    bordReadyback(keyBoardId);
    sessions.setStorage('keyBoardId', keyBoardId);
    let row1 = [],row2 = [],row3 = [],row4 = [];
    keyBoardVos.forEach((itm,idx) => {
      let m = itm.imgUrl.split('.png')[0].split('/')
      let key = m[m.length-1]
      if(idx<3){
          row1.push({key:key,value:itm.indexValue})
      }else if(idx>=3&&idx<6){
          row2.push({key:key,value:itm.indexValue})
      }else if(idx>=6&&idx<9){
          row3.push({key:key,value:itm.indexValue})
      }else{
          row4.push({key:key,value:itm.indexValue})
      }
    })
    sessions.setStorage('rows',  [row1,row2,row3,row4]);
    doPop(option, callback, [row1,row2,row3,row4])
  }).catch((err) => {
    Loade.hide();
    Toaster.toaster({type: 'success', position: 'top', content: JSON.stringify(err), time: 5000});
  })
}

function doPop(option, callback, rows) {
    const content = (<div>
    <Row className="border-bottom border-color-e5e5e5">
      <Col span={4} className={'text-align-center line-height-3r'} onClick={() => { PopContainer.closeAll() }} >
          <Icon iconName={"android-close"} size={'180%'} iconColor={'#000'} />
      </Col>
      <Col span={16} className={'text-align-center line-height-3r'}>{option.title}</Col>
      <Col span={4}></Col>
    </Row>
    <Row>
      <Col className="bg-f5f5f5">
        <Bord showPwd={option.showPwd} rows={rows} callback={callback} />
      </Col>
    </Row>
    </div>);
    PopContainer.confirm({
      content: content,
      type: 'bottom',
      containerStyle: { top: '3rem'},
    });
}

function mformConfirm(option, callback, bordReadyback){
  let keyBoardId = sessions.getStorage('keyBoardId');
  let rows = sessions.getStorage('rows');
  if(option.key && option.key == keyBoardId){
    bordReadyback(keyBoardId);
    doPop(option, callback, rows)
  }else{
    getKeyboardFun(option, callback, bordReadyback)
  }
  
}

export default {
  confirm: mformConfirm,
  close: () => { PopContainer.closeAll() }
};
