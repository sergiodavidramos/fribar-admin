import Head from 'next/head'
import { useEffect, useContext } from 'react'
import Notifications, { notify } from 'react-notify-toast'
import FacebookLogin from 'react-facebook-login'
import { encode } from 'base-64'
import Router from 'next/router'
import UserContext from '../components/UserContext'
import { API_URL } from '../components/Config'
const Login = () => {
  var auth2
  //   const [state, dispatch] = useStateValue()
  const { signIn } = useContext(UserContext)
  const setUser = ({ token, usuario }) => {
    if (usuario.idPersona.status !== false) {
      if (
        usuario.role === 'ADMIN-ROLE' ||
        usuario.role === 'USER-ROLE' ||
        usuario.role === 'DELIVERY-ROLE' ||
        usuario.role === 'GERENTE-ROLE' ||
        usuario.role === 'ALMACEN-ROLE'
      ) {
        signIn(usuario, token)
        switch (usuario.role) {
          case 'DELIVERY-ROLE':
            Router.push('/delivery')
            break
          case 'ADMIN-ROLE' || 'GERENTE-ROLE':
            Router.push('/')
            break
          case 'USER-ROLE':
            Router.push('/pedidos')
            break
          case 'ALMACEN-ROLE':
            Router.push('/productos')
            break
        }
      } else
        notify.show(
          'Su cuenta no tiene permisos para ingresar al sistema de administracion ',
          'warning'
        )
    } else
      notify.show(
        'Su cuenta no tiene permisos para ingresar al sistema de administracion ',
        'warning'
      )
  }
  var startApp = function () {
    gapi.load('auth2', function () {
      auth2 = window.gapi.auth2.init({
        client_id:
          '1089002507424-cilko1bfs2h6ka5injmj8r0nuaev4ne9.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      })
      attachSignin(document.getElementById('customBtn'))
    })
  }
  function attachSignin(element) {
    auth2.attachClickHandler(
      element,
      {},
      function (googleUser) {
        const id_token = googleUser.getAuthResponse().id_token
        fetch(`${API_URL}/login/google`, {
          method: 'POST',
          body: JSON.stringify({
            idtoken: id_token,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.error) notify.show(response.body, 'warning')
            else {
              setUser(response.body)
            }
          })
          .catch((err) => {
            notify.show('Error en el Servidor', 'error')
          })
      },
      function (error) {
        notify.show(`No se pudo iniciar sesion: ${error.error}`, 'error')
      }
    )
  }
  useEffect(() => {
    startApp()
  }, [])
  function handlerSubmit() {
    event.preventDefault()
    let headers = new Headers()
    headers.append(
      'Authorization',
      'Basic ' +
        encode(event.target[0].value + ':' + event.target[1].value)
    )
    fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: headers,
    })
      .then((res) => res.json())
      .then((response) => {
        response.error
          ? notify.show(response.body, 'warning')
          : setUser(response.body)
      })
      .catch((err) => {
        notify.show(err.message, 'error')
      })
  }
  const responseFacebook = (response) => {
    fetch(`${API_URL}/login/facebook`, {
      method: 'POST',
      body: JSON.stringify({
        accessToken: response.accessToken,
        userID: response.userID,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((response) => {
        response.error
          ? notify.show(response.body.message, 'warning')
          : setUser(response.body)
      })
      .catch((err) => {
        console.log('el errr', err)
        notify.show('Error en el Servidor', 'error')
      })
  }
  const componentClicked = () => {}
  return (
    <>
      <Head>
        <meta
          name="google-signin-client_id"
          content="1089002507424-cilko1bfs2h6ka5injmj8r0nuaev4ne9.apps.googleusercontent.com"
        ></meta>

        <script src="https://apis.google.com/js/api:client.js"></script>
      </Head>
      <div className="bg-sign">
        <Notifications />
        <div id="layoutAuthentication">
          <div id="layoutAuthentication_content">
            <main>
              <img
                src="/img/logoFB.svg"
                alt="logo"
                width="100"
                height="100"
              />

              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-5">
                    <div className="card shadow-lg border-0 rounded-lg mt-5 card-modi">
                      <div className="card-header card-sign-header">
                        <h3 className="text-center font-weight-light my-4">
                          Inicio de sesión
                        </h3>
                      </div>
                      <div id="google-btn">
                        <div id="my-signin2"></div>
                      </div>
                      <button
                        className="btn btn-lg btn-google"
                        id="customBtn"
                      >
                        <i className="fab fa-google-plus-g mr-2"></i>
                        Inicia sesión con Google
                      </button>
                      <div className="container-face">
                        <FacebookLogin
                          appId="333033351546623"
                          autoLoad={false}
                          onClick={componentClicked}
                          callback={responseFacebook}
                          cssClass="btn btn-lg btn-facebook"
                          icon="fab fa-facebook-f mr-2"
                          textButton="Inicia sesión con Facebook"
                        />
                      </div>
                      <div className="card-body">
                        <form onSubmit={handlerSubmit}>
                          <div className="form-group">
                            <label
                              className="form-label"
                              htmlFor="inputEmailAddress"
                            >
                              Correo*
                            </label>
                            <input
                              className="form-control py-3"
                              id="inputEmailAddress"
                              type="email"
                              placeholder="Enter email address"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label
                              className="form-label"
                              htmlFor="inputPassword"
                            >
                              Contraseña*
                            </label>
                            <input
                              className="form-control py-3"
                              id="inputPassword"
                              type="password"
                              placeholder="Enter password"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <div className="custom-control custom-checkbox">
                              <input
                                className="custom-control-input"
                                id="rememberPasswordCheck"
                                type="checkbox"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="rememberPasswordCheck"
                              >
                                Recordar contraseña
                              </label>
                            </div>
                          </div>
                          <div className="form-group d-flex align-items-center justify-content-between mt-4 mb-0">
                            <button className="btn btn-sign hover-btn">
                              Ingresar
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      <style jsx>{`
        main {
          display: flex;
          height: 100vh;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        .btn-google {
          color: white;
          background-color: #ea4335;
          font-size: 15px;
          margin: 10px 20px;
          font-weight: 600;
        }
        .card-modi {
          margin-top: 0 !important;
        }
      `}</style>
    </>
  )
}

export default Login
