
import { Button } from "@/components/ui/button";
import { Coffee, Moon, Star, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-primary/10 to-cafe-gold/10 blur-3xl animate-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-cafe-gold/10 to-primary/10 blur-2xl animate-glow" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Floating decorative icons */}
      <div className="absolute top-20 left-20 animate-float">
        <Star className="w-8 h-8 text-cafe-gold/30" />
      </div>
      <div className="absolute top-32 right-32 animate-float" style={{ animationDelay: "2s" }}>
        <Sparkles className="w-6 h-6 text-primary/30" />
      </div>
      <div className="absolute bottom-32 left-32 animate-float" style={{ animationDelay: "4s" }}>
        <Moon className="w-7 h-7 text-cafe-gold/30" />
      </div>
      <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: "3s" }}>
        <Coffee className="w-5 h-5 text-primary/30" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4">
        {/* Logo and Brand */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className="relative">
            <Coffee className="w-16 h-16 text-primary animate-pulse" />
            <Sparkles className="w-6 h-6 text-cafe-gold absolute -top-2 -right-2 animate-bounce" />
          </div>
          <div className="text-left">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-cafe-gold bg-clip-text text-transparent">
              Midnight Cafe
            </h1>
            <p className="text-xl text-cafe-gold/80 font-medium tracking-wider">
              Bloom
            </p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            Where Coffee Dreams
            <span className="block bg-gradient-to-r from-primary to-cafe-gold bg-clip-text text-transparent">
              Come to Life
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience the perfect blend of artisan coffee, midnight ambiance, and digital innovation. 
            Manage your cafe with elegance and watch your business bloom under the starlit sky.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link to="/login">
              <Button className="bg-gradient-to-r from-primary to-cafe-gold hover:from-primary/80 hover:to-cafe-gold/80 text-primary-foreground font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg group">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-4 text-lg transition-all duration-300 glass">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass rounded-lg p-6 text-center group hover:scale-105 transition-all duration-300">
            <Coffee className="w-12 h-12 text-primary mx-auto mb-4 group-hover:animate-bounce" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Menu Management</h3>
            <p className="text-muted-foreground">Craft your perfect menu with our intuitive management system</p>
          </div>
          
          <div className="glass rounded-lg p-6 text-center group hover:scale-105 transition-all duration-300" style={{ animationDelay: "0.1s" }}>
            <Moon className="w-12 h-12 text-cafe-gold mx-auto mb-4 group-hover:animate-bounce" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Night Mode</h3>
            <p className="text-muted-foreground">Beautiful dark interface perfect for late-night operations</p>
          </div>
          
          <div className="glass rounded-lg p-6 text-center group hover:scale-105 transition-all duration-300" style={{ animationDelay: "0.2s" }}>
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 group-hover:animate-bounce" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Analytics</h3>
            <p className="text-muted-foreground">Watch your business bloom with detailed insights</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage