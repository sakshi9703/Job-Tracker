import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-brand-mark">J</span>
          <span className="footer-brand-name">JobTracker</span>
        </div>

        <p className="footer-tagline">
          Track smarter. Apply better.
        </p>

        <p className="footer-copyright">
          © {new Date().getFullYear()} JobTracker
        </p>
      </div>
    </footer>
  );
}