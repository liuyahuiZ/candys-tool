import React, { useState, useCallback, useMemo } from 'react';
function Example() {
  const [count, setCount] = useState(0);
  const [list, setList] = useState([]);

  const [a, setA] = useState(0)
  const [b, setB] = useState(0)

  const handleChange = useCallback(() => {
    console.log(`selected`);
  },[])

  //使用useMemo缓存一个计算值，计算函数的执行依赖于状态值a和b，当a和b变化时才执行计算函数
  const memoizedValue = useMemo(() => a + b, [a, b]);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>addCount</button>
      <button onClick={() => setList([...list, 1])}>changeList</button>
      <button onClick={() => { setA(a+1)}}>点我A</button>
      <button onClick={() => { setB(b+1)}}>点我B</button>
      <Child list={list} memoizedValue={memoizedValue} handleChange={handleChange} />
    </div>
  );
}
const Child = React.memo((props) => {
  console.log("进入了组件child")
  return (
    <div>这里是child：list为{props.list.join(',')}, 计算总和：{props.memoizedValue}</div>
  )
})
export default Example;