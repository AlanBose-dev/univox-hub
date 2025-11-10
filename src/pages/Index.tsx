import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Shield, TrendingUp, Bell } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">CampusVoice</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/signup")}>Sign Up</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Your Voice,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Our Priority
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A unified platform for students and staff to raise concerns, track progress, and drive
            positive change in your institution.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Button size="lg" onClick={() => navigate("/signup")}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <MessageSquare className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Easy Submission</CardTitle>
              <CardDescription>
                Submit concerns quickly with our intuitive interface
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Shield className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Anonymous Option</CardTitle>
              <CardDescription>
                Choose to submit concerns anonymously for sensitive matters
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <TrendingUp className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Real-Time Tracking</CardTitle>
              <CardDescription>
                Monitor your concern's progress with live status updates
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Bell className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Instant Updates</CardTitle>
              <CardDescription>
                Get notified immediately when admins respond to your concerns
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Ready to make your voice heard?</h2>
              <p className="text-muted-foreground">
                Join CampusVoice today and be part of creating a better campus environment.
              </p>
              <Button size="lg" onClick={() => navigate("/signup")}>
                Create Your Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 CampusVoice. Making institutions better, one voice at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
