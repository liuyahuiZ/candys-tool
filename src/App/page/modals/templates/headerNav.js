import React from 'react'

class HeaderNav extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      brand: this.props.brand || '',
      menu: this.props.menu || '',
      navend: this.props.navend || '',
      userinfo: this.props.userinfo || ''
    }
  }
  getBrand() {}
  render() {
    return (
    <nav className='line-height-3r'>
      <div className=''></div>
    </nav>
    )
  }
}
export default HeaderNav
