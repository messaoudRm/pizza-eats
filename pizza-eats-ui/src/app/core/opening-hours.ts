import { OpeningHours, OpeningInterval } from './models/brand.model';

const DAY_NAMES = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

export interface SimulatedTime {
  iso: string;
  label: string;
}

// Date du jour à Paris (l'API vérifie les horaires en heure de Paris)
function getParisToday(): { year: number; month: number; day: number } {
  const formatted = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  const parts = formatted.split('-');
  return { year: Number(parts[0]), month: Number(parts[1]), day: Number(parts[2]) };
}

// Décalage horaire de Paris pour une date donnée, ex. "+01:00"
function getParisOffset(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Paris',
    timeZoneName: 'longOffset',
  }).formatToParts(date);
  const zone = parts.find((part) => part.type === 'timeZoneName');
  if (zone && zone.value.length > 3) {
    return zone.value.slice(3);
  }
  return '+00:00';
}

function addMinutes(time: string, minutes: number): string {
  const parts = time.split(':');
  const total = Number(parts[0]) * 60 + Number(parts[1]) + minutes;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return `${String(hours).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function formatIntervals(intervals: OpeningInterval[]): string {
  const labels: string[] = [];
  for (const interval of intervals) {
    labels.push(`${interval.open} – ${interval.close}`);
  }
  return labels.join(' · ');
}

// Horaires du jour, ex. "11:30 – 14:30 · 18:30 – 22:30"
export function getTodayHours(hours: OpeningHours): string {
  const today = getParisToday();
  const weekDay = new Date(Date.UTC(today.year, today.month - 1, today.day, 12)).getUTCDay();
  const intervals = hours[String(weekDay)];

  if (!intervals || intervals.length === 0) {
    return "Fermé aujourd'hui";
  }
  return formatIntervals(intervals);
}

// Prochain créneau d'ouverture (15 min après l'ouverture), pour la démo "Simuler une heure"
export function findOpeningSlot(hours: OpeningHours): SimulatedTime | null {
  const today = getParisToday();

  for (let offset = 0; offset < 7; offset++) {
    const date = new Date(Date.UTC(today.year, today.month - 1, today.day + offset, 12));
    const weekDay = date.getUTCDay();
    const intervals = hours[String(weekDay)];

    if (intervals && intervals.length > 0) {
      const time = addMinutes(intervals[0].open, 15);
      const isoDate = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;

      return {
        iso: `${isoDate}T${time}:00${getParisOffset(date)}`,
        label: `${DAY_NAMES[weekDay]} ${date.getUTCDate()} à ${time.replace(':', 'h')}`,
      };
    }
  }
  return null;
}
