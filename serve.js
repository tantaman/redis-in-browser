const handler = require("serve-handler");
const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
};

const server = https.createServer(options, (request, response) => {
  // Set up cross origina isolation. This is required for shared array buffers to work.
  // We use shared array buffers to share memory between redis threads.
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy#certain_features_depend_on_cross-origin_isolation
  return handler(request, response, {
    headers: [
      {
        source: "**/*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ],
  });
});

server.listen(3000, () => {
  console.log("Running at https://localhost:3000");
});

// https://github.com/vercel/serve/pull/520
