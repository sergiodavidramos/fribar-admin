import Head from 'next/head'
import TopNavbar from '../../../components/Navbar'
import SideNav from '../../../components/Navbar/SideNav'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'

function ProductView({ data }) {
  console.log(data)
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
      <Head></Head>
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
                <div className="col-lg-5 col-md-6">
                  <div className="card card-static-2 mb-30">
                    <div className="card-body-table">
                      <div className="shopowner-content-left text-center pd-20">
                        <div className="shop_img">
                          <img src="images/product/img-1.jpg" alt="" />
                        </div>
                        <ul className="product-dt-purchases">
                          <li>
                            <div className="product-status">
                              Orders{' '}
                              <span className="badge-item-2 badge-status">
                                10
                              </span>
                            </div>
                          </li>
                          <li>
                            <div className="product-status">
                              Shop{' '}
                              <span className="badge-item-2 badge-status">
                                2
                              </span>
                            </div>
                          </li>
                        </ul>
                        <div className="shopowner-dts">
                          <div className="shopowner-dt-list">
                            <span className="left-dt">Price</span>
                            <span className="right-dt">$15</span>
                          </div>
                          <div className="shopowner-dt-list">
                            <span className="left-dt">Status</span>
                            <span className="right-dt">Active</span>
                          </div>
                          <div className="shopowner-dt-list">
                            <span className="left-dt">Created</span>
                            <span className="right-dt">
                              5 May 2020, 03.45 PM
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
  const pro = await axios.get(`http://localhost:3001/productos/all`, {
    responseType: 'json',
  })
  //   console.log(pro.data.body)
  const temp = pro.data.body
  const paths = temp.map((pro) => ({
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
  const pro = await axios.get(
    `http://localhost:3001/productos?id=${params.id}`,
    {
      responseType: 'json',
    }
  )
  const data = pro.data
  return {
    props: { data },
    revalidate: 1,
  }
}

export default ProductView
