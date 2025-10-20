"use client";

import React from "react";
import { NAV_ITEMS as navItems } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItems = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <ul className="flex flex-col gap-3 p-2 font-medium sm:gap-10 sm:flex-row">
      {navItems.map(({ href, label }) => (
        <li key={href}>
          <Link
            href={href}
            className={`hover:text-yellow-400 transition-colors
                ${isActive(href) ? "text-yellow-100" : ""}
                `}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavItems;
