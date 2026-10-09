// Kichik yordamchi funksiyalar

const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];

// "2026-10-23" -> "23-oktabrgacha"
export function formatUntil(iso) {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  return `${date.getDate()}-${MONTHS[date.getMonth()]}gacha`;
}

// Vaqtni "5 daqiqa oldin" ko'rinishida beradi
export function timeAgo(iso) {
  const seconds = (Date.now() - new Date(iso).getTime()) / 1000;
  if (seconds < 60) return "hozirgina";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} daqiqa oldin`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} soat oldin`;
  return `${Math.floor(hours / 24)} kun oldin`;
}
