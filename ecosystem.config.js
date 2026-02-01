module.exports = {
  apps: [
    {
      name: 'vincent-bot',
      script: 'index.js',
      watch: false,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production'
        // Add other env vars here or configure them on the VPS
      }
    }
  ]
};
