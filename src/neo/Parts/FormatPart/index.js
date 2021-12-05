import React from 'react';
import filter from '../../utils/filter';
import DysmText from '../DetailPart/dysmText';
import DirectText from './directText';

export default function formatPart(obg, value, option, replaceStr, pageData) {
    switch (obg.formatModel) {
        case 'array':
          return (
            filter(option, value)
          )
        case 'link':
          return <DysmText option={{urlInfo: obg.FormatRequest, value: value, pageData: pageData }} />
        case 'date':
          return filter(obg.formatModel, value, option)
        case 'absolute':
          return filter('absolute', value, option)
        case 'uppercase':
          return filter('uppercase', value, option)
        case 'lowercase':
          return filter('lowercase', value, option)
        case 'fixed':
          return filter('fixed', value, option)
        case 'replace':
          return filter('replace', value, option, replaceStr||'')
        case 'direct':
          return <DirectText option={{urlInfo: obg.FormatRequest, value: value }} />
        default:
         return value
    }
}
