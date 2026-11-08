// Proxy de développement : les appels /api/... sont redirigés vers l'API Pizza Eats.
// En local : http://localhost:3000 ; dans Docker : API_URL=http://pizza-eats-api:3000
module.exports = {
  "/api": {
    target: process.env.API_URL || "http://localhost:3000",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
  },
};
