import type { Metadata } from "next";
import SearchClient from "./SearchClient";

const PRIMARY_KEYWORD = "Udemy courses";

export const metadata: Metadata = {
  title: `${PRIMARY_KEYWORD} Deals & Coupons | Coursespeak`,
  description: "Discover the latest Udemy courses coupons and discounts curated by Coursespeak.",
  keywords: [
    "Udemy courses",
    "Udemy coupons",
    "Udemy discounts",
    "online course deals",
    "elearning promotions",
  ],
  openGraph: {
    title: `${PRIMARY_KEYWORD} Deals & Coupons | Coursespeak`,
    description: "A curated list of Udemy courses deals, coupons, and limited-time discounts to boost your skills.",
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
