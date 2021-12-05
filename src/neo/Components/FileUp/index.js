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
import Modal from '../Modal';
class FileUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultSrc: this.props.defaultSrc,
      theFile: '',
      fileArr: [],
      nowEditFile: {},
      description: this.props.description||'点击上传',
      compress: this.props.compress,
      callType: this.props.callType || 'H5', //H5 Native
      quality: this.props.quality || 60,
      maxSize: this.props.maxSize || 20,
      limitSize: this.props.limitSize || 1024000,
      accept: this.props.accept || 'image/*',
      typeModel: this.props.typeModel || 'View', //View Button
      fileType: this.props.fileType || 'blob',
      fileModel: this.props.fileModel || 'SINGEL',//  SINGEL 、 MULTIPLE
      upUrlInfo: this.props.doRequest || {},
      showFiles: this.props.showFiles || true,
      value: this.props.value,
      resultModel: 'Link',
      fileArrLinkArr: [],
      action: 'ADD', // ADD CHANGE DEL
      defStatus: 'default', //
    };
    this.change = this.change.bind(this);
    this.EditImg = this.EditImg.bind(this);
    this.getFile = this.getFile.bind(this);
    this.getValue = this.getValue.bind(this);
    this.uploadSuccessData = this.uploadSuccessData.bind(this);
  }
  componentDidMount() {
    if(this.props.value){
      this.rederDefaultImg(this.props.value, this.props.defalutURl)
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      typeModel: nextProps.typeModel,
      accept: nextProps.accept,
      compress: nextProps.compress,
      quality: nextProps.quality,
      fileType: nextProps.fileType,
      fileModel: nextProps.fileModel,
      description: nextProps.description,
      upUrlInfo: nextProps.doRequest,
      showFiles: nextProps.showFiles,
      value: nextProps.value,
    })
    if(nextProps.defaultSrc){
      this.setState({
        defaultSrc: nextProps.defaultSrc
      })
    }
    if(nextProps.value){
      this.rederDefaultImg(nextProps.value, nextProps.defalutURl)
    }
  }
  rederDefaultImg(value, imageURl){
    let rootUrl = imageURl
    const { fileArr, fileModel} = this.state;
    let newArr = fileArr
    if(imageURl&&imageURl.indexOf('${')>=0&&value){
      // let splitArr = imageURl.split(/\${.*\}/g)
      rootUrl = imageURl.replace(/\${.*\}/g, value)
    } else{
      rootUrl = value
    }
    if(fileModel=='SINGEL'){
      newArr[0] = { defaultSrc:  rootUrl };
      this.setState({
        fileArr: newArr
      })
    }
  }
  change() {
    const file = this.$$files.files[0];
    const self = this;
    const { limitSize } = this.state;
    if (file) {
      // console.log(file)
      if(file.size >= Number(limitSize)) { 
        Toaster.toaster({ type: 'warning', content: `请上传小于${parseFloat(limitSize/1000).toFixed(2)}kb的文件`,time: 3000 },true)
        return false; }

      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = function (event) {
        self.setState({ defaultSrc: event.target.result });
      };
      const type = file.type.split('/');
      setTimeout(()=>{
        self.rendFile(type, file);
      },1000)
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
    const { fileModel, fileArrLinkArr, value, defStatus } = this.state;
    if(defStatus=='default'&&value) {
      return value
    }
    if(fileModel=='SINGEL'){
      return fileArrLinkArr[0]
    }
    return fileArrLinkArr;
  }

  setReq(condition, parmes){
    if(!parmes) return;
    let data = new FormData();
    for(let i=0;i<condition.length;i++){
      data.append(condition[i].key, parmes.file);
    }
    return data
  }

  uploadSuccessData(data) {
    if(this.props.uploadSuccess) {
      this.props.uploadSuccess(data);
    }
  }
  codeTip(code, dataArr){
    let check = arrayUtils.checkInArrIndex(dataArr, 'text', code)
    if(check.status){
        let obg = dataArr[check.index]
        Modal.alert({ title: obg.title,
        content: obg.value,
        style: '',
        type: obg.type||'small',
        btnConStyle: 'right',
        btn: {
          text: '确认',
          type: 'primary',
          style: { 'height': '2rem', 'minWidth': '100px'}
        }
      },
      (id, callback) => { 
          callback(id);
      },
      (id, callback) => { callback(id); });
    }
  }
  upfileData(parmes, callback){
    const { upUrlInfo, fileArrLinkArr, fileModel } = this.state;
    const self = this;
    // console.log('upUrlInfo', upUrlInfo)
    if(upUrlInfo&&upUrlInfo.url) {
      fileUP(upUrlInfo.url, {
        method: upUrlInfo.method,
        data: upUrlInfo.options?self.setReq(upUrlInfo.options, parmes):{},
      }, upUrlInfo.header||{}, upUrlInfo).then((res) => {
        // console.log('res', res);
        self.uploadSuccessData(res);
        let newArr = ''

        if( res.code=='99995'|| res.code === '9992' ){
          Toaster.toaster({ type: 'error', content: res.data.msg,time: 3000 },true)
          setTimeout(()=>{
              location.hash="/LoginPage"
          },1000)
        }
        if(upUrlInfo&&upUrlInfo.codeTip){
          self.codeTip(res.code, upUrlInfo.codeTip)
        }

        if (res.code === config.SUCCESS) {
          if(fileModel=='SINGEL'){
            newArr=[res.data]
          }else{
            newArr = JSON.parse(JSON.stringify(fileArrLinkArr))
            newArr.push(res.data)
          }
          self.setState({
            defStatus: 'EditStatus',
            fileArrLinkArr: newArr
          })
          callback('success')
          // Toaster.toaster({ type: 'error', content: res.msg, time: 3000 });
        } else {
          Toaster.toaster({ type: 'error', content: res.msg||'系统错误',time: 3000 },true)
          callback('error')
        }
      }).catch((err)=>{
        // console.log('err', err)
        Toaster.toaster({ type: 'error', content: err.msg||'系统错误',time: 3000 },true)
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
      self.upfileData({file: file}, (code)=>{
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
        <Col className={"add"}><Icon iconName={'plus-round '}  iconColor={"#666"} size={'220%'} /></Col>
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
    return <div className={`addFile ${containerClass}`} onClick={()=>{this.EditImg('ADD')}}>{AddDom}</div>
  }

  renderFile(){
    const {typeModel, fileArr} = this.state;
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
        return (<div key={`${idx}-vew`} className={`${containerClass} width-100 heightp-100 relative`} style={statusTyle[itm.status]}>
        <div className="delFile" onClick={()=>{self.delFile(itm)}}><Icon iconName={"android-cancel "} iconColor={"#333"} size={'140%'} /></div>
        <div className="img-container"><img className={"img"} src={itm.defaultSrc} onClick={()=>{self.EditImg('CHANGE', itm)}} ref={(r) => { this.$$img = r; }} alt="" /> </div>
        <ProGressLoader loaderStyle={{'position': 'absolute', 'bottom': '0px', 'width':'100%', 'zIndex':'2'}} status={itm.status} />
        </div>)
      }) : '';
      break;
      case 'Button':
      fileDom = fileArr&&fileArr.length > 0 ? fileArr.map((itm, idx)=>{
        return (<Row key={`${idx}-btn`}  className={'width-100 line-height-3r relative'} style={statusTyle[itm.status]}>
        <Col span={20}>
        <span className="transForm-roate-45 display-inline-block"><Icon iconName={'android-attach '} iconColor={"#333"} size={'140%'} /></span>{itm.name}</Col>
        <Col span={4} className={'text-align-right'} onClick={()=>{self.delFile(itm)}}><Icon iconName={"android-cancel "} iconColor={"#333"} size={'140%'} /></Col>
        <ProGressLoader loaderStyle={{'position': 'absolute', 'bottom': '0px', 'width':'100%', 'zIndex':'2'}} status={itm.status} />
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
    if(this.props.delFile) {
      this.props.delFile(itm);
    }
    this.$$files.value = null;
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
FileUp.propTypes = {
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
  uploadSuccess: PropTypes.func,
};

FileUp.defaultProps = {
  defaultSrc: '',
  description: '',
  compress: false,
  fileReady: () =>{},
  fileType: 'bolb', // bolb base64,
  accept: 'image/*',
  typeModel: 'View',
  fileModel: 'SINGEL', //  SINGEL 、 MULTIPLE
  upUrlInfo: {},
  showFiles: true,
  uploadSuccess: () => {}
};

export default FileUp;
