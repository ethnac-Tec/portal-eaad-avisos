import { HashRouter, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import NavSidebar from './components/NavSidebar';
import Feed from './pages/Feed';
import Detail from './pages/Detail';
import Calendar from './pages/Calendar';

function App() {
  return (
    <HashRouter>
      <div style={styles.page}>
        <TopBar />
        <div className="app-shell">
          <NavSidebar />
          <div className="content-col">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/aviso/:id" element={<Detail />} />
              <Route path="/calendario" element={<Calendar />} />
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
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    WebkitFontSmoothing: 'antialiased',
  },
};

export default App;
