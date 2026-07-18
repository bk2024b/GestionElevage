import { creerRessource } from '../actions'
import { Input, Textarea, Select, Field } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default async function NouvelleRessourcePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/admin/ressources" className="text-sm text-ink-soft">← Retour</Link>
      </div>
      <h1 className="text-xl font-display font-semibold mb-5">Nouvelle ressource</h1>

      {error && (
        <p className="text-sm text-danger bg-danger/10 rounded-card px-3 py-2 mb-3">{error}</p>
      )}

      <form action={creerRessource} className="flex flex-col gap-3">
        <Input name="titre" type="text" placeholder="Titre" required />

        <Field label="Type">
          <Select name="type" required defaultValue="document">
            <option value="document">Document</option>
            <option value="cours">Formation</option>
          </Select>
        </Field>

        <Input name="categorie" type="text" placeholder="Catégorie (ex: Reproduction, Santé...)" />
        <Textarea name="description" placeholder="Description" rows={3} />
        <Input name="image_url" type="url" placeholder="URL image de couverture (optionnel)" />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="gratuit" className="w-4 h-4" />
          Ressource gratuite
        </label>

        <Field label="Lien d'accès direct (si gratuit)">
          <Input name="url_acces" type="url" placeholder="https://..." />
        </Field>

        <Field label="Lien page de vente Chariow (si payant)">
          <Input name="chariow_url" type="url" placeholder="https://chariow.com/..." />
        </Field>

        <Input name="ordre" type="number" placeholder="Ordre d'affichage (0 = premier)" defaultValue={0} />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="publie" defaultChecked className="w-4 h-4" />
          Publier immédiatement
        </label>

        <Button type="submit" variante="primaire" className="mt-1">
          Créer la ressource
        </Button>
      </form>
    </div>
  )
}