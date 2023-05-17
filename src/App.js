import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CategoryPage from './components/categoryPage';
import ProductPage from './components/productsPage';

import './App.css';

function App() {

  return (
    <BrowserRouter>
    <Routes>
      {/* <Route path="/" element={<Layout />}> */}
      {/* <Route index element={<Home />} /> */}
      <Route path="products" element={<ProductPage />} />
      <Route path="categories" element={<CategoryPage />} />
      {/* <Route path="*" element={<NoPage />} /> */}
      {/* </Route> */}
    </Routes>
  </BrowserRouter>
  );
}

export default App;
