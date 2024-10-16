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
import { API_URL } from '../components/Config'
import 'mapbox-gl/dist/mapbox-gl.css'
import sonidoPedido from '../components/Pedidos/sonido/sonidoPedido.mp3'
import sonidoPago from '../components/Transacciones/sonido/pagoRealizado.mp3'
export default class MyApp extends App {
  alarm
  pagoRealizado
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      token: null,
      categorias: [],
      ofertas: [],
      sid: false,
      sucursales: [],
      admSucursal: false,
      generarQR: 100,
    }
  }

  setSitNav = (sid) => {
    this.setState({
      sid,
    })
  }
  setAdmSucursal = (admSucursal) => {
    localStorage.setItem('fribar-sucursal', admSucursal)
    this.setState({
      admSucursal,
    })
  }
  setSucursales = (sucursales) => {
    this.setState({
      sucursales,
    })
  }
  getCategorias = async () => {
    try {
      const res = await fetch(`${API_URL}/categoria`)
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
  getOfertas = () => {
    fetch(`${API_URL}/offers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        if (data.error) {
          notify.show('Error el en servidor', 'error')
        } else {
          this.setState({
            ofertas: data.body,
          })
        }
      })
      .catch((error) => {
        notify.show('Error en el servidor', 'error', 2000)
      })
  }

  componentDidMount() {
    this.alarm = new Audio(sonidoPedido)
    this.pagoRealizado = new Audio(sonidoPago)
    this.getCategorias()
    this.getOfertas()
    const user = localStorage.getItem('fribar-user')
    const token = localStorage.getItem('fribar-token')
    const admSucursal = localStorage.getItem('fribar-sucursal')
    if (user && token) {
      this.setState({
        user: JSON.parse(user),
        token,
        admSucursal,
      })
    }
  }

  signIn = (user, token) => {
    localStorage.setItem('fribar-user', JSON.stringify(user))
    localStorage.setItem('fribar-token', token)
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
    localStorage.setItem('fribar-user', JSON.stringify(user))
    this.setState({
      user,
    })
  }
  signOut = () => {
    localStorage.removeItem('fribar-user')
    localStorage.removeItem('fribar-token')
    this.setState({
      user: null,
      token: null,
    })
    Router.replace('/login')
  }
  setGenerarQR = () => {
    this.setState({
      generarQR: Math.floor(Math.random() * 99),
    })
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
            getSucursales: this.state.sucursales,
            getAdmSucursal: this.state.admSucursal,
            sid: this.state.sid,
            alarm: this.alarm,
            pagoRealizado: this.pagoRealizado,
            generarQR: this.state.generarQR,
            getOfertas: this.state.ofertas,
            signIn: this.signIn,
            signOut: this.signOut,
            setUser: this.setUser,
            setSitNav: this.setSitNav,
            setSucursales: this.setSucursales,
            setAdmSucursal: this.setAdmSucursal,
            setGenerarQR: this.setGenerarQR,
          }}
        >
          <Component {...pageProps} />
        </UserContext.Provider>
      </div>
    )
  }
}
