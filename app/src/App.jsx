import { useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import NavSidebar from './components/NavSidebar';
import Feed from './pages/Feed';
import Detail from './pages/Detail';
import Calendar from './pages/Calendar';
import Enviar from './pages/Enviar';
import { completeSignInFromLinkIfPresent } from './professorAuth';

// Firebase's magic-link redirect always lands on the plain origin ("/"),
// never on "/#/enviar" (see professorAuth.js for why). This finishes the
// sign-in if that's what just happened, then routes to the form.
function AuthLinkHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    completeSignInFromLinkIfPresent()
      .then((user) => {
        if (user) navigate('/enviar', { replace: true });
      })
      .catch((err) => {
        console.error(err);
        alert(err.message || 'No se pudo completar el inicio de sesión.');
      });
  }, [navigate]);

  return null;
}

function App() {
  return (
    <HashRouter>
      <div style={styles.page}>
        <AuthLinkHandler />
        <TopBar />
        <div className="app-shell">
          <NavSidebar />
          <div className="content-col">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/aviso/:id" element={<Detail />} />
              <Route path="/calendario" element={<Calendar />} />
              <Route path="/enviar" element={<Enviar />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </HashRouter>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#ffffff',
    color: '#14171c',
    fontFamily: 'Arial, Helvetica, sans-serif',
    WebkitFontSmoothing: 'antialiased',
  },
};

export default App;
