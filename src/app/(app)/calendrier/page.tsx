import { recupererEvenements } from '@/lib/calendrier'
import { CalendarView } from '@/components/calendrier/CalendarView'

export default async function CalendrierPage() {
  const evenements = await recupererEvenements()

  return (
    <div className="px-6 py-6">
      <h1 className="text-xl font-medium mb-4">Calendrier</h1>
      <CalendarView evenements={evenements} />
    </div>
  )
}