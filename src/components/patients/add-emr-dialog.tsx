"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addEmrNumberAction } from "@/app/(dashboard)/patients/actions";
import type { PatientOption } from "@/server/patients";

export function AddEmrDialog({ patients }: { patients: PatientOption[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientOption | null>(
    null,
  );
  const [emrNumber, setEmrNumber] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) {
      setSelectedPatient(null);
      setEmrNumber("");
      setError(undefined);
    }
  }, [open]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);

    const formData = new FormData();
    if (selectedPatient) {
      formData.set("patientId", String(selectedPatient.id));
    }
    formData.set("emrNumber", emrNumber);

    startTransition(async () => {
      const result = await addEmrNumberAction({}, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button type="button" variant="outline" size="sm" />}
      >
        Add EMR Number
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Add EMR Number</DialogTitle>
          <DialogDescription>
            Select a patient and enter their EMR number.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="patient-combobox">Patient</Label>
              <Combobox
                items={patients}
                value={selectedPatient}
                onValueChange={(value) =>
                  setSelectedPatient((value as PatientOption | null) ?? null)
                }
                itemToStringValue={(patient) => patient.patientName}
                modal={false}
              >
                <ComboboxInput
                  id="patient-combobox"
                  placeholder="Search patient…"
                  className="w-full"
                  showClear
                />
                <ComboboxContent>
                  <ComboboxEmpty>No patients found.</ComboboxEmpty>
                  <ComboboxList>
                    {(patient) => (
                      <ComboboxItem key={patient.id} value={patient.patientName}>
                        {patient.patientName}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emr-number">EMR number</Label>
              <Input
                id="emr-number"
                name="emrNumber"
                value={emrNumber}
                onChange={(event) => setEmrNumber(event.target.value)}
                placeholder="EMR number"
                autoComplete="off"
              />
            </div>
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Add EMR"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
