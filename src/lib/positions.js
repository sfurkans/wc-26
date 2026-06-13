// Pozisyon sabitleri & yardımcıları (mevcut index.html'den taşındı)
export const DEF_POS = ['CB', 'RB', 'LB']
export const MID_POS = ['DM', 'CM', 'AM', 'LM', 'RM']
export const FWD_POS = ['LW', 'RW', 'CF', 'SS']

export function posSection(p) {
  if (p === 'GK') return 'GK'
  if (DEF_POS.includes(p)) return 'DEF'
  if (MID_POS.includes(p)) return 'MID'
  if (FWD_POS.includes(p)) return 'FWD'
  return 'MID'
}

export const SECTION_ORDER = ['GK', 'DEF', 'MID', 'FWD']
export const SECTION_LABEL = { GK: 'KALECİ', DEF: 'DEFANS', MID: 'ORTA SAHA', FWD: 'FORVET' }
export const SECTION_ICON = { GK: '🧤', DEF: '🛡️', MID: '⚙️', FWD: '⚡' }
export const POS_SORT = { GK: 0, CB: 1, RB: 2, LB: 3, DM: 4, CM: 5, AM: 6, LM: 7, RM: 8, LW: 9, RW: 10, CF: 11, SS: 12 }
