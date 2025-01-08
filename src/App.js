import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import { AuthProvider } from "./context/AuthContext";
import Chat from './components/Chat';
import Signup from './pages/Signup';
import Home from './pages/Welcome'
import Profile from './components/profile'
import ReceiverList from './components/ReceiverList';

function App() {
  return (
    <div className="App">
      
      <AuthProvider>
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                {/* <Route path="/Category" element={<Category />} /> */}
                <Route path="/Signup" element={<Signup />} />
                <Route path="/chat" element={<Chat />}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/recivers" element={<ReceiverList/>}/>
                <Route path="/chat" element={<Chat/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </div>
  );
}

export default App;