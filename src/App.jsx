import { Routes, Route, NavLink, Link, Navigate } from 'react-router-dom';
import { useApp } from './context.jsx';
import Home from './pages/Home.jsx'; import Products from './pages/Products.jsx'; import Cart from './pages/Cart.jsx';
import Auth from './pages/Auth.jsx'; import Admin from './pages/Admin.jsx';
export default function App() {
  const { cart, auth, logout } = useApp(), count = cart.reduce((s, i) => s + i.qty, 0);
  return (<>
    <header className="header"><Link to="/" className="logo">Sole<span>Style</span></Link>
      <nav><NavLink to="/" end>Home</NavLink><NavLink to="/products">Shop</NavLink>
        {auth?.user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}</nav>
      <div className="head-actions"><Link to="/cart" className="cart-link">Cart <b>{count}</b></Link>
        {auth ? <><span className="hello">Hi, {auth.user.name.split(' ')[0]}</span><button className="btn ghost" onClick={logout}>Logout</button></>
          : <Link to="/login" className="btn">Login</Link>}</div></header>
    <main><Routes><Route path="/" element={<Home />} /><Route path="/products" element={<Products />} /><Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Auth />} /><Route path="/admin" element={auth?.user.role === 'admin' ? <Admin /> : <Navigate to="/login" />} /></Routes></main>
    <footer className="footer">© {new Date().getFullYear()} Sole Style · Erode, Tamil Nadu</footer>
  </>);
}
