import { LegalPage } from '@/components/legal/LegalPage'

export default function ConditionsUtilisationPage() {
  return (
    <LegalPage title="Conditions Générales d'Utilisation" majAt="18 juillet 2026">
      <section>
        <h2>1. Objet</h2>
        <p>
          Les présentes conditions régissent l'utilisation de l'application « Élevage »
          (ci-après « l'Application »), un service de gestion d'élevage cunicole édité
          par [Ton nom / raison sociale], basé à Cotonou, Bénin. En créant un compte,
          tu acceptes ces conditions.
        </p>
      </section>

      <section>
        <h2>2. Description du service</h2>
        <p>
          L'Application permet aux éleveurs de lapins de gérer leur cheptel : fiches
          individuelles, reproduction, naissances, santé, alimentation, finances,
          statistiques et rappels automatisés. L'Application est accessible via
          navigateur web ou installation en PWA (application progressive) sur mobile.
        </p>
      </section>

      <section>
        <h2>3. Création de compte</h2>
        <p>
          Tu dois fournir des informations exactes (nom, nom de l'élevage, email) lors
          de l'inscription. Tu es responsable de la confidentialité de ton mot de passe
          et de toute activité effectuée depuis ton compte.
        </p>
      </section>

      <section>
        <h2>4. Période d'essai et abonnement</h2>
        <p>
          Chaque nouveau compte bénéficie d'une période d'essai gratuite de 60 jours.
          Passé ce délai, l'accès à l'Application est suspendu tant qu'un abonnement
          n'est pas activé. L'activation se fait actuellement par confirmation manuelle
          après paiement (Mobile Money ou autre moyen convenu) ; le tarif en vigueur est
          communiqué avant tout engagement et peut évoluer, sans effet rétroactif sur
          une période déjà payée.
        </p>
      </section>

      <section>
        <h2>5. Utilisation des données saisies</h2>
        <p>
          Les informations que tu enregistres (fiches d'animaux, dates, montants,
          notes) restent ta propriété. L'Application les traite uniquement pour te
          fournir le service (calculs de dates, rappels, statistiques). Voir la{' '}
          <a href="/confidentialite" className="text-ink underline">Politique de Confidentialité</a>{' '}
          pour le détail.
        </p>
      </section>

      <section>
        <h2>6. Limites de responsabilité</h2>
        <p>
          Les dates calculées (mise bas, sevrage, etc.) et les statistiques sont des
          estimations fondées sur les données que tu saisis — elles ne remplacent pas
          un avis vétérinaire ou zootechnique professionnel. L'Application est fournie
          « en l'état » ; nous mettons tout en œuvre pour assurer sa disponibilité mais
          ne garantissons pas une absence totale d'interruption ou d'erreur.
        </p>
      </section>

      <section>
        <h2>7. Résiliation</h2>
        <p>
          Tu peux cesser d'utiliser l'Application à tout moment. En cas de non-paiement
          après la période d'essai ou de non-renouvellement, l'accès est suspendu ; les
          données restent conservées pendant une période raisonnable en cas de reprise
          d'abonnement, puis peuvent être supprimées.
        </p>
      </section>

      <section>
        <h2>8. Modification des conditions</h2>
        <p>
          Ces conditions peuvent être mises à jour. Les changements significatifs
          seront communiqués via l'Application ou par email.
        </p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          Pour toute question : <a href="https://wa.me/22940545270" className="text-ink underline">WhatsApp</a>.
        </p>
      </section>
    </LegalPage>
  )
}