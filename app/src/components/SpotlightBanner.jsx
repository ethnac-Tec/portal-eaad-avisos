import { Link } from 'react-router-dom';
import { AVISOS, COLORS } from '../data';

function todayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Auto-picks the closest upcoming "Programado" (save-the-date) aviso — no
// admin curation step, consistent with how Programado items get onto the
// site in the first place. Renders nothing if there isn't one.
export default function SpotlightBanner() {
  const today = todayISO();
  const next = AVISOS.filter((a) => a.estado === 'Programado' && a.fechaISO >= today).sort((a, b) =>
    a.fechaISO.localeCompare(b.fechaISO)
  )[0];

  if (!next) return null;

  const color = COLORS[next.carrera] || '#c0562b';
  const footerParts = [next.campus, next.fecha].filter(Boolean);

  return (
    <Link to="/calendario" style={styles.card}>
      <div style={styles.imageWrap}>
        {next.image && <img src={next.image} alt="" style={styles.image} />}
        <div style={{ ...styles.colorBar, background: color }} />
        <span style={styles.badge}>Próximamente</span>
      </div>
      <div style={styles.body}>
        <div style={styles.metaRow}>
          {next.carrera && <span style={{ ...styles.carrera, color }}>{next.carrera}</span>}
          {next.carrera && next.tipo && <span style={styles.dot} />}
          {next.tipo && <span style={styles.tipo}>{next.tipo}</span>}
        </div>
        <h2 style={styles.title}>{next.title}</h2>
        {next.summary && <p style={styles.summary}>{next.summary}</p>}
        {next.body?.map((para, i) => (
          <p key={i} style={styles.summary}>
            {para}
          </p>
        ))}
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
  card: {
    cursor: 'pointer',
    display: 'block',
    background: '#fff',
    border: '1px solid #dfe3ea',
    marginBottom: 34,
    animation: 'eaadFade 0.5s ease both',
    color: 'inherit',
    textDecoration: 'none',
  },
  imageWrap: {
    position: 'relative',
    minHeight: 380,
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
  badge: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: '6px 12px',
    borderRadius: 3,
    background: '#000000',
    color: '#fff',
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 800,
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  body: {
    padding: 'clamp(24px, 4vw, 34px)',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  carrera: {
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 13,
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
    fontSize: 13,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#55627a',
    fontWeight: 600,
  },
  title: {
    margin: 0,
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 800,
    fontSize: 'clamp(26px, 3.8vw, 42px)',
    lineHeight: 1.06,
    letterSpacing: '-0.02em',
    color: '#14171c',
  },
  summary: {
    margin: '16px 0 0',
    fontSize: 17,
    lineHeight: 1.6,
    color: '#47505f',
    maxWidth: '76ch',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
    fontSize: '13.5px',
    color: '#6b7484',
  },
  autor: {
    fontWeight: 700,
    color: '#14171c',
  },
};
