import { createContext, useContext, useEffect, useState } from 'react';
const Ctx = createContext(); export const useApp = () => useContext(Ctx);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
export function AppProvider({ children }) {
  const [cart, setCart] = useState(load('cart', [])), [auth, setAuth] = useState(load('auth', null)), [toast, setToast] = useState('');
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('auth', JSON.stringify(auth)), [auth]);
  const notify = m => { setToast(m); setTimeout(() => setToast(''), 2000); };
  const addToCart = (p, size = 8) => { setCart(c => { const k = p._id + size, f = c.find(i => i.key === k);
      return f ? c.map(i => i.key === k ? { ...i, qty: i.qty + 1 } : i) : [...c, { key: k, id: p._id, name: p.name, price: p.price, image: p.image, size, qty: 1 }]; }); notify('Added to cart'); };
  const setQty = (key, d) => setCart(c => c.map(i => i.key === key ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const remove = key => setCart(c => c.filter(i => i.key !== key));
  const logout = () => setAuth(null);
  return <Ctx.Provider value={{ cart, setCart, addToCart, setQty, remove, auth, setAuth, logout, notify }}>
    {children}{toast && <div className="toast">{toast}</div>}</Ctx.Provider>;
}
