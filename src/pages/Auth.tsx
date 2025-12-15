import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { z } from 'zod';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Validate
      const schema = isSignUp ? signUpSchema : signInSchema;
      const result = schema.safeParse(formData);
      
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setLoading(false);
        return;
      }

      if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Email already registered', {
              description: 'Please sign in instead or use a different email.',
            });
          } else {
            toast.error('Sign up failed', { description: error.message });
          }
        } else {
          toast.success('Account created!', {
            description: 'Welcome to Store. You are now logged in.',
          });
          navigate('/');
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid credentials', {
              description: 'Please check your email and password.',
            });
          } else {
            toast.error('Sign in failed', { description: error.message });
          }
        } else {
          toast.success('Welcome back!');
          navigate('/');
        }
      }
    } catch (err) {
      toast.error('Something went wrong', { description: 'Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isSignUp ? 'Create Account' : 'Sign In'} | Store</title>
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <span className="text-xl font-bold text-accent-foreground">S</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">Store</span>
            </Link>

            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {isSignUp
                  ? 'Join us to start shopping and track your orders'
                  : 'Sign in to continue shopping and view your orders'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="John Doe"
                      className={cn(
                        "w-full h-12 pl-11 pr-4 rounded-xl bg-secondary border transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
                        errors.fullName ? "border-destructive" : "border-border"
                      )}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className={cn(
                      "w-full h-12 pl-11 pr-4 rounded-xl bg-secondary border transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
                      errors.email ? "border-destructive" : "border-border"
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className={cn(
                      "w-full h-12 pl-11 pr-12 rounded-xl bg-secondary border transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
                      errors.password ? "border-destructive" : "border-border"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Toggle */}
            <p className="text-center text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
                }}
                className="font-semibold text-accent hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/10 to-background" />
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"
            alt="Shopping"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-foreground">
            <h2 className="text-3xl font-bold mb-3">Shop with Confidence</h2>
            <p className="text-muted-foreground">
              Join thousands of happy customers who love our curated collection of premium products.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
