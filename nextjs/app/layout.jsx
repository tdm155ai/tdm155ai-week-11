import "@fontsource-variable/inter";
import "./globals.css";

export const metadata = {
  title: { default: "Games · TDM 155AI week 11", template: "%s · TDM 155AI week 11" },
  description: "Games as a kind of media: what a game is made of, a few small games to play and remake, and a mechanic of your own. TDM 155AI, November 18, 2026.",
};

export const viewport = {
  colorScheme: "dark",
  themeColor: "#100d1c",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
