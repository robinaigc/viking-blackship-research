import "../global.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";
import { LanguageProvider } from "./components/language";

export const metadata: Metadata = {
  metadataBase: new URL("https://vikingblackship.com"),
  title: {
    default: "Robin Seun | Viking Blackship",
    template: "%s | Robin Seun",
  },
  description:
    "Sharp, evidence-based analysis on China's economy, policy signals, and local government behavior.",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Robin Seun | Viking Blackship",
    description:
      "Sharp, evidence-based analysis on China's economy, policy signals, and local government behavior.",
    url: "https://vikingblackship.com",
    siteName: "Viking Blackship",
    images: [
      {
        url: "/og.png",
        width: 1362,
        height: 482,
        alt: "Viking Blackship research and consulting",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Robin Seun | Viking Blackship",
    description:
      "Sharp, evidence-based analysis on China's economy, policy signals, and local government behavior.",
    card: "summary_large_image",
    images: ["/og.png"],
  },
  icons: {
    shortcut: "/favicon.png",
  },
};
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={[inter.variable, calSans.variable].join(" ")}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var l=localStorage.getItem('viking-blackship-language');if(l==='zh'||l==='en'){document.documentElement.dataset.language=l;document.documentElement.lang=l==='zh'?'zh-CN':'en'}}catch(e){}",
          }}
        />
        <Analytics />
      </head>
      <body
        className={`bg-black ${process.env.NODE_ENV === "development" ? "debug-screens" : undefined
          }`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
