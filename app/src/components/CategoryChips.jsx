import { CARRERAS } from '../data';

export default function CategoryChips({ active, onChange }) {
  return (
    <nav style={styles.nav}>
      {CARRERAS.map((carrera) => {
        const isActive = active === carrera;
        return (
          <button
            key={carrera}
            onClick={() => onChange(carrera)}
            style={{
              ...styles.chip,
              color: isActive ? '#0b2f6b' : '#6b7484',
              boxShadow: isActive ? 'inset 0 -2px 0 #d4472f' : 'none',
            }}
          >
            {carrera}
          </button>
        );
      })}
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0,
    borderBottom: '2px solid #d9dde4',
    marginBottom: 30,
    position: 'sticky',
    top: 55,
    zIndex: 30,
    background: '#eef0f3',
  },
  chip: {
    cursor: 'pointer',
    fontFamily: "'Public Sans', sans-serif",
    fontSize: '13.5px',
    fontWeight: 600,
    padding: '12px 18px',
    background: 'transparent',
    border: 'none',
    transition: 'all .15s ease',
    marginBottom: -2,
  },
};
