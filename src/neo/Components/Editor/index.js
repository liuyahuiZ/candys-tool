import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WE from 'wangeditor';

class Editor extends Component {
  constructor(props) {
    super(props);
    const propValue = this.props.value;
    this.state = {
      value: this.props.value,
      count: propValue.length,
      focus: false
    };
    this.getValue = this.getValue.bind(this);
    this.editor = null;
  }

  componentWillReceiveProps(nextProps) {
    const self = this;
    this.setState({
      value: nextProps.value
    },()=>{
      setTimeout(()=>{
        self.editor.txt.html(nextProps.value)
       }, 1000)
    });
  }

  componentDidMount(){
     // 两个参数也可以传入 elem 对象，class 选择器
     this.editor = new WE('#editor') 
     this.editor.create()
     const self = this;
     const {value} = this.state;
     if(value){
       setTimeout(()=>{
        self.editor.txt.html(value)
       }, 1000)
     }
  }
  
  getValue() {
    const self = this;
    let data = self.editor.txt.html();
    let text = self.editor.txt.text();
    console.log('data', data, text)
    return data;
  }


  render() {
    return (
      <div id="editor">
      </div>
    );
  }
}

Editor.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxLengthShow: PropTypes.bool,
  style: PropTypes.shape({}),
  innerStyle: PropTypes.shape({}),
  typeStyle: PropTypes.string,
  onChange: PropTypes.func
};

Editor.defaultProps = {
  value: '',
  placeholder: '',
  disabled: false,
  style: {},
  innerStyle: {},
  maxLength: 50,
  maxLengthShow: true,
  typeStyle: '',
  onChange: () => {},
};

export default Editor;
