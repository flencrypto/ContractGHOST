export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden border-t border-border-subtle"
      style={{
        backgroundImage: "url('/header-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/88 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 px-6 py-3 flex items-center justify-between">
        <p className="text-xs text-text-muted font-mono">
          aLiGN OS &middot; AI-native Bid &amp; Delivery Platform
        </p>
        <p className="text-xs text-text-faint font-mono">v0.1.0</p>
      </div>
    </footer>
  );
}
