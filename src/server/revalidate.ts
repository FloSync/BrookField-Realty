import { revalidatePath } from "next/cache";

export function revalidateProperties(slug?: string): void {
  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath("/contact");
  if (slug) revalidatePath(`/properties/${slug}`);
}

export function revalidateProjects(): void {
  revalidatePath("/projects");
}

export function revalidateTeam(): void {
  revalidatePath("/team");
}

export function revalidateCareers(): void {
  revalidatePath("/careers");
}

export function revalidateContact(): void {
  revalidatePath("/contact");
}
