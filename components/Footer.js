export default () => (
  <footer className="py-4 bg-footer mt-auto">
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between small">
        <div className="text-muted-1">
          © 2020 <b>FriFolly</b>. De
          {` Potosí-Bolivia con `} <i className="fas fa-heart"></i>
          {` para el mundo`}
        </div>
        {/* <div className="footer-links">
          <a href="">
            Politicas de Provacidad
          </a>
          <a href="">
            Terminos &amp; Condiciones
          </a>
        </div> */}
      </div>
    </div>
    <style jsx>{`
      .fa-heart {
        color: #f55d2c;
      }
    `}</style>
  </footer>
)
