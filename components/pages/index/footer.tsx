import Link from "next/link"
import { Github, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-12">
      <div className="container flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Mohammed Elmuiz. All rights reserved.
        </p>
        <div className="flex space-x-6">
          <Link href="https://github.com/alballa3" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="h-5 w-5" />
          </Link>
          
        </div>
      </div>
    </footer>
  )
}

