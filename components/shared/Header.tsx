import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavItems from "./NavItems";
import UserDropdown from "./UserDropdown";
import { searchStocks } from "@/lib/actions/finnhub.actions";

const Header = async ({ user }: { user: User }) => {
  let initialStocks: StockWithWatchlistStatus[] = [];
  try {
    initialStocks = await searchStocks();
  } catch (error) {
    console.error("Failed to fetch initial stocks:", error);
  }

  return (
    <div className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/icons/logo2.png"
            alt="logo"
            width={140}
            height={32}
            className="h-8 w-auto rounded-full cursor-pointer"
          />
          <span className="text-3xl font-semibold text-gray-300 pb-1">
            StockTrail
          </span>
        </Link>
        <nav className="hidden sm:block">
          <NavItems initialStocks={initialStocks} />
        </nav>
        <UserDropdown user={user} initialStocks={initialStocks} />
      </div>
    </div>
  );
};

export default Header;
