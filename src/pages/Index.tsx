import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Shield, TrendingUp, Bell, Briefcase } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">CampusVoice</h1>
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
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer" onClick={() => navigate("/login/student")}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Student</CardTitle>
              <CardDescription className="text-base">
                Submit and track your concerns
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full" size="lg">
                Student Login
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Don't have an account?{" "}
                <span 
                  className="text-primary hover:underline cursor-pointer font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/signup/student");
                  }}
                >
                  Sign up
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer" onClick={() => navigate("/login/staff")}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Staff</CardTitle>
              <CardDescription className="text-base">
                Report issues and collaborate
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full" size="lg">
                Staff Login
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Don't have an account?{" "}
                <span 
                  className="text-primary hover:underline cursor-pointer font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/signup/staff");
                  }}
                >
                  Sign up
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer" onClick={() => navigate("/admin/login")}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Admin</CardTitle>
              <CardDescription className="text-base">
                Manage and resolve concerns
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full" size="lg" variant="secondary">
                Admin Access
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Authorized personnel only
              </p>
            </CardContent>
          </Card>
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
                Choose your role above to get started with CampusVoice today.
              </p>
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
