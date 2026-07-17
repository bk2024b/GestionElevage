import { signIn } from '../actions'
import { Input, Field } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 max-w-sm mx-auto">
      <div className="flex flex-col items-center mb-8">
        <span className="w-12 h-12 rounded-card bg-ink text-paper flex items-center justify-center font-display font-semibold text-sm mb-3">
          EL
        </span>
        <h1 className="text-xl font-display font-semibold">Connexion</h1>
        <p className="text-sm text-ink-soft mt-1">Retrouve ton élevage</p>
      </div>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-card px-3 py-2 mb-4">{error}</p>
      )}

      <form action={signIn} className="flex flex-col gap-3">
        <Field label="Email">
          <Input name="email" type="email" required />
        </Field>
        <Field label="Mot de passe">
          <Input name="password" type="password" required />
        </Field>
        <Button type="submit" variante="primaire" className="mt-2">
          Se connecter
        </Button>
      </form>

      <Link href="/register" className="text-sm text-center text-ink-soft mt-6">
        Pas encore de compte ? <span className="text-ink font-medium">Créer un compte</span>
      </Link>
    </div>
  )
}