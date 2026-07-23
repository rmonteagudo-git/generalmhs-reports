import Link from "next/link";
import { AddEmrDialog } from "@/components/patients/add-emr-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { PatientFilters, PatientOption } from "@/server/patients";

const STATUS_OPTIONS = [
  "Active",
  "Prospective",
  "Archived",
  "Inactive",
] as const;

const filterFields = [
  { name: "id", label: "ID", type: "text" },
  { name: "patientName", label: "Patient name", type: "text" },
  { name: "patientType", label: "Patient type", type: "text" },
  { name: "dateAdded", label: "Date added", type: "date" },
  { name: "primaryClinician", label: "Primary clinician", type: "text" },
  { name: "address", label: "Address", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "state", label: "State", type: "text" },
  { name: "zip", label: "Zip", type: "text" },
  { name: "phoneNumber", label: "Phone number", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "primaryInsurance", label: "Primary insurance", type: "text" },
  { name: "insuranceId", label: "Insurance ID", type: "text" },
] as const satisfies ReadonlyArray<{
  name: keyof PatientFilters;
  label: string;
  type: "text" | "date";
}>;

const selectClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30";

export function PatientsFilters({
  filters,
  patientOptions,
}: {
  filters: PatientFilters;
  patientOptions: PatientOption[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-card-foreground">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Filters</h3>
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm" form="patients-filters">
            Search
          </Button>
          <AddEmrDialog patients={patientOptions} />
          <Link
            href="/patients"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Clear
          </Link>
        </div>
      </div>

      <form id="patients-filters" method="get">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filterFields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                defaultValue={filters[field.name] ?? ""}
                placeholder={field.label}
              />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue={filters.status ?? ""}
              className={selectClassName}
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}
