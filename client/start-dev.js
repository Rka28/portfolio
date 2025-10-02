const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Function to create a formatted timestamp
function getTimestamp() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
}

// Function to log messages with timestamps and colors
function log(message, color = colors.reset) {
  console.log(`${colors.bright}${colors.cyan}[${getTimestamp()}]${colors.reset} ${color}${message}${colors.reset}`);
}

// Start the backend server
log('Starting backend server...', colors.yellow);
const backend = spawn('node', ['server/server.js'], { stdio: 'pipe' });

// Start the frontend development server
log('Starting frontend development server...', colors.magenta);
const frontend = spawn('npm', ['start'], { stdio: 'pipe' });

// Handle backend output
backend.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    log(`[Backend] ${line}`, colors.green);
  });
});

backend.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    log(`[Backend] ${line}`, colors.red);
  });
});

// Handle frontend output
frontend.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    log(`[Frontend] ${line}`, colors.blue);
  });
});

frontend.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    log(`[Frontend] ${line}`, colors.red);
  });
});

// Handle process exit
process.on('SIGINT', () => {
  log('Shutting down development servers...', colors.yellow);
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
});

// Handle child process exit
backend.on('exit', (code) => {
  log(`Backend server exited with code ${code}`, colors.red);
});

frontend.on('exit', (code) => {
  log(`Frontend development server exited with code ${code}`, colors.red);
});

log('Development environment is starting up...', colors.green);
log('Press Ctrl+C to stop all servers', colors.yellow);
