import React, {Component} from 'react';
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import LayOut from './core/LayOut';
import Home from './page/home';

const  Projects = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/projects').default)
  },'Projects')
};

const  ProjectManage = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/projectManage').default)
  },'ProjectManage')
};

const  CardManage = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/cardManage').default)
  },'CardManage')
};

const  ProjectView = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/projectView').default)
  },'ProjectView')
};

const  NoAuthor = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/login/noAuthor').default)
  },'NoAuthor')
};

const  LoginPage = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/login/loginPage').default)
  },'LoginPage')
};

const  NullPage = (location, cb) => {
  require.ensure([], require => {
      cb(null, require('./page/nullPage').default)
  },'NullPage')
};

class MyRoutes extends Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
    <Router history={hashHistory}>
      <Route path={'/'} component={LayOut} >
        {/* <IndexRoute component={ListDoc} /> */}
        <IndexRedirect to="/LoginPage"/>
        <Route path={'Home'} component={Home} />
        <Route path={'Projects'} getComponent={Projects} />
        <Route path={'ProjectManage'} getComponent={ProjectManage} />
        <Route path={'CardManage'} getComponent={CardManage} />
        <Route path={'ProjectView'} getComponent={ProjectView} />
        <Route path={'NoAuthor'} getComponent={NoAuthor} />
        <Route path={'LoginPage'} getComponent={LoginPage} />
        <Route path={'*'} getComponent={NullPage} />
      </Route>
    </Router>
    )
  }
}
export default MyRoutes
