import { useEffect, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { AVISOS } from '../data';
import { getAllCampuses } from '../campus';
import { functions } from '../firebase';
import { sendLoginLink, watchProfessorAuth, signOutProfessor } from '../professorAuth';

const CARRERAS = ['Arquitectura', 'Arte Digital', 'Diseño', 'Urbanismo'];
const CAMPUSES = getAllCampuses(AVISOS);

export default function Enviar() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = signed out

  useEffect(() => watchProfessorAuth(setUser), []);

  if (user === undefined) return <main style={styles.main} />;

  return <main style={styles.main}>{user ? <AvisoForm user={user} /> : <EmailStep />}</main>;
}

function EmailStep() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await sendLoginLink(email);
      setStatus('sent');
    } catch (err) {
      setError(err.message || 'Algo salió mal.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div style={styles.card}>
        <h1 style={styles.title}>Revisa tu correo</h1>
        <p style={styles.text}>
          Te mandamos un enlace a <strong>{email}</strong>. Ábrelo desde este mismo navegador para
          continuar con tu aviso.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Enviar un aviso</h1>
      <p style={styles.text}>
        Este formulario es solo para profesores de EAAD. Escribe tu correo institucional y te
        mandamos un enlace de acceso — sin contraseña.
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          required
          placeholder="tu.nombre@tec.mx"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" disabled={status === 'sending'} style={styles.button}>
          {status === 'sending' ? 'Enviando…' : 'Mandarme el enlace →'}
        </button>
      </form>
    </div>
  );
}

const EMPTY_FORM = {
  nombre: '',
  titulo: '',
  carreras: [],
  campus: '',
  tipo: '',
  fecha: '',
  descripcion: '',
  socios: '',
  estudiantes: '',
  imagen: '',
};

function AvisoForm({ user }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleCarrera(c) {
    setForm((f) => ({
      ...f,
      carreras: f.carreras.includes(c) ? f.carreras.filter((x) => x !== c) : [...f.carreras, c],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const submitAviso = httpsCallable(functions, 'submitAviso');
      await submitAviso(form);
      setStatus('sent');
    } catch (err) {
      setError(err.message || 'No se pudo enviar. Intenta de nuevo.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div style={styles.card}>
        <h1 style={styles.title}>¡Listo!</h1>
        <p style={styles.text}>
          Tu aviso se registró para revisión. Un administrador lo aprobará antes de que aparezca en
          el sitio público.
        </p>
        <button style={styles.buttonSecondary} onClick={() => setForm(EMPTY_FORM) || setStatus('idle')}>
          Enviar otro aviso
        </button>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.headerRow}>
        <h1 style={styles.title}>Enviar un aviso</h1>
        <button type="button" onClick={signOutProfessor} style={styles.signOut}>
          {user.email} · salir
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Tu nombre completo
          <input
            required
            value={form.nombre}
            onChange={(e) => update('nombre', e.target.value)}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Título del aviso
          <input
            required
            value={form.titulo}
            onChange={(e) => update('titulo', e.target.value)}
            style={styles.input}
          />
        </label>

        <div style={styles.label}>
          Carrera(s)
          <div style={styles.checkRow}>
            {CARRERAS.map((c) => (
              <label key={c} style={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={form.carreras.includes(c)}
                  onChange={() => toggleCarrera(c)}
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        <label style={styles.label}>
          Campus
          <input
            required
            list="campuses"
            value={form.campus}
            onChange={(e) => update('campus', e.target.value)}
            style={styles.input}
          />
          <datalist id="campuses">
            {CAMPUSES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>

        <label style={styles.label}>
          Tipo de evento (ej. Taller, Congreso, Exposición)
          <input
            required
            value={form.tipo}
            onChange={(e) => update('tipo', e.target.value)}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Fecha del evento
          <input
            type="date"
            required
            value={form.fecha}
            onChange={(e) => update('fecha', e.target.value)}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Descripción
          <textarea
            required
            rows={6}
            value={form.descripcion}
            onChange={(e) => update('descripcion', e.target.value)}
            style={styles.textarea}
          />
        </label>

        <label style={styles.label}>
          Socios formadores (opcional)
          <input
            value={form.socios}
            onChange={(e) => update('socios', e.target.value)}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Equipo / estudiantes involucrados (opcional)
          <input
            value={form.estudiantes}
            onChange={(e) => update('estudiantes', e.target.value)}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Link a una imagen (opcional por ahora)
          <input
            type="url"
            placeholder="https://…"
            value={form.imagen}
            onChange={(e) => update('imagen', e.target.value)}
            style={styles.input}
          />
        </label>

        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" disabled={status === 'sending'} style={styles.button}>
          {status === 'sending' ? 'Enviando…' : 'Enviar para revisión →'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  main: { maxWidth: 640, margin: '0 auto', padding: '44px 22px 80px' },
  card: {},
  headerRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  title: {
    margin: 0,
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 'clamp(28px, 4vw, 40px)',
    color: '#000000',
  },
  signOut: {
    background: 'none',
    border: 'none',
    color: '#6b7484',
    fontSize: 13,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  text: { fontSize: 16, lineHeight: 1.6, color: '#47505f', margin: '14px 0 0' },
  form: { display: 'flex', flexDirection: 'column', gap: 18, marginTop: 26 },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontSize: 13.5,
    fontWeight: 700,
    color: '#14171c',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  input: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 400,
    fontSize: 15,
    padding: '10px 12px',
    border: '1px solid #dfe3ea',
    borderRadius: 4,
  },
  textarea: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 400,
    fontSize: 15,
    padding: '10px 12px',
    border: '1px solid #dfe3ea',
    borderRadius: 4,
    resize: 'vertical',
  },
  checkRow: { display: 'flex', flexWrap: 'wrap', gap: 14, fontWeight: 400, fontSize: 14 },
  checkLabel: { display: 'flex', alignItems: 'center', gap: 6 },
  error: { color: '#b3261e', fontSize: 14, margin: 0 },
  button: {
    alignSelf: 'flex-start',
    background: '#000',
    color: '#fff',
    border: 'none',
    padding: '12px 22px',
    borderRadius: 4,
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
  buttonSecondary: {
    marginTop: 18,
    background: 'none',
    border: '1px solid #dfe3ea',
    padding: '10px 18px',
    borderRadius: 4,
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    color: '#14171c',
  },
};
