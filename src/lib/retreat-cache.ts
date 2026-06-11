import { revalidatePath } from "next/cache";

export function revalidateRetreatPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/retreat");
  revalidatePath("/retreats");
  revalidatePath("/retreats/[slug]", "page");
  revalidatePath("/register/[retreatSlug]", "page");

  if (slug) {
    revalidatePath(`/retreats/${slug}`);
    revalidatePath(`/register/${slug}`);
  }
}
