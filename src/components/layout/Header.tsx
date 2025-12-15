import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Menu, X, Sun, Moon, User, LogOut, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import logo from '../../images/logo.png'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount, wishlist } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            {/* <span className="text-lg font-bold text-accent-foreground">S</span> */}
            <img src={logo} alt="" />
          </div>
          <span className="text-xl font-bold tracking-tight">Velora</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            All Products
          </Link>
          <Link to="/products?category=electronics" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Electronics
          </Link>
          <Link to="/products?category=fashion" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Fashion
          </Link>
          <Link to="/products?category=home-living" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home & Living
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className={cn(
            "absolute left-0 right-0 top-0 h-16 bg-background/95 backdrop-blur-xl border-b border-border flex items-center px-4 transition-all duration-300",
            isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          )}>
            <Search className="h-5 w-5 text-muted-foreground mr-3" />
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              autoFocus={isSearchOpen}
            />
            <Button variant="ghost" size="icon-sm" onClick={() => setIsSearchOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {wishlist.length}
                </span>
              )}
            </Button>
          </Link>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="flex items-center cursor-pointer">
                    <Package className="h-4 w-4 mr-2" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden overflow-hidden transition-all duration-300 border-t border-border",
        isMenuOpen ? "max-h-80" : "max-h-0"
      )}>
        <nav className="container py-4 flex flex-col gap-2">
          <Link to="/products" className="py-2 text-sm font-medium hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>
            All Products
          </Link>
          <Link to="/products?category=electronics" className="py-2 text-sm font-medium hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>
            Electronics
          </Link>
          <Link to="/products?category=fashion" className="py-2 text-sm font-medium hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>
            Fashion
          </Link>
          <Link to="/products?category=home-living" className="py-2 text-sm font-medium hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>
            Home & Living
          </Link>
          <div className="h-px bg-border my-2" />
          {user ? (
            <>
              <Link to="/orders" className="py-2 text-sm font-medium hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>
                My Orders
              </Link>
              <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="py-2 text-sm font-medium text-destructive text-left">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/auth" className="py-2 text-sm font-medium text-accent" onClick={() => setIsMenuOpen(false)}>
              Sign In / Sign Up
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
