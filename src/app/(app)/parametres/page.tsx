import { createClient } from '@/lib/supabase/server'
import { modifierProfil, changerMotDePasse } from './actions'
import { signOut } from '../../(auth)/actions'

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
    <div className="px-6 py-6 max-w-md">
      <h1 className="text-xl font-medium mb-4">Paramètres</h1>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2 mb-3">{error}</p>
      )}
      {success === '1' && (
        <p className="text-sm text-green-700 bg-green-50 rounded-md px-3 py-2 mb-3">Profil mis à jour.</p>
      )}
      {success === 'mdp' && (
        <p className="text-sm text-green-700 bg-green-50 rounded-md px-3 py-2 mb-3">Mot de passe modifié.</p>
      )}

      <section className="mb-8">
        <h2 className="text-sm font-medium text-gray-600 mb-3">Profil de l'élevage</h2>
        <form action={modifierProfil} className="flex flex-col gap-3">
          <label className="text-sm text-gray-600">
            Ton nom
            <input name="nom" type="text" defaultValue={profil?.nom ?? ''} required className="border rounded-md px-3 py-2 w-full mt-1" />
          </label>
          <label className="text-sm text-gray-600">
            Nom de l'élevage
            <input name="nom_elevage" type="text" defaultValue={profil?.nom_elevage ?? ''} required className="border rounded-md px-3 py-2 w-full mt-1" />
          </label>
          <label className="text-sm text-gray-600">
            Téléphone
            <input name="telephone" type="tel" defaultValue={profil?.telephone ?? ''} className="border rounded-md px-3 py-2 w-full mt-1" />
          </label>
          <label className="text-sm text-gray-600">
            Adresse
            <input name="adresse" type="text" defaultValue={profil?.adresse ?? ''} className="border rounded-md px-3 py-2 w-full mt-1" />
          </label>
          <button type="submit" className="bg-[#1F2B22] text-white rounded-md py-2 mt-2">
            Enregistrer
          </button>
        </form>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-medium text-gray-600 mb-3">Sécurité</h2>
        <form action={changerMotDePasse} className="flex flex-col gap-3">
          <label className="text-sm text-gray-600">
            Nouveau mot de passe
            <input
              name="nouveau_mot_de_passe"
              type="password"
              minLength={6}
              required
              className="border rounded-md px-3 py-2 w-full mt-1"
            />
          </label>
          <button type="submit" className="border border-[#1F2B22] text-[#1F2B22] rounded-md py-2">
            Changer le mot de passe
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-sm font-medium text-gray-600 mb-3">Compte</h2>
        <p className="text-sm text-gray-500 mb-3">{user?.email}</p>
        <form action={signOut}>
          <button type="submit" className="text-sm text-red-600">Se déconnecter</button>
        </form>
      </section>
    </div>
  )
}