import { readFileSync } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import type { PrismaClient } from "../../src/generated/prisma/client";

function emptyToNull(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function parseDate(value?: string) {
  const raw = emptyToNull(value);
  if (!raw) return null;

  // CSV format: M/D/YY (e.g. 5/5/26)
  const match = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!match) return null;

  const month = Number(match[1]);
  const day = Number(match[2]);
  let year = Number(match[3]);
  if (year < 100) year += 2000;

  return new Date(Date.UTC(year, month - 1, day));
}

export async function seedPatients(prisma: PrismaClient) {
  const csvPath = path.join(
    process.cwd(),
    "src/data/client_details_report.csv",
  );

  const file = readFileSync(csvPath, "utf-8");
  const rows = parse(file, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  const patients = rows
    .map((row) => ({
      patientName: emptyToNull(row.patient_name) ?? "Unknown",
      patientType: emptyToNull(row.patient_type ?? row.patient_type),
      dateAdded: parseDate(row.date_added),
      primaryClinician: emptyToNull(row.primary_clinician),
      address: emptyToNull(row.address),
      city: emptyToNull(row.city),
      state: emptyToNull(row.state),
      zip: emptyToNull(row.zip),
      phoneNumber: emptyToNull(row.phone_number),
      email: emptyToNull(row.email),
      primaryInsurance: emptyToNull(row.primary_insurance),
      insuranceId: emptyToNull(row.insurance_id),
      status: emptyToNull(row.status),
    }))
    .filter((patient) => patient.patientName);

  await prisma.patient.deleteMany();
  await prisma.patient.createMany({ data: patients });

  console.log(`✓ patients seeded (${patients.length})`);
}
