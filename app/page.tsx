"use client";

import { useMemo, useState } from "react";

type Product = { id: number; name: string; category: string; price: number; image: string; tag?: string };
const products: Product[] = [
  { id: 1, name: "The Everyday Linen Shirt", category: "Men", price: 320, image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=85", tag: "BESTSELLER" },
  { id: 2, name: "Sculpted Evening Dress", category: "Women", price: 480, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=85", tag: "NEW" },
  { id: 3, name: "Everyday Classic Sneakers", category: "Shoes", price: 550, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85" },
  { id: 4, name: "Structured Mini Bag", category: "Accessories", price: 390, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85" },
];
type CartItem = { product: Product; quantity: number };

const money = (amount: number) => new Intl.NumberFormat("en-GH", {
  style: "currency", currency: "GHS", maximumFractionDigits: 2
}).format(amount);

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);

  function add(product: Product) {
    setCart(old => {
      const found = old.find(item => item.product.id === product.id);
      return found
        ? old.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...old, { product, quantity: 1 }];
    });
    setNotice(`${product.name} added to your bag.`);
    setCartOpen(true);
  }
  function changeQty(id: number, delta: number) {
    setCart(old => old.map(item => item.product.id === id ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0));
  }
  async function checkout() {
    setNotice("");
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setNotice("Enter a valid email address to continue.");
      return;
    }
    if (!cart.length) return;
    setBusy(true);
    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          items: cart.map(item => ({ id: item.product.id, quantity: item.quantity }))
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not start payment.");
      window.location.href = data.authorization_url;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <main>
      <div className="announcement"><span>✦ Complimentary delivery on orders over GH₵500</span><span className="announce-center">SHOP SMART. DRESS BETTER.</span><span>Accra, Ghana&nbsp; · &nbsp;Worldwide style</span></div>
      <header className="header">
        <a className="brand" href="#"><span className="brand-mark">S</span><span>Sandy’s <b>Closet</b><small>FASHION · STYLE · YOU</small></span></a>
        <nav><a href="#home">Home</a><a href="#shop">Shop</a><a href="#collections">Collections</a><a href="#story">Our Story</a></nav>
        <button className="bag-button" onClick={() => setCartOpen(true)} aria-label="Open shopping bag">Bag <span>{count}</span></button>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">THE NEW SEASON EDIT · 2026</p>
          <h1>Style that<br/><i>speaks</i> for you.</h1>
          <p className="hero-desc">Thoughtful pieces. Effortless confidence.<br/>Find your next favourite look at Sandy’s Closet.</p>
          <a className="button dark" href="#shop">Explore the collection <span>↗</span></a>
        </div>
        <div className="hero-image" role="img" aria-label="Fashion editorial featuring a stylish model">
          <div className="image-caption">DRESS YOUR<br/>OWN WAY.</div>
        </div>
        <div className="hero-index">01 — 03 <span>NEW ARRIVALS</span></div>
      </section>

      <section className="service-row">
        <div><b>01</b><span>Curated for you<small>Pieces worth keeping</small></span></div>
        <div><b>02</b><span>Secure checkout<small>Powered by Paystack</small></span></div>
        <div><b>03</b><span>Made easy<small>Support when you need it</small></span></div>
      </section>

      <section className="shop-section" id="shop">
        <div className="section-heading"><div><p className="eyebrow">A LITTLE SOMETHING FOR EVERY YOU</p><h2>Shop the edit<span>.</span></h2></div><a href="#collections">VIEW ALL COLLECTIONS ↗</a></div>
        <div className="product-grid">
          {products.map((product, index) => <article className="product-card" key={product.id}>
            <div className="product-image-wrap">
              <img src={product.image} alt={product.name}/>
              {product.tag && <span className="tag">{product.tag}</span>}
              <button className="quick-add" onClick={() => add(product)}>ADD TO BAG +</button>
            </div>
            <div className="product-meta"><div><p>{product.category}</p><h3>{product.name}</h3></div><strong>{money(product.price)}</strong></div>
          </article>)}
        </div>
      </section>

      <section className="collection-strip" id="collections">
        <div><p className="eyebrow">FIND YOUR FEEL</p><h2>Good style has<br/><i>no rules.</i></h2><a href="#shop" className="button light">Shop all pieces ↗</a></div>
        <div className="strip-photo"></div>
      </section>
      <section className="story" id="story"><p className="eyebrow">THE SANDY’S CLOSET POINT OF VIEW</p><h2>Fashion is how you<br/>introduce yourself.</h2><p>We believe getting dressed should feel like the best part of your day. Discover pieces that bring your personal style to life.</p></section>
      <footer><a className="brand footer-brand" href="#">Sandy’s <b>Closet</b></a><span>FASHION · STYLE · YOU</span><span>© 2026 Sandy’s Closet. All rights reserved.</span></footer>

      {cartOpen && <div className="overlay" onClick={() => setCartOpen(false)}>
        <aside className="cart-drawer" onClick={e => e.stopPropagation()}>
          <div className="drawer-head"><h2>Your bag <span>({count})</span></h2><button onClick={() => setCartOpen(false)}>✕</button></div>
          {cart.length === 0 ? <div className="empty">Your bag is looking a little empty.<br/><a href="#shop" onClick={() => setCartOpen(false)}>Discover the collection ↗</a></div> :
            <><div className="cart-lines">{cart.map(item => <div className="cart-line" key={item.product.id}><img src={item.product.image} alt=""/><div className="line-info"><b>{item.product.name}</b><span>{money(item.product.price)}</span><div className="qty"><button onClick={() => changeQty(item.product.id, -1)}>−</button>{item.quantity}<button onClick={() => changeQty(item.product.id, 1)}>+</button></div></div></div>)}</div>
            <div className="checkout"><label htmlFor="email">Email address</label><input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}/><div className="total"><span>Subtotal</span><b>{money(total)}</b></div><small>Delivery fees, if applicable, are confirmed separately.</small><button className="button dark pay-button" onClick={checkout} disabled={busy}>{busy ? "Preparing secure checkout…" : "Continue to Paystack ↗"}</button>{notice && <p className="notice">{notice}</p>}</div></>}
        </aside>
      </div>}
    </main>
  );
}
