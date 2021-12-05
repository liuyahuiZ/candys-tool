import React , { Component }from 'react';
import { Components, Templates } from 'neo';
import { ThemeContext } from  'context';

const { Row } = Components;
const { EditTable } = Templates;
  
class EditTableView extends Component {
    constructor(props) {
      super(props);
      let pageConfig = this.props.pageConfig || {}
      this.state = {
          confirmDirty: false,
          pageData: this.props.pageData,
          pageConfig: pageConfig,
          editCondition: [],
          editUrlCondition: {},
          editConfig: {},
          pageParmes: this.props.pageParmes,
          pageConfigId: pageConfig._id||null,
          wholeRules: []
      };
      this.getValue = this.getValue.bind(this);
      this.setValue = this.setValue.bind(this);
    }

    componentWillReceiveProps(nextProps){
      let pageConfig = nextProps.pageConfig || {}
      this.setState({
        pageData: nextProps.pageData,
        pageConfig: nextProps.pageConfig,
        pageParmes: nextProps.pageParmes,
      })
      this.initPage(pageConfig.configJson, nextProps.pageData, pageConfig._id);
    }
    
    componentDidMount(){
      this.initPage(this.state.pageConfig.configJson, this.state.pageData, this.state.pageConfigId);
    }

    getValue(){
      if(this.$$EditTableView&&this.$$EditTableView.getValue){
          return this.$$EditTableView.getValue()
      }
      
    }
    setValue(v){
      if(this.$$EditTableView&&this.$$EditTableView.setValue){
          return this.$$EditTableView.setValue(v)
      }
      
    }
    initPage(pageConfig, pageData, configID){
      if(pageConfig&&JSON.stringify(pageConfig)!=='{}'){
        if(typeof pageConfig == 'string') {
          pageConfig = JSON.parse(pageConfig);
        }
        this.setState({
          editCondition: pageConfig.editCondition,
          editUrlCondition: pageConfig.editUrlCondition,
          editConfig: pageConfig.editConfig||{},
          pageConfigId: configID,
          wholeRules: pageConfig.wholeRules||[]
        })
      }
    }

    render() {
        const {editCondition, editUrlCondition, editConfig, wholeRules} = this.state
        const self = this;
        let pageProps = {
          listFormat: editCondition,
          urlInfo: editUrlCondition,
          editConfig: editConfig||{},
          callback: this.props.callback,
          wholeRules: wholeRules
        };
        return (
          <section className="bg-show">
            <Row className="width-100">
            <ThemeContext.Consumer>
                { context => {
                return <EditTable {...pageProps} {...this.props} ref={(r)=>{ self.$$EditTableView = r }} reRender={context.reRender} contextParames={context.parames} />
                }
              }
              </ThemeContext.Consumer>
            </Row>
          </section>
        );
    }
}
export default EditTableView;
