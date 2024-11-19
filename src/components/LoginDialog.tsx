import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Loader2, Mail, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

export function LoginDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: localStorage.getItem('rememberedEmail') || "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Check if account is locked
    const storedLockoutTime = localStorage.getItem('loginLockoutTime');
    if (storedLockoutTime) {
      const lockoutEndTime = parseInt(storedLockoutTime);
      if (Date.now() < lockoutEndTime) {
        setLockoutTime(lockoutEndTime);
      } else {
        localStorage.removeItem('loginLockoutTime');
        localStorage.removeItem('loginAttempts');
      }
    }

    // Restore login attempts
    const storedAttempts = localStorage.getItem('loginAttempts');
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts));
    }
  }, []);

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };
    let isValid = true;

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if account is locked
    if (lockoutTime && Date.now() < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
      toast({
        variant: "destructive",
        title: "Account Locked",
        description: `Too many failed attempts. Please try again in ${remainingTime} minutes.`,
      });
      return;
    }
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        // Reset login attempts on successful login
        setLoginAttempts(0);
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('loginLockoutTime');

        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        toast({
          title: "Welcome back!",
          description: "Successfully signed in to your account.",
        });
        navigate("/dashboard");
      } else {
        // Increment failed login attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('loginAttempts', newAttempts.toString());

        // Check if account should be locked
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          const lockoutEndTime = Date.now() + LOCKOUT_TIME;
          setLockoutTime(lockoutEndTime);
          localStorage.setItem('loginLockoutTime', lockoutEndTime.toString());
          
          toast({
            variant: "destructive",
            title: "Account Locked",
            description: "Too many failed attempts. Please try again in 15 minutes.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Authentication failed",
            description: `Invalid email or password. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempts remaining.`,
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implement password reset functionality
    toast({
      title: "Password Reset",
      description: "Please contact your system administrator to reset your password.",
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Welcome back</DialogTitle>
        <DialogDescription>
          Sign in to access the SEDCO Admin Dashboard
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        {lockoutTime && Date.now() < lockoutTime && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">
                Account locked. Try again in {Math.ceil((lockoutTime - Date.now()) / 1000 / 60)} minutes.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input 
              id="email"
              type="email" 
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              className={cn(
                "pl-10",
                errors.email ? "border-red-500 focus:ring-red-500" : ""
              )}
              disabled={isLoading || (lockoutTime && Date.now() < lockoutTime)}
            />
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input 
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              className={cn(
                "pl-10",
                errors.password ? "border-red-500 focus:ring-red-500" : ""
              )}
              disabled={isLoading || (lockoutTime && Date.now() < lockoutTime)}
            />
            <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              disabled={isLoading || (lockoutTime && Date.now() < lockoutTime)}
            />
            <Label 
              htmlFor="remember" 
              className="text-sm text-gray-600 cursor-pointer"
            >
              Remember me
            </Label>
          </div>
          <Button
            variant="link"
            className="text-sm text-blue-600 hover:text-blue-700"
            onClick={handleForgotPassword}
            type="button"
            disabled={isLoading || (lockoutTime && Date.now() < lockoutTime)}
          >
            Forgot password?
          </Button>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 h-11"
          disabled={isLoading || (lockoutTime && Date.now() < lockoutTime)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </DialogContent>
  );
}