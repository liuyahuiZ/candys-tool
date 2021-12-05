import React from 'react';
import { Input, Selects, Textarea, Text, DatePicker, Switch,  Radio, Checkbox,  TagRadio, FileUp, InnerText, Image } from '../../Components/';

export default function genInput(item, rowIdx, callback=()=>{}, render=()=>{}) {
  switch (item.type) {
    case 'selects':
      return (
        <Selects
          {...item}
          ref={(r) => { this[`$$${item.keyName}`] = r; }}
          onChange={(e,t,v) => {
            // console.log(item, 'value', v);
            // if(item.linkDomkeyName){
            //   doChange(item, this, v.value, {[item.keyName]:v.value});
            if(callback){
              callback(v, v.value);
            }
          }}
        />
      );
    case 'textarea':
      return (
        <Textarea
          {...item}
          ref={(r) => { this[`$$${item.keyName}`] = r; }}
          onChange={(value) => {
            // console.log('value:', value);
            if(callback){
              callback(value);
            }
    
          }}
        />
      );
    case 'date':
      return (
        <DatePicker {...item}
          callback={(e)=>{
            // console.log(e)
          }}
          ref={(r) => { this[`$$${item.keyName}`] = r; }}
          onChange={(value) => {
            // console.log('value:', value);
            if(callback){
              callback(value);
            }
          }}
        />
      );
    case 'switch':
      return (
        <Switch
          ref={(r) => { this[`$$${item.keyName}`] = r; }}
          {...item}
          onchange={(value)=>{
            // console.log('value:', item, value);
            if(callback){
              callback(value);
            }
          }}
        />
      );
    case 'Text':
      return (
        <Text ref={(r) => { this[`$$${item.keyName}`] = r; }} {...item} />
      );
    case 'InnerText':
      return (
        <InnerText ref={(r) => { this[`$$${item.keyName}`] = r; }} {...item} />
      );
    case 'Radio':
      return (
        <Radio
          ref={(r) => { this[`$$${item.keyName}`] = r; }}
          {...item}
          onChange={(value) => {
            if(callback){
              callback(value);
            }
          }}
        />
      );
    case 'Checkbox':
      return (
        <Checkbox
          ref={(r) => { this[`$$${item.keyName}`] = r; }}
          {...item}
          onChange={(value) => {
            if(callback){
              callback(value);
            }
          }}
        />
      );
    case 'TagRadio':
      return (
        <TagRadio
          ref={(r) => { this[`$$${item.keyName}`] = r; }}
          {...item}
          onChange={(value) => {
            if(callback){
              callback(value);
            }
          }}
        />
      );
    case 'FileUp': 
      return (
        <FileUp ref={(r) => { this[`$$${item.keyName}`] = r; }}
         fileReady={(file) => {
          // console.log(file);
          if(callback){
            callback(value);
          }
         }}
          {...item}
         />
      )
    
    case 'Input':
      return (
        <Input
          ref={(r) => { this[`$$${item.keyName}`] = r; }}
          hasBorder
          {...item}
          onChange={(e, self, value) => {
            if(callback){
              callback(value);
            }
          }}
        />
      );
    case 'Image': 
      return (
        <Image ref={(r) => { this[`$$${item.keyName}`] = r; }} {...item} />
      )
    default:
      if (item.type === 'number') {
        item.maxLengthShow = false;
      }
      return (
        <Input
          hasBorder
          ref={(r) => { this[`$$${item.keyName}`] = r; }}
          {...item}
          onChange={(e, self, value) => {
            // console.log(item, value);
            if(callback){
              callback(value);
            }
          }}
        />
      );
  }
}
