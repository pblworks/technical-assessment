# technical-assessment

Exercises used in PBLWorks engineering interviews.

We use two formats:

- **Code review.** A small pull request against a snapshot of real code
  from our monorepo. The candidate reads the background in the
  exercise's `README.md`, looks at the PR, and walks the interviewer
  through their review.
- **Architecture discussion.** An open design problem with no code. The
  candidate reads a short brief in the exercise's `README.md` and
  reasons through the design with the interviewer.

## Exercises

### Code review

- [`eng-983-create-account-crash`](exercises/eng-983-create-account-crash/) —
  reviewing a small "obvious" bug-fix PR that hides a deeper question.

### Architecture discussion

- [`permissions-architecture-discussion`](exercises/permissions-architecture-discussion/) —
  designing a permissions model for a platform opening up to
  third-party publishers.

## A note on the code-review exercises

The code snapshots in this repo are intentionally simplified —
telemetry/logging calls have been stripped so candidates can focus on
the structure of the change. The logic being reviewed and the change
itself are unmodified.

The full file paths from the source monorepo are preserved
(`apps/teach/src/app/...`) so candidates can see they are looking at a
slice of a much larger Next.js app inside a Turborepo monorepo. Imports
that resolve to internal workspace packages (`database/models`, `auth`,
`@/components/...`) are not included here and are not part of the review.
