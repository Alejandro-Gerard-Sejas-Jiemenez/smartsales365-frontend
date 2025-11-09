import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/apiClient";
import { FaSnowflake, FaSoap, FaCoffee, FaWind, FaBlender, FaBroom } from "react-icons/fa";
import ProductoCard from "../components/ProductoCard";

function getCategoryIcon(nombre) {
  const name = nombre.toLowerCase();
  if (name.includes("refrigerador")) return <FaSnowflake className="text-3xl text-blue-500" />;
  if (name.includes("lavadora")) return <FaSoap className="text-3xl text-indigo-500" />;
  if (name.includes("microonda")) return <FaBlender className="text-3xl text-pink-500" />;
  if (name.includes("aire")) return <FaWind className="text-3xl text-cyan-500" />;
  if (name.includes("aspiradora")) return <FaBroom className="text-3xl text-green-500" />;
  if (name.includes("cafetera")) return <FaCoffee className="text-3xl text-yellow-600" />;
  return <FaSnowflake className="text-3xl text-gray-400" />;
}

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    api.get("/api/categorias/").then(res => setCategories(Array.isArray(res) ? res : []));
    api.get("/api/productos/").then(res => setProducts(Array.isArray(res) ? res : []));
  }, []);

  // Filtrar productos por categoría seleccionada
  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoria === selectedCategory)
    : products;

  return (
    <div>
      <main style={{padding: '28px 16px'}}>
        <div style={{maxWidth:1100, margin:'0 auto'}}>
          {/* Categories header */}
          <section style={{textAlign:'center', padding:'24px 0 8px'}}>
            <h2 style={{fontSize:28, margin:0}}>Explora por categorías</h2>
            <p style={{color:'#6b7280', marginTop:8}}>Encuentra exactamente lo que necesitas para tu hogar</p>
          </section>

          {/* Categories row */}
          <section style={{display:'flex', gap:16, marginTop:20, flexWrap:'wrap', justifyContent:'center'}}>
            {categories.map(cat => (
              <button
                key={cat.id}
                style={{
                  background: selectedCategory === cat.id ? '#e0f2fe' : '#fff',
                  border: selectedCategory === cat.id ? '2px solid #0ea5a5' : '2px solid #f1f5f9',
                  borderRadius:12,
                  padding:18,
                  width:170,
                  boxShadow:'0 6px 18px rgba(15,23,42,0.04)',
                  textAlign:'center',
                  cursor:'pointer',
                  outline: selectedCategory === cat.id ? '2px solid #0ea5a5' : 'none',
                  transition:'all 0.2s'
                }}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              >
                <div style={{height:74, width:74, borderRadius:10, background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 8px'}}>
                  {getCategoryIcon(cat.nombre)}
                </div>
                <div style={{fontWeight:600}}>{cat.nombre}</div>
                <small style={{display:'block', color:'#6b7280', marginTop:6}}>{cat.estado ? 'Activa' : 'Inactiva'}</small>
              </button>
            ))}
          </section>

          {/* Products header */}
          <section style={{textAlign:'center', marginTop:44}}>
            <h2 style={{fontSize:26, margin:0}}>Productos destacados</h2>
            <p style={{color:'#6b7280', marginTop:8}}>Los electrodomésticos más populares con las mejores ofertas</p>
          </section>

          {/* Products grid */}
          <section style={{marginTop:20, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:18}}>
            {filteredProducts.map(p => (
              <ProductoCard key={p.id} producto={p} />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
