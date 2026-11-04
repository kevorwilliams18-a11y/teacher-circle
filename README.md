# Teacher Circle

Live site: https://kevorwilliams18-a11y.github.io/teacher-circle/

A funny Would You Rather game for teachers with 10 shuffled rounds, email magic-link sign-in, private response storage, and a host results dashboard.

Host: the designated host email. Access is checked in PostgreSQL against the authenticated user and a confirmed email. A browser email field cannot grant host access.

Production database: Teacher Circle. Only the public publishable key is stored in config.js. Never add database passwords or secret/service-role keys to this repository.

Signed-in teachers can submit or update their own complete set of 10 choices. They can read their own saved row. Only the confirmed host can read everyone's responses. Signed-out accounts have no table privileges. The dashboard displays up to the latest 1,000 responses. Results appear in the dashboard; notification emails are not implemented.

Email authentication and confirmation are enabled. The Site URL and allowed redirect URL point to the exact GitHub Pages URL. A host sign-in request was accepted on November 4, 2026. The host still needs to open the emailed link to complete verification. End-to-end host dashboard and teacher submission checks must be completed after sign-in.

Important remaining setup: custom SMTP is not configured. Supabase's built-in email sender is for testing and restricts recipients. Configure a production email sender before inviting teachers.

Publishing: GitHub Pages currently deploys from main, root directory. Commit index.html, game.css, game.js, auth.js and config.js to update the site. The earlier app.js, style.css and supabase.sql belong to the initial introduction-form design and are not loaded by the current game. game-schema.sql describes the current schema.
