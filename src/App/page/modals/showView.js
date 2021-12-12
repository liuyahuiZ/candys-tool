import React , { Component }from 'react';
import { Components, Templates } from 'neo';
import { hashHistory } from 'react-router';
import { pageConfigGet, pageConfigQry } from '../../api/index';
import * as Register from '../../../views/register';
import * as PageViewRegister from './pageViewRegister';

const { Loader, LoadPage } = Components;
const { ErrorBounDary } = Templates
class ShowView extends Component {
    constructor(props) {
      super(props);
      this.state = {
        pageList: this.props.pageList || [],
        pagesInfo: this.props.pagesInfo || [],
        pageConfig: [],
        selectTree: this.props.pagesInfo.templateId|| '',
        defaultAction: this.props.defaultAction,
        valueBack: this.props.valueBack,
        selectUrl: '',
        selectPage: '',
        selectPageParmes: this.props.parame||{},
        publistatus: this.props.publistatus == undefined ? 1 : this.props.publistatus,
        loadingStatus: 'LOADING', //'LOADING', 'LOADED',
        isModal: this.props.isModal || false
      };
      this.getThisDom = this.getThisDom.bind(this);
      this.getValue = this.getValue.bind(this);
      this.setValue = this.setValue.bind(this);
    }

    componentDidMount(){
        const { publistatus, pagesInfo} = this.state;
        if(publistatus===1){
            this.getPageConfig(pagesInfo)
        } else {
            this.getEditConfig()
        }
    }

    componentWillReceiveProps(nextProps){
        const { publistatus, pagesInfo, pageList, defaultAction, isModal, parame, valueBack} = nextProps;
        if(this.state.pagesInfo&&(this.state.pagesInfo.id == pagesInfo.id)&&(this.state.selectPageParmes = parame)) return;
        this.setState({
            pageList: pageList || [],
            pagesInfo: pagesInfo || [],
            pageConfig: [],
            selectPage: '',
            selectTree: pagesInfo.templateId|| '',
            selectPageParmes: parame||{},
            defaultAction: defaultAction,
            isModal: isModal || false,
            valueBack: valueBack,
        }, ()=>{
            if(publistatus===1){
                this.getPageConfig(pagesInfo)
            } else {
                this.getEditConfig()
            }
        })
        
    }

    getValue(keys){
        const { selectTree } = this.state;
        if(keys&&this[`$$${keys}`]&&this[`$$${keys}`].getValue){
            return this[`$$${keys}`].getValue()
        }
        if(this[`$$${selectTree}`]&&this[`$$${selectTree}`].getValue){
            return this[`$$${selectTree}`].getValue()
        }
        
    }
    setValue(v){
        const { selectTree } = this.state;
        if(this[`$$${selectTree}`]&&this[`$$${selectTree}`].setValue){
            return this[`$$${selectTree}`].setValue(v)
        }
    }
    getThisDom(){
        const { selectTree } = this.state;
        
        return this[`$$${selectTree}`]
    }

    //获取页面下未发布的配置 
    getEditConfig(){
        const page = this.state.pagesInfo
        const self = this;
        const { publistatus} = this.state;
        this.setState({
            loadingStatus: 'LOADING'
        })
        Loader.show()
        pageConfigQry({
            current: 0,
            obj: {
                pageId: page.id,
                status: publistatus, //0-未发布，1-已发布，2-已删除
            },
            size: 10
        }).then((res)=>{
            Loader.hide();
            if(res.code=='0000'){
                if(res.data.length>0){
                    self.setState({
                        pageConfig: res.data[0],
                        loadingStatus: 'LOADED'
                    })
                    
                } else {
                    //没有处于编辑状态的配置 调已发布的最新配置，去新增编辑配置
                    if(page.configId){
                        self.getPageConfig(page)
                    }else{
                        self.setState({
                            pageConfig: {},
                            loadingStatus: 'LOADED'
                        })
                    }
                }
            } else{
                self.setState({
                    loadingStatus: 'ERROR'
                })
                Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
            }
            
        }).catch(()=>{
            Loader.hide();
        })
    }

    //获取页面已绑定发布的配置
    getPageConfig(page, callback){
        // 绑定配置
        const self = this;
        this.setState({
            loadingStatus: 'LOADING'
        })
        if(page.configId) {
            pageConfigGet({
                id: page.configId,
                status: 1
            }).then((res)=>{
                if(res.code=='0000'){
                    self.setState({
                        pageConfig: res.data,
                        loadingStatus: 'LOADED'
                    },()=>{if(typeof callback == 'function'){callback()}})
                } else{
                    self.setState({
                        pageConfig: "",
                        loadingStatus: 'ERROR'
                    })
                    Toaster.toaster({ type: 'normal',  position: 'top', content: res.msg }, true)
                }
            }).catch(()=>{
    
            })
        }
        
    }
    
    handleClick(link) {
        if(link) {
            hashHistory.push(link);
        }
    }

    renderTemple(selectTree){
        const self = this;
        const { pageList, pageConfig, selectPage, selectPageParmes, defaultAction, pagesInfo, valueBack, loadingStatus } = this.state;
        if(pagesInfo&&pagesInfo.url&&pagesInfo.url.indexOf('@') >= 0&&pagesInfo.isDIYPage==1){
            let pages = pagesInfo.url.split('@')[1]
            const Components = Register.default[pages]
            if(Components){
                return <React.Suspense fallback={<LoadPage />}>
                    <Components pageData={selectPage} pageParmes={selectPageParmes} pageList={pageList} pageConfig={pageConfig} loadingStatus={loadingStatus} ref={(r) => { self[`$$${pages}`] = r; }} {...defaultAction} {...this.props} />
                </React.Suspense>
            } else{
                return <div className="padding-all-2r bg-show">未找到页面404</div>
            }
        }
        if(selectTree){
            console.log('selectTree === ', selectTree);
            const PageComponents = PageViewRegister.default[selectTree]
            console.log('PageViewRegister === ', PageViewRegister.default);
            if(PageComponents){
                return <React.Suspense fallback={<LoadPage />}>
                    <PageComponents pageData={pagesInfo} pageList={pageList} pageParmes={selectPageParmes} ref={(r) => { self[`$$${selectTree}`] = r; }}  pageConfig={pageConfig} valueBack={valueBack} defaultAction={defaultAction} loadingStatus={loadingStatus} {...defaultAction} {...this.props}  />
                </React.Suspense>
            } else{
                return <div className="padding-all-2r bg-show">未找到页面404</div>
            }
        }
    }

    render() {
        const self = this;
        const { selectTree } = this.state;

        return(
          <section className="width-100">
            <ErrorBounDary >{self.renderTemple(selectTree)} </ErrorBounDary>
          </section>
        );
    }
}
export default ShowView;
