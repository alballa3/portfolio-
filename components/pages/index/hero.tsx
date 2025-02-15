import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github,  Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-gradient-to-b from-background to-background/50 px-4">
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-7xl flex-col-reverse items-center justify-center gap-16 py-12 md:flex-row md:justify-between md:py-20">
        {/* Left Content */}
        <div className="relative z-10 flex flex-col items-center space-y-8 md:items-start">
          {/* Text Content */}
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5">
              <span className="text-sm font-medium text-primary">
                Available for work
              </span>
            </div>

            <h1 className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/40 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
              Hi, I'm Mohammed Elmuiz
            </h1>

            <p className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl sm:leading-8">
              A passionate Full Stack Developer crafting exceptional digital
              experiences through innovative websites .
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link href="#projects">
              <Button size="lg" className="group">
                View Projects
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#contact">
              <Button variant="outline" size="lg">
                Contact Me
              </Button>
            </Link>
          </div>

          {/* Social Links */}
          <div className="mt-8 flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Github className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Linkedin className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Twitter className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Right Content - Image */}
        <div className="relative">
          <div className="relative h-[400px] w-[400px]">
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl" />
            <Image
              src="/personal/photo.jpg"
              alt="Mohammed Elmuiz"
              width={400}
              height={400}
              className="relative rounded-full ring-2 ring-border/50"
              priority
            />
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-1/4 top-1/2 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-3xl" />
      </div>
    </section>
  );
};

export default HeroSection;
