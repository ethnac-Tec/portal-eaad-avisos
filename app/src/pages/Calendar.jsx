import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AVISOS, COLORS } from '../data';

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Only days that actually have something are worth a cell — a mostly-empty
// month shouldn't render five weeks of blank boxes. Skips weekday columns
// with nothing all month too, and weeks with nothing in any active column.
function buildMonthEvents(year, month, today) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const byDay = new Map();

  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayItems = AVISOS.filter((a) => a.fechaISO === iso);
    if (!dayItems.length) continue;
    // Once the real note for a date exists, hide the "save the date"
    // placeholder(s) for that same day — the note takes its slot.
    const hasPublicado = dayItems.some((a) => a.estado === 'Publicado');
    const events = hasPublicado ? dayItems.filter((a) => a.estado === 'Publicado') : dayItems;
    const weekday = new Date(year, month, d).getDay();
    const weekIndex = Math.floor((d - 1 + firstWeekday) / 7);
    const isToday = year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
    byDay.set(`${weekIndex}-${weekday}`, { day: d, weekday, weekIndex, isToday, events });
  }

  const entries = [...byDay.values()];
  const activeWeekdays = [...new Set(entries.map((e) => e.weekday))].sort((a, b) => a - b);
  const activeWeeks = [...new Set(entries.map((e) => e.weekIndex))].sort((a, b) => a - b);

  return { byDay, activeWeekdays, activeWeeks };
}

export default function Calendar() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const { byDay, activeWeekdays, activeWeeks } = useMemo(
    () => buildMonthEvents(cursor.year, cursor.month, today),
    [cursor, today]
  );
  const sortedEntries = useMemo(() => [...byDay.values()].sort((a, b) => a.day - b.day), [byDay]);
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

        {activeWeekdays.length === 0 ? (
          <p style={styles.empty}>No hay avisos ni eventos programados este mes.</p>
        ) : (
          <>
            <div className="calendar-grid-view">
              <div style={{ ...styles.grid, gridTemplateColumns: `repeat(${activeWeekdays.length}, 1fr)` }}>
                {activeWeekdays.map((wd, i) => (
                  <div
                    key={`h-${wd}`}
                    style={{ ...styles.weekdayCell, ...(i === activeWeekdays.length - 1 ? styles.lastCol : {}) }}
                  >
                    {WEEKDAYS[wd]}
                  </div>
                ))}

                {activeWeeks.map((wi) =>
                  activeWeekdays.map((wd, i) => {
                    const isLast = i === activeWeekdays.length - 1;
                    const entry = byDay.get(`${wi}-${wd}`);
                    if (!entry) {
                      return (
                        <div key={`${wi}-${wd}`} style={{ ...styles.emptyCell, ...(isLast ? styles.lastCol : {}) }} />
                      );
                    }
                    const multi = entry.events.length > 1;
                    return (
                      <div key={`${wi}-${wd}`} style={{ ...styles.dayCell, ...(isLast ? styles.lastCol : {}) }}>
                        <div style={styles.dayNumRow}>
                          <span style={entry.isToday ? styles.dayNumToday : styles.dayNum}>{entry.day}</span>
                          {multi && <span style={styles.multiTag}>· {entry.events.length} eventos</span>}
                        </div>
                        <div style={styles.franjaRow}>
                          {entry.events.map((ev) => {
                            const color = COLORS[ev.carrera] || '#000';
                            return (
                              <div key={ev.id} onClick={() => setSelectedId(ev.id)} style={styles.franja}>
                                <div
                                  style={{
                                    ...styles.franjaImageWrap,
                                    aspectRatio: multi ? '1 / 1' : '4 / 3',
                                  }}
                                >
                                  {ev.image && <img src={ev.image} alt="" style={styles.franjaImage} />}
                                  <div style={{ ...styles.franjaColorBar, background: color }} />
                                </div>
                                {ev.carrera && <div style={{ ...styles.franjaCarrera, color }}>{ev.carrera}</div>}
                                <div style={styles.franjaTitle}>{ev.title}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* A weekday-column matrix doesn't fit a phone width — same
                "only days with something" idea, as one chronological list. */}
            <div className="calendar-list-view">
              {sortedEntries.map((entry) => (
                <div key={entry.day} style={styles.listRow}>
                  <div style={styles.listDayNum}>
                    {entry.day}
                    <br />
                    <span style={styles.listWeekday}>{WEEKDAYS[entry.weekday]}</span>
                  </div>
                  <div style={styles.listEvents}>
                    {entry.events.map((ev) => {
                      const color = COLORS[ev.carrera] || '#000';
                      return (
                        <div key={ev.id} onClick={() => setSelectedId(ev.id)} style={styles.listEvent}>
                          <div style={styles.listThumb}>
                            {ev.image && <img src={ev.image} alt="" style={styles.franjaImage} />}
                            <div style={{ ...styles.franjaColorBar, background: color }} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            {ev.carrera && <div style={{ ...styles.listCarrera, color }}>{ev.carrera}</div>}
                            <div style={styles.listTitle}>{ev.title}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
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
  backRow: { maxWidth: 1200, margin: '0 auto', padding: '22px 22px 0' },
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
  inner: { maxWidth: 1200, margin: '0 auto', padding: '10px 22px 80px' },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    margin: '10px 0 8px',
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
  empty: {
    padding: '40px 0 60px',
    color: '#6b7484',
    fontSize: 15,
  },
  // Only the weekdays that had something this month become columns; days
  // and weekdays without events render as blank space, not empty boxes.
  grid: {
    display: 'grid',
    borderTop: '2px solid #14171c',
  },
  lastCol: { borderRight: '1px solid #e3e6ec' },
  weekdayCell: {
    borderLeft: '1px solid #e3e6ec',
    padding: '10px 14px',
    fontSize: 11,
    fontWeight: 700,
    color: '#6b7484',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  emptyCell: {
    borderLeft: '1px solid #e3e6ec',
    borderTop: '1px solid #eef0f3',
  },
  dayCell: {
    borderLeft: '1px solid #e3e6ec',
    borderTop: '1px solid #eef0f3',
    padding: '16px 14px 20px',
  },
  dayNumRow: { display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 },
  dayNum: {
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 800,
    fontSize: 26,
    color: '#14171c',
  },
  dayNumToday: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: '#000',
    color: '#fff',
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 800,
    fontSize: 16,
  },
  multiTag: {
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 11,
    color: '#9098a3',
  },
  franjaRow: { display: 'flex', gap: 8 },
  franja: { cursor: 'pointer', flex: 1, minWidth: 0 },
  franjaImageWrap: {
    position: 'relative',
    background: '#dce1e8',
    marginBottom: 8,
  },
  franjaImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  franjaColorBar: { position: 'absolute', top: 0, left: 0, height: 4, width: '100%' },
  franjaCarrera: {
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  franjaTitle: {
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 13,
    lineHeight: 1.3,
    color: '#14171c',
  },
  listRow: {
    display: 'flex',
    gap: 14,
    padding: '16px 0',
    borderTop: '1px solid #e3e6ec',
  },
  listDayNum: {
    flex: 'none',
    width: 40,
    paddingTop: 2,
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 800,
    fontSize: 20,
    color: '#14171c',
  },
  listWeekday: {
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#9098a3',
  },
  listEvents: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 },
  listEvent: { cursor: 'pointer', display: 'flex', gap: 10 },
  listThumb: {
    position: 'relative',
    flex: 'none',
    width: 72,
    height: 72,
    background: '#dce1e8',
  },
  listCarrera: {
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  listTitle: {
    fontFamily: 'Inter, Arial, Helvetica, sans-serif',
    fontWeight: 700,
    fontSize: 13.5,
    lineHeight: 1.3,
    color: '#14171c',
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
