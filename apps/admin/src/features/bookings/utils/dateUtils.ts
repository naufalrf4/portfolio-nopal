export interface WeekDates {
  start: Date;
  end: Date;
  days: Date[];
}

function getServerDate(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const serverTime = new Date(utc + 7 * 60 * 60 * 1000);
  return serverTime;
}

export function getWeekDates(date: Date): WeekDates {
  const serverDate = getServerDate();
  const targetDate = date || serverDate;

  const start = new Date(targetDate);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(day.getDate() + i);
    days.push(day);
  }

  return { start, end, days };
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
}

export function formatDateFull(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
}

export function formatDateISO(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
}

export function calculateEndTime(startTime: string, durationMinutes: number = 60): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}

export function isToday(date: Date): boolean {
  const serverDate = getServerDate();
  return formatDateISO(serverDate) === formatDateISO(date);
}

export function isThisWeek(weekStart: Date): boolean {
  const serverDate = getServerDate();
  const thisWeek = getWeekDates(serverDate);
  return formatDateISO(thisWeek.start) === formatDateISO(weekStart);
}
