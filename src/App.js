import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'App.css';
import { Landing } from 'pages/Landing';
import { Gallery } from 'pages/Gallery';
import { About } from 'pages/About';
import { Process } from 'pages/Process';
import { Careers } from 'pages/Careers';
import { Contact } from 'pages/Contact';
import { Nav } from 'components/Nav';
import { Footer } from 'components/Footer';
import { GallerySub } from 'pages/GallerySub';
import { Login } from 'pages/Login';

function AppContent() {
  const location = useLocation();
  const home = location.pathname === '/';
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Function to update scroll position
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isFullNav = home && scrollPosition < 100;

  return (
    <>
      <Nav full={isFullNav} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:subgallery" element={<GallerySub />} />
        <Route path="/process" element={<Process />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
