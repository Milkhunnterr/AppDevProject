import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, CreditCard, ChevronRight, Package } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, []);

  const updateQuantity = (id, delta) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-[#05050f] text-white font-sans pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a16]/80 backdrop-blur-md border-b border-[#2a2a3e] px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-[#151522] rounded-full hover:bg-[#2a2a3e] transition text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8b2cf5]" /> ตะกร้าสินค้า
            </h1>
          </div>
          <span className="text-sm text-gray-400">{cartItems.length} รายการ</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[#12121e] border border-[#2a2a3e] rounded-3xl border-dashed">
            <ShoppingBag className="w-16 h-16 text-[#2a2a3e] mb-4" />
            <p className="text-gray-400 font-medium text-lg">ตะกร้าของคุณยังว่างเปล่า</p>
            <Link to="/" className="text-[#8b2cf5] mt-4 hover:underline font-bold">ไปเลือกช้อปไอเทมกันเถอะ!</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-[#12121e] border border-[#2a2a3e] rounded-2xl p-4 flex gap-4 hover:border-[#8b2cf5]/50 transition shadow-lg">
                  <div className="w-24 h-24 rounded-xl bg-[#1c1c2b] overflow-hidden flex-shrink-0 border border-[#2a2a3e]">
                    <img src={item.images?.[0] || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-100 line-clamp-1">{item.productName}</h3>
                        <button onClick={() => removeItem(item._id)} className="p-1 text-gray-500 hover:text-red-500 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#8b2cf5] font-semibold mt-1">฿{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-[#0a0a16] border border-[#2a2a3e] rounded-lg p-1">
                        <button onClick={() => updateQuantity(item._id, -1)} className="p-1 hover:text-[#8b2cf5] transition"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="px-3 text-sm font-bold w-10 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)} className="p-1 hover:text-[#8b2cf5] transition"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <p className="font-bold text-sm">฿{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-[#12121e] border border-[#2a2a3e] rounded-2xl p-6 shadow-xl sticky top-24">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">สรุปยอดคำสั่งซื้อ</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>ราคาสินค้า</span>
                    <span>฿{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>ค่าจัดส่ง</span>
                    <span className="text-green-400">ฟรี</span>
                  </div>
                  <div className="border-t border-[#2a2a3e] pt-3 flex justify-between font-black text-lg">
                    <span>ยอดรวมสุทธิ</span>
                    <span className="text-[#8b2cf5]">฿{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/payment', { state: { totalAmount: calculateTotal(), items: cartItems } })}
                  className="w-full py-4 bg-gradient-to-r from-[#8b2cf5] to-[#4361ee] rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(139,44,245,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" /> ชำระเงิน
                </button>
                <Link to="/" className="w-full mt-3 py-3 border border-[#2a2a3e] rounded-xl font-bold text-xs text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-all">
                  เลือกสินค้าเพิ่มเติม <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="bg-[#8b2cf5]/10 border border-[#8b2cf5]/30 rounded-2xl p-4 flex items-start gap-3">
                 <Package className="w-5 h-5 text-[#8b2cf5] mt-0.5" />
                 <div>
                    <p className="text-xs font-bold text-[#8b2cf5]">Free Shipping</p>
                    <p className="text-[10px] text-gray-400 mt-1">คุณได้รับสิทธิ์ส่งฟรีเมื่อซื้อสินค้าชิ้นแรกกับร้านค้าทางการ</p>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
