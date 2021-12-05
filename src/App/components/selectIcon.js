import React , { Component }from 'react';
import { Components } from 'neo';
import icons from './icon';

const {
    Row,
    Col,
    Icon,
  } = Components;

class SelectIcon extends Component {
    constructor(props) {
      super(props);
      this.state = {
          selectIcon: this.props.value,
      };
    }

    componentWillReceiveProps(){

    }

    resetIcon(){
        this.setState({
            selectIcon: ''
        });
        this.props.onChange('')
    }

    render() {
        const self = this;
        const {selectIcon} = this.state;
        const iconsMap = icons.map((item) => {
            return <Icon iconName={item.name} size={'150%'} key={item.name} onClick={()=>{
                self.setState({
                    selectIcon: item.name
                });
                self.props.onChange(item.name)
            }} />;
        });
        
        return(
          <section>
            <Row>
                <Col span={12}>{selectIcon&&selectIcon!=='' ? (<div> {selectIcon} <Icon iconName={selectIcon} size={'150%'} /></div>): '点击图标选择' }
                </Col>
                <Col span={12} onClick={()=>{ self.resetIcon('') }}>{selectIcon&&selectIcon!=='' ? <Icon iconName={'android-cancel '} size={'150%'} /> : ''}</Col>
                <Col className="heighr-12 overflow-y-scroll">{iconsMap}</Col>
            </Row>
          </section>
        );
    }
}
export default SelectIcon;
