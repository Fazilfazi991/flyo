# Flyo Travel & Tourism

Static HTML, CSS and JavaScript site, deployed with the existing Vercel static
build. Package content and images remain in the current data-driven templates.

## Flyo Live Chat — Setup and Operations

The support widget is human-to-human messaging backed by the **existing Supabase
project**: Postgres for enquiries and messages, Supabase Auth for staff and
anonymous visitor identities, and Supabase Realtime Postgres Changes for replies.
There are no AI replies, simulated agents, paid chat subscriptions or licensing.

### Local setup

Use Node.js 22+ and pnpm 11.25.0. The pinned dependencies and lockfile are committed.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

Open `http://127.0.0.1:4173`. The preview serves **only `dist`**, never `.env`,
database SQL, dependencies or source control files. `pnpm start` builds first.
Copy `.env.example` to `.env` if overriding the existing public project config.
Build scripts read `.env`; the preview process needs no service credentials.

Public routes: `/faq` and the floating support button on all customer pages.
Staff route: `/admin/live-chat` (also linked from `/admin`).

### Database configuration — activation step, not performed automatically

No hosted database changes or deployments are made by installation or build.
At the owner's request on **26 October 2026**, `supabase/live-chat.sql` was applied
through the SQL editor to the existing Flyo project `jlsdgouhesdgzdrmyqhw`.
Anonymous sign-ins are enabled, the four chat tables are published to Realtime,
all eleven Flyo tables have RLS enabled, and the previous unrestricted staff
policies have been replaced. Exactly **one** auto-confirmed, enabled administrator
has been authorized. Do not rerun the schema against this activated project.
No website deployment was performed.

For a fresh environment, complete the following setup:

1. Use the Supabase project already configured in `data/supabase-config.js`.
   Confirm the project identity before applying SQL. Use a test project for
   automated live-flow checks, with public URL/key overrides in `.env`.
2. On a fresh database, apply `supabase/flyo-admin-schema.sql` **first**. On the
   existing Flyo database, do not recreate its data or reset its tables.
3. Apply `supabase/live-chat.sql` **once** in the SQL editor. It is transactional
   and version-controlled; a failure rolls back the whole change. It extends the
   existing `flyo_enquiries` table, adds staff/conversation/message/read/typing
   tables, indexes, RLS and validated write commands. It also narrows the old
   "all authenticated users are admins" policies to explicitly enabled staff.
   **Do not rerun the old base schema's policies after this migration.**
4. Create/authorize the first staff user as described below. Existing CMS accounts
   also need staff profiles before they can continue using the administration UI.
5. Enable **Anonymous Sign-Ins** in Supabase Auth. Visitors use anonymous Auth,
   not public table access. Keep Supabase's anonymous sign-in IP limits enabled.
   Message and enquiry limits are also enforced atomically in Postgres. If you
   later require a CAPTCHA, add its token to `visitorSession` before enabling it.
6. Check that `flyo_conversations`, `flyo_messages`, `flyo_chat_reads` and
   `flyo_chat_typing` belong to the `supabase_realtime` publication. The migration
   adds them when that publication exists. Enable the publication if absent.
7. Run Supabase security advisors and review any additional existing permissive
   policies before enabling anonymous Auth. The migration replaces the named
   policies from this repository; custom policies need their own review.

Only the `public` schema should be exposed to the Data API. `flyo_private` holds
privileged command implementations and must stay unexposed. The public wrapper
uses invoker security; private commands verify Auth identity, staff role or
conversation ownership for every operation. All chat tables have RLS and deny
direct writes from browser roles. Postgres Changes delivery follows SELECT RLS.

### Creating the first staff account

Create or invite the staff member in **Supabase → Authentication → Users** using
their business email. Set the password through Supabase's normal invitation or
password flow; never put passwords in code or SQL files. In the SQL editor,
authorize the exact existing Auth user, replacing the sample email/name:

```sql
insert into public.flyo_staff(user_id, display_name, role)
select id, 'Flyo Administrator', 'admin'
from auth.users where lower(email) = lower('your-staff-email@example.com')
on conflict(user_id) do update
set display_name = excluded.display_name, role = excluded.role, enabled = true;
```

Check that **one row** was inserted or updated. An ordinary travel specialist
uses `role = 'agent'`; `admin` and `editor` also retain package CMS access.
Staff cannot grant their own role or edit the staff table through the browser.
Revoke access immediately with `update public.flyo_staff set enabled=false where
user_id='the-auth-user-id';`. Sign out/revoke Auth sessions as part of offboarding.
The old hardcoded fallback CMS password has been removed.

### Required environment variables

None are needed to keep using the repository's existing public configuration.
To target another Supabase environment, set **both**:

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Browser-safe project URL |
| `SUPABASE_ANON_KEY` | Browser-safe publishable or legacy anon key |
| `CHAT_E2E_URL` | Optional browser-test URL; defaults to local preview |
| `CHAT_TEST_AGENT_EMAIL` | Optional enabled test staff login, tests only |
| `CHAT_TEST_AGENT_PASSWORD` | Optional test staff password, tests only |

Only the first two are compiled into public configuration. Build rejects
service-role/secret keys. No service key is required by this implementation.
Never commit `.env` or test credentials. Deploy later using the existing Vercel
build/output settings; configure public overrides there only if needed.

### Customer and staff operation

Customers choose **Chat with Our Team** or **Frequently Asked Questions**. A chat
requires a name, valid mobile number, message and explicit contact consent;
email, travel dates and traveller count are optional. The team status is based on
enabled staff choosing Online and sending a heartbeat within 75 seconds. Offline
enquiries are stored in the same inbox; no email/WhatsApp notification service is
claimed or configured. An offline internet connection cannot submit an enquiry:
the form stays available, and the customer must reconnect and retry.

Staff sign in, set availability, select an enquiry, view contact/package details,
reply, and resolve/reopen the conversation. Presence defaults to Offline at login;
an Online dashboard in a background tab reports Away. A closed/disconnected tab
expires within 75 seconds. Multiple staff accounts and customers are supported.

Messages are acknowledged only after the database saves them. Stable UUIDs
deduplicate retries. Unread counters are based on acknowledged rendered history,
with separate staff read positions. Realtime reconnects and reloads history;
eight-second polling catches missed updates. Failure never displays a fake reply
or a false saved confirmation. Unsent text stays in the current page's memory;
keep the page open until a save is confirmed. Clearing browser storage or using
another device loses the anonymous identity and cannot recover its private chat.

### FAQ content and package integration

`data/faqs.js` contains all **36 OPTION 2** questions extracted from
`F&Q website 1.docx` in Downloads. It records the source document's SHA-256.
The alternative draft and its placeholder text are excluded. Question 36's
contact answer uses the current website phone, WhatsApp and email details;
the rest of the Option 2 question/answer wording is retained. `faq/browser.js`
renders the same dataset on `/faq` and inside the widget. Search is local keyword
matching, and answers use native accessible disclosure controls. No AI is used.

The four new package pages and their listing-card **Enquire Now** actions open
chat with package ID/name/URL and destination. The quick enquiry form transfers
only explicitly entered values. The existing contact form also transfers its
entered details into the consented enquiry flow, without a false saved message.
The separate **WhatsApp Enquiry** controls keep
the existing office chooser. Selecting another package during an active chat
attaches it atomically to the next customer message and records it in the lead.
For future pages, add a trigger with `data-flyo-chat`, `data-package-id`,
`data-package-name`, `data-package-url` and `data-destination`, or call:

```js
window.FlyoChat.open({
  view: 'team', package_id: 'the-existing-slug', package_name: 'Package title',
  package_url: location.origin + '/packages/the-existing-slug/', destination: 'Destination'
});
```

Page context excludes arbitrary URL query strings and hidden form values. Only
the explicitly permitted UTM campaign fields are collected.

### Verification

```sh
pnpm check
pnpm build
pnpm test
pnpm exec playwright install chromium
pnpm test:e2e
```

Database tests run the real SQL migration on a disposable **PGlite Postgres**
database with distinct visitor/staff roles. They verify persistent enquiries,
messages, idempotency, unread receipts, ownership isolation, CMS denial, revoked
staff access, input limits, spam limits, package changes and reopening the database.
These tests do not pretend to exercise hosted GoTrue or Supabase Realtime sockets.
Browser tests cover FAQ search, package prefill, keyboard dismissal, mobile sizes,
protected staff login and backend failure states. A separate real Supabase flow
uses two isolated browser contexts plus another visitor identity. It is skipped
unless the test URL/key and staff credentials are explicitly configured. That
test creates clearly labelled test enquiries; use a non-production project.

The hosted schema, anonymous Auth and sole staff account are now configured.
Hosted checks confirmed the staff account can call its protected profile/inbox
commands; unsigned API requests cannot read messages/enquiries or call chat
commands. On **27 October 2026**, an owner-authorized manual test against the
hosted Flyo backend passed using the local customer widget and the owner's
signed-in staff inbox in separate tabs. Test enquiry `c6dea7f8` verified an
offline customer enquiry appearing in the inbox, a staff reply appearing in
the customer chat, the staff's "Read by visitor" receipt, a customer follow-up,
and saved history after refreshing both pages. The clearly labelled test was
marked resolved and retained for review. Staff remained Offline throughout;
online availability and separate-browser privacy isolation were not part of
this manual check. No passwords were read, generated or stored by the agent,
and no additional staff accounts were created. The website remains undeployed.

Implementation verification on 26 October 2026: **20 database/content tests and
18 desktop/mobile browser tests passed**; the two real Supabase flow cases
(one per device size) were skipped because activation and test staff credentials
were not configured. Production build, syntax checks and diff checks passed.

### Troubleshooting and data handling

- **Chat unavailable / unknown table or function:** confirm project URL/key, apply
  the chat migration after the original schema, and wait for API schema refresh.
- **Anonymous sign-in failed:** enable anonymous Auth and check Auth IP limits.
  A required CAPTCHA also needs a client token integration.
- **Login works but dashboard is forbidden:** add the Auth UUID to `flyo_staff`,
  set `enabled=true`, and check the role. Agent accounts use the live-chat page.
- **Messages save but don't arrive instantly:** check publication membership,
  WebSocket access and Realtime logs. Polling/history reconnect remains available.
- **Team incorrectly appears offline:** choose Online in a visible staff tab and
  check heartbeats; a stale or background session is not an online representative.
- **No answers match:** clear the keyword/category filter; all 36 questions are
  also available through the public FAQ page.

Staff should use contact details only for the consented enquiry. Do not request
passport/payment documents in chat. Follow your documented business retention
period: review resolved/closed enquiries periodically and delete an enquiry by
its exact UUID in the SQL editor when appropriate. Its conversation, messages,
receipts and typing records cascade-delete; live/other enquiries remain intact.
Retain only consented follow-up data needed for the business, and remove unused
anonymous Auth identities after their related enquiry history is deleted. No
automatic destructive retention job is enabled. Export or preserve records first
when required by the business's retention obligations.
