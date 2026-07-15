import { createClient } from '@/lib/supabase/server'
import { modifierProfil, changerMotDePasse } from './actions'
import { signOut } from '../../(auth)/actions'
import { Input, Field } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default async function ParametresPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const { error, success } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profil } = await supabase.from('profils').select('*').eq('id', user!.id).single()

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      <h1 className="text-xl font-display font-semibold mb-5">Paramètres</h1>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-card px-3 py-2 mb-3">{error}</p>
      )}
      {success === '1' && (
        <p className="text-sm text-success bg-success/10 rounded-card px-3 py-2 mb-3">Profil mis à jour.</p>
      )}
      {success === 'mdp' && (
        <p className="text-sm text-success bg-success/10 rounded-card px-3 py-2 mb-3">Mot de passe modifié.</p>
      )}

      <section className="mb-8">
        <h2 className="text-sm font-medium text-ink-soft mb-3">Profil de l'élevage</h2>
        <form action={modifierProfil} className="flex flex-col gap-3">
          <Field label="Ton nom">
            <Input name="nom" type="text" defaultValue={profil?.nom ?? ''} required />
          </Field>
          <Field label="Nom de l'élevage">
            <Input name="nom_elevage" type="text" defaultValue={profil?.nom_elevage ?? ''} required />
          </Field>
          <Field label="Téléphone">
            <Input name="telephone" type="tel" defaultValue={profil?.telephone ?? ''} />
          </Field>
          <Field label="Adresse">
            <Input name="adresse" type="text" defaultValue={profil?.adresse ?? ''} />
          </Field>
          <Button type="submit" variante="primaire" className="mt-1">
            Enregistrer
          </Button>
        </form>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-medium text-ink-soft mb-3">Sécurité</h2>
        <form action={changerMotDePasse} className="flex flex-col gap-3">
          <Field label="Nouveau mot de passe">
            <Input name="nouveau_mot_de_passe" type="password" minLength={6} required />
          </Field>
          <Button type="submit" variante="secondaire">
            Changer le mot de passe
          </Button>
        </form>
      </section>

      <section>
        <h2 className="text-sm font-medium text-ink-soft mb-3">Compte</h2>
        <p className="text-sm text-ink-soft mb-3">{user?.email}</p>
        <form action={signOut}>
          <Button type="submit" variante="danger" className="w-full">
            Se déconnecter
          </Button>
        </form>
      </section>
    </div>
  )
}