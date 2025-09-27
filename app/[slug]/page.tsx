import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: params.slug,
  };
}

export default function LegacyRootRedirect({ params }: Props) {
  permanentRedirect(`/deal/${params.slug}`);
}
