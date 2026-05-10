# Code review: create-account crash for orgs without active subscriptions

Welcome! This exercise is a small pull request on a Next.js page in our
registration flow. Read through the PR, then walk us through your review.

You will not run this code. We are interested in how you reason about
changes and what kinds of feedback you would give the author — much more
than whether you can spot a syntax error.

## A bit about our data model

PBLWorks customers are **organizations** — typically school districts.
An organization can have **child organizations** under it, which we call
**sites** (think: individual schools within a district). Subscriptions
always live on a site, never on the parent directly. When a parent
organization needs its own subscription, we create a site under it with
the same name as the parent and attach the subscription there.

When a teacher registers under a parent organization's link, we need to
figure out which site they belong to:

- Exactly one child site has an active subscription → auto-assign.
- Multiple child sites have active subscriptions → show a "select your
  site" step.
- No child sites have active subscriptions → registration shouldn't
  proceed; the user is sent to a "no active subscription" page.

The progress indicator at the top of the registration flow reflects
this: three steps for single-site orgs, four steps when site selection
is needed.

## The registration flow

A school admin sends teachers a registration link. The teacher's
journey:

1. **`/reg/:slug`** — public landing page. Shows the org name and a
   registration form. Submitting the form starts a Clerk auth flow.
2. **`/reg/:slug/verify`** — handles the email-link callback from Clerk
   and finishes signing the user in.
3. **`/reg/:slug/create-account`** — the page in question. A server
   component renders a spinner and a progress indicator and mounts a
   client component (`HandleCreateAccount`) that does the real work:
   validates the user's session, creates the user/org link via a server
   action, then either auto-connects a single site or pushes the user
   to `/reg/:slug/select-site`.
4. Terminal pages: `/select-site`, `/already-registered`,
   `/not-active-subscription`, `/invalid-domain`, or `/home` once
   registration is complete.

## How the bug was found

A developer **navigated directly to `/reg/:slug/create-account`** (not
through `/reg/:slug` first) for a parent organization that has no
children with active subscriptions. The page returned a 500.

In the normal flow this URL is unreachable — the form on `/reg/:slug`
catches no-subscription orgs upstream, so users in that state never
reach `/create-account`. But it is reachable via deep links, refreshes,
or session changes mid-flow.

## What you are looking at

The PR modifies a single file. Three files are checked into this
exercise:

- `page.tsx` — the file the PR changes (a Next.js server component).
- `sites.ts` — the helpers it imports.
- `HandleCreateAccount.tsx` — the client component the page mounts.

The full paths under
`apps/teach/src/app/(public)/reg/[slug]/create-account/` are preserved
so you can see this is a slice of a larger Next.js app inside a
Turborepo monorepo. There are many other files in the actual repo that
are not part of this review.

These files have been **slightly simplified** for the interview (mainly
removing telemetry/logging calls). The structure and the actual change
under review are unchanged from production.

## Your task

Read the PR, then walk your interviewer through the review you would
leave. Useful things to cover:

- What you would block on, what you would request changes on, and what
  is a nit.
- Anything you would want to verify before approving.
- Anything you would file as a follow-up rather than block on this PR.

We are more interested in your reasoning than your conclusions.
