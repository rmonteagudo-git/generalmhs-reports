"use server";

import { revalidatePath } from "next/cache";
import { updatePatientEmrNumber } from "@/server/patients";

export type AddEmrState = {
  error?: string;
  success?: boolean;
};

export async function addEmrNumberAction(
  _prevState: AddEmrState,
  formData: FormData,
): Promise<AddEmrState> {
  const patientIdRaw = formData.get("patientId");
  const emrNumber = String(formData.get("emrNumber") ?? "").trim();

  const patientId = Number(patientIdRaw);
  if (!patientIdRaw || Number.isNaN(patientId)) {
    return { error: "Select a patient." };
  }

  if (!emrNumber) {
    return { error: "Enter an EMR number." };
  }

  try {
    await updatePatientEmrNumber(patientId, emrNumber);
    revalidatePath("/patients");
    return { success: true };
  } catch {
    return { error: "Could not update EMR number." };
  }
}
