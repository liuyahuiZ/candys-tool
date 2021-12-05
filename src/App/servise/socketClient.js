import io from '../servise/socket.io';
import { utils } from 'neo';
const { storage, sessions } = utils;

// let socket = io.connect('ws://localhost:2019');
// let socket = io.connect('wss://www.wetalks.cn',{path: '/socket.io'});
// let socket = io.connect('wss://www.wetalks.cn/nodeApi',{path: '/socket.io'});

export function socketLogin(callback){
    // let userInfo = sessions.getStorage('userInfo')
    // console.log('userInfo', userInfo);
    // var obj = {
    //     'userid': userInfo[0]._id,
    //     'username': userInfo[0].username,
    //     'time': new Date().toJSON()
    // };
    // socket.emit('candysLogin', obj );
}

export function heardCommit(callback){
    // socket.on('commit', function(o){
    //     callback(o)
    // });
}

export function socketGetMessage( callback){
    // socket.on('message', function(o){
    //     console.log('message', o)
    //     callback(o)
    // });
}