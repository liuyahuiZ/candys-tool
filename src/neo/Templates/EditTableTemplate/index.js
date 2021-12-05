import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Row, Col, Toaster } from '../../Components';
import { ListPart, ButtonTools } from '../../Parts';

class EditTableTemplate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pageData: {},
      urlInfo: this.props.urlInfo,
      pageParmes: this.props.pageParmes,
      editConfig: this.props.editConfig,
      listFormat: this.props.listFormat
    };
    this.getValue =  this.getValue.bind(this)
    this.setValue = this.setValue.bind(this);
    // console.log('pageParmes', this.props.pageParmes)
  }
  componentDidMount(){
  }
  componentWillReceiveProps(nextProps){
    // console.log('pageParmes', nextProps.pageParmes)
    this.setState({
      urlInfo: nextProps.urlInfo,
      pageParmes: nextProps.pageParmes,
      listFormat: nextProps.listFormat,
      editConfig: nextProps.editConfig,
      shuldRefresh: nextProps.reRender||'noRender',
      contextParames: nextProps.contextParames||{}
    })
  }

  getValue(){
    let result = this.$$ListPart.getValue()
    let checkStatus = this.$$ListPart.checkValid();
    if(checkStatus&&checkStatus.status===true) {
      return result
    } else if(checkStatus==''){
      return false;
    }else{
      Toaster.toaster({ type: 'error', content: checkStatus.errStr, time: 3000 });
      return false;
    }
  }
  setValue(v){
    if(this.$$ListPart&&this.$$ListPart.setValue){
        return this.$$ListPart.setValue(v)
    }
    
  }

  render() {
    const { funcButton } = this.props
    const { pageData, listFormat, urlInfo, pageParmes, shuldRefresh  } = this.state;
    const self = this;
    return (
      <Row justify={"center"}>
        <Col className="minheight-30">
        {listFormat&&listFormat.length>0 ? <ListPart
          listFormat={listFormat}
          EditlistData={pageData}
          urlInfo={urlInfo}
          showSort={false}
          showIndex={false}
          pageParmes={pageParmes}
          shuldRefresh={shuldRefresh}
          ref={(r)=>{
            self.$$ListPart = r
          }}
          {...this.props}
        /> : ''}
        </Col>
        <Col > 
          <Row justify={'center'}>
          <ButtonTools options={funcButton}  pageData={pageData}
            callback={()=>{callback()}} />
          </Row>
        </Col>
      </Row>
    );
  }
}

EditTableTemplate.propTypes = {
  detailList: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.array]),
  btns: PropTypes.arrayOf(PropTypes.shape()),
  funcButton: PropTypes.arrayOf(PropTypes.shape()),
  pageParmes: PropTypes.shape(),
  searchCondition:  PropTypes.oneOfType([PropTypes.shape({}),PropTypes.array])
};

EditTableTemplate.defaultProps = {
  valid: [],
  btns: [],
  funcButton: [],
  pageParmes: {},
  searchCondition: [],
  detailList: []
};

export default EditTableTemplate;