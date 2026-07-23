import { readFileSync } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import type {
  AttendanceStatus,
  PrismaClient,
} from "../../src/generated/prisma/client";

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

function parseStatus(value?: string): AttendanceStatus | null {
  const normalized = emptyToNull(value)?.toLowerCase();
  if (!normalized) return null;

  switch (normalized) {
    case "show":
      return "SHOW";
    case "no show":
      return "NO_SHOW";
    case "canceled":
    case "cancelled":
      return "CANCELED";
    case "late canceled":
    case "late cancelled":
      return "LATE_CANCELED";
    case "clinician canceled":
    case "clinician cancelled":
      return "CLINICIAN_CANCELED";
    default:
      return null;
  }
}

export async function seedAttendance(prisma: PrismaClient) {
  const csvPath = path.join(
    process.cwd(),
    "src/data/client_attendance_report.csv",
  );

  const file = readFileSync(csvPath, "utf-8");
  const rows = parse(file, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  const patients = await prisma.patient.findMany({
    select: { id: true, patientName: true },
    orderBy: [{ id: "asc" }],
  });

  const patientIdByName = new Map<string, number>();
  const ambiguousNames = new Set<string>();

  for (const patient of patients) {
    if (patientIdByName.has(patient.patientName)) {
      ambiguousNames.add(patient.patientName);
      continue;
    }
    patientIdByName.set(patient.patientName, patient.id);
  }

  if (ambiguousNames.size > 0) {
    console.warn(
      `⚠ attendance seed: ${ambiguousNames.size} duplicate patient name(s); using first id`,
    );
  }

  const skipped: string[] = [];
  const attendances: {
    patientId: number;
    dateOfService: Date;
    location: string | null;
    clinicianName: string | null;
    status: AttendanceStatus;
  }[] = [];

  for (const row of rows) {
    const patientName = emptyToNull(row.patient_name);
    if (!patientName) {
      skipped.push("missing patient_name");
      continue;
    }

    const patientId = patientIdByName.get(patientName);
    if (!patientId) {
      skipped.push(`no patient match: ${patientName}`);
      continue;
    }

    const dateOfService = parseDate(row.date_of_service);
    if (!dateOfService) {
      skipped.push(`invalid date for ${patientName}: ${row.date_of_service}`);
      continue;
    }

    const status = parseStatus(row.status);
    if (!status) {
      skipped.push(`invalid status for ${patientName}: ${row.status}`);
      continue;
    }

    attendances.push({
      patientId,
      dateOfService,
      location: emptyToNull(row.location),
      clinicianName: emptyToNull(row.clinician_name),
      status,
    });
  }

  await prisma.attendance.deleteMany();
  await prisma.attendance.createMany({ data: attendances });

  console.log(`✓ attendance seeded (${attendances.length})`);
  if (skipped.length > 0) {
    console.warn(`⚠ attendance seed skipped ${skipped.length} row(s)`);
    for (const reason of skipped.slice(0, 10)) {
      console.warn(`  - ${reason}`);
    }
    if (skipped.length > 10) {
      console.warn(`  … and ${skipped.length - 10} more`);
    }
  }
}
