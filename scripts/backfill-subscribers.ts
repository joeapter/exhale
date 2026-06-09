import "dotenv/config";
import { randomUUID } from "node:crypto";
import { Client } from "pg";

type Registration = {
  email: string;
  firstName: string;
};

type Subscriber = {
  email: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const [registrationsResult, subscribersResult] = await Promise.all([
      client.query<Registration>(
        `SELECT email, "firstName"
         FROM registrations
         ORDER BY "createdAt" ASC`
      ),
      client.query<Subscriber>(`SELECT email FROM mailing_list_subscribers`),
    ]);

    const registrantsByEmail = new Map<string, Registration>();
    for (const registration of registrationsResult.rows) {
      const email = normalizeEmail(registration.email);
      if (email && !registrantsByEmail.has(email)) {
        registrantsByEmail.set(email, registration);
      }
    }

    const existingEmails = new Set(
      subscribersResult.rows.map((subscriber) => normalizeEmail(subscriber.email))
    );
    const missingRegistrants = [...registrantsByEmail.entries()].filter(
      ([email]) => !existingEmails.has(email)
    );

    await client.query("BEGIN");
    let inserted = 0;

    for (const [email, registration] of missingRegistrants) {
      const result = await client.query(
        `INSERT INTO mailing_list_subscribers (id, email, "firstName", source, "createdAt")
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (email) DO NOTHING`,
        [randomUUID(), email, registration.firstName.trim() || null, "registration"]
      );
      inserted += result.rowCount ?? 0;
    }

    await client.query("COMMIT");
    console.log(
      `Done. Added ${inserted} of ${registrantsByEmail.size} unique registrant emails; ${existingEmails.size} subscribers already existed.`
    );
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
