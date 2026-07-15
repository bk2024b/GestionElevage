'use client'

interface StatsData {
  totalLapins: number
  totalAccouplements: number
  tauxReproduction: number
  totalNes: number
  totalMorts: number
  tauxMortalite: number
  totalDisponibles: number
  totalSevres: number
  tauxMortaliteSevrage: number
  revenus: number
  depenses: number
  benefice: number
}

export function ExportButtons({ stats, nomElevage }: { stats: StatsData; nomElevage: string }) {
  async function exporterPDF() {
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text(nomElevage, 14, 18)
    doc.setFontSize(11)
    doc.text(`Rapport statistique — ${new Date().toLocaleDateString('fr-FR')}`, 14, 26)

    autoTable(doc, {
      startY: 34,
      head: [['Indicateur', 'Valeur']],
      body: [
        ['Total lapins', String(stats.totalLapins)],
        ['Accouplements', String(stats.totalAccouplements)],
        ['Taux de reproduction', `${stats.tauxReproduction} %`],
        ['Lapereaux nés', String(stats.totalNes)],
        ['Taux de mortalité (naissance)', `${stats.tauxMortalite} %`],
        ['Lapereaux sevrés', `${stats.totalSevres} / ${stats.totalDisponibles}`],
        ['Taux de mortalité (sevrage)', `${stats.tauxMortaliteSevrage} %`],
        ['Revenus', `${stats.revenus.toLocaleString('fr-FR')} F`],
        ['Dépenses', `${stats.depenses.toLocaleString('fr-FR')} F`],
        ['Bénéfice', `${stats.benefice.toLocaleString('fr-FR')} F`],
      ],
    })

    doc.save(`statistiques-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  async function exporterExcel() {
    const XLSX = await import('xlsx')

    const donnees = [
      { Indicateur: 'Total lapins', Valeur: stats.totalLapins },
      { Indicateur: 'Accouplements', Valeur: stats.totalAccouplements },
      { Indicateur: 'Taux de reproduction (%)', Valeur: stats.tauxReproduction },
      { Indicateur: 'Lapereaux nés', Valeur: stats.totalNes },
      { Indicateur: 'Taux de mortalité naissance (%)', Valeur: stats.tauxMortalite },
      { Indicateur: 'Lapereaux sevrés', Valeur: stats.totalSevres },
      { Indicateur: 'Lapereaux disponibles', Valeur: stats.totalDisponibles },
      { Indicateur: 'Taux de mortalité sevrage (%)', Valeur: stats.tauxMortaliteSevrage },
      { Indicateur: 'Revenus (FCFA)', Valeur: stats.revenus },
      { Indicateur: 'Dépenses (FCFA)', Valeur: stats.depenses },
      { Indicateur: 'Bénéfice (FCFA)', Valeur: stats.benefice },
    ]

    const feuille = XLSX.utils.json_to_sheet(donnees)
    const classeur = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(classeur, feuille, 'Statistiques')
    XLSX.writeFile(classeur, `statistiques-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="flex gap-2">
      <button onClick={exporterPDF} className="flex-1 text-sm border border-[#1F2B22] text-[#1F2B22] rounded-md py-2">
        Export PDF
      </button>
      <button onClick={exporterExcel} className="flex-1 text-sm border border-[#1F2B22] text-[#1F2B22] rounded-md py-2">
        Export Excel
      </button>
    </div>
  )
}