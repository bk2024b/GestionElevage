import { recupererEvenements } from '@/lib/calendrier'
import { CalendarView } from '@/components/calendrier/CalendarView'

export default async function CalendrierPage() {
  const evenements = await recupererEvenements()

  return (
    <div className="max-w-md md:max-w-4xl mx-auto px-5 py-6">
      <h1 className="text-xl md:text-2xl font-bold mb-5">Calendrier</h1>
      <CalendarView evenements={evenements} />
    </div>
  )
}