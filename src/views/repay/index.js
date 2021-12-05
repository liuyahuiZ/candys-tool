
import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { projectAll } from 'api/index';
const { sessions, storage } = utils
const { Row, Col, Loader, Toaster, Buttons, Input, Tree } = Components;

class Repay extends Component {
    constructor(props) {
      super(props);
      this.state = {
          pageData: this.props.pageData,
          pageParmes: this.props.pageParmes,
          pageList: this.props.pageList,
          defaultAction: this.props.defaultAction,
      };
      this.getValue = this.getValue.bind(this);
    }

    componentDidMount(){
        this.getProjectList();
    }

    getProjectList(){
       const self = this;
       const { pageParmes } = this.state;
       console.log('value', pageParmes)
       Loader.show()
       projectAll({}).then((res)=>{
           Loader.hide()
           if(res.code=="0000") {
               let menuData = res.data
               if(pageParmes&&pageParmes.length>0){
                   try{ menuData = self.resetMenuData(res.data, pageParmes) }
                    catch(e){ console.log(e); }
                }
               self.setState({
                   loadStatus: 'SUCCESS',
                   menuData: menuData,
               })
           } else {
               self.setState({
                   loadStatus: 'ERROR',
                   menuData: [],
               })
               Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg })
           }
       }).catch(()=>{
           self.setState({
               loadStatus: 'ERROR',
               menuData: [],
           })
           Loader.hide()
       })
   }
   checkData(item, checkData){
        let status = false;
        let pages = []
        for(let i=0;i<checkData.length;i++){
            if(checkData[i].projectId==item){
                status = true;
                pages = checkData[i].pageId.split(',')
                break;
            }
        }
        return {status: status, pages: pages};
   }

   checkChildren(pageArr, menu){
    for(let i=0;i<menu.length;i++){
        if(pageArr.includes(menu[i]._id)){
            menu[i].checkStatus= 'checked'
        }
    }
   }

   resetMenuData(menuData, checkData){
       for(let i=0;i<menuData.length;i++){
            let result = this.checkData(menuData[i]._id, checkData)
            if(result.status){
                menuData[i].checkStatus = 'ambivalent'
                if(menuData[i].children&&menuData[i].children.length>0){
                    if(result.pages.length == menuData[i].children.length){
                        menuData[i].checkStatus = 'checked';
                    }
                    this.checkChildren(result.pages, menuData[i].children)
                } else {
                    menuData[i].checkStatus = 'checked';
                }
            }
       }
       return menuData

   }

    getValue(){
        let treeDataArr = this.$$tree.getValue();
        let result = this.resetTreeData(treeDataArr);
        console.log('treeData', treeDataArr, result);
        return result;
    }

    resetTreeData(treeData) {
        let newTree = [];
        for (let i = 0; i < treeData.length; i++) {
          newTree[i] = {
            projectId: treeData[i].pNode.tkey.replace("-t", ""),
            pageId: this.getChildId(treeData[i].child)
          };
        }
        return newTree;
    }
    getChildId(arr) {
        let result = "";
        for (let i = 0; i < arr.length; i++) {
          result =
            result +
            arr[i].tkey.replace("-t", "") +
            (i + 1 == arr.length ? "" : ",");
        }
        return result;
    }

    render() {
        const { menuData  }= this.state
        return(
          <section className="bg-show  padding-all-1r">
            <Row>
                <Col span={12}><Tree
                    Date={menuData}
                    display={'show'}
                    checkable
                    onTreeCheck={(item)=>{
                        // console.log(item);
                    }}
                    transKey={{
                        'otherName': 'title',
                        'tkey': '_id',
                        'keyID': '_id',
                        preKey: "projectId"
                    }}
                    
                    ref={(r)=>{ this.$$tree = r}}
                /></Col>
                {/* <Col><Buttons text={"获取"} onClick={()=>{
                    let treeDataArr = this.$$tree.getValue();
                    let result = this.resetTreeData(treeDataArr);
                    console.log('treeData', result);
                }} /></Col> */}
            </Row>
          </section>
        );
    }
}
export default Repay;
