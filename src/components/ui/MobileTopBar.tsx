import Link from 'next/link'
import { Bell } from 'lucide-react'
import { MobileMenu } from './MobileMenu'

export function MobileTopBar({ isAdmin, nbRappels }: { isAdmin: boolean; nbRappels: number }) {
  return (
    <div className="md:hidden flex items-center justify-between px-5 pt-4 pb-1 safe-top">
      <MobileMenu isAdmin={isAdmin} />
      <Link href="/rappels" className="tap relative w-10 h-10 flex items-center justify-center rounded-full">
        <Bell size={20} className="text-ink" />
        {nbRappels > 0 && (
          <span className="absolute top-1.5 right-2 w-2.5 h-2.5 rounded-full bg-accent-green" />
        )}
      </Link>
    </div>
  )
}