"use client";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  PlusIcon,
  Pencil,
  Search,
  Upload,
  Info,
  ListCheck,
  Link2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  github?: string;
  live?: string;
  tags: string[];
  details: string;
  features: string[];
  image_url?: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();
  const [newProject, setNewProject] = useState<Omit<Project, "id" | "image">>({
    title: "",
    description: "",
    github: "",
    live: "",
    tags: [],
    details: "",
    features: [],
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("basic");
  useEffect(() => {
    const handleAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/");
      }
    };
    const handle = async () => {
      const { data, error } = await supabase.from("projects").select("*");

      data?.map((project) => {
        project.tags = JSON.parse(project.tags);
        project.features = JSON.parse(project.features);
      });
      console.log(data, error);
      setProjects(data as Project[]);
    };
    handleAuth();
    handle();
  }, []);

  const handleAddOrUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const add = {
      title: newProject.title,
      description: newProject.description,
      github_url: newProject.github || null,
      live_url: newProject.live || null,
      tags: JSON.stringify(newProject.tags),
      features: JSON.stringify(newProject.features),
      image_url: newProject.image_url || null,
    };
    const file_path = `project/${Date.now()}.${selectedImage?.name
      .split(".")
      .pop()}`;
    const { data, error } = await supabase.storage
      .from("project")
      .upload(file_path, selectedImage as File, { upsert: true });
    console.log(error);
    const { data: imageurl } = supabase.storage
      .from("project")
      .getPublicUrl(file_path);
    add.image_url = imageurl?.publicUrl;
    const handle = await supabase.from("projects").insert(add);

    if (handle.error) {
      toast(handle.error?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      console.log(handle.error);
      return;
    }
    toast("Project Has been posted", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
    resetForm();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setNewProject({
      title: project.title,
      description: project.description,
      github: project.github || "",
      live: project.live || "",
      tags: project.tags,
      details: project.details,
      features: project.features,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const resetForm = () => {
    setNewProject({
      title: "",
      description: "",
      github: "",
      live: "",
      tags: [],
      details: "",
      features: [],
    });
    setSelectedImage(null);
    setEditingProject(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsDialogOpen(false);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen flex flex-col bg-background/50 dark:bg-background">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto py-3 px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <nav>
              <Button variant="ghost" asChild className="hover:bg-accent">
                <Link href="/">Back to Site</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Projects Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight">Projects</h2>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              {/* Add Project Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(true);
                    }}
                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-3xl bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                      {editingProject ? "Edit Project" : "Add New Project"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                      {editingProject
                        ? "Update the details of your project below."
                        : "Fill out the form to add your new project."}
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    onSubmit={handleAddOrUpdateProject}
                    className="space-y-6"
                  >
                    <Tabs
                      value={activeTab}
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-4 gap-4 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                        <TabsTrigger
                          value="basic"
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                        >
                          <Info className="w-4 h-4 mr-2" />
                          Basic Info
                        </TabsTrigger>
                        <TabsTrigger
                          value="media"
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Media
                        </TabsTrigger>
                        <TabsTrigger
                          value="links"
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                        >
                          <Link2 className="w-4 h-4 mr-2" />
                          Links
                        </TabsTrigger>
                        <TabsTrigger
                          value="details"
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                        >
                          <ListCheck className="w-4 h-4 mr-2" />
                          Details
                        </TabsTrigger>
                      </TabsList>

                      <div className="mt-6">
                        <TabsContent value="basic" className="space-y-6">
                          {/* Basic Info Tab */}
                          <div className="space-y-6">
                            <Card className="p-6 transition-all duration-200">
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="title"
                                    className="sm:text-right font-medium"
                                  >
                                    Title
                                  </Label>
                                  <Input
                                    id="title"
                                    value={newProject.title}
                                    onChange={(e) =>
                                      setNewProject({
                                        ...newProject,
                                        title: e.target.value,
                                      })
                                    }
                                    className="sm:col-span-3 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                    placeholder="Enter your project title"
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4">
                                  <Label
                                    htmlFor="description"
                                    className="sm:text-right font-medium pt-2"
                                  >
                                    Description
                                  </Label>
                                  <Textarea
                                    id="description"
                                    value={newProject.description}
                                    onChange={(e) =>
                                      setNewProject({
                                        ...newProject,
                                        description: e.target.value,
                                      })
                                    }
                                    className="sm:col-span-3 min-h-[120px] focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                    placeholder="Provide a brief overview of your project"
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="tags"
                                    className="sm:text-right font-medium"
                                  >
                                    Tags
                                  </Label>
                                  <Input
                                    id="tags"
                                    value={newProject.tags.join(", ")}
                                    onChange={(e) =>
                                      setNewProject({
                                        ...newProject,
                                        tags: e.target.value
                                          .split(",")
                                          .map((tag) => tag.trim()),
                                      })
                                    }
                                    className="sm:col-span-3 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                    placeholder="React, TypeScript, Tailwind"
                                  />
                                </div>
                              </div>
                            </Card>
                          </div>
                        </TabsContent>

                        <TabsContent value="media" className="space-y-6">
                          {/* Media Tab */}
                          <Card className="p-6">
                            <div className="space-y-4">
                              <Label className="text-lg font-medium">
                                Project Image
                              </Label>
                              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-indigo-500 transition-all duration-200">
                                <Input
                                  id="image"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  ref={fileInputRef}
                                  className="hidden"
                                />
                                <div className="space-y-4">
                                  <div className="flex flex-col items-center">
                                    <Upload className="h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                      Drag and drop your image here, or
                                    </p>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() =>
                                        fileInputRef.current?.click()
                                      }
                                      className="mt-2"
                                    >
                                      Browse Files
                                    </Button>
                                  </div>
                                  {selectedImage && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      Selected: {selectedImage.name}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </TabsContent>

                        <TabsContent value="links" className="space-y-6">
                          {/* Links Tab */}
                          <Card className="p-6">
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="github"
                                  className="sm:text-right font-medium"
                                >
                                  GitHub URL
                                </Label>
                                <Input
                                  id="github"
                                  value={newProject.github}
                                  onChange={(e) =>
                                    setNewProject({
                                      ...newProject,
                                      github: e.target.value,
                                    })
                                  }
                                  className="sm:col-span-3 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                  placeholder="https://github.com/username/project"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="live"
                                  className="sm:text-right font-medium"
                                >
                                  Live URL
                                </Label>
                                <Input
                                  id="live"
                                  value={newProject.live}
                                  onChange={(e) =>
                                    setNewProject({
                                      ...newProject,
                                      live: e.target.value,
                                    })
                                  }
                                  className="sm:col-span-3 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                  placeholder="https://your-project.com"
                                />
                              </div>
                            </div>
                          </Card>
                        </TabsContent>

                        <TabsContent value="details" className="space-y-6">
                          {/* Details Tab */}
                          <Card className="p-6">
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4">
                                <Label
                                  htmlFor="details"
                                  className="sm:text-right font-medium pt-2"
                                >
                                  Details
                                </Label>
                                <Textarea
                                  id="details"
                                  value={newProject.details}
                                  onChange={(e) =>
                                    setNewProject({
                                      ...newProject,
                                      details: e.target.value,
                                    })
                                  }
                                  className="sm:col-span-3 min-h-[120px] focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                  placeholder="Share comprehensive details about your project"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4">
                                <Label
                                  htmlFor="features"
                                  className="sm:text-right font-medium pt-2"
                                >
                                  Features
                                </Label>
                                <Textarea
                                  id="features"
                                  value={newProject.features.join("\n")}
                                  onChange={(e) =>
                                    setNewProject({
                                      ...newProject,
                                      features: e.target.value.split("\n"),
                                      // .filter(Boolean),
                                    })
                                  }
                                  className="sm:col-span-3 min-h-[120px] focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                  placeholder="List each feature on a new line"
                                />
                              </div>
                            </div>
                          </Card>
                        </TabsContent>
                      </div>
                    </Tabs>

                    <DialogFooter className="mt-6">
                      <div className="flex gap-4 w-full sm:w-auto">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setActiveTab(
                              activeTab === "basic"
                                ? "basic"
                                : activeTab === "media"
                                ? "basic"
                                : activeTab === "links"
                                ? "media"
                                : "links"
                            )
                          }
                          className="flex-1 sm:flex-none"
                          disabled={activeTab === "basic"}
                        >
                          Previous
                        </Button>
                        {activeTab !== "details" ? (
                          <Button
                            type="button"
                            onClick={() =>
                              setActiveTab(
                                activeTab === "basic"
                                  ? "media"
                                  : activeTab === "media"
                                  ? "links"
                                  : "details"
                              )
                            }
                            className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                          >
                            Next
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                          >
                            {editingProject ? "Update Project" : "Save Project"}
                          </Button>
                        )}
                      </div>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold">
                      {project.title}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="sr-only">Open menu</span>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleEditProject(project)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-grow">
                  <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                    <Image
                      src={project.image_url || "/placeholder.svg"}
                      alt={project.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {project.details}
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {project.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-4 pt-6">
                  {project.github && (
                    <Button variant="outline" asChild className="flex-1">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        GitHub
                      </a>
                    </Button>
                  )}
                  {project.live && (
                    <Button variant="outline" asChild className="flex-1">
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
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
  );
}
