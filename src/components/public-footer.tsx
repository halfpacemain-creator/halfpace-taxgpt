import { Link } from "@tanstack/react-router";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card/40 px-6 py-10">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        <div>
          <div className="text-base font-semibold">
            HalfPace <span className="text-primary">TaxGPT</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">India's AI Tax Expert</p>
        </div>
        <div className="text-sm">
          <div className="font-medium text-foreground">Product</div>
          <ul className="mt-2 space-y-1.5 text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/calculators" className="hover:text-foreground">Tax Calculators</Link></li>
            <li><Link to="/updates" className="hover:text-foreground">Latest Updates</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-medium text-foreground">Legal</div>
          <ul className="mt-2 space-y-1.5 text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms of Use</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-5xl text-xs text-muted-foreground">
        HalfPace TaxGPT provides general informational guidance. It does not constitute legal or
        professional advice. Always consult a qualified professional for advice specific to your
        circumstances.
      </p>
    </footer>
  );
}
