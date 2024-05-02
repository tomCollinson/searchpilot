import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Routes, Route } from "react-router-dom";
import Layout from './components/layout';
import DetailForm from './components/detailForm';
import NewForm from './components/newForm';
import ProductList from './components/productList';

function App() {

  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProductList />} />
          <Route path="/product/:productId" element={<DetailForm/>} />
          <Route path="/product/add" element={<NewForm/>} />
        </Route>
      </Routes>
  );
}

export default App;