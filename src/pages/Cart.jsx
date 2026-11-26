import { useState } from 'react'; import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js'; import { useApp } from '../context.jsx';
export default function Cart() {
  const { cart, setCart, setQty, remove, auth, notify } = useApp(), nav = useNavigate();
  const [coupon, setCoupon] = useState(''), [applied, setApplied] = useState(false), [pay, setPay] = useState('UPI'), [address, setAddress] = useState(auth?.user.address || ''), [done, setDone] = useState(null);
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0), discount = applied ? Math.round(sub * 0.1) : 0, delivery = sub > 999 || !sub ? 0 : 79, total = sub - discount + delivery;
  const apply = () => coupon.trim().toUpperCase() === 'SOLE10' ? (setApplied(true), notify('Coupon applied')) : notify('Invalid coupon');
  const place = async () => {
    if (!auth) return nav('/login');
    try { const o = await api('/orders', { method: 'POST', token: auth.token, body: { address, payment: pay, items: cart.map(i => ({ product: i.id, name: `${i.name} (size ${i.size})`, price: i.price, qty: i.qty })) } });
      setDone(o); setCart([]); } catch (e) { notify(e.message); }
  };
  if (done) return <section className="section center"><h2>Order placed 🎉</h2><p>Order #{done._id.slice(-6)} · Total ₹{total} · Paying by {done.payment}</p><Link to="/products" className="btn">Keep shopping</Link></section>;
  if (!cart.length) return <section className="section center"><h2>Your cart is empty</h2><Link to="/products" className="btn">Browse shoes</Link></section>;
  return (<section className="section"><h2>Your cart</h2><div className="cart-layout"><div>
    {cart.map(i => <div className="cart-item" key={i.key}><img src={i.image} alt={i.name} /><div className="grow"><h3>{i.name}</h3><div className="muted">Size {i.size} · ₹{i.price}</div>
      <div className="qty"><button onClick={() => setQty(i.key, -1)}>−</button><span>{i.qty}</span><button onClick={() => setQty(i.key, 1)}>+</button></div></div>
      <div className="right"><b>₹{i.price * i.qty}</b><button className="link" onClick={() => remove(i.key)}>Remove</button></div></div>)}</div>
    <aside className="summary"><h3>Price details</h3>
      <div className="row"><span>Subtotal</span><span>₹{sub}</span></div><div className="row"><span>Coupon discount</span><span>−₹{discount}</span></div>
      <div className="row"><span>Delivery</span><span>{delivery ? `₹${delivery}` : 'Free'}</span></div><div className="row total"><span>Total</span><span>₹{total}</span></div>
      <div className="coupon"><input className="input" placeholder="Coupon (SOLE10)" value={coupon} onChange={e => setCoupon(e.target.value)} /><button className="btn ghost" onClick={apply}>Apply</button></div>
      <label className="lbl">Delivery address<textarea className="input" rows="3" value={address} onChange={e => setAddress(e.target.value)} /></label>
      <div className="lbl">Payment</div>{['UPI', 'Card', 'Cash on delivery'].map(p => <label key={p} className="radio"><input type="radio" checked={pay === p} onChange={() => setPay(p)} /> {p}</label>)}
      <button className="btn full" onClick={place} disabled={!address.trim() && !!auth}>{auth ? 'Place order' : 'Log in to order'}</button></aside></div></section>);
}
