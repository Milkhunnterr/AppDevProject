import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
   // ตัวแม่: พื้นหลังเทาอ่อนทั้งหน้าจอ
    <div className="min-h-screen bg-gray-100">
      
      {/* 1. Navbar สีส้ม */}
      <header className="bg-[#ee4d2d] text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-3xl font-bold tracking-wider cursor-pointer">
            App Dev
          </div>

          <div className="flex-1 mx-8 flex shadow-sm">
            <input 
              type="text" 
              placeholder="ค้นหาสินค้า หรือ โพสต์..." 
              className="w-full px-4 py-2 text-black bg-white rounded-l-sm focus:outline-none"
            />
            <button className="bg-[#fb5533] px-6 py-2 rounded-r-sm hover:bg-orange-600 transition flex items-center justify-center">
              🔍
            </button>
          </div>

          <div className="flex items-center space-x-6 text-sm font-medium">
            <button className="hover:text-gray-200">🛒 ตะกร้า</button>
            <div className="h-4 w-px bg-white/50"></div>
            <Link to="/signup" className='hover:text-gray-200 cursor-pointer'>สมัครใหม่</Link>
            <Link to="/login" className='hover:text-gray-200 cursor-pointer'>เข้าสู่ระบบ</Link>
          </div>
        </div>
      </header>

      {/* 2. เนื้อหาหลัก (Main) */}
      <main className="container mx-auto px-4 py-8">
        
        {/* Banner (Hot Promotion) - ปรับขนาดให้พอดี */}
        <div className="w-full h-40 md:h-64 bg-orange-200 rounded-sm flex items-center justify-center mb-8 shadow-sm border border-orange-300">
           <h2 className="text-orange-700 font-bold text-3xl">Hot Promotion</h2>
        </div>

        {/* หัวข้อสินค้าแนะนำ */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-6 bg-orange-600"></div> {/* ขีดสีส้มข้างหน้า */}
            <h2 className="text-xl font-bold text-gray-800 uppercase">สินค้าแนะนำ</h2>
          </div>
          <button className="text-orange-600 text-sm font-medium hover:underline">ดูทั้งหมด {'>'}</button>
        </div>

        {/* Grid สินค้า */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
            <div key={item} className="bg-white rounded-sm shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer border border-transparent hover:border-orange-600 overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <span className="text-gray-300 text-xs font-bold uppercase">Image</span>
              </div>
              <div className="p-3">
                <p className="text-sm text-gray-700 line-clamp-2 mb-4 h-10">
                  ชื่อสินค้าทดสอบรายการที่ {item} จาก Post Controller
                </p>
                <div className="flex items-end justify-between">
                  <span className="text-orange-600 font-bold text-lg">฿99</span>
                  <span className="text-[10px] text-gray-400 pb-1">ขายแล้ว 1.2k</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

    </div>
  )
}

export default Home