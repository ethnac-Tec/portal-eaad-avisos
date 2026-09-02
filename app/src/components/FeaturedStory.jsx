import { Link } from 'react-router-dom';
import { COLORS } from '../data';

export default function FeaturedStory({ item }) {
  const color = COLORS[item.carrera] || '#c0562b';
  const footerParts = [item.autor, item.campus, item.fecha].filter(Boolean);

  return (
    <Link to={`/aviso/${item.id}`} style={styles.article}>
      <div style={styles.imageWrap}>
        <img src={item.image} alt="" style={styles.image} />
        <div style={{ ...styles.colorBar, background: color }} />
      </div>
      <div style={styles.content}>
        <div style={styles.metaRow}>
          {item.carrera && <span style={{ ...styles.carrera, color }}>{item.carrera}</span>}
          {item.carrera && item.tipo && <span style={styles.dot} />}
          {item.tipo && <span style={styles.tipo}>{item.tipo}</span>}
        </div>
        <h2 style={styles.title}>{item.title}</h2>
        <p style={styles.summary}>{item.summary}</p>
        <div style={styles.footer}>
          {footerParts.map((part, i) => (
            <span key={i} style={i === 0 ? styles.autor : undefined}>
              {i > 0 && '· '}
              {part}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

const styles = {
  article: {
    cursor: 'pointer',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 0,
    background: '#fff',
    border: '1px solid #dfe3ea',
    marginBottom: 44,
    animation: 'eaadFade 0.5s ease both',
    color: 'inherit',
    textDecoration: 'none',
  },
  imageWrap: {
    position: 'relative',
    minHeight: 320,
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
    height: 6,
    width: '100%',
  },
  content: {
    padding: 'clamp(26px, 4vw, 46px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  carrera: {
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: '#b3bccb',
  },
  tipo: {
    fontSize: 12,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#55627a',
    fontWeight: 600,
  },
  title: {
    margin: 0,
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 'clamp(25px, 3.4vw, 38px)',
    lineHeight: 1.06,
    letterSpacing: '-0.02em',
    color: '#14171c',
  },
  summary: {
    margin: '16px 0 0',
    fontSize: 16,
    lineHeight: 1.6,
    color: '#47505f',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginTop: 26,
    fontSize: 13,
    color: '#6b7484',
  },
  autor: {
    fontWeight: 700,
    color: '#14171c',
  },
};
