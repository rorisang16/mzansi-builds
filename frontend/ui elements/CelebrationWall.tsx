import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, getCurrentUser, type Project } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, PartyPopper } from "lucide-react";

const CelebrationWall = () => {
  const [completed, setCompleted] = useState<Project[]>([]);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    setCompleted(getProjects().filter((p) => p.stage === "completed"));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-hero py-16 px-4 text-center">
        <div className="container mx-auto max-w-3xl animate-fade-in">
          <PartyPopper className="h-12 w-12 text-celebration mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-hero-foreground mb-3">
            Celebration <span className="text-hero-accent">Wall</span>
          </h1>
          <p className="text-hero-foreground/70 text-lg">
            Honouring developers who built in public and shipped their projects.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl py-10 px-4">
        {completed.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No completed projects yet. Keep building!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {completed.map((project, i) => (
              <Card
                key={project.id}
                className="glass-card overflow-hidden hover:shadow-xl transition-all cursor-pointer animate-slide-up border-primary/20"
                style={{ animationDelay: `${i * 0.1}s` }}
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <div className="h-2 bg-gradient-to-r from-primary to-emerald-400" />
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.userName}</p>
                    </div>
                    <Badge className="bg-primary text-primary-foreground">
                      <Trophy className="h-3 w-3 mr-1" /> Shipped
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <Trophy className="h-4 w-4" />
                    {project.milestones.length} milestone{project.milestones.length !== 1 ? "s" : ""} achieved
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CelebrationWall;
