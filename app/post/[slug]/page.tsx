import { permanentRedirect } from "next/navigation";

export default function LegacyPostRedirect({ params }: { params: { slug: string } }) {
  permanentRedirect(`/deal/${params.slug}`);
}
