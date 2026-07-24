import { LegalPage } from '@/components/legal/LegalPage'

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de Confidentialité" majAt="18 juillet 2026">
      <section>
        <h2>1. Responsable du traitement</h2>
        <p>
          [Ton nom / raison sociale], basé à Cotonou, Bénin, est responsable du
          traitement des données collectées par l'Application « Élevage ».
        </p>
      </section>

      <section>
        <h2>2. Données collectées</h2>
        <ul>
          <li>Données de compte : nom, nom de l'élevage, email, téléphone (si renseigné)</li>
          <li>Données d'élevage : fiches de lapins, reproduction, naissances, santé, alimentation, finances</li>
          <li>Données techniques : identifiant de session, journaux de connexion basiques</li>
        </ul>
      </section>

      <section>
        <h2>3. Finalité du traitement</h2>
        <p>
          Ces données servent exclusivement à fournir le service : afficher ton
          tableau de bord, calculer les dates de reproduction, générer les rappels,
          produire tes statistiques et exports. Elles ne sont ni vendues ni utilisées
          à des fins publicitaires.
        </p>
      </section>

      <section>
        <h2>4. Hébergement</h2>
        <p>
          Les données sont hébergées via Supabase, un prestataire cloud qui stocke les
          données sur des infrastructures sécurisées. Aucune donnée n'est stockée sur
          l'appareil de tiers non autorisés.
        </p>
      </section>

      <section>
        <h2>5. Partage avec des tiers</h2>
        <p>
          Aucune donnée d'élevage n'est partagée avec des tiers. En cas de paiement via
          une plateforme comme Chariow, seules les informations nécessaires à la
          transaction (nom, email, téléphone) sont transmises à ce prestataire, selon
          sa propre politique de confidentialité.
        </p>
      </section>

      <section>
        <h2>6. Durée de conservation</h2>
        <p>
          Tes données sont conservées tant que ton compte est actif. En cas de
          suppression de compte, les données sont effacées dans un délai raisonnable,
          sauf obligation légale de conservation.
        </p>
      </section>

      <section>
        <h2>7. Tes droits</h2>
        <p>
          Tu peux à tout moment demander l'accès, la rectification ou la suppression
          de tes données en nous contactant. Certaines données peuvent être modifiées
          directement depuis la page Paramètres de l'Application.
        </p>
      </section>

      <section>
        <h2>8. Sécurité</h2>
        <p>
          L'accès à tes données est protégé par authentification et des règles de
          sécurité au niveau de la base de données (chaque éleveur ne peut voir que ses
          propres informations).
        </p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          Pour toute question sur tes données : <a href="https://wa.me/22940545270" className="text-ink underline">WhatsApp</a>.
        </p>
      </section>
    </LegalPage>
  )
}