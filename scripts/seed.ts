/**
 * Seeds the local (or configured) D1 database with:
 *  - one admin account, from ADMIN_EMAIL / ADMIN_PASSWORD env vars
 *  - the same sample content used in Phase 1's mock data, so the site
 *    isn't empty after switching from static mock data to the database
 *
 * Usage:
 *   ADMIN_EMAIL=admin@brookfieldrealty.ng ADMIN_PASSWORD=change-me \
 *     npm run db:seed
 */
import "dotenv/config";
import { adminAccountCount, createAdmin } from "../src/server/db/queries/admins";
import { hashPassword } from "../src/server/auth/password";
import {
  adminCreateProperty,
  adminAddPropertyImage,
} from "../src/server/db/queries/properties";
import { adminCreateProject } from "../src/server/db/queries/projects";
import { adminCreateTeamMember } from "../src/server/db/queries/team";
import { adminCreateCareer } from "../src/server/db/queries/careers";
import { properties, projects, team, jobOpenings } from "../src/lib/mock-data";

async function seedAdmin() {
  const count = await adminAccountCount();
  if (count > 0) {
    console.log(`Admins already exist (${count}) — skipping admin seed.`);
    return;
  }
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn(
      "ADMIN_EMAIL / ADMIN_PASSWORD not set — no admin account created. Set them and re-run `npm run db:seed` to create one."
    );
    return;
  }
  const hash = await hashPassword(password);
  await createAdmin(email, hash);
  console.log(`Created admin account for ${email}.`);
}

async function seedProperties() {
  for (const p of properties) {
    const id = await adminCreateProperty({
      title: p.title,
      slug: p.slug,
      propertyType: p.propertyType,
      category: p.category,
      location: p.location,
      state: p.state,
      price: p.price,
      currency: p.currency,
      priceNote: p.priceNote,
      description: p.description,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      landSize: p.landSize,
      features: p.features,
      paymentPlan: p.paymentPlan,
      availability: p.availability,
      featured: !!p.featured,
      published: true,
      inspectionAvailable: true,
    });
    for (const img of p.images) {
      await adminAddPropertyImage(id, img.url, img.alt);
    }
  }
  console.log(`Seeded ${properties.length} properties.`);
}

async function seedProjects() {
  for (const proj of projects) {
    await adminCreateProject({
      name: proj.name,
      slug: proj.slug,
      location: proj.location,
      description: proj.description,
      status: proj.status,
      imageUrl: proj.imageUrl,
      unitsInfo: proj.unitsInfo,
      published: true,
    });
  }
  console.log(`Seeded ${projects.length} projects.`);
}

async function seedTeam() {
  let order = 0;
  for (const member of team) {
    await adminCreateTeamMember({
      name: member.name,
      position: member.position,
      bio: member.bio,
      photoUrl: member.photoUrl,
      displayOrder: order++,
      published: true,
    });
  }
  console.log(`Seeded ${team.length} team members.`);
}

async function seedCareers() {
  for (const job of jobOpenings) {
    await adminCreateCareer({
      title: job.title,
      department: job.department,
      location: job.location,
      employmentType: job.type,
      description: job.description,
      requirements: job.requirements,
      status: "published",
      postedAt: new Date().toISOString(),
    });
  }
  console.log(`Seeded ${jobOpenings.length} careers.`);
}

async function main() {
  await seedAdmin();
  await seedProperties();
  await seedProjects();
  await seedTeam();
  await seedCareers();
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
