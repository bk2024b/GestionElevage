'use client'

import type { StatsLapin } from '@/lib/statistiques'

export function ExportReproducteurs({ stats, nomElevage }: { stats: StatsLapin[]; nomElevage: string }) {
  async function exporterPDF() {
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text(nomElevage, 14, 18)
    doc.setFontSize(11)
    doc.text(`Performance par reproducteur — ${new Date().toLocaleDateString('fr-FR')}`, 14, 26)

    autoTable(doc, {
      startY: 34,
      head: [['ID', 'Sexe', 'Accoupl.', 'Gestations', 'Mises bas', 'Lapereaux', 'Morts', 'Dépenses']],
      body: stats.map((s) => [
        s.identifiant,
        s.sexe,
        String(s.nbAccouplements),
        String(s.nbGestationsReussies),
        String(s.nbMisesBas),
        String(s.nbLapereauxTotal),
        String(s.nbLapereauxMorts),
        `${s.totalDepenses.toLocaleString('fr-FR')} F`,
      ]),
      styles: { fontSize: 8 },
    })

    doc.save(`reproducteurs-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  async function exporterExcel() {
    const XLSX = await import('xlsx')

    const donnees = stats.map((s) => ({
      Identifiant: s.identifiant,
      Nom: s.nom ?? '',
      Sexe: s.sexe,
      Accouplements: s.nbAccouplements,
      'Gestations réussies': s.nbGestationsReussies,
      'Mises bas': s.nbMisesBas,
      'Lapereaux total': s.nbLapereauxTotal,
      'Lapereaux morts': s.nbLapereauxMorts,
      'Dépenses (FCFA)': s.totalDepenses,
    }))

    const feuille = XLSX.utils.json_to_sheet(donnees)
    const classeur = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(classeur, feuille, 'Reproducteurs')
    XLSX.writeFile(classeur, `reproducteurs-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="flex gap-2">
      <button onClick={exporterPDF} className="tap flex-1 text-sm border border-ink text-ink rounded-card py-2.5">
        Export PDF
      </button>
      <button onClick={exporterExcel} className="tap flex-1 text-sm border border-ink text-ink rounded-card py-2.5">
        Export Excel
      </button>
    </div>
  )
}