import React , { Component }from 'react';
import { Components, utils } from 'neo';
import ShowView from '../page/modals/showView';
import { ThemeContext } from 'context';

const {
    Row,
    Col,
    Icon,
    Buttons,
    Text, Input, Selects, Toaster, AnTransition
  } = Components;
const { request, config, array } = utils;

const modalList = new Set();
class EditLayoutDom extends Component {
    constructor(props) {
      super(props);
      this.state = {
        tree: this.props.tree || [],
        hoverStyle: { display:'none'},
        selectNode: {},
        reRender: 'init', // init , shuldRender noRender
        noRenderModal: '',
        parames: {}
      };
    }
    
    componentDidMount(){
        const content = this.$$layoutContent;
        content.addEventListener('click', (e) => {
            if(this.props.noEdit) return;
            if(typeof(this.props.domFocus)=='function') {
                this.props.domFocus({data: e.target.dataset, className:e.target.className});
            }
            if(e.target.className.indexOf('col')>=0&&JSON.stringify(e.target.dataset)!=='{}'){
                this.setState({
                    hoverStyle: { display:'block', width: e.target.clientWidth, height: e.target.clientHeight, left: e.target.offsetLeft, top: e.target.offsetTop, zIndex: 'auto', border: '1px solid rgb(65, 150, 252)', boxShadow:  '0px 0px 25px 0px rgb(65, 150, 252)'}
                })
            }
            if(e.target.dataset&&e.target.dataset.num) {
                this.setState({
                    selectNode:  e.target.dataset
                })
            }
            
        })
        // content.addEventListener('mouseover', (e) => {
        //     this.props.domFocus({data: e.target.dataset, className:e.target.className});
        // })
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            tree: nextProps.tree
        })
    }
    componentWillUnmount(){
        this.setState({
            tree: []
        })
    }
    getPages(actionName, idx){
        const { pageList, defaultAction } = this.props;
        const { reRender }= this.state
        let pages = {}
        const self = this;
        for(let i=0;i<pageList.length;i++){
            // 当前页面打开弹出页
            if(pageList[i].url == actionName){
              pages = pageList[i]
            }
        }        
        return (<ShowView key={`${idx}-ShowView`} isModal={true} reRender={reRender} pageList={pageList} publistatus={1} pagesInfo={pages} defaultAction={ defaultAction } parame={self.props.pageParmes}
        ref={(r)=>{self[`$$${actionName}-label`] = r}} {...defaultAction} />)
    }

    getComponent(item, idx) {
        const self = this;
        if(item&&item.childrenNode){
            if(item.childrenNode.length>0) {
                let allDom = item.childrenNode.map((itm, idx)=>{
                    return self.getComponent(itm, idx)
                })
                item.children = allDom
            } else {
                item.children = self.getComponent(item.childrenNode[0])
            }
        }
        if(item&&item.props&&item.props.childrenModal&&JSON.stringify(item.props.childrenModal)!=='{}'){
            modalList.add(item.props.childrenModal)
            return <Col key={`${idx}-col`} idx={idx} {...item} {...item.props} >{this.getPages(item.props.childrenModal, idx)}</Col>
        }
        switch (item&&item.tagName){
            case 'Row':
                return <Row key={`${idx}-row`} idx={idx} {...item} {...item.props}/>
            case 'Col':
                return <Col key={`${idx}-col`} idx={idx} {...item} {...item.props}/>
            case 'Icon':
                return <Icon key={`${idx}-icon`}  {...item} {...item.props}/>
            case 'Input':
                return <Input key={`${idx}-inp`}  {...item} {...item.props}/>
            case 'Buttons':
                return <Buttons key={`${idx}-btn`}  {...item} {...item.props}/>
            case 'Selects':
                return <Selects key={`${idx}-sele`}  {...item} {...item.props}/>
            case 'Text':
                return <Text key={`${idx}-text`}  {...item} {...item.props}/>
            default: 
                return <div {...item}/> ;
        }
    }

    renderDom(tree){
        const self = this;
        let allDom = '';
        if(tree.length > 1){
            allDom = tree.map((itm, idx)=>{
                return <AnTransition
                act={'enter'}
                delay={idx*300}
                duration={166}
                enter={'listTem-enter'}
                leave={'listTem-leave'}
              >{self.getComponent(itm, idx)}</AnTransition>
            })
        }else{
            allDom = <AnTransition
            act={'enter'}
            delay={0}
            duration={166}
            enter={'listTem-enter'}
            leave={'listTem-leave'}
          >{self.getComponent(tree[0])}</AnTransition>
        }
        return allDom
    }

    fetData(urlInfo, reqData, resolve, reject, callback){
        const self = this;
        if(!(urlInfo&&urlInfo.url)){
          this.setLoadStatus('NULLLOAD');
          return;
        }

        let newReqData = urlInfo.options&&urlInfo.options.length>0 ? array.setReqs(urlInfo.options, reqData): {}
        request(urlInfo.url, {
          method: urlInfo.method,
          data: Object.assign({}, reqData, newReqData),
        }, urlInfo.header||{}, urlInfo).then((res) => {
          if (res.code === config.SUCCESS) {      
            Toaster.toaster({ type: 'success', content: res.msg, time: 3000 }, true);   
            self.setState({
                reRender: 'shuldRender'
            })
            setTimeout(()=>{
                self.setState({
                    reRender: 'noRender'
                })
            }, 1500)
            if(resolve) resolve(res.data)
            if(callback) callback()
          } else {
            Toaster.toaster({ type: 'error', content: res.msg, time: 3000 }, true);
          }
        }).catch((err)=>{
            if(reject) reject(err)
        });
    }

    resetData(data){
        let keys =  Object.keys(data);
        let values =  Object.values(data);
        let newData = {}
        for(let i=0;i<keys.length;i++){
            if(!(values[i]&&values[i].length)){
                newData = Object.assign({}, newData, {...values[i]})
                Reflect.deleteProperty(data, keys[i]);
            }
        }
        return Object.assign({}, data , newData)
    }

    render() {
        const self = this;
        const { tree, hoverStyle, selectNode, reRender, parames } = this.state;
        let treeData = [];
        treeData = treeData.concat(tree);
        let doms = treeData.length>0 ? self.renderDom(treeData):'';
        return(
          <section className="width-100 relative">
            <ThemeContext.Provider 
            value={{
              reRender: reRender, 
              parames: parames,
              parentCall: (res, pageData, callback)=>{ 
                self.setState({
                    reRender: 'shuldRender',
                    noRenderModal: pageData.url,
                    parames: res
                })
                if(callback) callback()
                setTimeout(()=>{
                    self.setState({
                        reRender: 'noRender'
                    })
                }, 1500)
              },
              parentSubmitCall:(res, btn, resolve, reject, callback) =>{
                let reqData = {}
                for (let item of modalList.values()) {
                    let dom = self[`$$${item}-label`];
                    if(!dom) continue;
                    let domValue = dom.getValue()
                    if(domValue==false){
                        return false;
                    }
                    if(dom.getValue){
                        reqData[item] = domValue
                    }
                }
                reqData = self.resetData(reqData);

                self.fetData(btn, reqData, resolve, reject, callback)
                
              }
            }}
          ><div className="relative"  ref={(r) => { this.$$layoutContent = r; }}>{doms}</div>
          </ThemeContext.Provider>
            <div className="absolute" style={hoverStyle} >
                <div className="relative width-100 height-100" style={{'height': hoverStyle.height}}>
                    <Row className="absolute width-5r font-size-8 text-align-center left-50 top-0 transform-d-50">
                        <Col className="bg-show padding-all border-radius-6r box-shadow cursor-pointer" onClick={()=>{
                            this.props.addNode(selectNode, 'top')
                        }}><Icon iconName={'android-add-circle '} size={'170%'} iconPadding={1} /></Col>
                    </Row>
                    <Row className="absolute  left-0 width-5r font-size-8 line-height-2r text-align-center transform-x-d-110">
                        {Number(selectNode.num) > 0 ? <Col className="bg-show padding-all margin-bottom-1r border-radius-6r cursor-pointer box-shadow" onClick={()=>{
                            this.props.moveNode(selectNode, 'top')
                        }}><Icon iconName={'android-arrow-up '} size={'170%'} iconPadding={1}  /> 
                        </Col> : ''}
                        <Col className="bg-show padding-all margin-bottom-1r border-radius-6r cursor-pointer box-shadow" onClick={()=>{
                            this.props.delNode(selectNode, 'inner')
                        }}><Icon iconName={'trash-a '} size={'170%'} iconPadding={1} /></Col>
                        <Col className="bg-show margin-bottom-1r padding-all border-radius-6r cursor-pointer box-shadow" onClick={()=>{
                            this.props.addNode(selectNode, 'inner')
                        }}><Icon iconName={'android-add-circle '} size={'170%'} iconPadding={1} /></Col>
                        {treeData[0]&&treeData[0].childrenNode&&(Number(selectNode.num) < (treeData[0].childrenNode.length-1)) ? <Col className="bg-show padding-all margin-bottom-1r border-radius-6r cursor-pointer box-shadow" onClick={()=>{
                            this.props.moveNode(selectNode, 'bottom')
                        }}><Icon iconName={'android-arrow-down '} size={'170%'} iconPadding={1}  /></Col> : ''}
                    </Row>
                    <Row className="absolute width-5r font-size-8 text-align-center left-50 bottom-0 transform-td-50">
                        <Col className="bg-show padding-all border-radius-6r box-shadow cursor-pointer" onClick={()=>{
                            this.props.addNode(selectNode, 'bottom')
                        }}><Icon iconName={'android-add-circle '} size={'170%'} iconPadding={1} /></Col>
                    </Row>
                </div>
            </div>
          </section>
        );
    }
}
export default EditLayoutDom;
