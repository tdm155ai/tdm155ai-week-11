export const places = [
  ['Kiritimati', 'Pacific/Kiritimati', 1.87, -157.43],
  ['Chatham Islands', 'Pacific/Chatham', -43.95, -176.55],
  ['Auckland', 'Pacific/Auckland', -36.85, 174.76],
  ['Suva', 'Pacific/Fiji', -18.14, 178.44],
  ['Sydney', 'Australia/Sydney', -33.87, 151.21],
  ['Adelaide', 'Australia/Adelaide', -34.93, 138.60],
  ['Brisbane', 'Australia/Brisbane', -27.47, 153.03],
  ['Darwin', 'Australia/Darwin', -12.46, 130.84],
  ['Tokyo', 'Asia/Tokyo', 35.68, 139.69],
  ['Seoul', 'Asia/Seoul', 37.57, 126.98],
  ['Singapore', 'Asia/Singapore', 1.35, 103.82],
  ['Hong Kong', 'Asia/Hong_Kong', 22.32, 114.17],
  ['Perth', 'Australia/Perth', -31.95, 115.86],
  ['Bangkok', 'Asia/Bangkok', 13.76, 100.50],
  ['Jakarta', 'Asia/Jakarta', -6.21, 106.85],
  ['Yangon', 'Asia/Yangon', 16.87, 96.20],
  ['Dhaka', 'Asia/Dhaka', 23.81, 90.41],
  ['Kathmandu', 'Asia/Kathmandu', 27.72, 85.32],
  ['New Delhi', 'Asia/Kolkata', 28.61, 77.21],
  ['Karachi', 'Asia/Karachi', 24.86, 67.01],
  ['Kabul', 'Asia/Kabul', 34.56, 69.21],
  ['Dubai', 'Asia/Dubai', 25.20, 55.27],
  ['Tehran', 'Asia/Tehran', 35.69, 51.39],
  ['Nairobi', 'Africa/Nairobi', -1.29, 36.82],
  ['Johannesburg', 'Africa/Johannesburg', -26.20, 28.05],
  ['Paris', 'Europe/Paris', 48.86, 2.35],
  ['London', 'Europe/London', 51.51, -0.13],
  ['Accra', 'Africa/Accra', 5.60, -0.19],
  ['Praia', 'Atlantic/Cape_Verde', 14.93, -23.51],
  ['Fernando de Noronha', 'America/Noronha', -3.85, -32.42],
  ['São Paulo', 'America/Sao_Paulo', -23.55, -46.63],
  ['St. John’s', 'America/St_Johns', 47.56, -52.71],
  ['Halifax', 'America/Halifax', 44.65, -63.57],
  ['New York', 'America/New_York', 40.71, -74.01],
  ['Cambridge, MA', 'America/New_York', 42.3736, -71.1097],
  ['Chicago', 'America/Chicago', 41.88, -87.63],
  ['Denver', 'America/Denver', 39.74, -104.99],
  ['Los Angeles', 'America/Los_Angeles', 34.05, -118.24],
  ['Anchorage', 'America/Anchorage', 61.22, -149.90],
  ['Honolulu', 'Pacific/Honolulu', 21.31, -157.86],
  ['Pago Pago', 'Pacific/Pago_Pago', -14.28, -170.70],
];

// Resolve civil midnight with the runtime's IANA time-zone database (including DST).
export function unlockAt(zone) {
  const target = Date.UTC(2026, 10, 19);
  const format = new Intl.DateTimeFormat('en-GB', {
    timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  });
  let guess = target;
  for (let pass = 0; pass < 4; pass++) {
    const parts = Object.fromEntries(format.formatToParts(guess).map(part => [part.type, part.value]));
    const local = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
    guess = target - (local - guess);
  }
  return guess;
}

export function midnightLongitude(time) {
  return Math.max(-180, Math.min(180, 180 - (time - Date.UTC(2026, 10, 18, 12)) / 86400000 * 360));
}

export function countdown(milliseconds) {
  let seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  return [hours, Math.floor(seconds / 60), seconds % 60].map(value => String(value).padStart(2, '0')).join(':');
}
