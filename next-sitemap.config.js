/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://mrconsultants.net",
  generateRobotsTxt: true,
  outDir: "./public", // 👈 IMPORTANT: output goes here
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"],
      },
    ],
  },
};
