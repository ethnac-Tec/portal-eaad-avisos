export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div>
          <p style={styles.title}>EAAD · Avisos</p>
          <p style={styles.subtitle}>Escuela de Arquitectura, Arte y Diseño · Tecnológico de Monterrey</p>
        </div>
        <p style={styles.note}>
          Los profesores registran sus avisos por formulario. Revisión de redacción y aprobación antes de publicar.
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#0b2f6b',
    color: '#cdd8ef',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '40px 22px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: 20,
    color: '#fff',
  },
  subtitle: {
    margin: '6px 0 0',
    fontSize: 13,
    color: '#9fb6e0',
  },
  note: {
    margin: 0,
    fontSize: '12.5px',
    color: '#7f96c4',
    maxWidth: '40ch',
  },
};
