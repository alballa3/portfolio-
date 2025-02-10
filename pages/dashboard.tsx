"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusIcon, Pencil, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"

interface Project {
  id: number
  title: string
  description: string
  image: string
  github?: string
  live?: string
  tags: string[]
  details: string
  features: string[]
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState<Omit<Project, "id" | "image">>({
    title: "",
    description: "",
    github: "",
    live: "",
    tags: [],
    details: "",
    features: [],
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedProjects = localStorage.getItem("projects")
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects))
  }, [projects])

  const handleAddOrUpdateProject =async () => {
    const add={
      title: newProject.title,
      description: newProject.description,
      github_url: newProject.github || null,
      live_url: newProject.live || null,
      tags:JSON.stringify(newProject.tags),
      features:JSON.stringify(newProject.features)
    }
    const {data,error}=await supabase.from("projects").insert(add);
    console.log(error,data)
    if (selectedImage) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const projectToSave: Project = {
          ...(editingProject || newProject),
          id: editingProject ? editingProject.id : Date.now(),
          image: reader.result as string,
        }
        if (editingProject) {
          setProjects(projects.map((p) => (p.id === editingProject.id ? projectToSave : p)))
          
        } else {
          setProjects([...projects, projectToSave])
         
        }
        resetForm()
      }
      reader.readAsDataURL(selectedImage)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setNewProject({
      title: project.title,
      description: project.description,
      github: project.github || "",
      live: project.live || "",
      tags: project.tags,
      details: project.details,
      features: project.features,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter((p) => p.id !== id))
   
  }

  const resetForm = () => {
    setNewProject({
      title: "",
      description: "",
      github: "",
      live: "",
      tags: [],
      details: "",
      features: [],
    })
    setSelectedImage(null)
    setEditingProject(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setIsDialogOpen(false)
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background border-b">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Button variant="ghost" asChild>
                  <Link href="/">Back to Site</Link>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow bg-background">
        <div className="container mx-auto py-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Projects</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForm()
                      setIsDialogOpen(true)
                    }}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" /> Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
                    <DialogDescription>
                      {editingProject
                        ? "Update the details of your project."
                        : "Enter the details of your new project here. Click save when you're done."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image" className="text-right">
                        Image
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          ref={fileInputRef}
                        />
                        {selectedImage && (
                          <p className="mt-2 text-sm text-muted-foreground">Selected: {selectedImage.name}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="github" className="text-right">
                        GitHub URL
                      </Label>
                      <Input
                        id="github"
                        value={newProject.github}
                        onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="live" className="text-right">
                        Live URL
                      </Label>
                      <Input
                        id="live"
                        value={newProject.live}
                        onChange={(e) => setNewProject({ ...newProject, live: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tags" className="text-right">
                        Tags
                      </Label>
                      <Input
                        id="tags"
                        value={newProject.tags.join(", ")}
                        onChange={(e) => setNewProject({ ...newProject, tags: e.target.value.split(", ") })}
                        className="col-span-3"
                        placeholder="Separate tags with commas"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="details" className="text-right">
                        Details
                      </Label>
                      <Textarea
                        id="details"
                        value={newProject.details}
                        onChange={(e) => setNewProject({ ...newProject, details: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="features" className="text-right">
                        Features
                      </Label>
                      <Textarea
                        id="features"
                        value={newProject.features.join("\n")}
                        onChange={(e) => setNewProject({ ...newProject, features: e.target.value.split("\n") })}
                        className="col-span-3"
                        placeholder="Enter each feature on a new line"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddOrUpdateProject}>
                      {editingProject ? "Update Project" : "Save Project"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {project.title}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditProject(project)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteProject(project.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video mb-4 relative">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{project.details}</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {project.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {project.github && (
                    <Button variant="outline" asChild>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    </Button>
                  )}
                  {project.live && (
                    <Button variant="outline" asChild>
                      <a href={project.live} target="_blank" rel="noopener noreferrer">
                        Live Demo
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}