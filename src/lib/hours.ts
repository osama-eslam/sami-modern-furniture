import { business } from "@/config/business";

/** Current day/minutes in Cairo, independent of the visitor's timezone. */
const cairoNow = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Cairo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const minutes = (Number(get("hour")) % 24) * 60 + Number(get("minute"));
  return { day, minutes };
};

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const isOpenNow = (date?: Date) => {
  const { day, minutes } = cairoNow(date);
  const today = business.hours.find((h) => h.day === day);
  if (!today) return false;
  return minutes >= toMin(today.open) && minutes < toMin(today.close);
};

export const todayIndex = () => cairoNow().day;
