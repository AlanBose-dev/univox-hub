import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ConcernCard from "@/components/ConcernCard";
import { useToast } from "@/hooks/use-toast";
import { LogOut, MessageSquare, BarChart3 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type Concern = Database["public"]["Tables"]["concerns"]["Row"];

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [selectedConcern, setSelectedConcern] = useState<Concern | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdmin();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchConcerns();
      
      const channel = supabase
        .channel('admin-concerns-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'concerns',
          },
          () => {
            fetchConcerns();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isAdmin]);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    
    if (!session?.user) {
      navigate("/login");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .single();

    if (!roles) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  };

  const fetchConcerns = async () => {
    try {
      const { data, error } = await supabase
        .from("concerns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConcerns(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch concerns",
        variant: "destructive",
      });
    }
  };

  const handleUpdateConcern = async () => {
    if (!selectedConcern) return;

    try {
      const updates: any = {};
      if (newStatus) updates.status = newStatus;
      if (newStatus === "resolved") updates.resolved_at = new Date().toISOString();

      const { error: updateError } = await supabase
        .from("concerns")
        .update(updates)
        .eq("id", selectedConcern.id);

      if (updateError) throw updateError;

      if (comment.trim()) {
        const { error: commentError } = await supabase
          .from("concern_comments")
          .insert([
            {
              concern_id: selectedConcern.id,
              user_id: user!.id,
              comment: comment.trim(),
              is_admin_comment: true,
            },
          ]);

        if (commentError) throw commentError;
      }

      toast({
        title: "Success",
        description: "Concern updated successfully",
      });

      setSelectedConcern(null);
      setNewStatus("");
      setComment("");
      fetchConcerns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update concern",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const filterConcerns = (status?: string) => {
    if (!status) return concerns;
    return concerns.filter((c) => c.status === status);
  };

  const stats = {
    total: concerns.length,
    pending: filterConcerns("pending").length,
    underReview: filterConcerns("under_review").length,
    resolved: filterConcerns("resolved").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CampusVoice</h1>
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Concerns</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl text-warning">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Under Review</CardDescription>
              <CardTitle className="text-3xl text-accent">{stats.underReview}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Resolved</CardDescription>
              <CardTitle className="text-3xl text-success">{stats.resolved}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>All Concerns</CardTitle>
            <CardDescription>Manage and respond to student concerns</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({concerns.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                <TabsTrigger value="under_review">In Review ({stats.underReview})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4 mt-4">
                {concerns.map((concern) => (
                  <ConcernCard
                    key={concern.id}
                    concern={concern}
                    onClick={() => setSelectedConcern(concern)}
                  />
                ))}
              </TabsContent>
              <TabsContent value="pending" className="space-y-4 mt-4">
                {filterConcerns("pending").map((concern) => (
                  <ConcernCard
                    key={concern.id}
                    concern={concern}
                    onClick={() => setSelectedConcern(concern)}
                  />
                ))}
              </TabsContent>
              <TabsContent value="under_review" className="space-y-4 mt-4">
                {filterConcerns("under_review").map((concern) => (
                  <ConcernCard
                    key={concern.id}
                    concern={concern}
                    onClick={() => setSelectedConcern(concern)}
                  />
                ))}
              </TabsContent>
              <TabsContent value="resolved" className="space-y-4 mt-4">
                {filterConcerns("resolved").map((concern) => (
                  <ConcernCard
                    key={concern.id}
                    concern={concern}
                    onClick={() => setSelectedConcern(concern)}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <Dialog open={!!selectedConcern} onOpenChange={() => setSelectedConcern(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedConcern?.title}</DialogTitle>
            <DialogDescription>Manage this concern</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Description:</p>
              <p className="text-sm text-muted-foreground">{selectedConcern?.description}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Update Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Add Comment (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="Add a response or note..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
            <Button onClick={handleUpdateConcern} className="w-full">
              Update Concern
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
