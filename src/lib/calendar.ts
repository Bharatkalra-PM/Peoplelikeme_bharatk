/**
 * Calendar utilities: Jitsi video URL generation and .ics download
 */

export function generateJitsiUrl(sessionKind: string, id: string): string {
  const cleanId = id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
  return `https://meet.jit.si/plm-${sessionKind}-${cleanId}`;
}

export function generateIcsContent({
  title,
  description,
  startsAt,
  durationMin,
  videoUrl,
}: {
  title: string;
  description: string;
  startsAt: string;
  durationMin: number;
  videoUrl: string;
}): string {
  const startDate = new Date(startsAt);
  const endDate = new Date(startDate.getTime() + durationMin * 60 * 1000);

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const now = formatDate(new Date());
  const startStr = formatDate(startDate);
  const endStr = formatDate(endDate);
  const uid = `plm-${Date.now()}@peoplelikeme.app`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//People Like Me//Session Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')} - Video Link: ${videoUrl}`,
    `LOCATION:${videoUrl}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT10M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Session starting in 10 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcsFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
