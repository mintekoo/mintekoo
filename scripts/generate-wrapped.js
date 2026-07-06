const fs = require("fs");
const path = require("path");

const year = new Date().getFullYear();

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="450">
    <rect width="100%" height="100%" fill="#0d1117"/>

    <text x="50%" y="80"
        text-anchor="middle"
        fill="white"
        font-size="42"
        font-family="Arial">
        Git Wrapped ${year}
    </text>

    <text x="50%" y="150"
        text-anchor="middle"
        fill="#58a6ff"
        font-size="26">
        @mintekoo
    </text>

    <text x="50%" y="240"
        text-anchor="middle"
        fill="white"
        font-size="22">
        🚀 This card was generated automatically.
    </text>
</svg>
`;

const distPath = path.join(process.cwd(), "dist");
fs.mkdirSync(distPath, { recursive: true });

fs.writeFileSync(path.join(distPath, "wrapped.svg"), svg.trim());

console.log("Generated wrapped.svg");
