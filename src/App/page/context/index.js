
import React from 'react'
const ThemeContext = React.createContext({
    theme: 'dark',
    toggle: () => {}, //向上下文设定一个回调方法
});

const ListContext = React.createContext({
    theme: 'ListContext'
});

export {
    ThemeContext,
    ListContext
}