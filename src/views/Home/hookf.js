import React, { useState, useRef } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 获取DOM元素span
  const spanEl = useRef(null);
  const getSpanRef = () => {
    console.log(2, spanEl.current)
  };
  // 获取react类组件实例
  const sunEl = useRef(null);
  const getRefBySun = () => {
    console.log(1, sunEl.current)
  };
  // 全局变量isClick，默认值false赋予isClick.current，相当于react类组件的this.isClick = false
  const isClick = useRef(false);
  const addCount = () => {
    if (!isClick.current) {
      setCount(count + 1)
      isClick.current = true
    }
  };
  return (
    <>
      <button onClick={addCount}>addCount</button>
      <Sun ref={sunEl} count={count} />
      <span ref={spanEl}>我是span</span>
      <button onClick={getSpanRef}>获取DOM元素Span</button>
      <button onClick={getRefBySun}>获取Sun组件</button>
    </>
  );
}
//Sun子组件
class Sun extends React.Component {
  render () {
    const { count } = this.props
    return (
      <div>{ count }</div>
    )
  }
}
export default Example;