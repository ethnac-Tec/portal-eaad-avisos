// Campus is a Notion multi-select, so an aviso's `campus` field can be a
// comma-joined string like "Hidalgo, Guadalajara". These helpers split
// that back into a list and build the set of all campuses actually
// present in the data, instead of a hardcoded list.

export function splitCampuses(campusStr) {
  return (campusStr || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function getAllCampuses(avisos) {
  const set = new Set();
  avisos.forEach((a) => splitCampuses(a.campus).forEach((c) => set.add(c)));
  return [...set].sort((a, b) => a.localeCompare(b, 'es'));
}

export function matchesCampus(aviso, campus) {
  return !campus || splitCampuses(aviso.campus).includes(campus);
}
