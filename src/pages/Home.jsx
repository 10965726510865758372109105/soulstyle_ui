import { Link } from 'react-router-dom';
const features = [['Free delivery', 'On every order above ₹999'], ['Special offers', 'Use SOLE10 for 10% off your first order'], ['Unique collections', 'Limited drops you won’t find elsewhere'],
  ['1,500+ happy customers', 'Families who keep coming back'], ['Secure payments', 'UPI, cards and cash on delivery']];
const cats = [['Men', 'Sharp, sturdy, everyday'], ['Women', 'Heels, flats and sneakers'], ['Casual', 'Easy slip-ons for weekends'], ['Kids', 'Tough soles for busy feet']];
export default function Home() {
  return (<>
    <section className="hero"><div className="hero-text">
      <h1>Shoes that feel as good as they look.</h1>
      <p>Sole Style is a family-run footwear shop in Erode. We pick every pair for comfort, durability and honest prices, so you can walk through the day with confidence.</p>
      <div className="hero-cta"><Link to="/products" className="btn big">Shop the collection</Link><Link to="/products?category=Kids" className="btn big ghost">Kids’ range</Link></div></div>
      <ul className="features">{features.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}</ul></section>
    <section className="section"><h2>Shop by category</h2><div className="cat-grid">
      {cats.map(([c, d]) => <Link key={c} to={`/products?category=${c}`} className="cat-card"><h3>{c}</h3><p>{d}</p><span>Browse {c.toLowerCase()} footwear</span></Link>)}</div></section>
    <section className="section about"><h2>About our shop</h2><p>We started with one small counter and a simple belief: great footwear should be comfortable, affordable and easy to buy. Today, over 1,500 customers trust us for quality they can feel, friendly help with sizing, and fast, free delivery.</p></section>
  </>);
}
