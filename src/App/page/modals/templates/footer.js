import React from 'react'
//import '../../../style/footer.scss'

class Footer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      type:
        this.props.type && 'absolute' === this.props.type
          ? 'fixed-footer'
          : 'abs-footer'
    }
    this.getDes = this.getDes.bind(this)
  }
  getDes() {
    const des = this.props.des
    let desDom = des ? des.map((val, idx) => {
      return (<span title={val.des || ''} key={`${idx}-des`}>
          {val.type && val.type === 'link' ? (
            <a href={val.link} target={val.target || '_self'}>
              {val.text}
            </a>
          ) : (
            val.text
          )}
        </span>)
    }) : ''
    return desDom
  }
  render() {
    const des = this.getDes();
    return (
      <footer className={`${this.state.type} bg-333 textclolor-666 line-height-2r`}>
        <span className="copyright">© {this.props.copyright}</span>
        <div className="des">{des}</div>
      </footer>
    )
  }
}
export default Footer
