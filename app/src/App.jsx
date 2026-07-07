import { HashRouter, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import Feed from './pages/Feed';
import Detail from './pages/Detail';

function App() {
  return (
    <HashRouter>
      <div style={styles.page}>
        <TopBar />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/aviso/:id" element={<Detail />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#eef0f3',
    color: '#14171c',
    fontFamily: "'Public Sans', system-ui, sans-serif",
    WebkitFontSmoothing: 'antialiased',
  },
};

export default App;
