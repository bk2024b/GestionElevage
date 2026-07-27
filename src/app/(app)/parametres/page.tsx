import { createClient } from '@/lib/supabase/server'
import { modifierProfil, changerMotDePasse } from './actions'
import { signOut } from '../../(auth)/actions'
import { Input, Field } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

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
    <div className="max-w-md md:max-w-4xl mx-auto px-5 py-6">
      <h1 className="text-xl md:text-2xl font-bold mb-5">Paramètres</h1>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-control px-3 py-2 mb-4">{error}</p>
      )}
      {success === '1' && (
        <p className="text-sm text-accent-green bg-accent-green-soft rounded-control px-3 py-2 mb-4">Profil mis à jour.</p>
      )}
      {success === 'mdp' && (
        <p className="text-sm text-accent-green bg-accent-green-soft rounded-control px-3 py-2 mb-4">Mot de passe modifié.</p>
      )}

      <div className="md:grid md:grid-cols-2 md:gap-6">
        <Card className="mb-6 md:mb-0">
          <h2 className="text-sm font-semibold text-ink-soft mb-4">Profil de l'élevage</h2>
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
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="text-sm font-semibold text-ink-soft mb-4">Sécurité</h2>
            <form action={changerMotDePasse} className="flex flex-col gap-3">
              <Field label="Nouveau mot de passe">
                <Input
                  name="nouveau_mot_de_passe"
                  type="password"
                  minLength={6}
                  required
                />
              </Field>
              <Button type="submit" variante="secondaire">
                Changer le mot de passe
              </Button>
            </form>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-ink-soft mb-4">Compte</h2>
            <p className="text-sm text-ink-soft mb-3">{user?.email}</p>
            <form action={signOut}>
              <Button type="submit" variante="danger" className="w-full">
                Se déconnecter
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}