import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PatientRow = {
  id: number;
  emrNumber: string | null;
  patientName: string;
  patientType: string | null;
  dateAdded: Date | null;
  primaryClinician: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phoneNumber: string | null;
  email: string | null;
  primaryInsurance: string | null;
  insuranceId: string | null;
  status: string | null;
};

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(value);
}

function cell(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

export function PatientsTable({ patients }: { patients: PatientRow[] }) {
  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>EMR number</TableHead>
            <TableHead>Patient name</TableHead>
            <TableHead>Patient type</TableHead>
            <TableHead>Date added</TableHead>
            <TableHead>Primary clinician</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Zip</TableHead>
            <TableHead>Phone number</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Primary insurance</TableHead>
            <TableHead>Insurance ID</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={15} className="h-24 text-center text-muted-foreground">
                No patients found.
              </TableCell>
            </TableRow>
          ) : (
            patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell>{cell(patient.emrNumber)}</TableCell>
                <TableCell className="max-w-[220px] truncate font-medium">
                  {cell(patient.patientName)}
                </TableCell>
                <TableCell>{cell(patient.patientType)}</TableCell>
                <TableCell>{formatDate(patient.dateAdded)}</TableCell>
                <TableCell className="max-w-[180px] truncate">
                  {cell(patient.primaryClinician)}
                </TableCell>
                <TableCell className="max-w-[220px] truncate">
                  {cell(patient.address)}
                </TableCell>
                <TableCell>{cell(patient.city)}</TableCell>
                <TableCell>{cell(patient.state)}</TableCell>
                <TableCell>{cell(patient.zip)}</TableCell>
                <TableCell>{cell(patient.phoneNumber)}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {cell(patient.email)}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {cell(patient.primaryInsurance)}
                </TableCell>
                <TableCell>{cell(patient.insuranceId)}</TableCell>
                <TableCell>{cell(patient.status)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
