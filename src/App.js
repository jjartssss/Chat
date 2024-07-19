import './App.css';
import Chat from './pages/Chat';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Room from './pages/Room';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/mainroom' element={<Room/>}></Route>
        <Route path='/chatroom' element={<Chat/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
