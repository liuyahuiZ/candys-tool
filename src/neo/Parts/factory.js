import React from 'react';
import { Input, Select, Selects, Textarea, Text, DatePicker, Dynamic, Switch, Radio, Checkbox, TagRadio, FileUp, InnerText, Image, ImageArr, Editor } from '../Components/';
import { NumFormPart, SelectTablePart, ListPart, LookBack, DynamicNumFormPart } from './index';
import * as changeAction from './changeAction';
import { getFactorChange } from './wholesUtil';

export default function genInput(item, rowIdx, callback=()=>{}, render=()=>{}, wholeRules) {
  switch (item.type) {
    case 'select':
      return (
        <Select
          {...item}
          ref={(r) => { this[`$$${item.key}`] = r; }}
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
          ref={(r) => { this[`$$${item.key}`] = r; }}
          onChange={(e,t,v) => {
            // console.log(item, 'value', v);
            // if(item.linkDomKey){
            //   doChange(item, this, v.value, {[item.key]:v.value});
            // }
            if(item.changeConfigs&&item.changeConfigs.length>0){
              changeAction.loop(item.changeConfigs, this, v.value, {[item.key]:v.value}, v, callback);
            }
            if(wholeRules){
              getFactorChange(wholeRules, this)
            }
          }}
        />
      );
    case 'textarea':
      return (
        <Textarea
          {...item}
          ref={(r) => { this[`$$${item.key}`] = r; }}
          onChange={(value) => {
            // console.log('value:', value);
            if(item.changeConfigs&&item.changeConfigs.length>0){
              changeAction.loop(item.changeConfigs, this, value, {[item.key]:value}, value, callback);
            }
          }}
        />
      );
    case 'date':
      return (
        <DatePicker {...item}
          callback={(e)=>{console.log(e)}}
          ref={(r) => { this[`$$${item.key}`] = r; }}
          onChange={(value) => {
            // console.log('value:', value);
            if(item.changeConfigs&&item.changeConfigs.length>0){
              changeAction.loop(item.changeConfigs, this, value.startDate, {[item.key]:value.startDate}, value, callback);
            }
          }}
        />
      );
    case 'dynamic':
      return (
        <Dynamic
          {...item}
          ref={(r) => { this[`$$${item.key}`] = r; }}
        />
      );
    case 'switch':
      return (
        <Switch
          ref={(r) => { this[`$$${item.key}`] = r; }}
          {...item}
          onchange={(value)=>{
            // console.log('value:', item, value);
            if(item.changeConfigs&&item.changeConfigs.length>0){
              changeAction.loop(item.changeConfigs, this, value, {[item.key]:value}, value, callback);
            }
            if(wholeRules){
              getFactorChange(wholeRules, this)
            }
          }}
        />
      );
    case 'Text':
      return (
        <Text ref={(r) => { this[`$$${item.key}`] = r; }} {...item} />
      );
    case 'InnerText':
      return (
        <InnerText ref={(r) => { this[`$$${item.key}`] = r; }} {...item} />
      );
    case 'Radio':
      return (
        <Radio
          ref={(r) => { this[`$$${item.key}`] = r; }}
          {...item}
          onChange={(e, value) => {
            if(item.changeConfigs&&item.changeConfigs.length>0){
              changeAction.loop(item.changeConfigs, this, value.iteValue, {[item.key]:value}, value, callback);
            }
          }}
        />
      );
    case 'Checkbox':
      return (
        <Checkbox
          ref={(r) => { this[`$$${item.key}`] = r; }}
          {...item}
          onChange={(e, value) => {
            if(item.changeConfigs&&item.changeConfigs.length>0){
              changeAction.loop(item.changeConfigs, this, value.iteValue, {[item.key]:value}, value, callback);
            }
          }}
        />
      );
    case 'TagRadio':
      return (
        <TagRadio
          ref={(r) => { this[`$$${item.key}`] = r; }}
          {...item}
          onChange={(e,value) => {
            if(item.changeConfigs&&item.changeConfigs.length>0){
              changeAction.loop(item.changeConfigs, this, value.iteValue, {[item.key]:value}, value, callback);
            }
          }}
        />
      );
    case 'FileUp': 
      return (
        <FileUp ref={(r) => { this[`$$${item.key}`] = r; }}
         fileReady={(file) => {
          // console.log(file);
          if (item.change) {
            item.change(item, value, rowIdx);
          }
         }}
          {...item}
         />
      )
    case 'LookBack': 
    return (
      <LookBack ref={(r) => { this[`$$${item.key}`] = r; }}
        {...item}
        renderTpl={render}
        onChange={(value, callback, self) => {
          // console.log('item', item, value);
          if(item.changeConfigs&&item.changeConfigs.length>0){
            if(callback){ callback(self) }
            changeAction.loop(item.changeConfigs, this, value, {[item.key]:value}, value);
          }
        }}
       />
    )
    case 'Input':
      return (
        <Input
          ref={(r) => { this[`$$${item.key}`] = r; }}
          hasBorder
          {...item}
          onChange={(e, self, value) => {
            if (item.change) {
              item.change(item, value, rowIdx);
            }
          }}
        />
      );
    case 'Image': 
      return (
        <Image ref={(r) => { this[`$$${item.key}`] = r; }} {...item} />
      )
    case 'ImageArr': 
      return (
        <ImageArr ref={(r) => { this[`$$${item.key}`] = r; }} {...item} />
      )
    case 'Editor':
      return (
        <Editor {...item}
        ref={(r) => { this[`$$${item.key}`] = r; }} />
      );
    case 'NumFormPart': 
      return (
        <NumFormPart 
          ref={(r) => { this[`$$${item.key}`] = r; }}
          {...item}
          onChange={(value) => {
            if (item.change) {
              item.change(value);
            }
          }}
        />
      )
    case 'DynamicNumFormPart':
      return (
        <DynamicNumFormPart 
        ref={(r) => { this[`$$${item.key}`] = r; }}
        {...item}
        renderTpl={render}
        onChange={(value) => {
          if (item.change) {
            item.change(value);
          }
        }} />
      )
    case 'SelectTablePart':
     return (<SelectTablePart 
      keys={item.key}
      ref={(r) => { this[`$$${item.key}`] = r; }}
      {...item}
      onChange={(value) => {
        // console.log(item, value);
        if(item.changeConfigs&&item.changeConfigs.length>0){
          changeAction.loop(item.changeConfigs, this, value, {[item.key]:value}, value, callback);
        }
      }} />
    )
    case 'EditTablePart':
      return (<ListPart keys={item.key}
        ref={(r) => { this[`$$${item.key}`] = r; }}
        {...item}
        onChange={(value) => {
          // console.log(item, value);
          if(item.changeConfigs&&item.changeConfigs.length>0){
            changeAction.loop(item.changeConfigs, this, value, {[item.key]:value}, value, callback);
          }
        }}
      />)
    default:
      if (item.type === 'number') {
        item.maxLengthShow = false;
      }
      return (
        <Input
          hasBorder
          ref={(r) => { this[`$$${item.key}`] = r; }}
          {...item}
          onChange={(e, self, value) => {
            // console.log(item, value);
            // if(item.linkDomKey){
            //   doChange(item, this, value, {[item.key]:value});
            // }
            if(item.changeConfigs&&item.changeConfigs.length>0){
              changeAction.loop(item.changeConfigs, this, value, {[item.key]:value}, value, callback);
            }
            if(wholeRules){
              getFactorChange(wholeRules, this)
            }
          }}
        />
      );
  }
}
