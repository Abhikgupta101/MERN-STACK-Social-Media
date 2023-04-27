import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import NewPassword from './pages/NewPassword';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/' element={<Feed />} />
        <Route path='/profile/:id' element={<Profile />} />
        < Route path='/password/reset' element={<ForgotPassword />} />
        < Route path='/password/reset/:id/:token' element={<NewPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
