import React , { Component }from 'react';
import { PropTypes } from 'prop-types';
import { Components } from 'neo';
import EditSearch from './editSearch';

const {
    Row,
    Col,
    Icon,
    Input,
    Buttons,
    Selects, Loader, Modal, Switch, ExModal, PopContainer
  } = Components;

class EditFormItem extends Component {
    constructor(props) {
      super(props);
      this.state = {
          datas: this.props.datas|| {},
          selectKey:  this.props.datas|| {
            showSort: false,
          }
      };
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            datas: nextProps.datas||{},
            selectKey: nextProps.datas || {
                showSort: false,
            },
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

        return(
          <section>
              <Row className="bg-show">
                    <Col className="margin-top-3">
                        <Row>
                        <Col span={5}>showSort : </Col>
                        <Col span={19}>
                        <Switch value={selectKey.showSort} checkedText={'-'} unCheckText={'o'} onchange={(date)=>{
                            let obg = JSON.parse(JSON.stringify(selectKey))
                            obg.showSort = date
                            self.setState({
                                selectKey:  obg
                            })
                        }} />
                        </Col>
                        <Col span={5}>listFormat : </Col>
                        <Col span={19}>
                            <EditSearch datas={selectKey.listFormat} handelChange={(res)=>{
                                let obg = JSON.parse(JSON.stringify(selectKey))
                                obg.listFormat = res
                                self.setState({
                                    selectKey:  obg
                                })
                            }} />
                        </Col>
                    
                        <Col span={8} className="margin-top-1r">
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

EditFormItem.propTypes = {
    datas: PropTypes.oneOfType([PropTypes.array, PropTypes.number, PropTypes.shape({})]),
};
  
EditFormItem.defaultProps = {
    datas: {},
};
export default EditFormItem;
