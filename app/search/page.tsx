import type { Metadata } from "next";
import SearchClient from "./SearchClient";

const PRIMARY_KEYWORD = "Udemy Coupons";

export const metadata: Metadata = {
  title: `${PRIMARY_KEYWORD} & Discounts | Courseswyn`,
  description: "Explore up-to-date Udemy coupon codes, promo links, and exclusive discounts curated by Courseswyn.",
  keywords: [
    "Udemy coupons",
    "Udemy coupon codes",
    "Udemy promo codes",
    "Udemy discounts",
    "Udemy deals",
    "free Udemy courses",
    "online learning discounts",
    "Udemy promotional offers",
  ],
  openGraph: {
    title: `${PRIMARY_KEYWORD} & Discounts | Courseswyn`,
    description: "A curated list of Udemy coupon codes, limited-time discounts, and free course offers from Courseswyn.",
    type: "website",
    url: "/search",
  },
  alternates: {
    canonical: "/search",
  },
};

export default function SearchPage() {
  return <SearchClient />;
}
