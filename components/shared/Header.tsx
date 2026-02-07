import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavItems from "./NavItems";
import UserDropdown from "./UserDropdown";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { Button } from "@/components/ui/button";

const Header = async ({ user }: { user: User | null }) => {
  let initialStocks: StockWithWatchlistStatus[] = [];
  try {
    initialStocks = await searchStocks();
  } catch {
    // Silent fail - initialStocks remains empty array
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
          <NavItems initialStocks={initialStocks} isAuthenticated={!!user} />
        </nav>
        {user ? (
          <UserDropdown user={user} initialStocks={initialStocks} />
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-yellow-400"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-yellow-500 text-yellow-900 hover:bg-yellow-400 font-semibold">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
