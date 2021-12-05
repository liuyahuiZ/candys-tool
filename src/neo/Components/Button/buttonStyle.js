export default {
  button: {
    boxSizing: 'border-box',
    display: 'inline-block',
    textDecoration: 'none',
    padding: '0 6px',
    outline: 'none',
    position: 'relative',
    zIndex: 1,
    cursor: 'pointer',
    fontSize: '12px',
    height: '2rem',
    borderRadius: '3px',
    minWidth: '100%',
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #aaa',
    opacity: 0.9
  },
  buttonHover: {
    opacity: 1,
    // boxShadow:  '1px 0px 3px 0px rgba(0, 0, 0, 0.5)'
  },
  link: {
    fontSize: '16px',
    border: 'none',
    background: 'none',
    color: '#4196fd',
    minWidth: 0,
    lineHeight: 1,
    height: '16px',
    margin: '0'
  },

  linkHover: {
    opacity: '0.8',
  },
  small: {
    fontSize: '12px',
    minHeight: '32px',
    borderRadius: '4px',
    minWidth: '50px',
  },
  large: {
    height: '46px',
    borderRadius: '4px',
    fontSize: '14px',
  },
  alldisabled: {
    cursor: 'not-allowed'
  },
  icon:{
    fontSize: '14px',
    height: '32px',
    borderRadius: '4px',
    minWidth: '32px',
  }
};
