import React from 'react';
import { PropTypes } from 'prop-types';
import Row from '../Grid/Row';
import Col from '../Grid/Col';
import Buttons from '../Button/buttons';
import Icon from '../Icon';

class FileUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultSrc: this.props.defaultSrc,
      theFile: '',
      description: this.props.description,
      compress: this.props.compress,
      callType: this.props.callType || 'H5', //H5 Native
      quality: this.props.quality || 60,
      maxSize: this.props.maxSize || 20,
      accept: this.props.accept || 'image/*',
      typeModel: this.props.typeModel || 'View' //View Button
    };
    this.change = this.change.bind(this);
    this.EditImg = this.EditImg.bind(this);
    this.getFile = this.getFile.bind(this);
  }
  componentWillReceiveProps(nextProps){

    this.setState({
      typeModel: nextProps.typeModel,
      accept: nextProps.accept,
      compress: nextProps.compress,
      quality: nextProps.quality
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
    const { fileType } = this.props;
    if(self.state.compress) {
      self.compress(self.$$img, 65, type[1]).then((result) => {
          const newfile = self.convertBase64UrlToBlob(result.src, result.dataContent);
          // console.log(newfile)
          self.setState({
            theFile: newfile
          })
          if(fileType==='blob'){
            self.props.fileReady(newfile);
          } else{
            self.props.fileReady(result.src)
          }
          // self.updateFile(newfile, type[1]);
      });
    } else {
      self.setState({
        theFile: file
      })
      if(fileType==='blob'){
        self.props.fileReady(file);
      } else{
        self.props.fileReady(self.state.defaultSrc)
      }
    }
  }
  getFile(){
    let file = this.state.theFile;
    return file;
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
  EditImg() {
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
    const {typeModel, description} = this.state;

    switch(typeModel){
      case 'View':
      return (<Row>
        <Col className={"add"}>+</Col>
        <Col className={"des"}>{description}</Col></Row>)
      case 'Button':
      return (<Row><Col><Buttons 
        text={(<div><Icon iconName={"arrow-down-a "} iconColor={"#333"} size={'120%'} /> description</div>)}
        type={'primary'}
        size={'small'}
        style={{minWidth: '4rem',borderRadius: '3rem'}}
        onClick={()=>{
        }} 
        plain
        /></Col></Row>)
      default:
        return <div />
    }
  }

  renderFile(){
    const {typeModel, defaultSrc, theFile} = this.state;

    switch(typeModel){
      case 'View':
      return (<div className="img-container"><img className={"img"} src={defaultSrc} onClick={this.EditImg} ref={(r) => { this.$$img = r; }} alt="" /> </div>)
      case 'Button':
      return (<Row><Col>{theFile.name}</Col></Row>)
      default:
        return <div />
    }
  }

  render() {
    const { defaultSrc, theFile, description, accept, typeModel } = this.state;
    let hasdesStyle = description&&description!==''? 'hasdes':'';
    let fileAddDom = this.renderFileAddDom();
    let fileListDom = ''
    if(defaultSrc&&defaultSrc!==''&&typeModel=='View') {
      fileAddDom='';
    }
    if(theFile&&theFile!=='' ){
      fileListDom = this.renderFile();
    }
    
    return (
      <div className={"neo-fileup container"}>

        {theFile&&theFile!=='' ?  <div className="delFile"><Icon iconName={"android-cancel "} iconColor={"#333"} size={'120%'} /></div> : ''}
        <div className={`addFile ${hasdesStyle}`} onClick={this.EditImg}>
          {fileAddDom}
        </div>
        {fileListDom}
        {this.props.children}
        <input className={'hideenInput'} type="file" id="selFile" accept={accept} onChange={this.change} ref={(r) => { this.$$files = r; }} />
      </div>
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
};

FileUp.defaultProps = {
  defaultSrc: '',
  description: '',
  compress: false,
  fileReady: () =>{},
  fileType: 'base64', // bolb base64,
  accept: 'image/*',
  typeModel: 'View'
};

export default FileUp;
