import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lightbulb, Hammer, FlaskConical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const CreateProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState("ideation");
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = localStorage.getItem("token");
  if (!token) { navigate("/login"); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await apiFetch("/projects", {
      method: "POST",
      body: JSON.stringify({ title, description, stage, status: "active" }),
    });
    if (data.success) {
      toast({ title: "Project created", description: "Your project is now live on the feed." });
      navigate("/dashboard");
    } else {
      toast({ title: "Error", description: data.message || "Could not create project.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="container mx-auto max-w-2xl animate-fade-in">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Project</CardTitle>
            <CardDescription>Share what you&apos;re building with the community</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" placeholder="My awesome project" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" placeholder="What are you building and why?" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Stage</Label>
                <Select value={stage} onValueChange={setStage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ideation"><span className="flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Ideation</span></SelectItem>
                    <SelectItem value="development"><span className="flex items-center gap-2"><Hammer className="h-4 w-4" /> Development</span></SelectItem>
                    <SelectItem value="testing"><span className="flex items-center gap-2"><FlaskConical className="h-4 w-4" /> Testing</span></SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="hero" size="lg" className="flex-1">
                  Publish Project
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => navigate("/dashboard")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProject;
