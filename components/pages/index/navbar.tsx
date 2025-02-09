import React, { useState, FC, ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Menu, X } from "lucide-react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

const NavLink: FC<NavLinkProps> = ({ href, children }) => (
  <Link
    href={href}
    className="relative transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
  >
    {children}
  </Link>
);

interface NavLinkItem {
  href: string;
  label: string;
}

const navLinks: NavLinkItem[] = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

interface SocialLinkItem {
  href: string;
  icon: React.ElementType;
  label: string;
}

const socialLinks: SocialLinkItem[] = [
  {
    href: "https://github.com/alexchen",
    icon: Github,
    label: "GitHub",
  },
  {
    href: "https://linkedin.com/in/alexchen",
    icon: Linkedin,
    label: "LinkedIn",
  },
];

const Navbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 transition-transform hover:scale-105"
        >
          <span className="font-poppins text-lg font-bold">Mohammed Elmuiz </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex flex-1 items-center justify-center space-x-8 text-sm font-medium"
          role="navigation"
        >
          {navLinks.map(({ href, label }) => (
            <NavLink key={href} href={href}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="transition-transform hover:scale-110"
            >
              <Button variant="ghost" size="icon" aria-label={label}>
                <Icon className="h-4 w-4" />
              </Button>
            </Link>
          ))}
          <Button size="sm" className="transition-transform hover:scale-105">
            Download CV
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-[3.5rem] left-0 right-0 bg-background border-b lg:hidden">
            <nav className="container py-4" role="navigation">
              <div className="flex flex-col space-y-4">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-sm font-medium hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
                <div className="flex items-center space-x-4 pt-4 border-t">
                  {socialLinks.map(({ href, icon: Icon, label }) => (
                    <Link
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="ghost" size="icon" aria-label={label}>
                        <Icon className="h-4 w-4" />
                      </Button>
                    </Link>
                  ))}
                  <Button size="sm">Download CV</Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
