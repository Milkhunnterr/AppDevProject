import { Link } from "react-router-dom";

function ProductDetail() {
  return (
    <div className="min-h-screen bg-[#030014] text-white p-4 md:p-10">
      {/* 1. แถบนำทางด้านบน */}
      <nav className="text-sm text-gray-500 mb-8 container mx-auto">
        <Link to="/" className="hover:text-purple-400">หน้าแรก</Link> / 
        <span className="ml-2 text-gray-300">รายละเอียดสินค้า</span>
      </nav>

      <main className="container mx-auto max-w-6xl">
        {/* กล่อง Glassmorphism ตัวแม่ */}
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row p-8 md:p-12 gap-12">
          
          {/* ฝั่งซ้าย: รูปภาพสินค้า */}
          <div className="w-full md:w-1/2 space-y-4">
             <div className="aspect-square bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/5 overflow-hidden">
                <span className="text-gray-500">BIG IMAGE VIEW</span>
             </div>
             <div className="flex gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-20 h-20 bg-white/5 rounded-2xl border border-white/10 cursor-pointer hover:border-purple-500 transition"></div>
                ))}
             </div>
          </div>

          {/* ฝั่งขวา: ข้อมูลสินค้า */}
          <div className="w-full md:w-1/2 space-y-8">
            <div>
              <h1 className="text-3xl font-black tracking-tight leading-tight">
                WD_BLACK P10 2-6 TB GAME DRIVE USB 3.2 Gen 1 External Harddisk
              </h1>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-yellow-400 text-sm">★★★★★ 4.9</span>
                <span className="text-gray-500 text-sm border-l border-gray-700 pl-4">295 รีวิว</span>
              </div>
            </div>

            {/* ส่วนของราคา */}
            <div className="bg-white/5 p-6 rounded-3xl">
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                ฿3,690 - ฿5,290
              </span>
            </div>

            {/* ตัวเลือกสินค้า (มนๆ) */}
            <div className="space-y-4">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">ความจุ</label>
               <div className="flex flex-wrap gap-3">
                  {['2TB', '4TB', '5TB', '6TB'].map(size => (
                    <button key={size} className="px-6 py-2 border border-white/10 rounded-full hover:bg-purple-600 transition font-medium">
                      {size}
                    </button>
                  ))}
               </div>
            </div>

            {/* ปุ่มกดซื้อ */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
               <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition flex items-center justify-center gap-2">
                 🛒 เพิ่มไปยังรถเข็น
               </button>
               <button className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                 ซื้อสินค้า
               </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default ProductDetail;