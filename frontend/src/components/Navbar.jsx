import React from 'react';
import { Search, Bell, MessageSquare, User, LogOut, ClipboardList, Settings, Store, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo0.png';

const Navbar = ({ currentUser, showDropdown, setShowDropdown }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a16] border-b border-[#2a2a3e] px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        
        <Link to="/" className="flex items-center gap-2 cursor-pointer w-fit">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8b2cf5] to-[#4361ee] flex items-center justify-center shadow-[0_0_15px_rgba(139,44,245,0.4)]">
            <img src={logo} alt="TradeApp Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8b2cf5] to-[#4361ee]">
            Shoplify
          </span>
        </Link>

        <div className="flex-1 max-w-3xl relative">
          <input 
            type="text" 
            placeholder="ค้นหาสินค้า หรือ ร้านค้า..." 
            className="w-full bg-[#151522] border border-[#2a2a3e] rounded-md py-2.5 pl-5 pr-12 focus:outline-none focus:border-[#8b2cf5] transition-all text-sm placeholder-gray-500"
          />
          <button className="absolute right-2 top-1.5 p-1.5 bg-[#8b2cf5] rounded-md hover:bg-[#7220c7] transition">
            <Search className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="flex items-center gap-5 w-auto justify-end">
          
          <Link to="/shops" className="hidden md:flex items-center gap-2 text-gray-300 hover:text-[#8b2cf5] font-medium transition-colors mr-2">
            <Store className="w-5 h-5" />
            ร้านค้า
          </Link>

          <div className="relative cursor-pointer hover:text-[#8b2cf5] transition">
            <Bell className="w-6 h-6 text-gray-300" />
          </div>
          <div className="relative cursor-pointer hover:text-[#8b2cf5] transition">
            <MessageSquare className="w-6 h-6 text-gray-300" />
          </div>
          <div className="h-8 w-px bg-[#2a2a3e] mx-1"></div>
          
          <div className="relative">
            {currentUser ? (
              <div 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className={`w-9 h-9 rounded-full bg-[#151522] border-2 ${currentUser.role === 'admin' ? 'border-[#8b2cf5]' : 'border-[#2a2a3e]'} flex items-center justify-center overflow-hidden group-hover:border-[#8b2cf5] transition-all`}>
                   <User className={`w-5 h-5 ${currentUser.role === 'admin' ? 'text-[#8b2cf5]' : 'text-gray-400'} group-hover:text-white`} />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate max-w-[100px]">
                  {currentUser.username}
                </span>

                {showDropdown && (
                  <div className="absolute right-0 top-12 w-56 bg-[#12121e] border border-[#2a2a3e] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-[#2a2a3e] bg-[#0a0a16]">
                      <p className="text-sm font-bold text-white truncate">{currentUser.username}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{currentUser.email}</p>
                    </div>
                    <div className="p-2">
                      {currentUser.role === 'admin' && (
                        <Link to="/admin/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-[#8b2cf5] hover:bg-[#8b2cf5]/10 rounded-lg transition-colors mb-1 font-bold">
                          <Shield className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#1c1c2b] hover:text-[#8b2cf5] rounded-lg transition-colors">
                        <User className="w-4 h-4" /> โปรไฟล์ของฉัน
                      </Link>
                      <Link to="/orders" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#1c1c2b] hover:text-[#8b2cf5] rounded-lg transition-colors mt-1">
                        <ClipboardList className="w-4 h-4" /> ประวัติการสั่งซื้อ
                      </Link>
                      <Link to="/account-settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#1c1c2b] hover:text-[#8b2cf5] rounded-lg transition-colors mt-1">
                        <Settings className="w-4 h-4" /> ตั้งค่าบัญชี
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4" /> ออกจากระบบ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 cursor-pointer hover:text-[#8b2cf5] transition group">
                <div className="w-9 h-9 rounded-full bg-[#151522] border-2 border-[#2a2a3e] flex items-center justify-center overflow-hidden group-hover:border-[#8b2cf5]">
                   <User className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </div>
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
