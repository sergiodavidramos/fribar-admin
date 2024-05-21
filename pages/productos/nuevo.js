import Head from 'next/head'
import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Notifications from 'react-notify-toast'
import FormularioAgregarProducto from '../../components/Productos/FormularioAgregarProducto'
import { API_URL } from '../../components/Config'
const ProductoNuevo = ({ categorias, marcas }) => {
  return (
    <>
      <Head></Head>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: '56px' }} />

            <div className="container-fluid">
              <h2 className="mt-30 page-title">Nuevo Producto</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/productos">
                    <a>Productos</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  Agregar producto
                </li>
              </ol>

              <FormularioAgregarProducto
                categorias={categorias}
                marcas={marcas}
              />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  try {
    const res = await fetch(`${API_URL}/categoria?status=true`)
    const categorias = await res.json()
    const mar = await fetch(`${API_URL}/proveedor/all?status=true`)
    const marcas = await mar.json()

    return {
      props: {
        categorias,
        marcas,
      },
      revalidate: 1,
    }
  } catch (err) {
    const categorias = { error: true }
    const marcas = { error: true }

    return {
      props: {
        categorias,
        marcas,
      },
      revalidate: 1,
    }
  }
}

export default ProductoNuevo
