import Notifications from 'react-notify-toast'
import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import TablaPedidos from '../../components/Pedidos/TablaPedidos'
const Pedidos = () => {
  return (
    <>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: '56px' }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Pedidos</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Pedidos</li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-3 col-md-4">
                  <div className="bulk-section mb-30">
                    <div className="input-group">
                      <select
                        id="action"
                        name="action"
                        className="form-control"
                        defaultValue="0"
                      >
                        <option value="0">Todas las acciones</option>
                        <option value="1">Pendiente</option>
                        <option value="2">Proceso</option>
                        <option value="3">Completo</option>
                        <option value="4">Cancelado</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Todos los pedidos</h4>
                    </div>
                    <TablaPedidos />
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
export default Pedidos
