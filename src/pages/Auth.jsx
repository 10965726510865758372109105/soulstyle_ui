import { useState } from 'react'; import { useNavigate } from 'react-router-dom';
import { api } from '../api.js'; import { useApp } from '../context.jsx';
export default function Auth() {
  const [signup, setSignup] = useState(false), [f, setF] = useState({ name: '', email: '', password: '', mobile: '', address: '' }), [err, setErr] = useState(''), { setAuth } = useApp(), nav = useNavigate();
  const ch = k => e => setF({ ...f, [k]: e.target.value });
  const submit = async e => { e.preventDefault(); setErr('');
    if (signup && !/^[6-9]\d{9}$/.test(f.mobile)) return setErr('Enter a valid 10-digit mobile number');
    try { const d = await api(signup ? '/auth/signup' : '/auth/login', { method: 'POST', body: f }); setAuth({ token: d.user.id, user: d.user }); nav(d.user.role === 'admin' ? '/admin' : '/products'); } catch (x) { setErr(x.message); } };
  return (<section className="section"><form className="auth" onSubmit={submit}><h2>{signup ? 'Create your account' : 'Welcome back'}</h2>
    {signup && <input className="input" placeholder="Full name" value={f.name} onChange={ch('name')} required />}
    <input className="input" type="email" placeholder="Email" value={f.email} onChange={ch('email')} required />
    <input className="input" type="password" placeholder="Password (min 6 characters)" value={f.password} onChange={ch('password')} required />
    {signup && <><input className="input" placeholder="Mobile number" value={f.mobile} onChange={ch('mobile')} required /><textarea className="input" rows="3" placeholder="Delivery address" value={f.address} onChange={ch('address')} required /></>}
    {err && <p className="error">{err}</p>}<button className="btn full">{signup ? 'Sign up' : 'Log in'}</button>
    <p className="muted center">{signup ? 'Already have an account?' : 'New here?'} <button type="button" className="link" onClick={() => { setSignup(!signup); setErr(''); }}>{signup ? 'Log in' : 'Sign up'}</button></p></form></section>);
}