import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import ProgressDrag from '../ProgressDrag';
import Icon from '../Icon';
import './index.scss';

class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playStatus: 'LOADING', // LOADING, PAUSE  PLAY  END
      current: '',
      duration: '',
      currentTime: 0,
      focus: false,
      souceUrl: this.props.souceUrl,
      preUrl: this.props.preUrl,
    };
    this.getValue = this.getValue.bind(this);
    this.setValue = this.setValue.bind(this);
    this.$$video = '';
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      nextProps
    });
  }

  fixedStr(str) {
    try {
      if (str) {
        return str.toFixed(0);
      }
      return '';
    } catch (err) {
      console.log('err', err);
      return str;
    }
  };

  playBySeconds(num){
      const curVideo = this.$$video;
      if (num && curVideo) {
        curVideo.currentTime = num;
      }
  }

  play(){
    const curVideo = this.$$video;
    console.log('curVideo', curVideo);
    curVideo && curVideo.play();
    this.setState({
      playStatus: 'PLAY'
    })
  }

  pause() {
    const curVideo = this.$$video;
    console.log('curVideo', curVideo);
    curVideo && curVideo.pause();
    this.setState({
      playStatus: 'PAUSE'
    })
  }

  rePlay(){
    this.playBySeconds(0.1);
  }

  timeChange(time) {//默认获取的时间是时间戳改成我们常见的时间格式
    //分钟
    let minute = time / 60;
    let minutes = parseInt(minute);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    //秒
    let second = time % 60;
    let seconds = parseInt(second);
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    let allTime = "" + minutes + "" + ":" + "" + seconds + ""
    return allTime
  }

  initVideoAction() {
    const curVideo = this.$$video;
    const { currentTime } = this.state;
    const self = this;
    // console.log('curVideo ===== ', curVideo);
    if (curVideo) {
      console.log('curVideo ===== ', curVideo);
      // 视频下载监听。当当前帧的数据已加载，但没有足够的数据来播放指定音频/视频的下一帧时触发
      curVideo.addEventListener('loadeddata', (res) => {
        console.log('loadeddata', res);
        self.setState({
          playStatus: 'PAUSE',
          duration: curVideo.duration
        })
      });
      curVideo.addEventListener('loadedmetadata', () => {
        console.log('this.video loadedmetadata =====', curVideo.currentTime);
        self.setState({
          playStatus: 'PAUSE',
          duration: curVideo.duration
        })
        curVideo.controls = false;
      });
      curVideo.addEventListener('canplay', () => {
        console.log('this.video canplay =====', curVideo.currentTime);
        self.setState({
          playStatus: 'PAUSE',
        })
        if (currentTime) {
          console.log('old currentTime', currentTime);
          self.playBySeconds(currentTime);
        }
      });
      curVideo.addEventListener('pause', () => {
        console.log('this.video pause =====', curVideo.currentTime);
        self.setState({
          playStatus: 'PAUSE',
        })
      });
      curVideo.addEventListener('play', () => {
        console.log('this.video play=====', curVideo.currentTime);
        self.setState({
          playStatus: 'PLAY',
        })
      });
      // 时长变化。当指定的音频/视频的时长数据发生变化时触发，加载后，时长由 NaN 变为音频/视频的实际时长
      curVideo.addEventListener('durationchange', () => {
        console.log('durationchange =====', curVideo.currentTime);
      });
      curVideo.addEventListener('timeupdate', () => {
        self.setState({
          playStatus: 'PLAY',
          current: curVideo.currentTime
        })
        if (self.fixedStr(curVideo.currentTime) === self.fixedStr(curVideo.duration)) {
          self.setState({
            playStatus: 'END',
          })
        }
      });
      curVideo.addEventListener('progress', () => {
        console.log('onprogress =====');
      });
      curVideo.addEventListener('ended', () => {
        console.log('ended =====');
        self.setState({
          playStatus: 'END',
        })
      });
      curVideo.addEventListener('waiting', () => {
        console.log('waiting =====');
      });
      curVideo.addEventListener('volumechange', () => {
        console.log('volumechange =====');
      });
      curVideo.addEventListener('error', () => {
        console.log('error =====');
      });
    }
  }
  componentDidMount() {
    this.initVideoAction();
  }

  getValue() {
  }

  setValue(_value) {
    this.setState({ value: _value });
  }

  render() {
    const { playStatus, current, duration, preUrl, souceUrl } = this.state;
    const { className } = this.props;
    let rootUrl = souceUrl
    if(preUrl&&preUrl.indexOf('${')>=0&&souceUrl){
      // let splitArr = imageURl.split(/\${.*\}/g)
      rootUrl = preUrl.replace(/\${.*\}/g, souceUrl)
    } else{
      rootUrl = souceUrl
    }
    return (
      <span  className={`video-container relative ${className}`}>
        <div className="absolute control">
          {
            playStatus === 'LOADING' && <span onClick={()=>{this.play()}}>加载中...</span>
          }
          {
            playStatus === 'PLAY' && <span onClick={()=>{this.pause()}}><Icon iconName='ios-pause' size="200%" /></span>
          }
          {
            playStatus === 'PAUSE' && <span onClick={()=>{this.play()}}><Icon iconName='ios-play' size="200%" /></span>
          }
          {
            playStatus === 'END' && <span onClick={()=>{this.rePlay()}}><Icon iconName="ios-refresh-outline" size="200%" /></span>
          }
        </div>
        <div className="absolute progress">
          <div className="time-limit">
            <div className="left-time">{this.timeChange(current||0)}</div>
            <div className="right-time">{this.timeChange(duration||0)}</div>
          </div>
          <ProgressDrag percent={current/duration*100} 
            barColor={'#fff'} bgColor={'#333'}
            style={{height: '5px'}} barRoundStyle={{}}
            radius={20} onChange={(v)=>{ console.log(v); }} />
        </div>
        <video playsInline={true} ref={(r) => { this.$$video = r; }} preload={'auto'}>
          <source
            src={rootUrl || "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"}
            type="video/mp4"
          ></source>
        </video>
      </span>
    );
  }
}

Video.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  className: PropTypes.string
};

Video.defaultProps = {
  value: '',
  style: {},
  type: 'text',
  className: '',
};

export default Video;
