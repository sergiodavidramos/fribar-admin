// import FormData from 'form-data'
// export default () => {
//   var formData = new FormData()
//   formData.append('my_field', 'my value')
//   const data = formData.getAll('my_field')
//   console.log(data)
//   return <h1>hola</h1>
// }

class Prueba extends React.Component {
  UNSAFE_componentWillReceiveProps(props) {
    console.log('asdsdsdsd', props)
  }
  // if (get(nextProps.location, 'state.loadUser')) {
  //   this.props.getProfile()
  //   this.props.history.replace({ state: null })
  // }

  render() {
    return <h1>HOla</h1>
  }
}
export default Prueba
