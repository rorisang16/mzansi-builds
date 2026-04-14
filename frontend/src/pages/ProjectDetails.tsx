import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProject, updateProject, getCurrentUser, type Project, type Milestone, type Comment } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, HandMetal, Trophy, Send, Plus, Lightbulb, Hammer, FlaskConical, CircleCheckBig, Handshake, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const stageBadge: Record<string, string> = {
  idea: "bg-accent text-accent-foreground",
  "in-progress": "bg-primary/20 text-primary",
  testing: "bg-celebration/20 text-foreground",
  completed: "bg-primary text-primary-foreground",
};

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getCurrentUser();
  const [project, setProject] = useState<Project | null>(null);
  const [comment, setComment] = useState("");
  const [milestone, setMilestone] = useState("");
  const [newStage, setNewStage] = useState<Project["stage"]>("idea");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const p = getProject(id || "");
    if (!p) { navigate("/dashboard"); return; }
    setProject(p);
    setNewStage(p.stage);
  }, [id]);

  if (!project || !user) return null;

  const isOwner = user.id === project.userId;

  const save = (updated: Project) => {
    updateProject(updated);
    setProject(updated);
  };

  const addComment = () => {
    if (!comment.trim()) return;
    const c: Comment = { id: crypto.randomUUID(), userId: user.id, userName: user.name, text: comment, date: new Date().toISOString() };
    save({ ...project, comments: [...project.comments, c], updatedAt: new Date().toISOString() });
    setComment("");
  };

  const addMilestone = () => {
    if (!milestone.trim()) return;
    const m: Milestone = { id: crypto.randomUUID(), text: milestone, date: new Date().toISOString() };
    save({ ...project, milestones: [...project.milestones, m], updatedAt: new Date().toISOString() });
    setMilestone("");
    toast({ title: "Milestone added" });
  };

  const requestCollab = () => {
    if (project.collaborationRequests.includes(user.id)) {
      toast({ title: "Already requested", variant: "destructive" });
      return;
    }
    save({ ...project, collaborationRequests: [...project.collaborationRequests, user.id] });
    toast({ title: "Hand raised", description: "The owner has been notified." });
  };

  const updateStage = () => {
    save({ ...project, stage: newStage, updatedAt: new Date().toISOString() });
    toast({ title: "Stage updated!" });
    if (newStage === "completed") {
      toast({ title: "Congratulations!", description: "Your project is on the Celebration Wall!" });
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="container mx-auto max-w-3xl space-y-6 animate-fade-in">
        {/* Project header */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">by {project.userName} · {new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge className={stageBadge[project.stage]}>{project.stage}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground">{project.description}</p>
            {project.supportNeeded && (
              <div className="p-3 rounded-lg bg-accent">
                <p className="text-sm font-medium text-accent-foreground flex items-center gap-2"><Handshake className="h-4 w-4" /> Support needed:</p>
                <p className="text-sm text-accent-foreground/80">{project.supportNeeded}</p>
              </div>
            )}
            {!isOwner && (
              <Button variant="outline" onClick={requestCollab}>
                <HandMetal className="h-4 w-4 mr-2" /> Raise Hand for Collaboration
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Owner controls */}
        {isOwner && (
          <Card className="glass-card border-primary/30">
            <CardHeader>
              <CardTitle className="text-lg">Update Your Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Stage</Label>
                  <Select value={newStage} onValueChange={(v) => setNewStage(v as Project["stage"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea"><span className="flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Idea</span></SelectItem>
                      <SelectItem value="in-progress"><span className="flex items-center gap-2"><Hammer className="h-4 w-4" /> In Progress</span></SelectItem>
                      <SelectItem value="testing"><span className="flex items-center gap-2"><FlaskConical className="h-4 w-4" /> Testing</span></SelectItem>
                      <SelectItem value="completed"><span className="flex items-center gap-2"><CircleCheckBig className="h-4 w-4" /> Completed</span></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="hero" onClick={updateStage}>Update Stage</Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Add Milestone</Label>
                <div className="flex gap-2">
                  <Input placeholder="What did you achieve?" value={milestone} onChange={(e) => setMilestone(e.target.value)} />
                  <Button variant="hero" onClick={addMilestone}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>

              {project.collaborationRequests.length > 0 && (
                <div className="p-3 rounded-lg bg-accent">
                   <p className="text-sm font-medium text-accent-foreground flex items-center gap-2">
                     <Users className="h-4 w-4" /> {project.collaborationRequests.length} collaboration request(s)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Milestones */}
        {project.milestones.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Trophy className="h-5 w-5 text-primary" /> Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.milestones.map((m) => (
                  <div key={m.id} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{m.text}</p>
                      <p className="text-xs text-muted-foreground">{new Date(m.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comments */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><MessageCircle className="h-5 w-5 text-primary" /> Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>}
            {project.comments.map((c) => (
              <div key={c.id} className="p-3 rounded-lg bg-secondary">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{c.userName}</span>
                  <span className="text-xs text-muted-foreground">{new Date(c.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm">{c.text}</p>
              </div>
            ))}
            <div className="flex gap-2">
              <Textarea placeholder="Write a comment..." value={comment} onChange={(e) => setComment(e.target.value)} rows={2} className="flex-1" />
              <Button variant="hero" onClick={addComment} className="self-end"><Send className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetails;
