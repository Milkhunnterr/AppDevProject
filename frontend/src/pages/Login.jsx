import { useState } from "react";
import { Link } from "react-router-dom"; // นำเข้า Link เพื่อกดกลับไปหน้า Signup หรือ Home

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("พยายามเข้าสู่ระบบด้วย:", formData);
        // เดี๋ยวเราจะใช้ axios.post('/api/auth/login', formData) เชื่อมกับ Controller
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#030014] relative overflow-hidden">
            {/* แสง Glow พื้นหลังเหมือนหน้า Signup */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>

            {/* กล่อง Login Glassmorphism */}
            <div className="bg-white/[0.02] backdrop-blur-3xl w-full max-w-[400px] rounded-[3rem] shadow-2xl p-10 border border-white/10 relative z-10">
                
                <div className="text-center mb-10">
                    <Link to="/">
                        <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                        Log In
                         </h2>
                    </Link>
                    <p className="text-gray-400 mt-3 text-sm font-medium">ยินดีต้อนรับกลับมา!</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ช่องอีเมล */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 ml-4 uppercase tracking-[0.2em]">Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    {/* ช่องรหัสผ่าน */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 ml-4 uppercase tracking-[0.2em]">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all transform hover:-translate-y-1 active:scale-95"
                    >
                        Sign In
                    </button>

                    <p className="text-center text-gray-500 text-xs mt-8">
                        ยังไม่มีบัญชี? <Link to="/signup" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;