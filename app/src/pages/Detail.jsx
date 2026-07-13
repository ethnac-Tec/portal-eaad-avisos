import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AVISOS, COLORS } from '../data';
import RelatedCard from '../components/RelatedCard';

export default function Detail() {
  const { id } = useParams();
  const current = AVISOS.find((d) => d.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!current) {
    return <Navigate to="/" replace />;
  }

  const color = COLORS[current.carrera] || '#c0562b';
  const related = AVISOS.filter((d) => d.id !== current.id).slice(0, 3);
  const subMetaParts = [current.autor, current.autorRol, current.campus, current.fecha].filter(Boolean);

  return (
    <main style={styles.main}>
      <div style={styles.backRow}>
        <Link to="/" style={styles.backLink}>
          ← Todos los avisos
        </Link>
      </div>

      <article style={styles.article}>
        <div style={styles.metaRow}>
          <span style={{ ...styles.metaBar, background: color }} />
          {current.carrera && <span style={{ ...styles.carrera, color }}>{current.carrera}</span>}
          {current.tipo && <span style={styles.tipo}>{current.carrera ? `· ${current.tipo}` : current.tipo}</span>}
        </div>
        <h1 style={styles.title}>{current.title}</h1>

        <div style={styles.subMeta}>
          {subMetaParts.map((part, i) => (
            <span key={i} style={i === 0 ? styles.autor : undefined}>
              {i > 0 && <span style={styles.dot}>· </span>}
              {part}
            </span>
          ))}
        </div>

        <div style={styles.heroWrap}>
          <img src={current.image} alt="" style={styles.hero} />
        </div>

        <div style={styles.body}>
          <p style={styles.summary}>{current.summary}</p>
          {current.body.map((para, i) => (
            <p key={i} style={styles.paragraph}>
              {para}
            </p>
          ))}
        </div>

        <div style={styles.metaFooter}>
          <div>
            <p style={styles.metaLabel}>Departamento / Iniciativa</p>
            <p style={styles.metaValue}>{current.depto}</p>
          </div>
          <div>
            <p style={styles.metaLabel}>Socios</p>
            <p style={styles.metaValue}>{current.socios}</p>
          </div>
          <div>
            <p style={styles.metaLabel}>Estudiantes</p>
            <p style={styles.metaValue}>{current.estudiantes}</p>
          </div>
        </div>
      </article>

      <section style={styles.moreSection}>
        <div style={styles.moreInner}>
          <h3 style={styles.moreTitle}>Más avisos</h3>
          <div style={styles.moreGrid}>
            {related.map((item) => (
              <RelatedCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const styles = {
  main: {
    animation: 'eaadFade 0.4s ease both',
  },
  backRow: {
    maxWidth: 840,
    margin: '0 auto',
    padding: '22px 22px 0',
  },
  backLink: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#000000',
    padding: '8px 0',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
  },
  article: {
    maxWidth: 840,
    margin: '0 auto',
    padding: '10px 22px 80px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '8px 0 16px',
  },
  metaBar: {
    width: 22,
    height: 3,
  },
  carrera: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  tipo: {
    fontSize: 12,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#6b7484',
    fontWeight: 600,
  },
  title: {
    margin: 0,
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 'clamp(29px, 5.2vw, 50px)',
    lineHeight: 1.04,
    letterSpacing: '-0.03em',
    color: '#000000',
  },
  subMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    margin: '20px 0 26px',
    fontSize: '13.5px',
    color: '#6b7484',
  },
  autor: {
    fontWeight: 700,
    color: '#14171c',
  },
  dot: {
    color: '#aeb7c5',
  },
  heroWrap: {
    position: 'relative',
    aspectRatio: '16 / 9',
    background: '#dce1e8',
    overflow: 'hidden',
    marginBottom: 34,
  },
  hero: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  body: {
    fontSize: 18,
    lineHeight: 1.7,
    color: '#2a2f38',
  },
  summary: {
    margin: '0 0 22px',
    fontSize: 20,
    lineHeight: 1.55,
    color: '#14171c',
    fontWeight: 600,
  },
  paragraph: {
    margin: '0 0 22px',
  },
  metaFooter: {
    marginTop: 40,
    padding: '26px 28px',
    background: '#fff',
    border: '1px solid #dfe3ea',
    borderLeft: '4px solid #000000',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '22px 30px',
  },
  metaLabel: {
    margin: '0 0 5px',
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#55627a',
    fontWeight: 700,
  },
  metaValue: {
    margin: 0,
    fontSize: 15,
    color: '#14171c',
  },
  moreSection: {
    borderTop: '2px solid #d9dde4',
    background: '#e6e9ee',
  },
  moreInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '40px 22px 70px',
  },
  moreTitle: {
    margin: '0 0 22px',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 24,
    color: '#000000',
  },
  moreGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))',
    gap: 22,
  },
};
