import { recupererEvenements } from '@/lib/calendrier'
import { CalendarView } from '@/components/calendrier/CalendarView'

export default async function CalendrierPage() {
  const evenements = await recupererEvenements()

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      <h1 className="text-xl font-display font-semibold mb-5">Calendrier</h1>
      <CalendarView evenements={evenements} />
    </div>
  )
}