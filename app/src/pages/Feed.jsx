import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PUBLICADOS } from '../data';
import { matchesCampus } from '../campus';
import CategoryChips from '../components/CategoryChips';
import FeaturedStory from '../components/FeaturedStory';
import NewsCard from '../components/NewsCard';

export default function Feed() {
  const [searchParams, setSearchParams] = useSearchParams();
  const carrera = searchParams.get('carrera') || 'Todas';
  const campus = searchParams.get('campus') || null;

  const filtered = useMemo(
    () =>
      PUBLICADOS.filter(
        (d) => (carrera === 'Todas' || d.carrera === carrera) && matchesCampus(d, campus)
      ),
    [carrera, campus]
  );

  const featured = useMemo(() => filtered.find((d) => d.featured) || filtered[0] || null, [filtered]);
  const cards = useMemo(
    () => filtered.filter((d) => !featured || d.id !== featured.id),
    [filtered, featured]
  );

  function handleCarreraChange(next) {
    const params = new URLSearchParams(searchParams);
    if (next === 'Todas') params.delete('carrera');
    else params.set('carrera', next);
    setSearchParams(params);
  }

  return (
    <main style={styles.main}>
      <section style={styles.masthead}>
        <div style={styles.kickerRow}>
          <span style={styles.kickerBar} />
          <p style={styles.kicker}>Boletín · Centro Occidente</p>
        </div>
        <h1 style={styles.title}>Boletín de Noticias EAAD</h1>
        <p style={styles.lede}>
          Este boletín es el punto de encuentro de nuestra comunidad, un espacio diseñado para
          celebrar el talento, la innovación y los logros que emergen de nuestros cuatro campus.
          Aquí encontrarás una curaduría de los proyectos más destacados, reconocimientos
          académicos, talleres y eventos que definen el futuro de nuestras disciplinas. Te
          invitamos a explorar el impacto de nuestros estudiantes y profesores, y a ser parte de
          la narrativa creativa que nos une y nos proyecta hacia el exterior.
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
    background: '#210702',
  },
  kicker: {
    margin: 0,
    fontSize: 12,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#003AA1',
    fontWeight: 700,
  },
  title: {
    margin: 0,
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 'clamp(32px, 5.5vw, 58px)',
    lineHeight: 1.0,
    letterSpacing: '-0.03em',
    color: '#000000',
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
