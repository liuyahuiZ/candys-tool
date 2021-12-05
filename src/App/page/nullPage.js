import React , { Component }from 'react';
import { Components, utils } from 'neo';
import { UrlSearch } from '../utils/index'
import bg1 from '../../assect/400-pg.png';
import bg2 from '../../assect/403.png';
import bg3 from '../../assect/500.png';
const {
    Row,
    Col, LoadText, Buttons
} = Components;

const { array } = utils
class NullPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingStatus: 'NODATA',
            statusArr: [{code: '404', span: 7, msg: '抱歉，您访问的页面不存在', url: bg1},
            {code: '403', span: 8, msg: '抱歉，您无权访问该页面',url: bg2},
            {code: '500', span: 10, msg: '服务器出错了',url: bg3}
        ]
        };
    }

    render(){
        const { statusArr } = this.state;
        let obg= UrlSearch();
        console.log('UrlSearch', UrlSearch())
        let nowInfo = statusArr[0]
        if(obg.code){
           nowInfo =  array.getItemForKey(statusArr,obg.code, 'code')
           if(!nowInfo.url) nowInfo = statusArr[0]
        }
        return (<section className="heighth-100 overflow-hide">
            <Row className="heighth-100" justify={'center'} align={'center'} content={'center'}>
                <Col span={nowInfo.span} className="relative">
                    <img className='width-100' src={nowInfo.url} />
                </Col>
                <Col span={19} className='text-align-center margin-top-2r font-size-big'>{nowInfo.msg}</Col>
                {/* <Col span={19} className='text-align-center margin-top-1r'><Buttons
                    text={'返回登陆'}
                    type={'primary'}
                    size={'small'}
                    style={{ color: '#fff' }}
                    onClick={() => {
                        location.hash="/Home";
                        top.location.href = '/#/LoginPage';
                    }}
                    />
                </Col> */}
                
            </Row>
        </section>)
    }
}

export default NullPage;