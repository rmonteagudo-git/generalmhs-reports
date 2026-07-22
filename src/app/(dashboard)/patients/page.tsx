import { PatientsFilters } from "@/components/patients/patients-filters";
import { PatientsTable } from "@/components/patients/patients-table";
import {
  listPatients,
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

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = filtersFromSearchParams(params);
  const patients = await listPatients(filters);

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Patients</h2>
        <p className="mt-1 text-muted-foreground">
          Listado de pacientes registrados.
        </p>
      </div>

      <PatientsFilters filters={filters} />

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {patients.length} patient{patients.length === 1 ? "" : "s"}
        </p>
        <PatientsTable patients={patients} />
      </div>
    </main>
  );
}
