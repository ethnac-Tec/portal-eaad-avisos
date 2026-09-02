import { Link } from 'react-router-dom';
import { COLORS } from '../data';

export default function RelatedCard({ item }) {
  const color = COLORS[item.carrera] || '#c0562b';

  return (
    <Link to={`/aviso/${item.id}`} style={styles.card}>
      <div style={styles.imageWrap}>
        <img src={item.image} alt="" style={styles.image} />
        <div style={{ ...styles.colorBar, background: color }} />
      </div>
      <div style={styles.body}>
        {item.carrera && <p style={{ ...styles.carrera, color }}>{item.carrera}</p>}
        <h4 style={styles.title}>{item.title}</h4>
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
    padding: '15px 18px 20px',
  },
  carrera: {
    margin: '0 0 7px',
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontSize: 11,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    fontWeight: 700,
  },
  title: {
    margin: 0,
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 17,
    lineHeight: 1.16,
    color: '#14171c',
  },
};
