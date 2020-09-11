import TopNavbar from '../../../components/Navbar'
import SideNav from '../../../components/Navbar/SideNav'
import Link from 'next/link'
import moment from 'moment'
function ProductView({ pro }) {
  moment.locale('es')
  //   const router = useRouter()
  //   if (router.isFallback) {
  //     return <div>Loading...</div>
  //   }
  //   const { id } = router.query
  //   if (slug === undefined) {
  //     console.log('weeee')
  //   } else
  //   if (!id) {
  //     return null
  //   }
  //   console.log(id)

  return (
    <>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Detalle del producto</h2>
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
                  Detalle producto
                </li>
              </ol>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="card card-static-2 mb-30">
                    <div className="card-body-table">
                      <div className="shopowner-content-left text-center pd-20">
                        <div className="shop_img">
                          <img
                            src={`http://localhost:3001/upload/producto/${pro.img[0]}`}
                            alt=""
                          />
                        </div>
                        <ul className="product-dt-purchases">
                          <li>
                            <div className="product-status">
                              Ventas/Pedidos
                              <span className="badge-item-2 badge-status">
                                10
                              </span>
                            </div>
                          </li>
                          <li>
                            <div className="product-status">
                              Stock
                              <span className="badge-item-2 badge-status">
                                {pro.stock}
                              </span>
                            </div>
                          </li>
                        </ul>
                        <div className="shopowner-dts">
                          <div className="shopowner-dt-list">
                            <span className="left-dt">Nombre</span>
                            <span className="right-dt">{pro.name}</span>
                          </div>
                          <div className="shopowner-dt-list">
                            <span className="left-dt">Precio Compra</span>
                            <span className="right-dt">
                              {pro.precioCompra} Bs
                            </span>
                          </div>
                          <div className="shopowner-dt-list">
                            <span className="left-dt">Precio Venta</span>
                            <span className="right-dt">
                              {pro.precioVenta} Bs
                            </span>
                          </div>
                          <div className="shopowner-dt-list">
                            <span className="left-dt">Categoria</span>
                            <span className="right-dt">
                              {' '}
                              {pro.category[0].name}
                            </span>
                          </div>
                          <div className="shopowner-dt-list">
                            <span className="left-dt">Detalle</span>
                            <span className="right-dt">{pro.detail}</span>
                          </div>
                          <div className="shopowner-dt-list">
                            <span className="left-dt">Estado</span>
                            <span className="right-dt">
                              {pro.status ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                          <div className="shopowner-dt-list">
                            <span className="left-dt">
                              Fecha de Vencimiento
                            </span>
                            <span className="right-dt">
                              {moment(pro.vence).format('LL') || ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const pro = await fetch(`http://localhost:3001/productos/all`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  const temp = await pro.json()
  const paths = temp.body.map((pro) => ({
    params: {
      id: pro._id,
      title: pro.name.toLowerCase().replace(/\s/g, '-'),
    },
  }))
  return {
    paths,
    fallback: false,
  }
}
export async function getStaticProps({ params }) {
  const pro = await fetch(
    `http://localhost:3001/productos?id=${params.id}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )
  const data = await pro.json()
  return {
    props: { pro: data.body[0][0] },
    revalidate: 1,
  }
}

export default ProductView
