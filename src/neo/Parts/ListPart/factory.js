import React from 'react';
import { Input, Select, Selects, Textarea, Text, DatePicker, Switch, Radio, Checkbox, TagRadio,FileUpWithData, FileUp, InnerText, Image } from '../../Components/';
import { NumFormPart, SelectTablePart, ListPart } from '../index';

export default function genInput(item, rowIdx, callback=()=>{}) {
  switch (item.type) {
    case 'select':
      return (
        <Select
          {...item}
          ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }}
          onChange={(e) => {
            if (item.change) {
              const doms = item.changeParams.map(key => this[`$$wrap-${key}`]);
              const inputDoms = item.changeParams.map(key => this[`$$${key}`]);
              item.change(e.target.value, ...doms, ...inputDoms);
            }
          }}
        />
      );
    case 'selects':
      return (
        <Selects
          {...item}
          ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }}
          onChange={(e,t,v) => {
            // if(item.linkDomKey){
            //   doChange(item, this, v.value, {[item.keyName]:v.value});
            // }
            item.change(item, v.value, rowIdx);
          }}
        />
      );
    case 'textarea':
      return (
        <Textarea
          {...item}
          ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }}
          onChange={(value) => {
            if(item.changeConfigs&&item.changeConfigs.length>0){
              loop(item.changeConfigs, this, value, {[item.keyName]:value}, value, callback);
            }
          }}
        />
      );
    case 'date':
      return (
        <DatePicker {...item}
          callback={(e)=>{console.log(e)}}
          ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }}
          onChange={(value) => {
            item.change(item, value, rowIdx);
          }}
          initChange={(value) => {
            item.change(item, value, rowIdx);
          }}
        />
      );

    case 'switch':
      return (
        <Switch
          ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }}
          {...item}
          onchange={(value)=>{
            item.change(item, value, rowIdx);
          }}
        />
      );
    case 'Image': 
      return (
        <Image ref={(r) => { this[`$$${item.key}-${rowIdx}`] = r; }} {...item} />
      )
    case 'Text':
      return (
        <Text ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }} {...item} />
      );
    case 'InnerText':
      return (
        <InnerText ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }} {...item} />
      );
    case 'Radio':
      return (
        <Radio
          ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }}
          {...item}
          onChange={(value) => {
            if (item.change) {
              item.change(item, value, rowIdx);
            }
          }}
        />
      );
    case 'Checkbox':
      // debugger
      return (
        <Checkbox
          ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }}
          {...item}
          onChange={(value) => {
            if (item.change) {
              item.change(item, value, rowIdx);
            }
          }}
        />
      );
    case 'TagRadio':
      return (
        <TagRadio
          ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }}
          {...item}
          onChange={(value) => {
            if (item.change) {
              item.change(item, value);
            }
          }}
        />
      );
    case 'FileUp': 
      return (
        <FileUp ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }}
         fileReady={(file) => {
          if (item.change) {
            item.change(item, value, rowIdx);
          }
         }}
          {...item}
         />
      )
      case 'FileUpWithData': 
      return (
        <FileUpWithData ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }}
         fileReady={(file) => {
          if (item.change) {
            item.change(item, file.imgUrl, rowIdx);
          }
         }}
          {...item}
         />
      )
    case 'Input':
      return (
        <Input
          ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }}
          hasBorder
          {...item}
          onChange={(e, self, value) => {
            if (item.change) {
              item.change(item, value, rowIdx);
            }
          }}
        />
      );
    case 'NumFormPart': 
      return (
        <NumFormPart 
          ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }}
          {...item}
          onChange={(value) => {
            if (item.change) {
              item.change(value);
            }
          }}
        />
      )
    case 'SelectTablePart':
     return (<SelectTablePart 
      keys={item.keyName}
      ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }}
      {...item}
      onChange={(value) => {
        
      }} />
    )
    case 'EditTablePart':
      return (<ListPart keys={item.keyName}
        ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }}
        {...item}
        onChange={(value) => {
          
        }}
      />)
    default:
      if (item.type === 'number') {
        item.maxLengthShow = false;
      }
      return (
        <Input
          hasBorder
          ref={(r) => { this[`$$${item.keyName}-${rowIdx}`] = r; }}
          {...item}
          onChange={(e, self, value) => {
            item.change(item, value, rowIdx);
          }}
        />
      );
  }
}
