import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConcernCard from "@/components/ConcernCard";
import { useToast } from "@/hooks/use-toast";
import { Plus, LogOut, MessageSquare } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type Concern = Database["public"]["Tables"]["concerns"]["Row"];

const UserDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchConcerns();
      
      // Subscribe to real-time updates
      const channel = supabase
        .channel('concerns-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'concerns',
            filter: `user_id=eq.${user.id}`,
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
  }, [user]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    if (!session?.user) {
      navigate("/login");
    }
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const filterConcerns = (status?: string) => {
    if (!status) return concerns;
    return concerns.filter((c) => c.status === status);
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
              <p className="text-sm text-muted-foreground">Student Dashboard</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Concerns</CardTitle>
                <CardDescription>Track and manage your submitted concerns</CardDescription>
              </div>
              <Button onClick={() => navigate("/submit-concern")}>
                <Plus className="w-4 h-4 mr-2" />
                New Concern
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({concerns.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({filterConcerns("pending").length})</TabsTrigger>
                <TabsTrigger value="under_review">In Review ({filterConcerns("under_review").length})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({filterConcerns("resolved").length})</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4 mt-4">
                {concerns.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No concerns yet. Start by creating one!</p>
                  </div>
                ) : (
                  concerns.map((concern) => (
                    <ConcernCard key={concern.id} concern={concern} />
                  ))
                )}
              </TabsContent>
              <TabsContent value="pending" className="space-y-4 mt-4">
                {filterConcerns("pending").map((concern) => (
                  <ConcernCard key={concern.id} concern={concern} />
                ))}
              </TabsContent>
              <TabsContent value="under_review" className="space-y-4 mt-4">
                {filterConcerns("under_review").map((concern) => (
                  <ConcernCard key={concern.id} concern={concern} />
                ))}
              </TabsContent>
              <TabsContent value="resolved" className="space-y-4 mt-4">
                {filterConcerns("resolved").map((concern) => (
                  <ConcernCard key={concern.id} concern={concern} />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UserDashboard;
