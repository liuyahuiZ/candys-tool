import React, { Component } from 'react';
import { LoadText, Row, Col, Notification } from '../../Components';

class ErrorBounDary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, info) {
      // You can also log the error to an error reporting service
      // console.log(error, info);
      Notification.toaster({ type: 'error',time: 30000, position: 'top', title: '提示', content: JSON.stringify(info) }, true);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <Row className="padding-all-2r">
            <Col span={18}><LoadText className={"padding-top-2r"} loadStatus={'NODATA'} text={(<div onClick={()=>{ window.location.reload();}}
            >页面有地方报错，点击刷新页面...</div>)} refreshBack={()=>{ }} /></Col>
        </Row>;
      }
  
      return this.props.children; 
    }
}
export default ErrorBounDary;