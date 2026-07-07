import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AVISOS } from '../data';
import CategoryChips from '../components/CategoryChips';
import FeaturedStory from '../components/FeaturedStory';
import NewsCard from '../components/NewsCard';

export default function Feed() {
  const [searchParams, setSearchParams] = useSearchParams();
  const carrera = searchParams.get('carrera') || 'Todas';

  const filtered = useMemo(
    () => AVISOS.filter((d) => carrera === 'Todas' || d.carrera === carrera),
    [carrera]
  );

  const featured = useMemo(() => filtered.find((d) => d.featured) || filtered[0] || null, [filtered]);
  const cards = useMemo(
    () => filtered.filter((d) => !featured || d.id !== featured.id),
    [filtered, featured]
  );

  function handleCarreraChange(next) {
    if (next === 'Todas') {
      setSearchParams({});
    } else {
      setSearchParams({ carrera: next });
    }
  }

  return (
    <main style={styles.main}>
      <section style={styles.masthead}>
        <div style={styles.kickerRow}>
          <span style={styles.kickerBar} />
          <p style={styles.kicker}>Boletín · Centro Occidente</p>
        </div>
        <h1 style={styles.title}>Avisos de la comunidad EAAD</h1>
        <p style={styles.lede}>
          Un índice curado de talleres, congresos, exposiciones y reconocimientos de Arquitectura, Arte
          Digital, Diseño y Urbanismo.
        </p>
      </section>

      <CategoryChips active={carrera} onChange={handleCarreraChange} />

      {featured && <FeaturedStory item={featured} />}

      <div style={styles.grid}>
        {cards.map((card) => (
          <NewsCard key={card.id} item={card} />
        ))}
      </div>

      {filtered.length === 0 && <p style={styles.empty}>No hay avisos en esta categoría por ahora.</p>}
    </main>
  );
}

const styles = {
  main: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 22px 80px',
  },
  masthead: {
    padding: '44px 0 26px',
  },
  kickerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  kickerBar: {
    width: 26,
    height: 3,
    background: '#d4472f',
  },
  kicker: {
    margin: 0,
    fontSize: 12,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#55627a',
    fontWeight: 700,
  },
  title: {
    margin: 0,
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: 'clamp(32px, 5.5vw, 58px)',
    lineHeight: 1.0,
    letterSpacing: '-0.03em',
    color: '#0b2f6b',
    maxWidth: '16ch',
  },
  lede: {
    margin: '18px 0 0',
    fontSize: 'clamp(15px, 2.2vw, 18px)',
    lineHeight: 1.6,
    color: '#47505f',
    maxWidth: '58ch',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
    gap: 24,
  },
  empty: {
    textAlign: 'center',
    padding: '60px 0',
    color: '#6b7484',
    fontSize: 16,
  },
};
