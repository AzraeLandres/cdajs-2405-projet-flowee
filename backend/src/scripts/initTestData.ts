import { dataSource } from "../dataSource/dataSource";
import { Account } from "../entities/Account";
import { Client } from "../entities/Client";
import { Project } from "../entities/Project";
import { AccountStatus } from "../enums/AccountStatus";
import { ProjectStatus } from "../enums/ProjectStatus";
import { Role } from "../enums/Role";

/**
 * Crée un projet de test complet avec account + client associés
 */
export async function CreateTestData(
  projectName: string,
  clientName: string,
  clientEmail: string,
  description: string,
  startDate: string,
  endDate: string
) {
  const companyUserId = 3; // ou autre ID statique/temporaire pour test

  let account = await dataSource.manager.findOne(Account, {
    where: { email: clientEmail },
  });

  if (!account) {
    account = dataSource.manager.create(Account, {
      email: clientEmail,
      password: "changeme",
      role: Role.CLIENT,
      status: AccountStatus.PENDING,
    });
    await dataSource.manager.save(Account, account);
  }

  let client = await dataSource.manager.findOne(Client, {
    where: { account: { id: account.id } },
    relations: ["account"],
  });

  if (!client) {
    client = dataSource.manager.create(Client, {
      clientName,
      account,
    });
    await dataSource.manager.save(Client, client);
  }

  const project = dataSource.manager.create(Project, {
    projectName,
    description,
    startDate,
    endDate,
    status: ProjectStatus.NOT_STARTED,
    client,
    companyUserId,
  });

  await dataSource.manager.save(Project, project);

  console.log(`✅ Projet "${projectName}" créé avec client ${clientName}`);
}

export async function initTestData() {
  await CreateTestData(
    "Refonte e-commerce textile",
    "Maison Verlaine",
    "contact@maisonverlaine.fr",
    "Mise en place d'une nouvelle boutique en ligne avec gestion du stock, des paiements et du catalogue produits.",
    "2024-09-15",
    "2025-03-30"
  );
  await CreateTestData(
    "Application mobile de réservation de soins",
    "ZenSpace Spa",
    "resa@zenspace.fr",
    "Développement d'une application mobile permettant la réservation de soins bien-être et massages, avec gestion des plannings et des créneaux.",
    "2024-11-01",
    "2025-05-20"
  );
  await CreateTestData(
    "CRM sur-mesure pour PME industrielles",
    "TechIndus Solutions",
    "support@techindus.io",
    "Développement d'une solution CRM adaptée aux besoins spécifiques des PME industrielles (suivi de prospects B2B, gestion des appels d'offres et pipeline de vente).",
    "2024-08-20",
    "2025-02-28"
  );
  await CreateTestData(
    "Plateforme RH - Onboarding collaborateur",
    "HumanFirst HR",
    "hr@humanfirst.io",
    "Mise en place d'un portail RH dédié à l'onboarding de nouveaux collaborateurs (signature contrat, checklist administrative, accès aux outils internes).",
    "2024-10-10",
    "2025-03-31"
  );
}
