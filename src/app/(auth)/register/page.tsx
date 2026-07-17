import { signUp } from '../actions'
import { Input, Field } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 max-w-sm mx-auto py-10">
      <div className="flex flex-col items-center mb-8">
        <span className="w-12 h-12 rounded-card bg-ink text-paper flex items-center justify-center font-display font-semibold text-sm mb-3">
          EL
        </span>
        <h1 className="text-xl font-display font-semibold">Créer un compte</h1>
        <p className="text-sm text-ink-soft mt-1">Gratuit, prêt en une minute</p>
      </div>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-card px-3 py-2 mb-4">{error}</p>
      )}

      <form action={signUp} className="flex flex-col gap-3">
        <Field label="Ton nom">
          <Input name="nom" type="text" required />
        </Field>
        <Field label="Nom de l'élevage">
          <Input name="nom_elevage" type="text" required />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" required />
        </Field>
        <Field label="Mot de passe">
          <Input name="password" type="password" required minLength={6} />
        </Field>
        <Button type="submit" variante="primaire" className="mt-2">
          Créer mon compte
        </Button>
      </form>

      <Link href="/login" className="text-sm text-center text-ink-soft mt-6">
        Déjà un compte ? <span className="text-ink font-medium">Se connecter</span>
      </Link>
    </div>
  )
}