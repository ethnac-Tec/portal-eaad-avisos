import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AVISOS } from '../data';
import { getAllCampuses } from '../campus';

const CAMPUSES = getAllCampuses(AVISOS);

export default function NavSidebar() {
  const [campusOpen, setCampusOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCampus = searchParams.get('campus');

  function selectCampus(campus) {
    const params = new URLSearchParams(searchParams);
    if (campus) params.set('campus', campus);
    else params.delete('campus');
    setCampusOpen(false);
    setMobileOpen(false);
    navigate(`/?${params.toString()}`);
  }

  function goCalendar() {
    setMobileOpen(false);
    navigate('/calendario');
  }

  const content = (
    <>
      <p style={styles.heading}>Navegar</p>

      <button
        onClick={() => setCampusOpen((v) => !v)}
        style={{ ...styles.navBtn, ...(activeCampus ? styles.navBtnActive : {}) }}
      >
        Campus{activeCampus ? ` · ${activeCampus}` : ''}
      </button>
      {campusOpen && (
        <div style={styles.dropdown}>
          <button
            onClick={() => selectCampus(null)}
            style={{ ...styles.dropdownItem, ...(!activeCampus ? styles.dropdownItemActive : {}) }}
          >
            Todos
          </button>
          {CAMPUSES.map((c) => (
            <button
              key={c}
              onClick={() => selectCampus(c)}
              style={{ ...styles.dropdownItem, ...(activeCampus === c ? styles.dropdownItemActive : {}) }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <a
        href="https://eaad.tec.mx/es/plataforma-academica/profesional"
        target="_blank"
        rel="noreferrer"
        style={styles.navLink}
      >
        Conoce nuestras Carreras
      </a>

      <button onClick={goCalendar} style={styles.navBtn}>
        Próximos Eventos
      </button>
    </>
  );

  return (
    <>
      <div className="nav-sidebar-desktop" style={styles.desktopPanel}>
        {content}
      </div>

      <div className="nav-sidebar-mobile-trigger" style={styles.mobileWrap}>
        <button onClick={() => setMobileOpen((v) => !v)} style={styles.mobileTrigger}>
          ☰ Navegar
        </button>
        {mobileOpen && <div style={styles.mobilePanel}>{content}</div>}
      </div>
    </>
  );
}

const styles = {
  desktopPanel: {
    boxSizing: 'border-box',
    background: '#ffffff',
    border: '1px solid #dfe3ea',
    borderRadius: 4,
    padding: '18px 10px 10px',
  },
  mobileWrap: {
    padding: '10px 22px 0',
  },
  mobileTrigger: {
    background: '#fff',
    border: '1px solid #dfe3ea',
    borderRadius: 4,
    padding: '9px 14px',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: 13.5,
    fontWeight: 700,
    color: '#000000',
    cursor: 'pointer',
  },
  mobilePanel: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    border: '1px solid #dfe3ea',
    borderRadius: 4,
    padding: '14px 10px 10px',
    marginTop: 8,
  },
  heading: {
    margin: '0 0 12px',
    padding: '0 6px',
    fontSize: 13,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#003AA1',
    fontWeight: 700,
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  navBtn: {
    textAlign: 'left',
    background: 'none',
    border: 'none',
    borderLeft: '3px solid transparent',
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 700,
    color: '#000000',
    padding: '9px 9px',
    borderRadius: 4,
  },
  navBtnActive: {
    borderLeftColor: '#000000',
  },
  navLink: {
    display: 'block',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    borderLeft: '3px solid transparent',
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 700,
    color: '#000000',
    padding: '9px 9px',
    textDecoration: 'none',
    borderRadius: 4,
  },
  dropdown: {
    background: '#fff',
    border: '1px solid #dfe3ea',
    borderRadius: 4,
    margin: '2px 0 6px',
    overflow: 'hidden',
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    background: '#fff',
    border: 'none',
    borderBottom: '1px solid #eee',
    padding: '10px 14px',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '13.5px',
    fontWeight: 400,
    color: '#14171c',
    cursor: 'pointer',
  },
  dropdownItemActive: {
    background: '#f2f2f2',
    fontWeight: 700,
  },
};
