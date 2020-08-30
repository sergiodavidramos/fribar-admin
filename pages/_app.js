import '../public/css/styles.css'
import '../public/css/admin-style.css'
import '../public/vendor/bootstrap/css/bootstrap.min.css'
import '../public/vendor/fontawesome-free/css/all.min.css'
import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import UserContext from '../components/UserContext'
import Router from 'next/router'
import { StateProvider } from '../components/state'
import Reducer from '../components/reducer'
export default class MyApp extends App {
  //   state = {
  //     user: null,
  //     token: null,
  //   }
  //   componentDidMount() {
  //     const user = localStorage.getItem('frifolly-user')
  //     const token = localStorage.getItem('frifolly-token')
  //     if (user && token) {
  //       this.setState({
  //         user: JSON.parse(user),
  //         token,
  //       })
  //     } else {
  //       Router.push('/login')
  //     }
  //   }
  //   signIn = (user, token) => {
  //     localStorage.setItem('frifolly-user', JSON.stringify(user))
  //     localStorage.setItem('frifolly-token', token)
  //     this.setState(
  //       {
  //         user,
  //         token,
  //       },
  //       () => {
  //         Router.push('/')
  //       }
  //     )
  //   }
  //   signOut = () => {
  //     localStorage.removeItem('frifolly-user')
  //     localStorage.removeItem('frifolly-token')
  //     this.setState({
  //       user: null,
  //       token: null,
  //     })
  //     Router.push('/login')
  //   }

  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <script src="https://apis.google.com/js/platform.js"> </script>
        </Head>
        <StateProvider.Provider
          reducer={Reducer}
          //   value={{
          //     user: this.state.user,
          //     token: this.state.token,
          //     signIn: this.signIn,
          //     signOut: this.signOut,
          //   }}
        >
          <Component {...pageProps} />
        </StateProvider.Provider>
      </>
    )
  }
}
