import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MessageCircle, Rocket, Award, ArrowRight } from "lucide-react";

const stageBadge: Record<string, { cls: string; label: string }> = {
  ideation:    { cls: "bg-amber-500/15 text-amber-400 border-amber-500/20",  label: "Ideation" },
  development: { cls: "bg-primary/15 text-primary border-primary/20",         label: "Development" },
  testing:     { cls: "bg-blue-500/15 text-blue-400 border-blue-500/20",       label: "Testing" },
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
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    apiFetch("/projects").then((data) => {
      if (data.success) setProjects(data.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-hero border-b border-border/20 py-14 px-4">
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm font-medium text-primary mb-2 animate-fade-in">
            {user ? `Welcome back, ${user.username}` : "Welcome"}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-hero-foreground mb-3 animate-fade-in leading-tight">
            Build in Public,{" "}
            <span className="text-hero-accent">Together.</span>
          </h1>
          <p className="text-hero-foreground/60 text-base md:text-lg max-w-xl mb-7 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            See what developers across Mzansi are building. Share progress, get feedback, celebrate wins.
          </p>
          <Button variant="hero" size="lg" onClick={() => navigate("/projects/create")} className="animate-fade-in gap-2" style={{ animationDelay: "0.2s" }}>
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            Live Feed
            {projects.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">{projects.length} project{projects.length !== 1 ? "s" : ""}</span>
            )}
          </h2>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-5">
              <Rocket className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">No projects yet.</p>
            <p className="text-muted-foreground/60 text-sm mt-1 mb-5">Be the first to build in public.</p>
            <Button variant="hero" onClick={() => navigate("/projects/create")}>
              <Plus className="h-4 w-4 mr-1" /> Create Project
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project, i) => {
              const stage = stageBadge[project.stage];
              return (
                <Link to={`/projects/${project.id}`} key={project.id}>
                  <Card
                    className="glass-card group hover:border-primary/30 hover:shadow-primary/5 hover:shadow-lg transition-all duration-200 cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <CardTitle className="text-base group-hover:text-primary transition-colors">{project.title}</CardTitle>
                            {stage && (
                              <Badge className={`${stage.cls} border text-xs font-medium`}>{stage.label}</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">by <span className="font-medium text-foreground/70">{project.username}</span></p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1 flex-shrink-0" />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3.5 w-3.5" /> {project.comment_count ?? 0} comment{project.comment_count !== 1 ? "s" : ""}
                        </span>
                        {project.milestone_count != null && project.milestone_count > 0 && (
                          <span className="flex items-center gap-1 text-primary font-medium">
                            <Award className="h-3.5 w-3.5" /> {project.milestone_count} milestone{project.milestone_count > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
