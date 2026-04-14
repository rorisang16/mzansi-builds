import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MessageCircle, Rocket, Award } from "lucide-react";

const stageBadge: Record<string, string> = {
  ideation: "bg-accent text-accent-foreground",
  development: "bg-primary/20 text-primary",
  testing: "bg-celebration/20 text-foreground",
};

type Project = {
  id: number;
  title: string;
  description: string;
  stage: string;
  status: string;
  username: string;
  comment_count: number;
  milestone_count?: number;
};

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    apiFetch("/projects").then((data) => {
      if (data.success) setProjects(data.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-hero py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4 animate-fade-in">
            <Rocket className="h-8 w-8 text-hero-accent" />
            <h1 className="text-3xl md:text-4xl font-bold text-hero-foreground">
              Build in Public,{" "}
              <span className="text-hero-accent">Together.</span>
            </h1>
          </div>
          <p className="text-hero-foreground/70 text-lg max-w-2xl mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            See what developers across Mzansi are building. Share your progress, get feedback, and celebrate wins.
          </p>
          <Button variant="hero" size="lg" onClick={() => navigate("/projects/create")} className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Plus className="h-5 w-5 mr-2" /> Start a Project
          </Button>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl py-10 px-4">
        <h2 className="text-xl font-semibold mb-6">Live Feed</h2>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <Rocket className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No projects yet. Be the first to build!</p>
            <Button variant="hero" className="mt-4" onClick={() => navigate("/projects/create")}>
              Create Project
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project, i) => (
              <Link to={`/projects/${project.id}`} key={project.id}>
                <Card className="glass-card hover:shadow-xl transition-all duration-300 cursor-pointer animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">by {project.username}</p>
                      </div>
                      <Badge className={stageBadge[project.stage] || "bg-secondary text-secondary-foreground"}>{project.stage}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" /> {project.comment_count ?? 0}
                      </span>
                      {project.milestone_count && project.milestone_count > 0 && (
                        <span className="text-primary font-medium flex items-center gap-1">
                          <Award className="h-4 w-4" /> {project.milestone_count} milestone{project.milestone_count > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
