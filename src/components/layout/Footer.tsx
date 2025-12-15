import { Link } from 'react-router-dom';
import logo from '../../images/logo.png'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                {/* <span className="text-lg font-bold text-accent-foreground">S</span> */}
                <img src={logo} alt="" />
              </div>
              <span className="text-xl font-bold tracking-tight">Velora</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Premium products for the modern lifestyle. Quality meets design.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/products?category=electronics" className="hover:text-foreground transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=fashion" className="hover:text-foreground transition-colors">Fashion</Link></li>
              <li><Link to="/products?category=home-living" className="hover:text-foreground transition-colors">Home & Living</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link to="/shipping" className="hover:text-foreground transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-foreground transition-colors">Returns</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Store. All rights reserved.</p>
          <p>powered by Tantragya</p>
        </div>
      </div>
    </footer>
  );
}
