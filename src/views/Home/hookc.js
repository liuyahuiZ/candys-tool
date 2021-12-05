import React, { useState, useCallback } from 'react';
function Example() {
  const [count, setCount] = useState(0);
  const [list, setList] = useState([]);

  const handleChange = useCallback(() => {
    console.log(`selected`);
  },[])// 或[list]
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>addCount</button>
      <button onClick={() => setList([...list, 1])}>changeList</button>
      <Child list={list} handleChange={handleChange}/>
    </div>
  );
}
const Child = React.memo((props) => {
  console.log("进入了组件child")
  return (
    <div>这里是child：{props.list.join(',')}</div>
  )
})
export default Example;