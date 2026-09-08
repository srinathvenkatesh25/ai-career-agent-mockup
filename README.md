# AI Career Agent — Concept Mockup

An interactive React prototype illustrating a proposed LinkedIn feature: a candidate's own AI agent holding a genuine, two-way screening conversation with a recruiter's AI agent, overnight, before either human is ever involved.

This is a **concept mockup exploring agent-to-agent (A2A) communication design** — it is not an official LinkedIn product, and it is not affiliated with or endorsed by LinkedIn. Styling approximates LinkedIn's visual language (color, layout, navigation conventions) to communicate the idea as a realistic feature proposal.

See [`PRD.md`](./PRD.md) for the full product requirements, guardrails, and open questions behind this design.

## What it shows

The prototype has three connected screens, reachable from the tab bar under the "Jobs" section:

1. **Create Your Agent** — a candidate sets up their agent: target roles, salary range, work arrangement, non-negotiables, portfolio links, a tone description, and one or more "personas" that reframe existing experience for adjacent roles (e.g. a consultant framing their work for a Product Manager audience) — without fabricating anything not already on file. Guardrails (grounded-data-only, standing AI disclosure) are shown as locked toggles.
2. **Agent Conversation** — a simulated overnight transcript between the candidate's agent and a recruiter's agent. Two example runs are included: a strong match that completes a full structured-plus-freeform screening, and an early exit triggered by a hard dealbreaker (visa sponsorship). Press **Play** to reveal the conversation message by message.
3. **Recruiter Dashboard** — a ranked list of candidates from the night's conversations, each with a rubric score breakdown, an audit trail of exactly what data was used, the full transcript on click, and an explicit human decision control (Advance to interview / Pass). No decision is ever made automatically.

## Design principles baked into the prototype

- **Grounded, not fabricated.** Agents may reframe real experience for a specific audience but must say "not addressed" rather than invent qualifications.
- **Always disclosed.** Every candidate is told they're talking to an AI, with an option to request a human instead.
- **Humans decide.** Scoring and ranking are automated; advancing or rejecting a candidate is not.
- **Auditable.** Every score is traceable to a specific, visible data source.

## Running it

This file is a single self-contained React component (`agent_recruiting_mockup.jsx`) built with Tailwind utility classes and [lucide-react](https://lucide.dev/) icons. To run it locally:

```bash
npx create-vite@latest agent-mockup --template react
cd agent-mockup
npm install lucide-react
# replace src/App.jsx with agent_recruiting_mockup.jsx, and ensure Tailwind is configured
npm run dev
```

It was originally built and previewed as a Claude.ai artifact, so no build step is required there — it's included here for version control and portfolio purposes.

## Tech

- React (function components, hooks — no external state library)
- Tailwind CSS utility classes
- lucide-react icons
- No backend — all data is in-memory sample data for demonstration

## Disclaimer

This is a concept exploration of agent-to-agent communication design, covering the interaction design, guardrails, and a recruiter-facing UI. It is not a production system, has not been reviewed for accessibility or security, and should not be used as-is with real candidate data.
