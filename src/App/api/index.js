
import config from '../config/config';
import request from '../../neo/utils/request';
import comRequest from '../servise/request';
//登陆
export function login(reqbody){
    return new Promise((resolve, reject)=>{
      comRequest(config.ROOT_URL+ 'api/admin/api/v1/user/login',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

export function userLogin(reqbody){
    return new Promise((resolve, reject)=>{
      comRequest(config.ROOT_URL+ 'candy_api/users/userLogin',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}
// 项目列表
export function getProjects(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/project/project_qry',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 菜单列表
export function projectQuery(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/project/project_menu',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}
// 菜单列表
export function projectAll(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/project/project_all',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 新增项目
export function addProject(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/project/project_add',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 修改项目
export function modifyProject(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/project/project_modify',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 删除项目
export function deleteProject(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/project/project_delete',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 项目详情
export function getProjectInfo(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/project/project_get',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 项目下页面列表
export function getProjectPages(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/page/page_qry',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 新增页面
export function addProjectPages(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/page/page_add',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 修改页面
export function modifyProjectPages(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/page/page_modify',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 新增页面
export function copyProjectPages(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/page/copyPage',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}
// 删除页面
export function deleteProjectPages(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/page/page_delete',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 新增页面配置
export function pageConfigAdd(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/pageConfig/pageConfig_add',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 修改页面配置
export function pageConfigModify(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/pageConfig/pageConfig_modify',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 获取页面配置
export function pageConfigGet(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/pageConfig/pageConfig_get',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 获取页面配置
export function pageConfigQry(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/pageConfig/pageConfig_qry',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 项目导出
export function downLoadProject(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/project/downLoadProject',{ method: 'POST', data: reqbody, responseType: 'blob'})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 配置导出
export function downLoadPageConfig(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/project/downLoadPageConfig',{ method: 'POST', data: reqbody, responseType: 'blob'})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}


// 所有配置导入
export function importProjectConfig(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/project/importProject',{ method: 'POST', data: reqbody, responseType: 'blob'})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

// 页面配置导入
export function importPageConfig(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/project/importPages',{ method: 'POST', data: reqbody, responseType: 'blob'})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}

export function bannerListForCode(reqbody){
    return new Promise((resolve, reject)=>{
        request(config.ROOT_URL+ 'candy_api/banner/bannerListForCode',{ method: 'POST', data: reqbody})
        .then(data => {
            resolve(data)
        }).catch(error => {
            reject(error);
        })
    })
}