import { useEffect, useState } from 'react'; import { api } from '../api.js'; import { useApp } from '../context.jsx';
const empty = { name: '', brand: '', category: 'Men', price: '', mrp: '', image: '', description: '', stock: '' };
export default function Admin() {
  const { auth, notify } = useApp(), token = auth.token;
  const [list, setList] = useState([]), [q, setQ] = useState(''), [form, setForm] = useState(null), [view, setView] = useState(null);
  const load = () => api(`/products?search=${encodeURIComponent(q)}`).then(setList);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [q]);
  const save = async e => { e.preventDefault(); const body = { ...form, price: +form.price, mrp: +form.mrp || +form.price, stock: +form.stock };
    try { form._id ? await api('/products/' + form._id, { method: 'PUT', body, token }) : await api('/products', { method: 'POST', body, token });
      notify(form._id ? 'Product updated' : 'Product added'); setForm(null); load(); } catch (x) { notify(x.message); } };
  const del = async p => { if (!confirm(`Delete ${p.name}?`)) return; await api('/products/' + p._id, { method: 'DELETE', token }); notify('Product deleted'); load(); };
  const ch = k => e => setForm({ ...form, [k]: e.target.value });
  return (<section className="section"><div className="bar"><h2>Product management ({list.length})</h2>
    <div className="bar-actions"><input className="input" placeholder="Search products" value={q} onChange={e => setQ(e.target.value)} /><button className="btn" onClick={() => setForm(empty)}>Add product</button></div></div>
    <div className="table-wrap"><table><thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>
      {list.map(p => <tr key={p._id}><td><img src={p.image} alt="" /></td><td>{p.name}<br /><small>{p.brand}</small></td><td>{p.category}</td><td>₹{p.price}</td><td>{p.stock}</td>
        <td className="acts"><button className="link" onClick={() => setView(p)}>View</button><button className="link" onClick={() => setForm(p)}>Edit</button><button className="link danger" onClick={() => del(p)}>Delete</button></td></tr>)}
      {!list.length && <tr><td colSpan="6" className="muted">No products found.</td></tr>}</tbody></table></div>
    {view && <div className="modal" onClick={() => setView(null)}><div className="modal-box" onClick={e => e.stopPropagation()}><img src={view.image} alt="" /><h3>{view.name}</h3>
      <p className="muted">{view.brand} · {view.category} · ★ {view.rating}</p><p>{view.description}</p><b>₹{view.price}</b> <del>₹{view.mrp}</del> · {view.stock} in stock<br /><button className="btn" onClick={() => setView(null)}>Close</button></div></div>}
    {form && <div className="modal"><form className="modal-box" onSubmit={save}><h3>{form._id ? 'Edit product' : 'Add product'}</h3>
      <input className="input" placeholder="Name" value={form.name} onChange={ch('name')} required /><input className="input" placeholder="Brand" value={form.brand} onChange={ch('brand')} />
      <select className="input" value={form.category} onChange={ch('category')}>{['Men', 'Women', 'Casual', 'Kids'].map(c => <option key={c}>{c}</option>)}</select>
      <div className="two"><input className="input" type="number" placeholder="Price" value={form.price} onChange={ch('price')} required /><input className="input" type="number" placeholder="MRP" value={form.mrp} onChange={ch('mrp')} /></div>
      <input className="input" type="number" placeholder="Stock" value={form.stock} onChange={ch('stock')} required /><input className="input" placeholder="Image URL" value={form.image} onChange={ch('image')} />
      <textarea className="input" rows="3" placeholder="Description" value={form.description} onChange={ch('description')} />
      <div className="two"><button className="btn">Save changes</button><button type="button" className="btn ghost" onClick={() => setForm(null)}>Cancel</button></div></form></div>}
  </section>);
}
