import React , { Component }from 'react';
import { Components } from 'neo';
import { importProjectConfig, importPageConfig } from '../../api/index';
const {
    Row, Col, Icon, Modal, Input, Selects , Textarea, Toaster, Loader, Checkbox, AnTransition , Radio , ExModal , Buttons ,FileUpWithData
  } = Components;
  
class Code extends Component {
    constructor(props) {
      super(props);
      this.state = {
        MDdisplay: '',
        MDaction: '',
        importType: 0,
        pageInfo: this.props.pageInfo,
        exportTypes: [
            {text: '页面和配置', value: '0',checked:true},
            {text: '配置', value: '1'},
        ],
        importStatus: [
            {text: '未发布', value: '0'},
            {text: '已发布', value: '1'},
        ],
        importParams:{
            status:'',
            vision:'',
            importPage:'',
            configJson:'',
        },
        fileLink: ''
      }
      this.showModal = this.showModal.bind(this)
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            pageInfo: nextProps.pageInfo
        })
    }
    setValue(key,value){
        let { importParams } = this.state;
        let newSelectKey = importParams
        newSelectKey[key] = value
        // console.log(newSelectKey)
        this.setState({
            importParams: newSelectKey
        })
    }
    showModal(){
        this.setState({
            MDdisplay: 'show',
            MDaction: 'enter',
            selectKey:{}   
          })
    }

    hideModal(){
        this.setState({
            MDdisplay: 'hide',
            MDaction: 'leave',
            importType:'0'
        })
    }

    handleUpdate(){
        let { importParams ,pageInfo, fileLink, importType} = this.state;
        if(!fileLink){
            return Toaster.toaster({ type: 'error',  position: 'top', content: '请上传配置文件' }, true)
        }

        if(importType=='1'){
            // if(!importParams.importPage){
            //     return Toaster.toaster({ type: 'error',  position: 'top', content: '请选择要导入的页面' }, true)
            // }
            if(!importParams.vision){
                return Toaster.toaster({ type: 'error',  position: 'top', content: '请输入配置版本号' }, true)
            }
            if(!importParams.status){
                return Toaster.toaster({ type: 'error',  position: 'top', content: '请选择状态' }, true)
            }
            // if(!importParams.configJson){
            //     return Toaster.toaster({ type: 'error',  position: 'top', content: '请输入配置JSON' }, true)
            // }
            importPageConfig({
                "fileLink":fileLink,
                "pageInfo": pageInfo,
            }).then((res)=>{
                if(res.code=='0000'){
                    Toaster.toaster({ type: 'normal',  position: 'top', content: '导入成功' }, true)
                    this.hideModal()
                } else{
                    Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
                }
            }).catch((err)=>{
    
            })
        } else{
            importProjectConfig({
                "fileLink":fileLink,
                "pageInfo": pageInfo,
            }).then((res)=>{
                if(res.code=='0000'){
                    Toaster.toaster({ type: 'normal',  position: 'top', content: '导入成功' }, true)
                    this.hideModal()
                } else{
                    Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
                }
            }).catch((err)=>{
    
            })
        }
    
    }

    render(){
        const { importType, exportTypes, importStatus, importParams, pageInfo } = this.state;
        const self = this;
        console.log('pageInfo', pageInfo);
        return (
            <ExModal disabledLayout='0'  display={this.state.MDdisplay} action={this.state.MDaction}  options={
                {content:(<div>
                <Row className="padding-left-1r line-height-3r padding-right-1r border-bottom border-color-f5f5f5">
                    <Col span={20} className="line-height-3r">上传配置</Col>
                    <Col span={4} className="text-align-right cursor-pointer" onClick={()=>{self.hideModal()}}>
                    <Icon iconName={'android-cancel '} size={'160%'} iconColor={'#666'}  /></Col>
                </Row>
                <Row justify={'flex-end'} className="padding-all-1r">
                 <Col className="margin-bottom-1r margin-top-3r">
                    <Row >
                        <Col span={6} className="line-height-3r text-align-right padding-right-1r">导入方式:</Col>
                        <Col span={18} className="line-height-3r">
                            <Radio onChange={(e,t,v)=>{
                                this.setState({importType : t.iteValue})
                            }} options={exportTypes} />
                        </Col>
                    </Row>
                </Col>
                <Col className="margin-bottom-1r">
                    <Row >
                        <Col span={6} className="line-height-3r text-align-right padding-right-1r">上传页面和配置: </Col>
                        <Col span={18} className="margin-top-1">
						<FileUpWithData accept="*" fileType="blob" fileModel="SINGEL" description={'选择配置文件'}  typeModel={'Button'}  doRequest={
							{
							 url: '/candy_api/files/fileUp', 
							 method: 'POST', 
							 options: [{ key: 'projectId', value: pageInfo._id }, {key: 'file', value: ''}]}} params={{ }} fileReady={(res)=>{
                                //  this.uploadCallBack(res)
                                 console.log('res', res);
                                self.setState({
                                    fileLink: res
                                })
                             }} />
                        </Col>
                    </Row>
                </Col>
                <Col style={{display:this.state.importType==='1'?'block':'none'}} className="margin-bottom-1r">
                    <Row >
                        <Col span={6} className="line-height-3r text-align-right padding-right-1r">配置版本号:</Col>
                        <Col span={18} className="line-height-3r">
                            <Input
                                value={importParams.vision}
                                placeholder=""
                                maxLength={10}
                                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                onChange={(e,t,v)=>{
                                    self.setValue('vision',v)
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col style={{display:this.state.importType==='1'?'block':'none'}} className="margin-bottom-1r">
                    <Row >
                        <Col span={6} className="line-height-3r text-align-right padding-right-1r">状态:</Col>
                        <Col span={18} className="line-height-3r">
                        <Radio onChange={(e,t,v)=>{
                                self.setValue('status',t.iteValue)
                            }} options={importStatus} />
                        </Col>
                    </Row>
                </Col>
                <Col style={{display:this.state.importType==='1'?'block':'none'}} className="margin-bottom-1r">
                    <Row >
                        <Col span={6} className="line-height-3r text-align-right padding-right-1r">配置json:</Col>
                        <Col span={18} className="line-height-3r">
                            <Textarea
                                value={importParams.configJson}
                                placeholder="请输入页面配置"
                                maxLength={5000}
                                maxLengthShow={false}
                                innerStyle={{'lineHeight':'2rem', 'height': '3rem'}}
                                onChange={(value)=>{
                                    self.setValue('configJson',value)
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={24} className="padding-top-1r heighth-45 text-align-right">
                <Buttons
                    text={'取消'}
                    type={'primary'}
                    size={'small'}
                    style={{borderRadius: '0.3rem'}}
                    onClick={()=>{
                        self.hideModal()
                    }}
                    iconName={'paper-airplane'}
                    hasIcon
                    plain
                />
                <Buttons
                    text={'确认'}
                    type={'primary'}
                    size={'small'}
                    style={{color: '#fff', borderRadius: '0.3rem',marginLeft:'1rem' }}
                    onClick={() => {
                        self.handleUpdate()
                    }}
                    iconName={'paper-airplane'}
                    hasIcon
                />
                </Col>
                </Row></div>),
                type: 'top',
                containerStyle: {left:'25vw' ,top:'5vh',width:'50vw',height: '80vh'}
                }}></ExModal>
        )
    }
}
export default Code;