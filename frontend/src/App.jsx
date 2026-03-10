import { BrowserRouter , Route , Routes } from "react-router-dom"
import Home from "./pages/Home.jsx"
import Signup from "./pages/Signup.jsx"
import Login from "./pages/Login.jsx"
import Chat from "./pages/Chat.jsx";
function App() {
  return (
    <BrowserRouter>
        <Routes>
            {/* หน้าแรก Home */}
          <Route path="/" element={<Home/>}></Route>
            {/* หน้าสมัครสมาชิก */}
          <Route path="/signup" element={<Signup/>}></Route>
            {/* หน้า login */}
          <Route path="/login" element={<Login/>}></Route>
            {/* หน้ารายละเอียดสินค้า */}
          {/* <Route path="/product/:id" element={<ProductDetail/>}></Route> */}

          <Route path="/chat" element={<Chat/>} />

        </Routes>
    </BrowserRouter>
  )
}

export default App