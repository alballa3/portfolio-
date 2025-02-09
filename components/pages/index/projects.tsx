"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Github, ExternalLink, ChevronRight, ArrowRight } from "lucide-react";

interface Project {
  title: string;
  description: string;
  image: string;
  github?: string;
  live?: string;
  tags: string[];
  details: string;
  features: string[];
}

const projects: Project[] = [
  {
    title: "E-commerce Platform",
    description:
      "A full-stack e-commerce solution with React, Node.js, and MongoDB.",
    image: "/placeholder.svg?height=400&width=600",
    github: "https://github.com/alexchen/ecommerce",
    live: "https://alexchen-ecommerce.vercel.app",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    details:
      "This e-commerce platform provides a seamless shopping experience with features like user authentication, product search, shopping cart, and secure checkout. The React frontend offers a responsive design, while the Node.js backend handles data management and integrates with MongoDB for efficient storage.",
    features: [
      "User authentication and authorization",
      "Product catalog with search and filter functionality",
      "Shopping cart and wishlist management",
      "Secure payment integration",
      "Order tracking and history",
      "Admin dashboard for inventory management",
    ],
  },
  // ... other projects remain the same
];

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="group"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
        <CardContent className="p-0">
          <div
            className={`flex flex-col gap-8 lg:flex-row ${
              index % 2 === 0 ? "" : "lg:flex-row-reverse"
            }`}
          >
            <div className="relative w-full lg:w-1/2 overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                width={600}
                height={400}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/0" />
            </div>
            <div className="w-full lg:w-1/2 p-6 space-y-4">
              <h3 className="text-2xl font-bold tracking-tight">{project.title}</h3>
              <p className="text-muted-foreground">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="transition-colors hover:bg-primary/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button onClick={() => onClick(project)} className="group">
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                {project.github && (
                  <Button variant="outline" asChild>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:bg-primary/10"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                )}
                {project.live && (
                  <Button variant="outline" asChild>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:bg-primary/10"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsOpen(true);
  };

  return (
    <section id="projects" className="container space-y-16 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-[58rem] text-center"
      >
        <h2 className="font-heading text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
          Featured Projects
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Here are some of the projects I've worked on. Each one represents a unique challenge and learning experience.
        </p>
      </motion.div>

      <div className="space-y-8">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={index}
            onClick={handleProjectClick}
          />
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
            <DialogDescription className="text-base">
              {selectedProject?.details}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3">Key Features</h4>
            <ul className="grid gap-2">
              {selectedProject?.features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <ChevronRight className="h-4 w-4 text-primary" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between mt-6">
            {selectedProject?.github && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            )}
            {selectedProject?.live && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={selectedProject.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Projects;
