import { Link } from 'react-router-dom';
import { COLORS } from '../data';

export default function NewsCard({ item }) {
  const color = COLORS[item.carrera] || '#c0562b';

  return (
    <Link to={`/aviso/${item.id}`} style={styles.card}>
      <div style={styles.imageWrap}>
        <img src={item.image} alt="" style={styles.image} />
        <div style={{ ...styles.colorBar, background: color }} />
      </div>
      <div style={styles.body}>
        <div style={styles.metaRow}>
          {item.carrera && <span style={{ ...styles.carrera, color }}>{item.carrera}</span>}
          {item.carrera && item.tipo && <span style={styles.dot} />}
          {item.tipo && <span style={styles.tipo}>{item.tipo}</span>}
        </div>
        <h3 style={styles.title}>{item.title}</h3>
        <p style={styles.summary}>{item.summary}</p>
        <div style={styles.footer}>
          <span style={styles.autor}>{item.autor}</span>
          <span style={styles.fecha}>{item.fecha}</span>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    border: '1px solid #dfe3ea',
    animation: 'eaadFade 0.5s ease both',
    color: 'inherit',
    textDecoration: 'none',
  },
  imageWrap: {
    position: 'relative',
    aspectRatio: '16 / 10',
    background: '#dce1e8',
  },
  image: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  colorBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 5,
    width: '100%',
  },
  body: {
    padding: '18px 20px 22px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    marginBottom: 11,
  },
  carrera: {
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: '50%',
    background: '#c0c8d4',
  },
  tipo: {
    fontSize: 11,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: '#6b7484',
    fontWeight: 600,
  },
  title: {
    margin: 0,
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 20,
    lineHeight: 1.14,
    letterSpacing: '-0.01em',
    color: '#14171c',
  },
  summary: {
    margin: '10px 0 0',
    fontSize: 14,
    lineHeight: 1.55,
    color: '#55627a',
    flex: 1,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    paddingTop: 14,
    borderTop: '1px solid #e8ebf0',
    fontSize: '12.5px',
    color: '#6b7484',
  },
  autor: {
    fontWeight: 700,
    color: '#14171c',
  },
  fecha: {
    marginLeft: 'auto',
  },
};
