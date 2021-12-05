import React , { Component }from 'react';
import { Components } from 'neo';
import BindUser from './bindUser';
import { bannerListForCode } from 'api/index';
const {
    Row,
    Col, Carousel, Image
} = Components;

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            cardInfo: {},
            loadText: '加载中',
            hasCard: "LOADING", // LOADING ,  HASCARD, NULLCARD
            banner: [],
        };
    }
    componentDidMount(){
        this.getBannerList()
    }
    getBannerList(){
        bannerListForCode({code: 'candys'}).then((res)=>{
            if(res.code=='0000'&&res.data&&res.data.records.length>0){
                this.setState({
                    banner: res.data.records
                })
            }
        }).catch((err)=>{

        })
    }
    render(){
        const { banner } = this.state;
        const carouselMap = banner&&banner.length>0? banner.map((itm, idx)=>{
            return {tabName: itm.bannerName, content: (<Image className="logo-computer" imageURl={'/candy_api/files/getTheImage?path=${imageGroup}'} value={itm.imgGroup} />), isActive: true}
        }) : [];
    //     [{ tabName: 'first', content:(<div className='logo-computer'></div>), isActive: true},
    // {tabName: 'second', content:(<div className='logo-computer'></div>), isActive: false}]
        return (<section className=" heighth-100 overflow-hide">
            <Row className="heighth-100" justify={'center'} content={'center'} align={'center'}>
                <Col span={14} className="bg-2F3346 heighth-100 relative ">
                    <Carousel options={carouselMap} height={100} showDotsText={false} autoPlay dragAble>
                    </Carousel></Col>
                <Col span={10}>
                    <Row justify={'center'} content={'center'} align={'center'}>
                        <Col span={19} style={{maxWidth: '380px'}}><BindUser isLogin /></Col>
                    </Row>
                </Col>
            </Row>
        </section>)
    }
}

export default LoginPage;