import { Link } from "@tanstack/react-router";
import { Mail, Phone, Globe } from "lucide-react";

export function PublicFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-gradient-to-b from-card/30 to-card/60 px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="text-lg font-semibold">
            HalfPace<sup className="reg-mark" aria-hidden>®</sup>{" "}
            <span className="text-primary">Finance &amp; Tax Consultants</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            India's Intelligent Tax &amp; Compliance Platform
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <a href="tel:+917021402436" className="hover:text-foreground">7021402436</a>
              <span className="opacity-40">·</span>
              <a href="tel:+919987600927" className="hover:text-foreground">9987600927</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:ikaclients@gmail.com" className="hover:text-foreground">ikaclients@gmail.com</a>
            </li>
            <li className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <a href="https://www.halfpace.in" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                www.halfpace.in
              </a>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-medium text-foreground">Product</div>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/calculators" className="hover:text-foreground">Tax Calculators</Link></li>
            <li><Link to="/updates" className="hover:text-foreground">Latest Updates</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-medium text-foreground">Legal</div>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms of Use</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-border/60 pt-6 text-xs text-muted-foreground">
        <p>
          HalfPace<sup className="reg-mark" aria-hidden>®</sup> TaxGPT provides general
          informational guidance. It does not constitute legal or professional advice.
          Always consult a qualified professional for advice specific to your circumstances.
        </p>
        <p className="mt-3">
          HalfPace<sup className="reg-mark" aria-hidden>®</sup> is a registered trademark.
          © {year} HalfPace<sup className="reg-mark" aria-hidden>®</sup> Finance &amp; Tax Consultants. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
