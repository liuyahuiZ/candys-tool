import React , { Component }from 'react';
import { Components } from 'neo';
import Options from './options';

const {
    Row,
    Col,
    Icon,
    Input,
    Buttons,
    Selects, Loader, FileUp
  } = Components;

class EditVideo extends Component {
    constructor(props) {
      super(props);
      this.state = {
          datas: this.props.datas||{},
          selectKey: this.props.datas || {},
      };
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            datas: nextProps.datas,
            selectKey: nextProps.datas || {},
        })
    }

    setKey(key, value) {
        const { selectKey } = this.state;
        let newSelectKey = selectKey
        newSelectKey[key] = value
        this.setState({
            selectKey: newSelectKey
        })
    }
    
    handelChange(){
        const { selectKey } = this.state;
        
        this.props.handelChange(selectKey);
        Loader.show()
        setTimeout(()=>{
            Loader.hide()
        }, 500)
    }

    render() {
        const self = this;
        const { selectKey } = this.state;
        console.log('selectKey ====== ', selectKey);
        return(
          <section>
              <Row className="bg-show padding-all font-size-9">
                    <Col className="margin-top-3">
                        <Row>
                            <Col span={8} className="line-height-3r">video类型 : </Col>
                            <Col span={16} className="padding-top-2">
                                <Selects value={selectKey.type||''} onChange={(e,t,v)=>{
                                    self.setKey('type', v.value);
                                    // self.renderOptions(v.value, selectKey)
                                    }} options={[{text: '请选择', value: ''},{text: '视频', value: 'video'},{text: '音频', value: 'audio'}]} />
                            </Col>
                            <Col span="8" className="line-height-3r">videoUrl前缀: </Col>
                            <Col span="16">
                                <Input
                                value={selectKey.videoUrlPre|| '/koa_node/files/getTheImage?path=${imgGroup}'}
                                placeholder="请输入"
                                maxLength={100}
                                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                onChange={(e,t,v)=>{
                                    self.setKey('videoUrlPre', v)
                                }}
                                />
                            </Col>
                            <Col span="8" className="line-height-3r">video: </Col>
                            <Col span="16">
                                <FileUp
                                    value={selectKey.videoUrl ||''}
                                    typeModel="Button"
                                    fileModel="SINGEL"
                                    defalutURl="/koa_node/files/getTheImage?path=${imgGroup}"
                                    fileType="blob"
                                    description={'点击上传'}
                                    accept={'*'}
                                    limitSize={30240000}
                                    doRequest={{
                                        url: '/koa_node/files/fileUp',
                                        method: 'POST',
                                        options: [{key: 'file'}]
                                    }}
                                    uploadSuccess={(data)=>{
                                        if (data.code === '0000'){
                                            self.setKey('videoUrl', data.data)
                                        }
                                    }}
                                />
                            </Col>
                            <Col span="8" className="line-height-3r">video样式: </Col>
                            <Col span="16">
                                <Options datas={eval(selectKey.contStyle)} onChange={(itm)=>{
                                    self.setKey('contStyle', itm)
                                }} />
                            </Col>
                            <Col span={8}>
                            <Buttons
                                text={'更新Dom'}
                                type={'primary'}
                                size={'small'}
                                style={{color:'#fff', borderRadius: '3rem'}}
                                onClick={()=>{
                                    self.handelChange()
                                }}
                            />
                            </Col>
                        </Row>
                    </Col>
                </Row>
          </section>
        );
    }
}
export default EditVideo;
