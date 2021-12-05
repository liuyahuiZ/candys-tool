import React , { Component }from 'react';

const Home = React.lazy(() => import('./Home/index'));
const MenuData = React.lazy(() => import('./repay/index'));

export default {
    Home: Home,
    MenuData: MenuData,
}
