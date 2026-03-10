import { useState } from "react";
import { Link } from "react-router-dom";

function Chat() {
  // ข้อมูลจำลองสำหรับแชท
  const [messages, setMessages] = useState([
    { id: 1, text: "สวัสดีครับ สนใจสินค้าชิ้นไหนสอบถามได้เลยครับ", sender: "shop", time: "10:00" },
    { id: 2, text: "WD_BLACK P10 ตัว 2TB ยังมีของไหมครับ?", sender: "me", time: "10:05" },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if(!inputText.trim()) return;
    
    // พิมพ์แล้วเด้งขึ้นจอฝั่งเราทันที
    setMessages([...messages, { id: Date.now(), text: inputText, sender: "me", time: "10:06" }]);
    setInputText("");
  };

  return (
    // พื้นหลังอวกาศมืดมิด
    <div className="min-h-screen bg-[#030014] text-white p-4 md:p-8 relative overflow-hidden flex items-center justify-center">
        
        {/* แสง Glow เพิ่มมิติ */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>

        {/* กล่องแชทตัวแม่: Glassmorphism แบ่ง 2 ฝั่ง */}
        <div className="w-full max-w-6xl h-[85vh] bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl flex overflow-hidden relative z-10">

            {/* ฝั่งซ้าย: รายชื่อติดต่อ (ซ่อนในจอมือถือ) */}
            <div className="hidden md:flex flex-col w-1/3 border-r border-white/10 bg-white/[0.01]">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">ข้อความ</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    
                    {/* คนที่กำลังคุยด้วย (Active) */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 border border-white/20 cursor-pointer shadow-lg shadow-purple-500/10">
                        <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-lg">A</div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold truncate text-white">App Dev Shop</h3>
                            <p className="text-xs text-purple-300 truncate mt-0.5">WD_BLACK P10 ตัว 2TB ยัง...</p>
                        </div>
                    </div>

                    {/* รายชื่ออื่นๆ */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 cursor-pointer transition">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center font-bold text-gray-400">J</div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-300 truncate">JIB Computer</h3>
                            <p className="text-xs text-gray-500 truncate mt-0.5">ส่งสินค้าให้แล้วนะครับ ขอบคุณครับ</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* ฝั่งขวา: ห้องแชทหลัก */}
            <div className="flex-1 flex flex-col">
                
                {/* Header ห้องแชท */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        {/* โชว์รูปโปรไฟล์เฉพาะจอมือถือ (เพราะจอคอมมีฝั่งซ้ายแล้ว) */}
                        <div className="w-10 h-10 md:hidden bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold">A</div>
                        <div>
                            <h3 className="font-bold text-lg text-white">App Dev Shop</h3>
                            <p className="text-xs text-green-400 flex items-center gap-1.5 mt-0.5 font-medium">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span> Online
                            </p>
                        </div>
                    </div>
                    <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition px-4 py-2 hover:bg-white/5 rounded-full">✕ ปิด</Link>
                </div>

                {/* พื้นที่ข้อความวิ่งไปมา */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] md:max-w-[65%] p-4 md:p-5 rounded-[1.5rem] ${
                                msg.sender === "me"
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-sm shadow-lg shadow-purple-500/20"
                                : "bg-white/5 text-gray-200 rounded-bl-sm border border-white/10"
                            }`}>
                                <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                                <span className={`text-[10px] block mt-2 ${msg.sender === "me" ? "text-white/60 text-right" : "text-gray-500 text-left"}`}>
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ช่องพิมพ์ข้อความด้านล่าง */}
                <div className="p-4 md:p-6 border-t border-white/10 bg-white/[0.01]">
                    <form onSubmit={handleSend} className="flex gap-3 relative max-w-4xl mx-auto">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-full pl-6 pr-16 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm placeholder-gray-500 shadow-inner"
                            placeholder="พิมพ์ข้อความที่นี่..."
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 aspect-square bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-md"
                        >
                            ➤
                        </button>
                    </form>
                </div>
            </div>

        </div>
    </div>
  );
}

export default Chat;