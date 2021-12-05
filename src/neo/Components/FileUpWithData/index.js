import React from 'react';
import { PropTypes } from 'prop-types';
import * as arrayUtils from '../../utils/array';
import Row from '../Grid/Row';
import Col from '../Grid/Col';
import Buttons from '../Button/buttons';
import Icon from '../Icon';
import fileUP from '../../utils/fileUp';
import config from '../../utils/config';
import ProGressLoader from '../Loader/progressLoaderAuto';
import Toaster from '../Toaster';

class FileUpWithData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params:this.props.params||null,
      defaultSrc: this.props.defaultSrc,
      theFile: '',
      fileArr: [],
      nowEditFile: {},
      description: this.props.description,
      compress: this.props.compress,
      callType: this.props.callType || 'H5', //H5 Native
      quality: this.props.quality || 60,
      maxSize: this.props.maxSize || 20,
      accept: this.props.accept || 'image/*',
      typeModel: this.props.typeModel || 'View', //View Button
      fileType: this.props.fileType || 'blob',
      fileModel: this.props.fileModel || 'SINGEL',//  SINGEL 、 MULTIPLE
      upUrlInfo: this.props.doRequest || {},
      showFiles: this.props.showFiles || true,
      imgStyle:this.props.imgStyle||{},
      resultModel: 'Link',
      fileArrLinkArr: [],
      action: 'ADD', // ADD CHANGE DEL
    };
    this.change = this.change.bind(this);
    this.EditImg = this.EditImg.bind(this);
    this.getFile = this.getFile.bind(this);
    this.getValue = this.getValue.bind(this);
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      typeModel: nextProps.typeModel,
      accept: nextProps.accept,
      compress: nextProps.compress,
      imgStyle:nextProps.imgStyle,
      quality: nextProps.quality,
      fileType: nextProps.fileType,
      fileModel: nextProps.fileModel,
      description: nextProps.description,
      upUrlInfo: nextProps.doRequest,
      showFiles: nextProps.showFiles,
      params:nextProps.params
    })
    if(nextProps.defaultSrc){
      this.setState({
        defaultSrc: nextProps.defaultSrc
      })
    }
  }
  change() {
    const file = this.$$files.files[0];
    const self = this;
    if (file) {
      // console.log(file)
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = function (event) {
        self.setState({ defaultSrc: event.target.result });
      };
      const type = file.type.split('/');
      setTimeout(()=>{
        self.rendFile(type, file);
      },600)
    }
  }
  rendFile(type, file){
    const self = this;
    const { fileType } = this.state;
    if(self.state.compress) {
      self.compress(self.$$img, 65, type[1]).then((result) => {
          const newfile = self.convertBase64UrlToBlob(result.src, result.dataContent);
          // console.log(newfile)
          self.setState({
            theFile: newfile
          })
          if(fileType==='blob'){
            self.fileReady(newfile);
          } else{
            self.fileReady(result.src)
          }
          // self.updateFile(newfile, type[1]);
      });
    } else {
      self.setState({
        theFile: file
      })
      if(fileType==='blob'){
        self.fileReady(file);
      } else{
        self.fileReady(self.state.defaultSrc)
      }
    }
  }
  getFile(){
    let file = this.state.theFile;
    return file;
  }

  getValue(){
    const { fileModel, fileArrLinkArr } = this.state;
    if(fileModel=='SINGEL'){
      return fileArrLinkArr[0]
    }
    return fileArrLinkArr;
  }

  setReq(condition, parmes){
    if(!parmes) return;
    let data = new FormData();
    for(let i=0;i<condition.length;i++){
      if(condition[i].key === 'file'){
        data.append(condition[i].key, parmes.file);
      }else{
        data.append(condition[i].key, condition[i].value);
      }
    }
    return data
  }

  upfileData(parmes, callback){
    // console.log("你好哇",parmes)
    const { upUrlInfo, fileArrLinkArr } = this.state;
    const self = this;
    // console.log('upUrlInfo', upUrlInfo)
    if(upUrlInfo&&upUrlInfo.url) {
      fileUP(upUrlInfo.url, {
        method: upUrlInfo.method,
        data: upUrlInfo.options?self.setReq(upUrlInfo.options, parmes):{},
      }, upUrlInfo.header||{}).then((res) => {
        // console.log('res', res);
        let newArr = JSON.parse(JSON.stringify(fileArrLinkArr))
        if (res.code === config.SUCCESS) {
          newArr.push(res.data)
          self.setState({
            fileArrLinkArr: newArr
          })
          callback('success')
          self.props.fileReady(newArr[0])
          // Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
        } else {
          callback('error')
          Toaster.toaster({ type: 'error', content: res.msg,time: 3000 },true)
        }
      }).catch((err)=>{
        // console.log('err', err)
        callback('error')
      });
    }
  }

  fileReady(file){
    const { action, fileArr, nowEditFile, defaultSrc} = this.state;
    const self = this;
    // console.log("fileReady")
    let newArr = fileArr.slice(0);
    file.defaultSrc = defaultSrc;
    file.status = 'show';
    if(action=='ADD'){
        newArr.push(file);
    }else if(action=='CHANGE') {
      let obg = arrayUtils.checkInArrIndex(fileArr, 'name', nowEditFile.name)
      newArr[obg.index] = file;
    }
    //文件load完时 自动上传
    self.setState({
      fileArr: newArr,
    }, ()=>{
      self.upfileData({file: file,...this.state.params}, (code)=>{
        file.status = code;
        let resArr = arrayUtils.changeNode(newArr, 'name', file);
        self.setState({
          fileArr: resArr
        })
      });
    })
  }

  // 转file
  convertBase64UrlToBlob(urlData, mimeType) {
    const bytes = window.atob(urlData.split(',')[1]);        // 去掉url的头，并转换为byte
    // 处理异常,将ascii码小于0的转换为大于0
    const ab = new ArrayBuffer(bytes.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeType||'image/jpeg' });
  }
  // 压缩 图片
  compress(sourceImgObj, quality, outputFormat) {
    return new Promise((resolve) => {
      let mimeType = 'image/jpeg';
      if (typeof outputFormat !== 'undefined' && outputFormat === 'png') {
        mimeType = 'image/png';
      }

      const cvs = document.createElement('canvas');
      const drawidth = sourceImgObj.naturalWidth;
      const draheight = sourceImgObj.naturalHeight;
      const scale = drawidth / draheight;
      if (drawidth > draheight) {
        cvs.width = 900;
        cvs.height = parseInt(cvs.width / scale, 10);
      } else {
        cvs.height = 900;
        cvs.width = parseInt(cvs.height * scale, 10);
      }
      const ctx = cvs.getContext('2d');
      ctx.drawImage(sourceImgObj, 0, 0, drawidth, draheight, 0, 0, cvs.width, cvs.height);
      const newImageData = cvs.toDataURL(mimeType, quality / 100);
      const resultImageObj = new Image();
      resultImageObj.src = newImageData;
      resultImageObj.dataContent = mimeType;
      resolve(resultImageObj);
    });
  }
  nativeGetImg(src) {
    const self = this;
    const header = 'data:image/jpg;base64,'
    let imgSrc = header+src;
    self.setState({ defaultSrc: imgSrc });
    const newfile = self.convertBase64UrlToBlob(imgSrc, 'image/jpeg')
    // console.log(newfile)
    self.setState({
      theFile: newfile
    })
    self.props.fileReady(newfile);

  }
  // 点击头像修改
  EditImg(action, itm) {
    this.setState({
      action: action,
      nowEditFile: itm ||{}
    })
    if(this.state.callType === 'Native') {

      return;
      // jsCallNative('multimedia','photo',{
      //   quality: this.state.quality,
      //   maxSize: this.state.maxSize
      // },(data)=>{
      //   if(data.errorCode == 0) {
      //     if(data.data.imgs&&data.data.imgs.length>0&&data.data.imgs[0]!==''){
      //       self.nativeGetImg(data.data.imgs[0])
      //     }
      //   }
      // });
    } else {
      this.$$files.click();
    }
  }

  renderFileAddDom(){
    const {typeModel, description, fileModel,fileArr} = this.state;
    let AddDom = '';
    let containerClass= this.renderContainer();
    switch(typeModel){
      case 'View':
        AddDom= (<Row>
        <Col className={"add"}><Icon iconName={'plus-round '}  iconColor={"#666"} size={'180%'} /></Col>
        <Col className={"des"}>{description}</Col></Row>)
        break;
      case 'Button':
      AddDom = (<Row><Col><Buttons 
        text={(<div><Icon iconName={"arrow-up-a "} iconColor={"#666"} size={'120%'} /> {description}</div>)}
        type={'primary'}
        size={'small'}
        style={{minWidth: '4rem',borderRadius: '0.3rem'}}
        onClick={()=>{
        }} 
        plain
        /></Col></Row>)
        break;
      default:
        AddDom=  <div />
    }
    if(fileArr&&fileArr.length>0&&typeModel=='View'&&fileModel=='SINGEL') {
      return ''
    } 
    if(fileArr&&fileArr.length>0&&typeModel=='Button'&&fileModel=='SINGEL') {
      return ''
    } 
    return <div className={`addFile ${containerClass}`} onClick={()=>{this.EditImg('ADD')}}>{AddDom}</div>
  }

  renderFile(){
    const {typeModel,  fileArr, imgStyle} = this.state;
    let containerClass= this.renderContainer()
    const self = this;
    let fileDom = ''
    let statusTyle = {
      success: {'color': '#4698F9'}, //79EF44
      error: {'color': '#F55936', 'borderColor': '#F55936'}
    }
    switch(typeModel){
      case 'View':
      fileDom = fileArr&&fileArr.length > 0 ? fileArr.map((itm, idx)=>{
        return (<div key={`${idx}-vew`} className={`${containerClass} width-100 heightp-100 relative`} style={{...statusTyle[itm.status],...imgStyle}}>
        <div className="delFile" onClick={()=>{self.delFile(itm)}}><Icon iconName={"android-cancel "} iconColor={"#333"} size={'140%'} /></div>
        <div className="img-container"><img className={"img"} src={itm.defaultSrc} onClick={()=>{self.EditImg('CHANGE', itm)}} ref={(r) => { this.$$img = r; }} alt="" /> </div>
        <ProGressLoader loaderStyle={{'position': 'absolute', 'bottom': '0px', 'width':'100%'}} status={itm.status} />
        </div>)
      }) : '';
      break;
      case 'Button':
      fileDom = fileArr&&fileArr.length > 0 ? fileArr.map((itm, idx)=>{
        return (<Row key={`${idx}-btn`}  className={'width-100 line-height-3r relative'} style={statusTyle[itm.status]}>
        <Col span={20}>{itm.name}</Col>
        <Col span={4} className={'text-align-right'} onClick={()=>{self.delFile(itm)}}><Icon iconName={"android-cancel "} iconColor={"#333"} size={'140%'} /></Col>
        <ProGressLoader loaderStyle={{'position': 'absolute', 'bottom': '0px', 'width':'100%'}} status={itm.status} />
      </Row>)
      }) : '';
      break;
      default:
      fileDom = <div />
    }
    return fileArr&&fileArr.length > 0 ? fileDom : '';
  }

  delFile(itm){
    const {fileArr} = this.state;
    let newArr = fileArr.slice(0);
    let obg = arrayUtils.checkInArrIndex(newArr, 'name', itm.name)
    if(obg&&JSON.stringify(obg)!=='{}'){
      newArr = arrayUtils.delNode(newArr, 'name', itm.name)
    }
    this.setState({
      fileArr: newArr
    })
      
  }
  renderContainer(){
    const {typeModel} = this.state;
    switch(typeModel){
      case 'View':
      return 'view-container';
      case 'Button':
      return 'btn-container';
      default: 
      return '';
    }
  }
  render() {
    const {  accept, showFiles } = this.state;
    let fileAddDom = this.renderFileAddDom();
    let fileListDom =  this.renderFile();

    return (
      <Row className={`neo-fileup container`}>
        {fileAddDom}
        {showFiles ? fileListDom: ''}
        {this.props.children}
        <input className={'hideenInput'} type="file" id="selFile" accept={accept} onChange={this.change} ref={(r) => { this.$$files = r; }} />
      </Row>
    );
  }
}
FileUpWithData.propTypes = {
  defaultSrc: PropTypes.string,
  description: PropTypes.string,
  compress: PropTypes.bool,
  fileReady: PropTypes.func,
  fileType: PropTypes.string,
  accept: PropTypes.string,
  typeModel: PropTypes.string,
  fileModel: PropTypes.string,
  upUrlInfo: PropTypes.shape({}),
  showFiles: PropTypes.bool,
};

FileUpWithData.defaultProps = {
  defaultSrc: '',
  description: '',
  compress: false,
  fileReady: () =>{},
  fileType: 'bolb', // bolb base64,
  accept: 'image/*',
  typeModel: 'View',
  fileModel: 'SINGEL', //  SINGEL 、 MULTIPLE
  upUrlInfo: {},
  showFiles: true
};

export default FileUpWithData;
