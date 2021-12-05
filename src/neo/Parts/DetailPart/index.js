import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style';
import * as arrayUtils from '../../utils/array';
import filter from '../../utils/filter';
import genInput from '../factory';
import formatPart from '../../Parts/FormatPart';
import * as changeAction from '../changeAction';

class DetailPart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.genInput = genInput.bind(this);
  }
  getValue(detail) {
    const { detailList } = this.props;
    this.detail = detail;
    if (detail.format && detail.format !== '') {
      // console.log('format', detail.format);
      if (detail.format === 'html') {
        return (<span style={styles.value} dangerouslySetInnerHTML={{ __html: detail.value }} />);
      }
      return (<span style={styles.value}> {filter(eval(detail.format), detail.value)} </span>);
    }
    if(detail.formatModel){
      return formatPart(detail, detail.value, detail.formatStr, detail.replaceStr, detailList )
    }
    if(detail.type){
      return this.genInput(detail)
    }
    return (<span style={styles.value}
      ref={(r) => { this[`$$${detail.key}${detail.keyId?detail.keyId:''}`] = r; }}> {detail.value} </span>);
  }

  render() {
    const { detailList,  display } = this.props;
    let contentStyle = styles.container;
    if (display === 'half') {
      contentStyle = styles.halfContainer;
    }
    const self = this;
    const comment = detailList&&detailList.length>0 ? detailList.map((detail, idx) => {
      const key = `${idx}-${detail.text}`;
      const items = detail.items || [detail];
      if (detail.isShow) {
        // const params =  detail.isShowParams.map(p => data[p]);
        // if (!detail.isShow(...params)) {
        //   return null;
        // }
      }
      const dispStyle = {};
      if (detail.isShow!==undefined) {
        if (detail.isShow==false) {
          dispStyle.display = 'none';
        }
      }

      let contStyle = {}
      if(detail.contStyle) {
        contStyle = arrayUtils.arrToObg(detail.contStyle, 'text', 'value')
        // console.log(contStyle);
      }
      let textContStyle= {}
      if(detail.textContStyle) {
        textContStyle = arrayUtils.arrToObg(detail.textContStyle, 'text', 'value')
        // console.log(contStyle);
      }
      let labelStyle = {}
      if(detail.labelStyle) {
        labelStyle = arrayUtils.arrToObg(detail.labelStyle, 'text', 'value')
        // console.log(contStyle);
      }

      if(detail.value){
        if(detail.changeConfigs&&detail.changeConfigs.length>0){
          let itemValue = detail.value;
          setTimeout(()=>{
            changeAction.loop(detail.changeConfigs, self, itemValue, {}, {});
          }, 200)
        }
      }
      return (
        <div
          key={key}
          style={Object.assign({}, contentStyle, contStyle, dispStyle)}
          ref={(dom) => {
            self[`$$wrap-${detail.key}${detail.keyId?detail.keyId:''}`] = dom;
          }}
        >
          <span
            style={Object.assign({}, styles.text, labelStyle)}
          >
            {detail.text}
          </span>
          {
            items.map((item) => {
              const value = item && self.getValue(item);
              const after = (detail.value && detail.value !== '') && item.after ? <span style={styles.value}> {item.after} </span> : '';
              const remark = (detail.value && detail.value !== '') && item.remark ? <span style={styles.remark}>{item.remark || ''}</span> : '';
              const k = `inner-${item.key}`;

              return (
                <div key={k} style={Object.assign({}, styles.inline, textContStyle)}>
                  {value}
                  {after}
                  {remark}
                </div>
              );
            })
          }
        </div>
      );
    }
  ) : '';
    return (
      <div style={arrayUtils.merge([styles.paddingContiner])}>
        {comment}
      </div>
    );
  }
}

DetailPart.propTypes = {
  detailList: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.array]),
  data: PropTypes.shape({}),
  display: PropTypes.string,
  style: PropTypes.shape({})
};

DetailPart.defaultProps = {
  detailList: [],
  data: {},
  display: '',
  style: {}
};

export default DetailPart;
