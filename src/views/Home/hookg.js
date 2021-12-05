// import React, { useRef, useContext } from 'react';
// //Context，createContext接收一个参数为默认值
// const ThemeContext = React.createContext('white');
// const AgeContext = React.createContext();

// function Example() {
//   return (
//     <>
//       <ThemeContext.Provider value={'blue1'}>
//         <div>
//           <ChildOfContext />
//         </div>
//       </ThemeContext.Provider>
//       <span>我是span</span>
//     </>
//   );
// }
// // 子组件
// const ChildOfContext = (props) => {
//   console.log("进入了子组件ChildOfContext")
//   return (
//     <div>
//       这里是子组件ChildOfContext
//        <GrandChildOfContext />
//     </div>
//   )
// }
// // 孙子组件
// const GrandChildOfContext = (props) => {
//   console.log("进入了孙子组件GrandChildOfContext")
//   const color = useContext(ThemeContext);
//   return (
//     <div>
//       这里是子组件GrandChildOfContext
//       颜色是：{color} 
//     </div>
//   )
// }
// export default Example;


import React, { useRef, useContext } from 'react';
//Context，createContext接收一个参数为默认值
const ThemeContext = React.createContext('white');
const AgeContext = React.createContext();

function Example() {
  return (
    <>
      <ThemeContext.Provider value={'blue'}>
        <div>
          <ChildOfContext />
        </div>
      </ThemeContext.Provider>
      <span>我是span</span>
    </>
  );
}
// 子组件进行嵌套一层Context
const ChildOfContext = (props) => {
  console.log("进入了子组件ChildOfContext")
  return (
    <div>
      这里是子组件ChildOfContext
      <AgeContext.Provider value={21}>
        <div>
          <GrandChildOfContext />
        </div>
      </AgeContext.Provider>
    </div>
  )
}
// 孙子组件
const GrandChildOfContext = (props) => {
  console.log("进入了孙子组件GrandChildOfContext")
  const color = useContext(ThemeContext);
  const age = useContext(AgeContext);
  return (
    <div>
      这里是子组件GrandChildOfContext
      颜色是：{color} 
      嵌套Context
      年龄是：{age} 
    </div>
  )
}
export default Example;