import { useEffect, useState } from 'react'; import { useSearchParams } from 'react-router-dom';
import { api } from '../api.js'; import { useApp } from '../context.jsx';
const CATS = ['All', 'Men', 'Women', 'Casual', 'Kids'];
export default function Products() {
  const [params, setParams] = useSearchParams(), { addToCart } = useApp();
  const [items, setItems] = useState([]), [search, setSearch] = useState(''), [sort, setSort] = useState(''), [max, setMax] = useState(5000), [loading, setLoading] = useState(true);
  const category = params.get('category') || 'All';
  useEffect(() => { setLoading(true);
    const t = setTimeout(() => api(`/products?category=${category}&search=${encodeURIComponent(search)}&sort=${sort}&max=${max}`).then(setItems).finally(() => setLoading(false)), 250);
    return () => clearTimeout(t); }, [category, search, sort, max]);
  return (<section className="section"><h2>Our footwear</h2>
    <div className="filters">
      <div className="pills">{CATS.map(c => <button key={c} className={'pill' + (c === category ? ' on' : '')} onClick={() => setParams(c === 'All' ? {} : { category: c })}>{c}</button>)}</div>
      <input className="input" placeholder="Search shoes or brands" value={search} onChange={e => setSearch(e.target.value)} />
      <select className="input" value={sort} onChange={e => setSort(e.target.value)}><option value="">Sort: Newest</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option></select>
      <label className="range">Up to ₹{max}<input type="range" min="500" max="5000" step="100" value={max} onChange={e => setMax(e.target.value)} /></label></div>
    {loading ? <p className="muted">Loading…</p> : !items.length ? <p className="muted">No shoes match. Try clearing a filter.</p> :
      <div className="grid">{items.map(p => <article key={p._id} className="card">
        <img src={p.image} alt={p.name} loading="lazy" /><div className="card-body"><small>{p.brand} · {p.category}</small><h3>{p.name}</h3>
          <div className="price">₹{p.price} <del>₹{p.mrp}</del></div><div className="muted">★ {p.rating} · {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</div>
          <button className="btn full" disabled={p.stock < 1} onClick={() => addToCart(p)}>Add to cart</button></div></article>)}</div>}
  </section>);
}
