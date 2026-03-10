import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Settings from './pages/Settings'; 
import CreateShop from './pages/CreateShop';
// 🟢 1. Import หน้า Shops เข้ามา
import Shops from './pages/Shops'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/create-shop" element={<CreateShop />} />
        
        {/* 🟢 2. เพิ่ม Route สำหรับหน้า Shops */}
        <Route path="/shops" element={<Shops />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;