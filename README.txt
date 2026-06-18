======================================================
  NEON RUNNER — Hostinger Node.js Deployment Guide
======================================================

FOLDER STRUCTURE
----------------
neon-runner/
├── server.js        ← Node.js server (entry point)
├── package.json     ← App info & start script
├── README.txt       ← This file
└── public/          ← All game files (DO NOT modify)
    ├── index.html
    ├── favicon.ico
    └── _expo/
        └── static/
            ├── css/
            └── js/

------------------------------------------------------
STEP-BY-STEP DEPLOYMENT ON HOSTINGER
------------------------------------------------------

STEP 1 — Upload files
  - Log in to Hostinger hPanel
  - Go to: Hosting → Manage → File Manager
  - Navigate to your Node.js app root folder
    (usually: /home/username/domains/yourdomain.com/)
  - Upload the entire contents of this ZIP
    (server.js, package.json, public/ folder)

STEP 2 — Set up Node.js app in hPanel
  - Go to: Hosting → Manage → Node.js
  - Click "Create Application"
  - Set:
      Node.js version : 18 or 20 (recommended)
      Application root: /home/username/domains/yourdomain.com/
      Application URL : yourdomain.com (or subdomain)
      Application file: server.js
      Start command   : node server.js
  - Click "Create"

STEP 3 — Start the app
  - In the Node.js panel, click "Start" or "Restart"
  - Your game will be live at your domain!

------------------------------------------------------
ENVIRONMENT VARIABLES (optional)
------------------------------------------------------
PORT  — the port your server listens on.
        Hostinger sets this automatically.
        Default fallback: 3000

------------------------------------------------------
NOTES
------------------------------------------------------
- No npm install needed — this server uses zero
  external dependencies (built-in Node.js only).
- All game progress is saved in the player's browser
  (localStorage/AsyncStorage web fallback).
- The game works on mobile browsers too — players
  can add it to their home screen as a PWA.
- HTTPS is handled by Hostinger automatically.

------------------------------------------------------
SUPPORT
------------------------------------------------------
If the site shows a blank page:
  1. Check that public/index.html exists
  2. Confirm the Application file is set to: server.js
  3. Restart the Node.js app in hPanel

======================================================
