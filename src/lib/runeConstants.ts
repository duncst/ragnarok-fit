// Rune mapping for days of the week
export const RUNE_MAP = {
  'Mon': 'ᚱ',
  'Tue': 'ᚢ',
  'Wed': 'ᚦ',
  'Thu': 'ᚨ',
  'Fri': 'ᛏ',
  'Sat': 'ᛜ',
  'Sun': 'ᛉ'
} as const;

export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export type DayName = typeof WEEK_DAYS[number];
