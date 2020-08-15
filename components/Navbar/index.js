export default () => (
  <nav className="sb-topnav navbar navbar-expand navbar-light bg-clr">
    <a className="navbar-brand logo-brand" href="index.html">
      Gambo Supermarket
    </a>
    <button
      className="btn btn-link btn-sm order-1 order-lg-0"
      id="sidebarToggle"
      href="#"
    >
      <i className="fas fa-bars"></i>
    </button>
    <a
      href="http://gambolthemes.net/html-items/gambo_supermarket_demo/index.html"
      className="frnt-link"
    >
      <i className="fas fa-external-link-alt"></i>Home
    </a>
    <ul className="navbar-nav ml-auto mr-md-0">
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          id="userDropdown"
          href="#"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i className="fas fa-user fa-fw"></i>
        </a>
        <div
          className="dropdown-menu dropdown-menu-right"
          aria-labelledby="userDropdown"
        >
          <a
            className="dropdown-item admin-dropdown-item"
            href="edit_profile.html"
          >
            Edit Profile
          </a>
          <a
            className="dropdown-item admin-dropdown-item"
            href="change_password.html"
          >
            Change Password
          </a>
          <a
            className="dropdown-item admin-dropdown-item"
            href="login.html"
          >
            Logout
          </a>
        </div>
      </li>
    </ul>
  </nav>
)
