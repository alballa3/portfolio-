import React from "react";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Mail, MapPin, Trophy } from "lucide-react";

interface StatsCardProps {
  icon: FC<{ className?: string }>;
  label: string;
  value: number | string;
}
const StatsCard: FC<StatsCardProps> = ({ icon: Icon, label, value }) => (
  <Card className="border-none bg-muted/50">
    <CardContent className="flex flex-col items-center p-6 text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

export default function About() {
  const stats = [
    {
      icon: Trophy,
      label: "Projects Completed",
      value: "50+",
    },
    {
      icon: Calendar,
      label: "Years Experience",
      value: "5+",
    },
    {
      icon: Mail,
      label: "Client Satisfaction",
      value: "100%",
    },
    {
      icon: MapPin,
      label: "Countries Reached",
      value: "10+",
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Image */}
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
              <img
                src="./personal/photo.jpg"
                alt="Professional headshot"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/0" />
            </div>
            {/* Experience Badge */}
            <div className="absolute -bottom-6 -right-6 rounded-xl bg-primary p-6 shadow-lg">
              <div className="text-3xl font-bold text-primary-foreground">
                3+
              </div>
              <div className="text-sm text-primary-foreground/80">
                Years of Experience
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About Me
              </h2>
              <p className="mt-4 text-muted-foreground">
                Hi, I'm Mohammed Elmuiz, a passionate Full Stack Developer with
                a strong track record of collaborating with diverse teams to
                build high-quality web solutions. I have a deep belief in my
                ability to develop and scale any website, offering a wide range
                of services tailored to meet unique project needs.
              </p>
              <p className="mt-4 text-muted-foreground">
                My expertise lies in crafting scalable and efficient
                applications using modern technologies like React, Node.js, and
                Laravel (for larger projects). With over three years of
                experience in Full Stack development, I've worked with startups
                and established companies, helping them achieve their technical
                goals and create impactful digital experiences.
              </p>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>alballamohammed3@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>sharjah . UAE</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button>Download CV</Button>
              <Button variant="outline">Contact Me</Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
