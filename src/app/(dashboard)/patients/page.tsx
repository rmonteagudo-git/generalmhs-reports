import { PatientsFilters } from "@/components/patients/patients-filters";
import { PatientsPagination } from "@/components/patients/patients-pagination";
import { PatientsTable } from "@/components/patients/patients-table";
import {
  listPatientOptions,
  listPatients,
  PATIENTS_PAGE_SIZE,
  type PatientFilters,
} from "@/server/patients";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pickFilter(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0] || undefined;
  return value || undefined;
}

function filtersFromSearchParams(
  params: Record<string, string | string[] | undefined>,
): PatientFilters {
  return {
    id: pickFilter(params.id),
    patientName: pickFilter(params.patientName),
    patientType: pickFilter(params.patientType),
    dateAdded: pickFilter(params.dateAdded),
    primaryClinician: pickFilter(params.primaryClinician),
    address: pickFilter(params.address),
    city: pickFilter(params.city),
    state: pickFilter(params.state),
    zip: pickFilter(params.zip),
    phoneNumber: pickFilter(params.phoneNumber),
    email: pickFilter(params.email),
    primaryInsurance: pickFilter(params.primaryInsurance),
    insuranceId: pickFilter(params.insuranceId),
    status: pickFilter(params.status),
  };
}

function pageFromSearchParams(
  params: Record<string, string | string[] | undefined>,
) {
  const raw = pickFilter(params.page);
  const page = Number(raw);
  if (!raw || Number.isNaN(page) || page < 1) return 1;
  return Math.floor(page);
}

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = filtersFromSearchParams(params);
  const page = pageFromSearchParams(params);
  const [{ patients, total, page: currentPage, totalPages, pageSize }, patientOptions] =
    await Promise.all([
      listPatients(filters, page, PATIENTS_PAGE_SIZE),
      listPatientOptions(),
    ]);

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Patients</h2>
        <p className="mt-1 text-muted-foreground">
          Listado de pacientes registrados.
        </p>
      </div>

      <PatientsFilters filters={filters} patientOptions={patientOptions} />

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {total} patient{total === 1 ? "" : "s"}
        </p>
        <PatientsTable patients={patients} />
        <PatientsPagination
          filters={filters}
          page={currentPage}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
        />
      </div>
    </main>
  );
}
