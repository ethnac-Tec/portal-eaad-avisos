import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AVISOS, COLORS } from '../data';

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function buildCalDays(year, month, today) {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);

  return cells.map((num) => {
    if (!num) return { num: null };
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(num).padStart(2, '0')}`;
    const isToday =
      year === today.getFullYear() && month === today.getMonth() && num === today.getDate();
    const dayItems = AVISOS.filter((d) => d.fechaISO === iso);
    // Once the real note for a date exists, hide the "save the date"
    // placeholder(s) for that same day — the note takes its slot.
    const hasPublicado = dayItems.some((d) => d.estado === 'Publicado');
    const events = hasPublicado ? dayItems.filter((d) => d.estado === 'Publicado') : dayItems;
    return { num, iso, isToday, events };
  });
}

export default function Calendar() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const calDays = useMemo(() => buildCalDays(cursor.year, cursor.month, today), [cursor, today]);
  const selected = selectedId ? AVISOS.find((d) => d.id === selectedId) : null;
  const selectedColor = selected ? COLORS[selected.carrera] || '#c0562b' : null;
  const isProgramado = selected?.estado === 'Programado';

  function prevMonth() {
    setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
  }
  function nextMonth() {
    setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));
  }

  return (
    <main style={styles.main}>
      <div style={styles.backRow}>
        <Link to="/" style={styles.backLink}>
          ← Todos los avisos
        </Link>
      </div>

      <div style={styles.inner}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            {MESES[cursor.month]} {cursor.year}
          </h1>
          <div style={styles.navBtns}>
            <button onClick={prevMonth} style={styles.navBtn}>←</button>
            <button onClick={nextMonth} style={styles.navBtn}>→</button>
          </div>
        </div>

        <div style={styles.grid}>
          {WEEKDAYS.map((wd) => (
            <div key={wd} style={styles.weekdayCell}>{wd}</div>
          ))}
          {calDays.map((day, i) =>
            day.num ? (
              <div key={i} style={styles.dayCell}>
                <span style={day.isToday ? styles.dayNumToday : styles.dayNum}>{day.num}</span>
                {day.events.map((ev) => {
                  const color = COLORS[ev.carrera] || '#000';
                  const isProgramado = ev.estado === 'Programado';
                  return (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedId(ev.id)}
                      style={
                        isProgramado
                          ? { ...styles.eventPill, ...styles.eventPillOutline, borderColor: color, color }
                          : { ...styles.eventPill, background: color }
                      }
                    >
                      {ev.title.length > 18 ? ev.title.slice(0, 17) + '…' : ev.title}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div key={i} style={styles.emptyCell} />
            )
          )}
        </div>
      </div>

      {selected && (
        <div style={styles.overlay} onClick={() => setSelectedId(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedId(null)}>×</button>
            <div style={styles.modalImageWrap}>
              <img src={selected.image} alt="" style={styles.modalImage} />
              <div style={{ ...styles.modalColorBar, background: selectedColor }} />
            </div>
            <div style={styles.modalBody}>
              {isProgramado && <p style={styles.modalBadge}>Próximamente · sin nota publicada todavía</p>}
              <p style={{ ...styles.modalKicker, color: selectedColor }}>
                {[selected.carrera, selected.tipo].filter(Boolean).join(' · ')}
              </p>
              <h2 style={styles.modalTitle}>{selected.title}</h2>
              {selected.summary && <p style={styles.modalSummary}>{selected.summary}</p>}
              {selected.body?.map((para, i) => (
                <p key={i} style={styles.modalSummary}>
                  {para}
                </p>
              ))}
              <div style={styles.modalMeta}>
                {[selected.fecha, selected.campus, selected.autor].filter(Boolean).map((part, i) => (
                  <span key={i}>
                    {i > 0 && ' · '}
                    {part}
                  </span>
                ))}
              </div>
              {!isProgramado && (
                <button onClick={() => navigate(`/aviso/${selected.id}`)} style={styles.modalCta}>
                  Ver nota completa →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const styles = {
  main: { animation: 'eaadFade 0.4s ease both' },
  backRow: { maxWidth: 1000, margin: '0 auto', padding: '22px 22px 0' },
  backLink: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#000000',
    padding: '8px 0',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
  },
  inner: { maxWidth: 1000, margin: '0 auto', padding: '10px 22px 80px' },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    margin: '10px 0 28px',
    flexWrap: 'wrap',
  },
  title: {
    margin: 0,
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 'clamp(24px, 4vw, 36px)',
    letterSpacing: '-0.02em',
    color: '#000000',
    textTransform: 'capitalize',
  },
  navBtns: { display: 'flex', gap: 8 },
  navBtn: {
    width: 38,
    height: 38,
    border: '1px solid #dfe3ea',
    background: '#fff',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 700,
    color: '#14171c',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 1,
    background: '#dfe3ea',
    border: '1px solid #dfe3ea',
  },
  weekdayCell: {
    background: '#f5f5f5',
    padding: '8px 4px',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 700,
    color: '#55627a',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  dayCell: {
    background: '#fff',
    minHeight: 88,
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  emptyCell: { background: '#fbfbfb', minHeight: 88, padding: 8 },
  dayNum: {
    fontSize: 12,
    fontWeight: 700,
    color: '#14171c',
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
  },
  dayNumToday: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: '#000',
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
  },
  eventPill: {
    cursor: 'pointer',
    fontSize: '10.5px',
    lineHeight: 1.3,
    padding: '3px 5px',
    borderRadius: 3,
    color: '#fff',
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 700,
  },
  // "Programado" — save-the-date, no article yet: outlined instead of a
  // solid fill, so it visually reads as lighter/tentative next to real
  // (solid) published avisos.
  eventPillOutline: {
    background: '#fff',
    border: '1px solid currentColor',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(20,23,28,0.55)',
    zIndex: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    animation: 'eaadFade 0.2s ease both',
  },
  modal: {
    maxWidth: 560,
    width: '100%',
    maxHeight: '85vh',
    overflowY: 'auto',
    background: '#fff',
    borderRadius: 6,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    background: 'rgba(255,255,255,0.9)',
    border: 'none',
    width: 32,
    height: 32,
    borderRadius: '50%',
    fontSize: 20,
    lineHeight: 1,
    cursor: 'pointer',
    color: '#14171c',
    zIndex: 2,
  },
  // `contain` (not `cover`) on purpose: posters for "Programado" items can
  // come in any aspect ratio (portrait flyers included), and we'd rather
  // show the whole design with neutral letterbox bars than crop it.
  modalImageWrap: {
    position: 'relative',
    minHeight: 220,
    maxHeight: '50vh',
    background: '#dce1e8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: { display: 'block', width: '100%', maxHeight: '50vh', objectFit: 'contain' },
  modalColorBar: { position: 'absolute', top: 0, left: 0, height: 6, width: '100%' },
  modalBody: { padding: '26px 28px 28px' },
  modalBadge: {
    display: 'inline-block',
    margin: '0 0 14px',
    padding: '4px 10px',
    borderRadius: 3,
    background: '#f5f5f5',
    color: '#55627a',
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  modalKicker: {
    margin: '0 0 10px',
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  modalTitle: {
    margin: '0 0 12px',
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 24,
    lineHeight: 1.15,
    color: '#14171c',
  },
  modalSummary: { margin: '0 0 16px', fontSize: 15, lineHeight: 1.6, color: '#47505f' },
  modalMeta: { fontSize: 13, color: '#6b7484', marginBottom: 18 },
  modalCta: {
    display: 'inline-block',
    background: '#000',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: 4,
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontSize: '13.5px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};
