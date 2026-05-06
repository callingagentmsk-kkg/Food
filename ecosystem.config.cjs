module.exports = {
  apps: [{
    name: 'satyam-gold',
    script: 'npx',
    args: 'http-server public -p 3000 -c-1 --cors -a 0.0.0.0',
    cwd: '/home/user/webapp',
    env: { NODE_ENV: 'production' },
    autorestart: true,
    watch: false
  }]
};
