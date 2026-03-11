import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, User, PackageOpen } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Chat = () => {
  const [activeTab, setActiveTab] = useState('GENERAL'); 
  const [chats, setChats] = useState([]); 
  const [activeChat, setActiveChat] = useState(null); 
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState('');
  const location = useLocation(); 
  const navigate = useNavigate();
  const messagesEndRef = useRef(null); 
  
  // 🟢 ดึงข้อมูลเรา (Me)
  let currentUser = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== "undefined") currentUser = JSON.parse(userStr);
  } catch (error) {
    console.error("Local storage error:", error);
  }
  
  // ID ของเราที่เป็น String ชัวร์ๆ
  const myId = String(currentUser?.id || currentUser?._id || "");

  // ดักจับการวาร์ปมาจากหน้า Community / Profile
  useEffect(() => {
    if (location.state?.receiverId) {
      const incomingType = location.state.chatType || 'GENERAL';
      setActiveTab(incomingType);

      const tempChat = {
        _id: 'new_temp_chat', 
        chatType: incomingType,
        participants: [{ 
            _id: location.state.receiverId, 
            username: location.state.receiverName || 'คู่สนทนา' 
        }]
      };
      
      setActiveChat(tempChat);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // โหลดรายชื่อแชท
  useEffect(() => {
    if (!myId) return;
    const fetchChats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/chats', { withCredentials: true }); 
        if (res.data.success) setChats(res.data.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, [myId]);

  // ⚡ REAL-TIME POLLING
  useEffect(() => {
    let interval;
    if (activeChat && activeChat._id !== 'new_temp_chat' && myId) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/chats/${activeChat._id}`, { withCredentials: true });
          if (res.data.success) {
            setMessages(res.data.data.messages);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
      interval = setInterval(fetchMessages, 3000); 
    } else if (activeChat?._id === 'new_temp_chat') {
        setMessages([]); 
    }
    return () => clearInterval(interval);
  }, [activeChat, myId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ส่งข้อความ
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !myId) return;

    const receiver = activeChat.participants.find(p => String(p._id) !== myId) || activeChat.participants[0];

    try {
      const res = await axios.post('http://localhost:5000/api/chats', {
        receiverId: receiver._id,
        content: newMessage,
        chatType: activeTab 
      }, { withCredentials: true });

      if (res.data.success) {
        // 🟢 ฝัง sender เป็น ID เราลงไปตรงๆ เพื่อให้ isMe ทำงานถูกต้องทันทีที่กดส่ง
        setMessages(prev => [...prev, { sender: myId, content: newMessage }]);
        setNewMessage('');
        
        if (activeChat._id === 'new_temp_chat') {
            const refreshRes = await axios.get('http://localhost:5000/api/chats', { withCredentials: true }); 
            if (refreshRes.data.success) {
                setChats(refreshRes.data.data);
                const realChat = refreshRes.data.data.find(c => 
                    c.participants.some(p => String(p._id) === String(receiver._id)) && c.chatType === activeTab
                );
                if(realChat) setActiveChat(realChat);
            }
        }
      }
    } catch (error) {
      console.error("Send error:", error);
    }
  };

  if (!myId) return <div className="fixed inset-0 flex items-center justify-center bg-[#05050f] text-white">กรุณาล็อกอิน</div>;

  const filteredChats = chats.filter(chat => (chat.chatType || 'GENERAL') === activeTab);

  return (
    <div className="fixed inset-0 flex bg-[#05050f] text-white overflow-hidden font-sans">
      
      {/* ฝั่งซ้าย: รายชื่อแชท */}
      <div className="w-1/3 border-r border-[#2a2a3e] flex flex-col bg-[#0a0a16]">
        <div className="p-4 border-b border-[#2a2a3e] flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 bg-[#151522] rounded-lg hover:bg-[#2a2a3e] transition">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">Messages</h2>
        </div>

        <div className="flex p-3 gap-2 border-b border-[#2a2a3e]">
          <button onClick={() => { setActiveTab('GENERAL'); setActiveChat(null); }} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'GENERAL' ? 'bg-[#4361ee] text-white' : 'bg-[#151522] text-gray-400'}`}>ทั่วไป</button>
          <button onClick={() => { setActiveTab('TRADE'); setActiveChat(null); }} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'TRADE' ? 'bg-[#8b2cf5] text-white' : 'bg-[#151522] text-gray-400'}`}>เทรด/ซื้อ</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeChat?._id === 'new_temp_chat' && activeChat.chatType === activeTab && (
             <div className="p-4 border-b border-[#2a2a3e]/50 flex items-center gap-3 bg-[#151522]">
                <div className="w-10 h-10 rounded-full bg-[#151522] border border-[#2a2a3e] flex items-center justify-center text-[#4361ee] font-bold">
                    {activeChat.participants.find(p => String(p._id) !== myId)?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                   <h3 className="font-bold truncate text-[#4361ee]">{activeChat.participants.find(p => String(p._id) !== myId)?.username}</h3>
                   <p className="text-[10px] text-blue-400 animate-pulse">เริ่มคุยได้เลย...</p>
                </div>
             </div>
          )}
          {filteredChats.map(chat => {
            const otherUser = chat.participants.find(p => String(p._id) !== myId) || chat.participants[0];
            return (
              <div key={chat._id} onClick={() => setActiveChat(chat)} className={`p-4 border-b border-[#2a2a3e]/50 cursor-pointer flex items-center gap-3 transition-all ${activeChat?._id === chat._id ? 'bg-[#151522]' : 'hover:bg-[#12121e]'}`}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#8b2cf5] to-[#4361ee] flex items-center justify-center shrink-0">
                  {otherUser?.imageProfile ? <img src={otherUser.imageProfile} className="w-11 h-11 rounded-full object-cover" /> : <User className="w-6 h-6 text-white" />}
                </div>
                <div className="overflow-hidden text-sm flex-1">
                  <div className="flex justify-between items-center">
                     <h3 className="font-bold truncate">{otherUser?.username}</h3>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{chat.lastMessage || 'เริ่มการสนทนา'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ฝั่งขวา: ห้องสนทนา */}
      <div className="flex-1 flex flex-col bg-[#05050f]">
        {activeChat ? (
           <>
            <div className="p-4 bg-[#0a0a16] border-b border-[#2a2a3e] flex items-center justify-between shadow-lg">
                <h3 className="font-bold text-lg">{activeChat.participants.find(p => String(p._id) !== myId)?.username}</h3>
                <span className="text-[10px] bg-[#151522] px-3 py-1 rounded-full border border-[#2a2a3e] text-gray-400 font-bold uppercase tracking-wider">{activeTab}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                    // 🟢 เช็คแบบครอบคลุม: msg.sender อาจจะเป็น ID (String) หรือ Object { _id: ... }
                    const msgSenderId = String(msg.sender?._id || msg.sender || "");
                    const isMe = msgSenderId === myId;
                    
                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full animate-in fade-in slide-in-from-bottom-1 duration-300`}>
                            <div className={`max-w-[75%] p-3 rounded-2xl shadow-md ${
                                isMe 
                                ? 'bg-gradient-to-r from-[#8b2cf5] to-[#4361ee] text-white rounded-tr-none' 
                                : 'bg-[#151522] border border-[#2a2a3e] text-gray-200 rounded-tl-none'
                            }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-[#0a0a16] border-t border-[#2a2a3e] flex gap-2">
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="พิมพ์ข้อความ..." 
                    className="flex-1 bg-[#12121e] border border-[#2a2a3e] rounded-full px-5 py-2.5 focus:outline-none focus:border-[#4361ee] text-sm transition-all" 
                />
                <button 
                    type="submit" 
                    disabled={!newMessage.trim()} 
                    className="w-10 h-10 bg-[#4361ee] rounded-full flex items-center justify-center hover:bg-[#8b2cf5] transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
                >
                    <Send className="w-4 h-4 text-white ml-0.5" />
                </button>
            </form>
           </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600 space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#0a0a16] border border-[#2a2a3e] flex items-center justify-center">
                <Send className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm font-medium">เลือกเพื่อนในรายการเพื่อเริ่มการสนทนา</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;