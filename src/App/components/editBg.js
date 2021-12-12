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

class EditBg extends Component {
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
                            <Col span="8" className="line-height-3r">背景颜色: </Col>
                            <Col span="16"><Input
                            value={selectKey.bgColor|| ''}
                            placeholder="请输入"
                            maxLength={100}
                            innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                            onChange={(e,t,v)=>{
                                self.setKey('bgColor', v)
                            }}
                            />
                            </Col>
                            <Col span="8" className="line-height-3r">图片背景前缀: </Col>
                            <Col span="16">
                                <Input
                                value={selectKey.bgUrlPre|| '/koa_node/files/getTheImage?path=${imgGroup}'}
                                placeholder="请输入"
                                maxLength={100}
                                innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                                onChange={(e,t,v)=>{
                                    self.setKey('bgUrlPre', v)
                                }}
                                />
                            </Col>
                            <Col span="8" className="line-height-3r">图片背景: </Col>
                            <Col span="16">
                                <FileUp
                                    value={selectKey.bgUrl ||''}
                                    typeModel="View"
                                    fileModel="SINGEL"
                                    defalutURl="/koa_node/files/getTheImage?path=${imgGroup}"
                                    fileType="blob"
                                    doRequest={{
                                        url: '/koa_node/files/fileUp',
                                        method: 'POST',
                                        options: [{key: 'file'}]
                                    }}
                                    uploadSuccess={(data)=>{
                                        if (data.code === '0000'){
                                            self.setKey('bgUrl', data.data)
                                        }
                                    }}
                                />
                            </Col>
                            <Col span="8" className="line-height-3r">图片样式: </Col>
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
export default EditBg;
