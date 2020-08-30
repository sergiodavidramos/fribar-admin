import Head from 'next/head'
import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import CardTable from '../../components/Productos/CardTable'
import Link from 'next/link'
export default function Productos() {
  return (
    <>
      <Head></Head>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Products</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <a href="index.html">Dashboard</a>
                </li>
                <li className="breadcrumb-item active">Products</li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-12">
                  <Link href="/productos/nuevo">
                    <a className="add-btn hover-btn">
                      Agregar Nuevo Producto
                    </a>
                  </Link>
                </div>
                <div className="col-lg-5 col-md-6">
                  <div className="bulk-section mt-30">
                    <div className="search-by-name-input">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                      />
                    </div>
                    <div className="input-group">
                      <select
                        id="categeory"
                        name="categeory"
                        className="form-control"
                        defaultValue={'0'}
                      >
                        <option value="0">Active</option>
                        <option value="1">Inactive</option>
                      </select>
                      <div className="input-group-append">
                        <button
                          className="status-btn hover-btn"
                          type="submit"
                        >
                          Search Area
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mt-30 mb-30">
                    <div className="card-title-2">
                      <h4>All Areas</h4>
                    </div>

                    <CardTable />
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
// Productos.getInitialProps = async (context) => {
//   console.log('loooo', context.localStorage)
//   return { token: 'asdasd' }
// }
