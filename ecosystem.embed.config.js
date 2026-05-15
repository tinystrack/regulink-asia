// ecosystem.embed.config.js
// PM2 config for the Python embedding service.
// Usage:
//   pm2 start ecosystem.embed.config.js
//   pm2 save

module.exports = {
  apps: [
    {
      name: "regulink-embed",
      // Use the virtualenv python explicitly so PM2 finds sentence-transformers
      script: "/home/lyra_tinystrack/regulink-asia/venv/bin/python",
      args: "embed_service.py",
      cwd: "/home/lyra_tinystrack/regulink-asia",
      interpreter: "none",           // script IS the interpreter
      env: {
        EMBED_PORT: "3111",
        EMBED_MODEL: "sentence-transformers/all-MiniLM-L6-v2",
        // Limit PyTorch to 1 thread — avoids CPU contention on shared VPS
        OMP_NUM_THREADS: "1",
        TOKENIZERS_PARALLELISM: "false",
      },
      // Restart policy
      autorestart: true,
      watch: false,
      max_memory_restart: "600M",    // model ~90MB + FastAPI overhead, 600M is safe ceiling
      restart_delay: 3000,
      // Log paths (optional, PM2 defaults work fine too)
      out_file: "/home/lyra_tinystrack/.pm2/logs/regulink-embed-out.log",
      error_file: "/home/lyra_tinystrack/.pm2/logs/regulink-embed-err.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
