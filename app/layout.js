import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loader from "./loader"; // 👈 Import your loader here

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Manual Meta Tags for SEO */}
        <title>
          M R Consultants | Real Estate, Construction & Interior Design
        </title>
        <meta
          name="description"
          content="Top real estate, construction, land development, and interior design company serving clients in 50+ countries. Build your dream with M R Consultants."
        />
        <meta
          name="keywords"
          content="mr consultants, m r consultants, mr consultants bangalore, real estate consultants, construction company, interior design firm, land development, luxury real estate, sustainable architecture, property consultants"
        />
        <meta name="author" content="M R Consultants" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          {/* ✅ Google Search Console Verification */}
  <meta name="google-site-verification" content="xWFvk6Q0gL7oqBTc1zjhUUWv1sYx2naspVqenv-xQ-g" />

        {/* ✅ Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="M R Consultants | Real Estate & Construction"
        />
        <meta
          property="og:description"
          content="Discover world-class solutions in real estate, construction, land development, and interior design. Trusted by 500+ clients globally."
        />
        <meta property="og:url" content="https://www.mrconsultants.net" />
        <meta property="og:site_name" content="M R Consultants" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta
          property="og:image"
          content="https://www.mrconsultants.net/logo.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="M R Consultants - Futuristic Real Estate & Design"
        />

        {/* ✅ Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="M R Consultants | Real Estate & Construction"
        />
        <meta
          name="twitter:description"
          content="Luxury real estate, futuristic construction, and modern interior design. Globally trusted and locally delivered."
        />
        <meta
          name="twitter:image"
          content="https://www.mrconsultants.net/logo.png"
        />

        {/* ✅ JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "M R Consultants",
              url: "https://www.mrconsultants.net",
              logo: "https://www.mrconsultants.net/logo.png",
              description:
                "M R Consultants is a global leader in real estate, construction, land development, and home interior design. Delivering innovative and sustainable solutions worldwide.",
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "#46 Pro Fit Club, Appu Circle, Doddabele, Kengeri,Bangalore",
                addressLocality:
                  "#46 Pro Fit Club, Appu Circle, Doddabele, Kengeri,Bangalore",
                addressCountry: "IN",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: " +91 7619624474",
                contactType: "Customer Service",
                email: "mrconsultants589@gmail.com",
                areaServed: "Worldwide",
                availableLanguage: ["English", "Hindi"],
              },
              sameAs: [
                "https://www.facebook.com/mrconsultants",
                "https://www.instagram.com/mrconsultants",
                "https://www.linkedin.com/company/mrconsultants",
              ],
              founder: {
                "@type": "Person",
                name: "Mallesh Reddy",
              },
              foundingDate: "2010-01-01",
              employee: [
                // {
                //   "@type": "Person",
                //   name: "Bob Williams",
                //   jobTitle: "Lead Architect",
                // },
                // {
                //   "@type": "Person",
                //   name: "Carol Davis",
                //   jobTitle: "Interior Designer",
                // },
                // {
                //   "@type": "Person",
                //   name: "David Lee",
                //   jobTitle: "Construction Manager",
                // },
              ],
              service: [
                {
                  "@type": "Service",
                  name: "Real Estate",
                  areaServed: "Worldwide",
                  description:
                    "National and international real estate services offering modern properties and investment opportunities.",
                },
                {
                  "@type": "Service",
                  name: "Construction",
                  description:
                    "High-quality building construction projects with a focus on innovation and design.",
                },
                {
                  "@type": "Service",
                  name: "Land Development",
                  description:
                    "Transforming landscapes through sustainable and community-centric development.",
                },
                {
                  "@type": "Service",
                  name: "Interior Design",
                  description:
                    "Bespoke interior design services for residential and commercial spaces.",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Loader />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
