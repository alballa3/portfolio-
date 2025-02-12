"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote, Pause, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  testimonial: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 4,
    name: "Yousuf",
    position: "Founder",
    company: "You (Your Original Unity)",
    testimonial:
      "Working with Mohammed was a game-changer for our startup. His full-stack skills and ability to quickly grasp our business needs resulted in an MVP that exceeded our expectations and impressed our investors.",
    image: "/personal/yousef.jpg",
  },
  {
    id: 5,
    name: "Mohammed",
    position: "Business Owner",
    company: "Unknown",
    testimonial:
      "Mohammed is one of the best developers I've ever worked with. His innovative design skills and technical expertise have consistently impressed me. ",
    image: "",
  },
  {
    id: 1,
    name: "Soon",
    position: "Soon",
    company: "Soon",
    testimonial:
      "Soon",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Soon",
    position: "Soon",
    company: "Soon",
    testimonial:
      "Soon",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Soon",
    position: "Soon",
    company: "Soon",
    testimonial:
      "Soon",
    image: "/placeholder.svg?height=100&width=100",
  },
 
];

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const nextTestimonial = useCallback(() => {
    setDirection(1);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setDirection(-1);
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      nextTestimonial();
    }, 6000);

    return () => clearInterval(timer);
  }, [isPlaying, nextTestimonial]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section id="testimonials" className="container space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-poppins font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
          Client Testimonials
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Don't just take my word for it. Here's what my clients have to say
          about working with me.
        </p>
      </div>

      <Card
        className="mx-auto max-w-4xl overflow-hidden bg-gradient-to-br from-background to-muted/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-8">
          <div className="relative h-[300px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentTestimonial}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="absolute w-full"
              >
                <Quote className="absolute top-0 left-0 h-8 w-8 text-primary/20 -translate-x-4 -translate-y-4" />
                <blockquote className="space-y-6">
                  <p className="text-lg italic leading-relaxed">
                    {testimonials[currentTestimonial].testimonial}
                  </p>
                  <footer className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-xl" />
                      <Image
                        src={testimonials[currentTestimonial].image}
                        alt={testimonials[currentTestimonial].name}
                        width={60}
                        height={60}
                        className="relative rounded-full ring-2 ring-background"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {testimonials[currentTestimonial].name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonials[currentTestimonial].position} at{" "}
                        <span className="text-primary">
                          {testimonials[currentTestimonial].company}
                        </span>
                      </p>
                    </div>
                  </footer>
                </blockquote>
              </motion.div>
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center space-y-4">
        <div className="flex justify-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentTestimonial ? 1 : -1);
                setCurrentTestimonial(index);
              }}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentTestimonial
                  ? "bg-primary w-6"
                  : "bg-primary/20 hover:bg-primary/40"
              }`}
            />
          ))}
        </div>

        <div
          className={`flex justify-center space-x-4 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button variant="outline" size="icon" onClick={prevTestimonial}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous testimonial</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isPlaying ? "Pause autoplay" : "Start autoplay"}
            </span>
          </Button>
          <Button variant="outline" size="icon" onClick={nextTestimonial}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next testimonial</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
