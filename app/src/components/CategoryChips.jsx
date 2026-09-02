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
              color: isActive ? '#000000' : '#6b7484',
              boxShadow: isActive ? 'inset 0 -2px 0 #000000' : 'none',
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
    background: '#ffffff',
  },
  chip: {
    cursor: 'pointer',
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontSize: '13.5px',
    fontWeight: 600,
    padding: '12px 18px',
    background: 'transparent',
    border: 'none',
    transition: 'all .15s ease',
    marginBottom: -2,
  },
};
