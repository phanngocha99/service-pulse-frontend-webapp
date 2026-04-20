import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import Logo from "../assets/logo.svg";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/Card";
import { LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate("/profile");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login({ name, password });
    setLoading(false);

    if (success) {
      navigate("/profile");
    } else {
      setError("Incorrect username or password.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-xl flex items-center justify-center">
            <img src={Logo} className="text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Service Pulse</h1>
          <p className="text-sm text-muted-foreground">Log in to continue</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Log in</CardTitle>
            <CardDescription>Use your system account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your username..."
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  required
                />
              </div>

              <Button type="submit" className="w-full h-11" disabled={loading}>
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? "Currently logged in..." : "Log in"}
              </Button>
            </form>

            {/* Demo hint */}
            <div className="mt-6 p-3 rounded-md bg-muted text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Demo accounts:</p>
              <p>
                <span className="font-mono bg-background px-1 rounded">
                  admin
                </span>{" "}
                — Full admin access
              </p>
              <p>
                <span className="font-mono bg-background px-1 rounded">
                  agent01
                </span>{" "}
                — IT Agent
              </p>
              <p>
                <span className="font-mono bg-background px-1 rounded">
                  user01
                </span>{" "}
                — End user
              </p>
              <p>
                Password:{" "}
                <span className="font-mono bg-background px-1 rounded">
                  password
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { Login };
