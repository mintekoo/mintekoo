const fs = require("fs");
const path = require("path");
const { Octokit } = require("@octokit/rest");

const USERNAME = "mintekoo";

// GitHub API client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function fetchStats() {
  const { data: user } = await octokit.users.getByUsername({
    username: USERNAME,
  });

  const { data: repos } = await octokit.repos.listForUser({
    username: USERNAME,
    per_page: 100,
  });

  let stars = 0;
  let forks = 0;

  repos.forEach((repo) => {
    stars += repo.stargazers_count;
    forks += repo.forks_count;
  });

  return {
    name: user.name || USERNAME,
    followers: user.followers,
    repos: repos.length,
    stars,
    forks,
  };
}

async function generate() {
  const stats = await fetchStats();
  const year = new Date().getFullYear();

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="500">

  <defs>
    <linearGradient id="bg" x1="0" x2="1">
      <stop offset="0%" stop-color="#0f0c29"/>
      <stop offset="50%" stop-color="#302b63"/>
      <stop offset="100%" stop-color="#24243e"/>
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg)"/>

  <!-- TITLE -->
  <text x="50%" y="80"
        text-anchor="middle"
        fill="#ffffff"
        font-size="44"
        font-family="Arial"
        font-weight="bold">
    🎁 Git Wrapped ${year}
  </text>

  <!-- USER -->
  <text x="50%" y="140"
        text-anchor="middle"
        fill="#58a6ff"
        font-size="26">
    @${USERNAME}
  </text>

  <!-- STATS ROW 1 -->
  <text x="50%" y="220"
        text-anchor="middle"
        fill="#e6edf3"
        font-size="22">
    📦 Repositories: ${stats.repos}
  </text>

  <text x="50%" y="260"
        text-anchor="middle"
        fill="#e6edf3"
        font-size="22">
    ⭐ Stars: ${stats.stars}
  </text>

  <!-- STATS ROW 2 -->
  <text x="50%" y="300"
        text-anchor="middle"
        fill="#e6edf3"
        font-size="22">
    🍴 Forks: ${stats.forks}
  </text>

  <text x="50%" y="340"
        text-anchor="middle"
        fill="#e6edf3"
        font-size="22">
    👥 Followers: ${stats.followers}
  </text>

  <!-- FOOTER -->
  <text x="50%" y="410"
        text-anchor="middle"
        fill="#8b949e"
        font-size="16">
    Live GitHub data • Updated daily via Actions
  </text>

</svg>
`;

  const dist = path.join(process.cwd(), "dist");
  fs.mkdirSync(dist, { recursive: true });

  fs.writeFileSync(path.join(dist, "wrapped.svg"), svg.trim());

  console.log("✅ Git Wrapped generated successfully");
}

generate().catch((err) => {
  console.error("❌ Error generating Git Wrapped:", err);
  process.exit(1);
});
