import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Trophy, Send, Lightbulb, Hammer, FlaskConical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  user_id: number;
  username: string;
  created_at: string;
};

type Comment = {
  id: number;
  content: string;
  username: string;
  created_at: string;
};

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [newStage, setNewStage] = useState("ideation");

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    apiFetch(`/projects/${id}`).then((data) => {
      if (data.success) {
        setProject(data.data);
        setNewStage(data.data.stage);
      } else {
        navigate("/dashboard");
      }
    });
    apiFetch(`/projects/${id}/comments`).then((data) => {
      if (data.success) setComments(data.data);
    });
  }, [id]);

  if (!project) return null;

  const isOwner = currentUser && currentUser.id === project.user_id;

  const addComment = async () => {
    if (!comment.trim()) return;
    const data = await apiFetch(`/projects/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({ content: comment }),
    });
    if (data.success) {
      setComments((prev) => [...prev, data.data]);
      setComment("");
    } else {
      toast({ title: "Error", description: data.message || "Could not post comment.", variant: "destructive" });
    }
  };

  const updateStage = async () => {
    const data = await apiFetch(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify({ stage: newStage }),
    });
    if (data.success) {
      setProject((prev) => prev ? { ...prev, stage: newStage } : prev);
      toast({ title: "Stage updated!" });
    } else {
      toast({ title: "Error", description: data.message || "Could not update stage.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="container mx-auto max-w-3xl space-y-6 animate-fade-in">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">by {project.username} · {new Date(project.created_at).toLocaleDateString()}</p>
              </div>
              <Badge className={stageBadge[project.stage] || "bg-secondary text-secondary-foreground"}>{project.stage}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{project.description}</p>
          </CardContent>
        </Card>

        {isOwner && (
          <Card className="glass-card border-primary/30">
            <CardHeader>
              <CardTitle className="text-lg">Update Your Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Stage</Label>
                  <Select value={newStage} onValueChange={setNewStage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ideation"><span className="flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Ideation</span></SelectItem>
                      <SelectItem value="development"><span className="flex items-center gap-2"><Hammer className="h-4 w-4" /> Development</span></SelectItem>
                      <SelectItem value="testing"><span className="flex items-center gap-2"><FlaskConical className="h-4 w-4" /> Testing</span></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="hero" onClick={updateStage}>Update Stage</Button>
              </div>
              <Separator />
            </CardContent>
          </Card>
        )}

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Trophy className="h-5 w-5 text-primary" /> Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{comments.length} comment{comments.length !== 1 ? "s" : ""}</span>
            </div>
            {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>}
            {comments.map((c) => (
              <div key={c.id} className="p-3 rounded-lg bg-secondary">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{c.username}</span>
                  <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm">{c.content}</p>
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
