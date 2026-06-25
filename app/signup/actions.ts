"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getCasualErrorMessage } from "@/utils/error-handler";
import { signupSchema } from "@/utils/schema";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Form gak valid";
    redirect("/signup?error=" + encodeURIComponent(firstError));
  }

  const { email, password } = parsed.data;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    const errorMessage = getCasualErrorMessage(error.message);
    redirect("/signup?error=" + encodeURIComponent(errorMessage));
  }

  redirect(
    "/login?success=" +
      encodeURIComponent(
        "Daftar berhasil! Cek inbox/spam email kamu buat konfirmasi ya.",
      ),
  );
}
