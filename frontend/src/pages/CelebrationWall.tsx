import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Rocket, MessageCircle, Calendar } from "lucide-react";

type Project = {
  id: number;
  title: string;
  description: string;
  stage: string;
  status: string;
  username: string;
  comment_count: number;
  created_at: string;
};

const CelebrationWall = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    apiFetch("/projects/completed").then((data) => {
      if (data.success) setProjects(data.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-hero py-16 px-4 border-b border-border/20">
        <div className="container mx-auto max-w-4xl text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 mb-5">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-hero-foreground mb-3">
            Celebration <span className="text-hero-accent">Wall</span>
          </h1>
          <p className="text-hero-foreground/60 text-lg max-w-xl mx-auto">
            Projects shipped by the Mzansi developer community. Every finish line deserves a moment.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl py-10 px-4">
        {projects.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-5">
              <Rocket className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">No completed projects yet.</p>
            <p className="text-muted-foreground/60 text-sm mt-1">
              Be the first to ship something and claim your spot here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project, i) => (
              <Link to={`/projects/${project.id}`} key={project.id}>
                <Card
                  className="glass-card group h-full hover:border-primary/40 hover:shadow-primary/10 hover:shadow-xl transition-all duration-300 cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Trophy className="h-4 w-4 text-primary flex-shrink-0" />
                          <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors truncate">
                            {project.title}
                          </CardTitle>
                        </div>
                        <p className="text-xs text-muted-foreground">by {project.username}</p>
                      </div>
                      <Badge className="bg-primary/15 text-primary border-0 shrink-0">shipped</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3.5 w-3.5" /> {project.comment_count ?? 0}
                      </span>
                      {project.created_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(project.created_at).toLocaleDateString()}
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

export default CelebrationWall;
