import React, { useState, useEffect } from 'react';

function Example(props) {
  const [count, setCount] = useState(0);
  const [dataSources, setDataSources] = useState([]);

  /* 
   * 情况一：useEffect无第二个参数 
   */
  //组件初始化和render后，都会执行该useEffect
  useEffect(() => {
    console.log("相当于生命周期：componentDidMount+componentDidUpdate")
    setCount(count+1)
  }, [props.data]);

  useEffect(() => {
    console.log("count+ dataSources", count, dataSources)
  }, [count, dataSources]);

  /* 
   * 情况二：useEffect有第二个参数 
   */
  //第二个参数为空数组时：组件初始化才执行
  // useEffect(() => { 
  //   console.log("相当于生命周期：componentDidMount"); 
  // }, []);
  
  //第二个参数为指定状态值时：组件初始化时和dataSources发生变化才执行
  // useEffect(() => { 
  //   console.log("相当于生命周期：componentDidMount")
  //   console.log("相当于依赖dataSources状态值的生命周期：componentDidUpdate")
  // }, [dataSources]);

  //执行函数内return一个函数：初始化时执行函数体，组件卸载unmount时执行return后的函数
  // useEffect(() => {
  //   console.log("相当于生命周期：componentDidMount")
  //   // 执行函数中直接使用return返回一个函数，这个函数会在组件unmount时执行。
  //   return () => {
  //     console.log('相当于声明周期：componentWillUnmount');  
  //   }
  // }, []);

  return (
    <div>
      <p>this is props {props.data}</p>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
export default Example;