import { motion } from "framer-motion";
import { Code, Server } from "lucide-react";
import Image from "next/image";

type SkillItem = {
  name: string;
  icon: string;
  description: string;
  category: "frontend" | "backend";
};

const skills: SkillItem[] = [
  {
    name: "TypeScript",
    icon: "/icons/typescript.svg",
    description: "Type-safe development",
    category: "frontend",
  },
  {
    name:"Shade Cdn",
    icon: "/icons/shadcnui.svg",
    description: "UI library That helps so much",
    category: "frontend",
  },
  {
    name: "React",
    icon: "/icons/react.svg",
    description: "For Handling The Front End",
    category: "frontend",
  },
  {
    name: "Next.js",
    icon: "/icons/nextdotjs.svg",
    description: "React framework",
    category: "frontend",
  },
  {
    name: "Tailwind CSS",
    icon: "/icons/tailwindcss.svg",
    description: "Utility-first CSS",
    category: "frontend",
  },
  {
    name: "supabase",
    icon: "/icons/supabase.svg",
    description: "Build serverless databases",
    category: "backend",
  },
  {
    name: "Express.js",
    icon: "/icons/express.svg",
    description: "Node.js framework",
    category: "backend",
  },
  {
    name: "Laravel",
    icon: "/icons/laravel.svg",
    description: "PHP framework",
    category: "backend",
  },
  {
    name: "Node.js",
    icon: "/icons/nodedotjs.svg",
    description: "JavaScript runtime",
    category: "backend",
  },
];





const SkillCard: React.FC<{ skill: SkillItem }> = ({ skill }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    className="group relative rounded-xl bg-card/50 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-transparent hover:border-primary/10 hover:bg-gradient-to-b from-card/50 to-card/20 backdrop-blur-sm"
  >
    <div className="flex items-start space-x-4">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 blur-xl group-hover:bg-primary/20 transition-colors rounded-full" />
        <div className="relative rounded-full bg-gradient-to-br from-primary/10 to-primary/5 p-3 backdrop-blur-sm">
          <Image
            src={skill.icon}
            alt={`${skill.name} icon`}
            width={24}
            height={24}
            className="transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-primary-glow"
          />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {skill.name}
        </h3>
        <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
          {skill.description}
        </p>
      </div>
    </div>
  </motion.div>
);

const SkillSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  category: "frontend" | "backend";
}> = ({ title, icon, category }) => (
  <div className="space-y-6">
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center space-x-3 pb-4 border-b border-border/50"
    >
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        {title}
      </h2>
    </motion.div>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {skills
        .filter((skill) => skill.category === category)
        .map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
    </div>
  </div>
);

export default function Skills() {
  return (
    <section className="container py-24">
      <div className="mx-auto max-w-7xl space-y-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Core Technologies
          </h1>
          <p className="text-lg text-muted-foreground mx-auto max-w-2xl">
            Specializing in modern web development with a focus on performant,
            scalable, and maintainable solutions
          </p>
        </motion.div>

        <div className="space-y-16">
          <SkillSection
            title="Frontend Development"
            icon={<Code className="h-6 w-6" />}
            category="frontend"
          />
          <SkillSection
            title="Backend Development"
            icon={<Server className="h-6 w-6" />}
            category="backend"
          />
        </div>
      </div>
    </section>
  );
}