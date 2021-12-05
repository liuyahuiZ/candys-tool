import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { hashHistory } from 'react-router';
const { Row, Col, Input, Buttons } = Components;
const { storage, sessions } = utils;
class NoAuthor extends Component {
    constructor(props) {
      super(props);
      this.state = {
          confirmDirty: false,
          Token:  sessions.getStorage('token')
      };
    }

    handleClick(link, itm) {
        if(link) {
            hashHistory.push({
                pathname: link,
                query: itm || ''
            });
        }
    }

    render() {
        const self = this;
        const { Token } = this.state;
        return(
          <section className="bg-f5f5f5  ">
            <Row className="padding-all-1r">
                <Col className="">
                    <h3>Candys-tools</h3>
                </Col>
            </Row>
            <Row className="padding-all-1r" jusity={"flex-start"}>
                <Col span={12}>
                    <Row>
                    <Col span={24} className="padding-all-1r bg-show" >Token 已过期</Col>
                    <Col span={20} className="padding-all-1r bg-show">
                    <Input
                        value={Token|| ''}
                        placeholder="更新Token"
                        maxLength={100}
                        innerStyle={{'lineHeight':'3rem', 'height': '3rem'}}
                        onChange={(e,t,v)=>{
                            self.setState({
                                'Token': v
                            })
                        }}
                        />
                    </Col>
                    <Col span={4} className="padding-all-1r bg-show">
                    <Buttons
                        text={'更新'}
                        type={'primary'}
                        size={'small'}
                        style={{color:'#fff', borderRadius: '3rem'}}
                        onClick={()=>{
                            // storage.setStorage('Token', Token)
                            self.handleClick('/Projects')
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
export default NoAuthor;
