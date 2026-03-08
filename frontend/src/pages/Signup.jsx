import { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("ข้อมูลที่จะส่งไป Backend Controller:", formData);
    };

    return (
        // พื้นหลังโทนอวกาศมืด (Deep Space) พร้อมแสง Glow นุ่มๆ
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#030014] relative overflow-hidden">
            
            {/* แสง Glow ตกแต่งพื้นหลัง (ม่วง-น้ำเงิน) */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>

            {/* กล่อง Glassmorphism: เน้นความมน (3xl) และความใสที่เห็นแสงด้านหลัง */}
            <div className="bg-white/[0.02] backdrop-blur-3xl w-full max-w-[420px] rounded-[3rem] shadow-2xl p-10 border border-white/10 relative z-10">
                
                <div className="text-center mb-10">
                    <Link to="/">
                        <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
                        Sign Up
                        </h2>
                    </Link>
                    <p className="text-gray-400 mt-3 text-sm font-medium">สร้างบัญชีเพื่อเริ่มต้นใช้งาน</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Input: ใช้ทรงมนพิเศษ (2xl) และพื้นหลังใสมาก */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 ml-4 uppercase tracking-[0.2em]">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all placeholder-gray-600"
                            placeholder="Your Name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 ml-4 uppercase tracking-[0.2em]">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all placeholder-gray-600"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 ml-4 uppercase tracking-[0.2em]">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all placeholder-gray-600 text-center tracking-[0.5em]"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* ปุ่มสมัครสมาชิก: ไล่สี Gradient และใส่เงา Glow (Neon Effect) */}
                    <button
                        type="submit"
                        className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all transform hover:-translate-y-1 active:scale-95 mt-4"
                    >
                        Create Account
                    </button>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-gray-600 font-bold">หรือสมัครด้วย</div>
                    </div>

                    {/* ปุ่ม Social Login: ทรงมนรับกับส่วนบน */}
                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" className="flex items-center justify-center py-3 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white text-xs font-bold">
                            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4 mr-2" alt="Google" />
                            GOOGLE
                        </button>
                        <button type="button" className="flex items-center justify-center py-3 bg-[#1877F2]/10 border border-[#1877F2]/20 rounded-2xl hover:bg-[#1877F2]/20 transition-all text-white text-xs font-bold">
                            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-4 h-4 mr-2" alt="Facebook" />
                            FACEBOOK
                        </button>
                    </div>

                    <p className="text-center text-gray-500 text-sm mt-8"> 
                    เป็นสมาชิกอยู่แล้ว? 
                     <Link to="/login" className="text-purple-400 font-bold 
                     hover:text-purple-300 transition-colors ml-1">Log in</Link>
                    </p>

                </form>
            </div>
        </div>
    );
}

export default Signup;