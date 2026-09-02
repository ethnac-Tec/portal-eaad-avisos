import { Link } from 'react-router-dom';

export default function TopBar() {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoMark}>EAAD</span>
          <span style={styles.logoSub}>Avisos</span>
        </Link>
        <a href="https://eaad.tec.mx" target="_blank" rel="noreferrer" style={styles.portalLink}>
          Portal EAAD ↗
        </a>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    background: '#000000',
    color: '#fff',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '15px 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  logo: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
    textDecoration: 'none',
    color: '#fff',
  },
  logoMark: {
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 21,
    letterSpacing: '-0.02em',
  },
  logoSub: {
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#b3b3b3',
  },
  portalLink: {
    fontSize: 13,
    fontWeight: 600,
    color: '#dddddd',
    border: '1px solid #444444',
    padding: '7px 14px',
    borderRadius: 4,
    whiteSpace: 'nowrap',
  },
};
