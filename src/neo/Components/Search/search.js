import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Row from '../Grid/Row';
import Col from '../Grid/Col';
import Input from '../Input';
import Icon from '../Icon';

class Searchs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      keyWords: ''
    };
  }
  search(v) {
    this.props.onChange(v)
  }

  render() {
    const { keyWords } = this.state;
    const { placeholder } = this.props;
    const self = this;
    return (<Row className="bg-show border-radius-3r overflow-hide">
            <Col span={3} className="padding-all-1"><Icon iconName={'ios-search-strong '} size={'160%'} /></Col>
            <Col span={17}><Input
            value={keyWords}
            placeholder={placeholder || "请输入"}
            maxLength={100}
            innerStyle={{'color': '#666','lineHeight':'2.5rem', 'height': '2.5rem', 'textAlign': 'left'}}
            onChange={(e,t,v)=>{
                self.setState({keyWords: v});
                self.search(v)
            }}
        /></Col>
        <Col span={4} className="cursor-pointer text-align-center" style={{lineHeight: '2.5rem'}} onClick={()=>{
            self.setState({ keyWords: '' });
            self.search('')
        }}>{keyWords!=='' ?<Icon iconName={'android-cancel'} size={'130%'} /> : ''} </Col>
    </Row>);
  }
}

Searchs.propTypes = {
  style:  PropTypes.shape({}),
  placeholder: PropTypes.string,
};

Searchs.defaultProps = {
  style: {},
  placeholder: '请输入'
};


export default Searchs;
