import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export type PatientFilters = {
  id?: string;
  patientName?: string;
  patientType?: string;
  dateAdded?: string;
  primaryClinician?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phoneNumber?: string;
  email?: string;
  primaryInsurance?: string;
  insuranceId?: string;
  status?: string;
};

function containsFilter(value?: string): Prisma.StringFilter | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return { contains: trimmed };
}

function buildWhere(filters: PatientFilters): Prisma.PatientWhereInput {
  const where: Prisma.PatientWhereInput = {};

  const idValue = filters.id?.trim();
  if (idValue) {
    const id = Number(idValue);
    if (!Number.isNaN(id)) {
      where.id = id;
    }
  }

  const patientName = containsFilter(filters.patientName);
  if (patientName) where.patientName = patientName;

  const patientType = containsFilter(filters.patientType);
  if (patientType) where.patientType = patientType;

  const dateAdded = filters.dateAdded?.trim();
  if (dateAdded) {
    const day = new Date(`${dateAdded}T00:00:00.000Z`);
    if (!Number.isNaN(day.getTime())) {
      const nextDay = new Date(day);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      where.dateAdded = { gte: day, lt: nextDay };
    }
  }

  const primaryClinician = containsFilter(filters.primaryClinician);
  if (primaryClinician) where.primaryClinician = primaryClinician;

  const address = containsFilter(filters.address);
  if (address) where.address = address;

  const city = containsFilter(filters.city);
  if (city) where.city = city;

  const state = containsFilter(filters.state);
  if (state) where.state = state;

  const zip = containsFilter(filters.zip);
  if (zip) where.zip = zip;

  const phoneNumber = containsFilter(filters.phoneNumber);
  if (phoneNumber) where.phoneNumber = phoneNumber;

  const email = containsFilter(filters.email);
  if (email) where.email = email;

  const primaryInsurance = containsFilter(filters.primaryInsurance);
  if (primaryInsurance) where.primaryInsurance = primaryInsurance;

  const insuranceId = containsFilter(filters.insuranceId);
  if (insuranceId) where.insuranceId = insuranceId;

  const status = filters.status?.trim();
  if (status) where.status = status;

  return where;
}

export const PATIENTS_PAGE_SIZE = 20;

export async function listPatients(
  filters: PatientFilters = {},
  page = 1,
  pageSize = PATIENTS_PAGE_SIZE,
) {
  const where = buildWhere(filters);
  const total = await prisma.patient.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const skip = (currentPage - 1) * pageSize;

  const patients = await prisma.patient.findMany({
    where,
    orderBy: [{ patientName: "asc" }, { id: "asc" }],
    skip,
    take: pageSize,
  });

  return {
    patients,
    total,
    page: currentPage,
    pageSize,
    totalPages,
  };
}

export type PatientOption = {
  id: number;
  patientName: string;
};

export async function listPatientOptions(): Promise<PatientOption[]> {
  return prisma.patient.findMany({
    select: { id: true, patientName: true },
    orderBy: [{ patientName: "asc" }, { id: "asc" }],
  });
}

export async function updatePatientEmrNumber(
  patientId: number,
  emrNumber: string,
) {
  return prisma.patient.update({
    where: { id: patientId },
    data: { emrNumber },
  });
}
