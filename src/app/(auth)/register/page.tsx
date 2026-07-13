import { signUp } from '../actions'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <main className="flex min-h-screen flex-col justify-center px-6 max-w-sm mx-auto gap-4">
      <h1 className="text-2xl font-medium">Créer un compte</h1>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">{error}</p>
      )}

      <form action={signUp} className="flex flex-col gap-3">
        <input name="nom" type="text" placeholder="Ton nom" required className="border rounded-md px-3 py-2" />
        <input name="nom_elevage" type="text" placeholder="Nom de l'élevage" required className="border rounded-md px-3 py-2" />
        <input name="email" type="email" placeholder="Email" required className="border rounded-md px-3 py-2" />
        <input name="password" type="password" placeholder="Mot de passe" required minLength={6} className="border rounded-md px-3 py-2" />
        <button type="submit" className="bg-[#1F2B22] text-white rounded-md py-2 mt-2">
          Créer mon compte
        </button>
      </form>

      <a href="/login" className="text-sm text-center text-[#5F5E5A]">
        Déjà un compte ? Se connecter
      </a>
    </main>
  )
}