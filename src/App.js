import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'App.css';
import { Landing } from 'pages/Landing';
import { Gallery } from 'pages/Gallery';
import { About } from 'pages/About';
import { Process } from 'pages/Process';
import { Careers } from 'pages/Careers';
import { Contact } from 'pages/Contact';
import { Nav } from 'components/Nav';
import { Footer } from 'components/Footer';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/process" element={<Process />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
