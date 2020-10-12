import '../public/css/styles.css'
import '../public/css/admin-style.css'
import '../public/vendor/bootstrap/css/bootstrap.min.css'
import '../public/vendor/fontawesome-free/css/all.min.css'
import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import UserContext from '../components/UserContext'
import Router from 'next/router'
import Notifications from 'react-notify-toast'
export default class MyApp extends App {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      token: null,
      categorias: [],
      sid: false,
    }
  }
  setSitNav = (sid) => {
    this.setState({
      sid,
    })
  }
  getCategorias = async () => {
    try {
      const res = await fetch('http://localhost:3001/categoria')
      const categorias = await res.json()
      this.setState({
        categorias: categorias.body,
      })
    } catch (err) {
      this.setState({
        categorias: [],
      })
    }
  }
  componentDidMount() {
    this.getCategorias()
    const user = localStorage.getItem('frifolly-user')
    const token = localStorage.getItem('frifolly-token')
    if (user && token) {
      this.setState({
        user: JSON.parse(user),
        token,
      })
    } else {
      //   Router.push('/login')
    }
  }

  signIn = (user, token) => {
    localStorage.setItem('frifolly-user', JSON.stringify(user))
    localStorage.setItem('frifolly-token', token)
    this.setState(
      {
        user,
        token,
      },
      () => {
        Router.push('/')
      }
    )
  }

  setUser = (user) => {
    localStorage.setItem('frifolly-user', JSON.stringify(user))
    this.setState({
      user,
    })
  }
  signOut = () => {
    localStorage.removeItem('frifolly-user')
    localStorage.removeItem('frifolly-token')
    this.setState({
      user: null,
      token: null,
    })
    Router.replace('/login')
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <div
        className={
          this.state.sid
            ? `sb-nav-fixed sb-sidenav-toggled`
            : 'sb-nav-fixed'
        }
      >
        <Head>
          <script src="https://apis.google.com/js/platform.js"> </script>
        </Head>
        <Notifications />
        <UserContext.Provider
          value={{
            user: this.state.user,
            token: this.state.token,
            categorias: this.state.categorias,
            sid: this.state.sid,
            signIn: this.signIn,
            signOut: this.signOut,
            setUser: this.setUser,
            setSitNav: this.setSitNav,
          }}
        >
          <Component {...pageProps} />
        </UserContext.Provider>
      </div>
    )
  }
}
