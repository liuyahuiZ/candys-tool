import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Row from '../Grid/Row';
import Col from '../Grid/Col';
import Input from '../Input';
import Icon from '../Icon';

class MenuSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      oldList: this.props.data,
      options: [],
      keyWords: '',
      showOptions: false,
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({
        oldList: nextProps.data
    })
  }

  search(keyWord, key, dataArr){
    let newList = []
    let showOptions = true
    // console.log(keyWord, key, (/^[\u4e00-\u9fa5]+$/).test(keyWord))
    let isChina = false;
    if((/^[\u4e00-\u9fa5]+$/).test(keyWord)){
        isChina = true
    }
    for(let i=0;i<dataArr.length;i++){
        if(isChina){
            if(dataArr[i][key]&&(dataArr[i][key]).indexOf(keyWord)>=0&&dataArr[i].status!==0&&dataArr[i].url){
                newList.push(dataArr[i]);
            }
        }else if(dataArr[i][key]&&(dataArr[i][key].toUpperCase()).indexOf(keyWord.toUpperCase())>=0&&dataArr[i].status!==0&&dataArr[i].url){
            newList.push(dataArr[i]);
        }

        if(dataArr[i].children){
            let node = this.search(keyWord, key, dataArr[i].children)
            newList = [...newList, ...node]
        }
    }

    if(keyWord==''){
        newList = [];
        showOptions = false;
    }
    this.setState({
        options: newList,
        showOptions: showOptions
    })

    return newList;
    
  }
  handSelect(res){
    this.setState({
        showOptions: false
    })
    this.props.handSelect(res)
  }

  render() {
    const { keyWords, options, oldList, showOptions } = this.state;
    const { placeholder } = this.props;
    const self = this;
    const optionDom = options&&options.length>0 ? options.map((itm, id) => {
        const key = `${itm.value}-${id}`;
        let node = (<Col key={key} className="line-height-2r cursor-pointer"
        onClick={()=>{ self.handSelect(itm); }}>{itm.title}</Col>);
        return node;
    }): keyWords!== <Col /> ? <Col className="text-align-center line-height-3r">暂无数据</Col> : <Col />;
    return (<Row className="bg-show relative">
            <Col span={3} style={{lineHeight: '2.5rem', paddingLeft: '10px'}}><Icon iconName={'ios-search-strong '} size={'130%'} /></Col>
            <Col span={17}><Input
            value={keyWords}
            placeholder={placeholder || "请输入"}
            maxLength={100}
            innerStyle={{paddingLeft: '10px','color': '#666','lineHeight':'2.5rem', 'height': '2.5rem', 'textAlign': 'left'}}
            onChange={(e,t,v)=>{
                self.setState({keyWords: v, showOptions: true});
                self.search(v, 'title', oldList)
            }}
            onFocus={()=>{ self.setState({showOptions: true}) }}
            onBlur={()=>{ setTimeout(()=>{ self.setState({showOptions: false}) }, 500) }}
        /></Col>
        <Col span={4} className="cursor-pointer text-align-center" style={{lineHeight: '2.5rem'}} onClick={()=>{
            self.setState({ keyWords: '', options: [], showOptions: false })
        }}>
        {keyWords!=='' ?<Icon iconName={'android-cancel'} size={'130%'} /> : ''} </Col>
        <Col className={`${showOptions ? 'heighr-12' : 'heighr-0'} absolute bg-show padding-left-1r padding-right-1r zindex-100 scroller overflow-auto box-shadow-menu border-top border-color-f5f5f5`} style={{'top': '100%'}}>
        {showOptions? <Row className="options ">{optionDom}</Row> : ''}
        </Col>
    </Row>);
  }
}

MenuSearch.propTypes = {
  style:  PropTypes.shape({}),
  placeholder: PropTypes.string,
};

MenuSearch.defaultProps = {
  style: {},
  placeholder: '请输入'
};


export default MenuSearch;
