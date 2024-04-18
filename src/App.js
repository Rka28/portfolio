import Home from "./components/Home/Home";
import Contact from "./components/Contact/Contact";
import Portfolio from "./components/Portofilo/Portfolio";
import { Routes, Route } from 'react-router-dom';
import './components/Contact/Contact.scss';
import './components/Home/Home.scss';
import './components/Portofilo/Portfolio.scss';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Contact' element={<Contact />} />
        <Route path='/Portfolio' element={<Portfolio />} />
      </Routes>
    </div>
  );
}


export default App;
