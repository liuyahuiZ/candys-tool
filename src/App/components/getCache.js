import React , { Component }from 'react';
import { Components, utils } from 'neo';

const {
    Selects
  } = Components;
const { sessions, storage } = utils;
class GetCache extends Component {
    constructor(props) {
      super(props);
      this.state = {
          datas: sessions.getStorage('caches')||{},
          value: this.props.defalut||{},
          cacheKey: {}
      };
    }

    componentWillReceiveProps(next){
        this.setState({
            value: next.defalut||{},
        })
    }

    render() {
        const self = this;
        const { datas, value } = this.state;
        const keys = Object.keys(datas);
        const values = Object.values(datas);
        let newOptions= [{text: '请选择', value: ''}];
        for(let i=0;i<keys.length;i++){
            newOptions.push({text: `${keys[i]} : ${values[i]}`, value: values[i], keyName: keys[i]})
        }
        return(
          <section>
              <Selects value={value.value||''} onChange={(e,t,v)=>{
                    
                    self.setState({
                        selectKey: v.value
                    })
                    self.props.onChange(v)
                }} options={newOptions} /> 
          </section>
        );
    }
}
export default GetCache;
