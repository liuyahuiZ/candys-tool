import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { getProjectPages, downLoadPageConfig } from '../../api/index';
const {
    Row, Col, Icon, Modal, Input, Selects , Textarea, Toaster, Loader, Checkboxs, AnTransition , Radio , ExModal , Buttons 
  } = Components;
const {  array } = utils
class Code extends Component {
    constructor(props) {
      super(props);
      this.state = {
        MDdisplay: '',
        MDaction: '',
        importType: 0,
        pageInfo: this.props.pageInfo,
        exportTypes: [
            {text: '全部页面和配置', value: '0',checked: true},
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
        pageList: []
      }
      this.showModal = this.showModal.bind(this)
    }
    
    componentDidMount(){
        this.getProjectPage(this.state.pageInfo)
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            pageInfo: nextProps.pageInfo
        }, ()=>{
            this.getProjectPage(this.state.pageInfo)
        })
    }

    getProjectPage(obg){
        const self = this;
        getProjectPages({
            current: 0,
            obj: {
                projectId: obg._id,
            },
            size: 10
        }).then((res)=>{
            if(res.code=='0000'){
                if(res.data.length > 0) {
                    self.setState({
                        pageList: res.data,
                        oldList: res.data,
                    })
                }else{
                    self.setState({
                        pageList: [],
                        oldList: [],
                        loadingStatus: 'NODATA',
                    })
                }
                
             } else{
                 Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
             }
        }).catch(()=>{

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
            exportTypes: [
                {text: '全部页面和配置', value: '0',checked: true},
                {text: '配置', value: '1'},
            ], 
          })
    }

    hideModal(){
        this.setState({
            MDdisplay: 'hide',
            MDaction: 'leave',
            importType:'0'
        })
    }

    getOptions(arr, key, value){
        let newArr = [];
        if(!arr) return newArr;
        for(let i=0;i<arr.length;i++){
            newArr.push({
              text: arr[i][key],
              value: arr[i][value],
              checkStatus: 'unchecked',
              ...arr[i]
            })
        }
        return newArr
      }

    handleExport(){
        let { importParams ,pageInfo, fileLink, importType} = this.state;
        if(importType=='0'){
            this.props.downProject({_id: pageInfo._id, title: pageInfo.title})
            return
        }else if(importType=='1'){
            let pages = this.$$pages.getValue();
            console.log('pages', pages)
            if(!(pages&&pages.length>0)){
                return Toaster.toaster({ type: 'error',  position: 'top', content: '请选择要导入的页面' }, true)
            }
            
            downLoadPageConfig({
                "_id": pageInfo._id,
                "pages": pages,
            }).then((res)=>{
                let blob = new Blob([res], {type: 'application/octet-stream'})
                let URL = window.URL || window.webkitURL
                let objectUrl = URL.createObjectURL(blob)
                console.log(objectUrl)
                let fileName = pageInfo ? `${pageInfo.title}.json` : 'allProjects.json';
                if (fileName) {
                    var a = document.createElement('a')
                    // safari doesn't support this yet
                    if (typeof a.download === 'undefined') {
                        window.location = objectUrl
                    } else {
                        a.href = objectUrl
                        a.download = fileName
                        this.$$projectContent.append(a)
                        a.click()
                        a.remove();
                    }
                } else {
                    window.location = objectUrl
                }
            }).catch((err)=>{
    
            })
        }
    }

    render(){
        const { importType, pageList, exportTypes, importStatus, importParams, pageInfo } = this.state;
        const self = this;
        return (
            <ExModal disabledLayout='0'  display={this.state.MDdisplay} action={this.state.MDaction}  options={
                {content:(<div ref={(r)=>{ self.$$projectContent = r; }}>
                <Row className="padding-left-1r line-height-3r padding-right-1r border-bottom border-color-f5f5f5" >
                    <Col span={20} className="line-height-3r">导出配置</Col>
                    <Col span={4} className="text-align-right cursor-pointer" onClick={()=>{self.hideModal()}}>
                    <Icon iconName={'android-cancel '} size={'160%'} iconColor={'#666'}  /></Col>
                </Row>
                <Row justify={'flex-end'} className="padding-all-1r">
                 <Col className="margin-bottom-1r margin-top-3r">
                    <Row >
                        <Col span={6} className="line-height-3r text-align-right padding-right-1r">导出方式:</Col>
                        <Col span={18} className="line-height-3r">
                            <Radio onChange={(e,t,v)=>{
                                this.setState({importType : t.iteValue})
                            }} options={exportTypes} />
                        </Col>
                    </Row>
                </Col>
                <Col style={{display:this.state.importType==='1'?'block':'none'}} className="margin-bottom-1r">
                    <Row >
                        <Col span={6} className="line-height-3r text-align-right padding-right-1r">选择页面:</Col>
                        <Col span={18} className="line-height-3r">
                            <Checkboxs labelFiled={'text'} valueFiled={'value'} options={self.getOptions(pageList, 'title', '_id')} onChange={(v)=>{
                                console.log('v', v)
                            }} ref={(r)=>{ this.$$pages = r; }} />
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
                        self.handleExport()
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