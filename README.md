# Teacher Circle

A responsive teacher icebreaker with email magic-link sign-in, one editable response per teacher, and a host dashboard. Authentication and database authorization use Supabase. The static website deploys to GitHub Pages.

## Connect a new Supabase project

1. Create a Supabase project in your account. Run `supabase.sql` in its SQL editor.
2. Put the project URL and public publishable/anon key in `config.js`. Never put a service-role key or database password in the website or repository.
3. Enable email authentication, keep email confirmation enabled, and configure an SMTP sender for real participants. Configure the email template to send a magic link.
4. Set the Authentication Site URL and allowed redirect URL to the exact deployed GitHub Pages URL, including its repository path and trailing slash.
5. Sign in with the intended host email once. Run the final commented query in `supabase.sql`, replacing YOUR_VERIFIED_EMAIL with the host's email, to grant access only to that verified account.
6. Verify with two separate accounts: the host must see both submissions; a teacher must be unable to query another teacher's submission or add host accounts. Signed-out requests must be rejected by the database.

## Publish on GitHub

Push these files, including `.github/workflows/pages.yml`, to a repository's `main` branch. In repository Settings → Pages, select GitHub Actions. The included workflow publishes the site. Wait for a successful deployment and use its returned URL for Supabase's redirect configuration.

## Behavior and limits

The dashboard is reached through Host dashboard. Database row-level security enforces privacy independently of the page's visibility. Responses are available in the host dashboard, not sent as notification emails. The current dashboard shows up to the latest 1,000 submissions. No live service has been configured in the initial source; until configured, email entry displays an honest setup message and does not collect answers. No sample responses are presented as real submissions.

## Local preview

Serve this folder with any static HTTP server. Live email and access tests require a configured Supabase project and an allowed redirect URL. Fonts and the Supabase browser library load from external CDNs.
