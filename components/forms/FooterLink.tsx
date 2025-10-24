import Link from "next/link";
import React from "react";

const FooterLink = ({ text, linkText, href }: FooterLinkProps) => {
  return (
    <div className="text-center pt-4">
      <div className="w-full h-px bg-gray-600 mb-4" />
      <span className="text-sm text-muted-foreground">{text}</span>
      <p className="text-sm text-gray-500 mt-2">
        <Link href={href} className="footer-link">
          {linkText}
        </Link>
      </p>
    </div>
  );
};

export default FooterLink;
