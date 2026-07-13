import { signIn } from '../actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <main className="flex min-h-screen flex-col justify-center px-6 max-w-sm mx-auto gap-4">
      <h1 className="text-2xl font-medium">Connexion</h1>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">{error}</p>
      )}

      <form action={signIn} className="flex flex-col gap-3">
        <input name="email" type="email" placeholder="Email" required className="border rounded-md px-3 py-2" />
        <input name="password" type="password" placeholder="Mot de passe" required className="border rounded-md px-3 py-2" />
        <button type="submit" className="bg-[#1F2B22] text-white rounded-md py-2 mt-2">
          Se connecter
        </button>
      </form>

      <a href="/register" className="text-sm text-center text-[#5F5E5A]">
        Pas encore de compte ? Créer un compte
      </a>
    </main>
  )
}