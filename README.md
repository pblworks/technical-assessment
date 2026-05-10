# interview-code-review

Code-review exercises used in PBLWorks engineering interviews.

Each exercise is a small pull request against a snapshot of real code
from our monorepo. Candidates are pointed at the exercise's PR, read
the background in the exercise `README.md`, then walk the interviewer
through their review.

## Exercises

- [`eng-983-create-account-crash`](exercises/eng-983-create-account-crash/) —
  reviewing a small "obvious" bug-fix PR that hides a deeper question.

## A note on the code

The code snapshots in this repo are intentionally simplified —
telemetry/logging calls have been stripped so candidates can focus on
the structure of the change. The logic being reviewed and the change
itself are unmodified.

The full file paths from the source monorepo are preserved
(`apps/teach/src/app/...`) so candidates can see they are looking at a
slice of a much larger Next.js app inside a Turborepo monorepo. Imports
that resolve to internal workspace packages (`database/models`, `auth`,
`@/components/...`) are not included here and are not part of the review.
