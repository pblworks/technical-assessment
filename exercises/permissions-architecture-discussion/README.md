# Architecture discussion: permissions for multi-publisher

Welcome! This exercise is an open architectural discussion. There is no
code to read or write — just a problem to think through with us out
loud.

We are interested in how you reason about an ambiguous design problem,
the trade-offs you weigh, and what you would push back on. There is no
expected "right answer."

## PBLWorks at a glance

A multi-app SaaS for K-12 project-based learning. Three apps share one
user base:

- **teach** — teachers using projects in their classrooms
- **publisher** — authors creating and publishing project content
- **admin** — PBLWorks staff managing users, organizations, and
  subscriptions

**Schools and districts** subscribe to access projects in _teach_.
**Authors** in _publisher_ create the projects that schools consume.

Today, all projects are authored by PBLWorks itself. **We are about to
open _publisher_ to other publishing companies** — independent
organizations that will create and publish their own projects, with
their own authors, on our platform.

## The exercise

Design a permissions model that works once multiple publishers are on
the platform.

The model needs to express things like:

- _Alice, an author at Acme Publishing, can edit any of Acme's
  projects._
- _Bob, a senior author at Acme, can also publish them._
- _Beta Publishing's authors must not see Acme's drafts._
- _A PBLWorks support engineer can view any publisher's data to help
  debug._
- _A teacher at District X can use projects from any publisher District
  X has licensed._

Walk us through:

1. What a permission looks like — in the data, in code.
2. How and where authorization gets checked.
3. What you would want to know before committing to a direction.

No code required. Whiteboard, talk, type — whatever helps you think.
