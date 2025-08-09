import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coffee, Moon, Star, Sparkles } from 'lucide-react';
import { login, signup } from '../redux/features/AuthSlice';
import { signInWithRedirect } from 'firebase/auth';
import { auth, googleAuthProvider } from './../config/firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // Import the toast function

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginWithGoogle = () => {
    toast.info('Redirecting to Google for sign-in...');
    signInWithRedirect(auth, googleAuthProvider);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = isLogin ? login(formData) : signup(formData);
    const toastId = toast.loading(isLogin ? 'Signing in...' : 'Creating account...');

    dispatch(action)
      .unwrap()
      .then((response) => {
        if (isLogin) {
          toast.success('Login Successful!', {
            id: toastId,
            description: `Welcome back, ${response.name || 'User'}!`,
          });
          navigate('/menu');
        } else {
          toast.success('Account Created!', {
            id: toastId,
            description: 'Your account has been successfully registered. Please sign in.',
          });
          setIsLogin(true); // Switch to login form
        }
      })
      .catch((error) => {
        toast.error(error.message || 'An error occurred', {
          id: toastId,
          description: 'Please check your details and try again.',
        });
      });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', phone: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <Card className="w-full max-w-md glass border-primary/20 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <Coffee className="w-10 h-10 text-primary animate-pulse" />
              <Sparkles className="w-4 h-4 text-cafe-gold absolute -top-1 -right-1 animate-bounce" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-cafe-gold bg-clip-text text-transparent">
                Midnight Cafe
              </h1>
              <p className="text-sm text-cafe-gold/80 font-medium">Bloom</p>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {isLogin ? 'Welcome Back' : 'Join Our Cafe'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isLogin
              ? 'Sign in to your account to continue your coffee journey'
              : 'Create an account to start your midnight cafe experience'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                <Input id="name" name="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={handleInputChange} required={!isLogin} className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"/>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
              <Input id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} required className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"/>
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-foreground font-medium">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="Enter your phone number" value={formData.phone} onChange={handleInputChange} required={!isLogin} className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"/>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleInputChange} required className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"/>
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleInputChange} required={!isLogin} className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"/>
              </div>
            )}
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-cafe-gold hover:from-primary/80 hover:to-cafe-gold/80 text-primary-foreground font-semibold py-3 transition-all duration-300 transform hover:scale-105 shadow-lg">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
            <Button onClick={handleLoginWithGoogle} type="button" className="w-full bg-gradient-to-r from-primary to-cafe-gold hover:from-primary/80 hover:to-cafe-gold/80 text-primary-foreground font-semibold py-3 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Sign In With Google
            </Button>
            <div className="text-center">
              <button type="button" onClick={toggleMode} className="text-primary hover:text-cafe-gold transition-colors duration-300 font-medium">
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
            {isLogin && (
              <div className="text-center">
                <button type="button" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  Forgot your password?
                </button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;