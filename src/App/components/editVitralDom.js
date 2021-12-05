import React , { Component }from 'react';
import { Components } from 'neo';

const {
    Row,
    Col,
    Icon,
    Buttons,
    Text, Input, Selects
  } = Components;

class EditVitralDom extends Component {
    constructor(props) {
      super(props);
      this.state = {
        tree: this.props.tree || []
      };
    }
    
    componentDidMount(){
        const content = this.$$vitralContent;
        content.addEventListener('click', (e) => {
            this.props.domFocus({data: e.target.dataset, className:e.target.className});
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
        switch (item&&item.tagName){
            case 'Row':
                return <Row {...item} {...item.props}/>
            case 'Col':
                return <Col {...item} {...item.props}/>
            case 'Icon':
                return <Icon {...item} {...item.props}/>
            case 'Input':
                return <Input {...item} {...item.props}/>
            case 'Buttons':
                return <Buttons {...item} {...item.props}/>
            case 'Selects':
                return <Selects {...item} {...item.props}/>
            case 'Text':
                return <Text {...item} {...item.props}/>
            default: 
                return <div {...item}/> ;
        }
    }

    renderDom(tree){
        const self = this;
        let allDom = '';
        if(tree.length > 1){
            allDom = tree.map((itm, idx)=>{
                return self.getComponent(itm, idx)
            })
        }else{
            allDom = self.getComponent(tree[0])
        }
        return allDom
    }
    render() {
        const self = this;
        const { tree } = this.state;
        let treeData = [];
        treeData = treeData.concat(tree);
        let doms = treeData.length > 0 ? self.renderDom(treeData):'';
        return(
          <section ref={(r) => { this.$$vitralContent = r; }}>
            {doms}
          </section>
        );
    }
}
export default EditVitralDom;
