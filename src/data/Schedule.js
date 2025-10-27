// Prosty “silnik” rozkładu na podstawie rules w flights.json

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function toISO(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

export function addMinutes(hhmm, minutes) {
  const [hh, mm] = hhmm.split(":").map(Number);
  const total = hh * 60 + mm + (minutes || 0);
  const totalPos = ((total % (24 * 60)) + (24 * 60)) % (24 * 60);
  const h2 = Math.floor(totalPos / 60);
  const m2 = totalPos % 60;
  return `${pad2(h2)}:${pad2(m2)}`;
}

export function ruleMatchesDate(rule, isoDate) {
  const date = parseISO(isoDate);
  const wd = DOW[date.getDay()];

  if (rule.season?.from && isoDate < rule.season.from) return false;
  if (rule.season?.to && isoDate > rule.season.to) return false;

  if (Array.isArray(rule.exceptions) && rule.exceptions.includes(isoDate))
    return false;
  if (Array.isArray(rule.extraDates) && rule.extraDates.includes(isoDate))
    return true;

  return Array.isArray(rule.daysOfWeek) && rule.daysOfWeek.includes(wd);
}

export function rulesForRoute(rules, origin, destination) {
  return rules.filter(
    (r) => r.origin?.code === origin && r.destination?.code === destination
  );
}

export function listAvailableDates(rules, origin, destination, pivotISO, spanDays) {
  const routeRules = rulesForRoute(rules, origin, destination);
  if (!routeRules.length) return [];
  const span = spanDays || 365; // ile dni do przodu szukamy
  const start = parseISO(pivotISO);
  const out = [];
  for (let i = -7; i <= span; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = toISO(d);
    if (routeRules.some((r) => ruleMatchesDate(r, iso))) out.push(iso);
  }
  // unikat + sort
  return Array.from(new Set(out)).sort();
}

export function getReachableAirports(rules, origin) {
  const set = new Map();
  rules
    .filter((r) => r.origin?.code === origin)
    .forEach((r) => set.set(r.destination.code, r.destination.name));
  return Array.from(set.entries())
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

export function buildFlightFromRule(rule, isoDate) {
  const dep = rule.departure; // "HH:MM"
  const arr = addMinutes(dep, rule.durationMin || 0);
  const durationMin = rule.durationMin || 0;
  const h = Math.floor(durationMin / 60);
  const m = durationMin % 60;

  return {
    id: `${rule.id}-${isoDate}-${dep}`,
    dateISO: isoDate,
    origin: rule.origin,
    destination: rule.destination,
    flightNo: rule.id,
    departTime: dep,
    arriveTime: arr,
    durationText: `${h} h ${pad2(m)} min`,
    durationMin,
    direct: !!rule.direct,
    aircraft: rule.aircraft || "",
    pricePLN: rule.pricePLN ?? rule.price ?? 0,
  };
}

export function findFlightsForDate(rules, origin, destination, isoDate) {
  const routeRules = rulesForRoute(rules, origin, destination);
  const ok = routeRules.filter((r) => ruleMatchesDate(r, isoDate));
  return ok
    .map((r) => buildFlightFromRule(r, isoDate))
    .sort((a, b) => (a.departTime < b.departTime ? -1 : 1));
}
