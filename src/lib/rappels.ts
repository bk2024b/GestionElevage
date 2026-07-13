export const LABEL_TYPE_RAPPEL: Record<string, string> = {
  nid: 'Préparation du nid',
  misebas: 'Mise bas prévue',
  sevrage: 'Sevrage',
  soin: 'Soin à faire',
  autre: 'Rappel',
}

export function estEnRetard(datePrevue: string) {
  return new Date(datePrevue) < new Date(new Date().toDateString())
}

export function estAujourdhui(datePrevue: string) {
  return new Date(datePrevue).toDateString() === new Date().toDateString()
}