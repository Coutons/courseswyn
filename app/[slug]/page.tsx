import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: params.slug,
  };
}

export default function LegacyRootRedirect({ params }: Props) {
  const specials: Record<string, string> = {
    "contact-us": "/contact",
    blog: "/deal/blog",
  };

  const target = specials[params.slug] || `/deal/${params.slug}`;
  permanentRedirect(target);
}
