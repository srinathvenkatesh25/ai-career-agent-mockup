# PRD: AI Career Agent — Peer-to-Peer Screening for LinkedIn

**Status:** Concept design exploration
**Owner:** Srinath Venkatesh
**Last updated:** September 2026

## 1. Summary

Give job seekers their own AI agent inside LinkedIn — one capable of holding a real, two-way screening conversation with a recruiter's existing AI agent (e.g. Hiring Assistant) overnight. Today, recruiter-side AI screening is one-directional: a company's agent evaluates a passive candidate, who gets no voice in the process and often no feedback afterward. This feature makes screening a negotiation between two peers instead of a company's AI silently judging a human.

## 2. Problem

- Recruiters already automate their side of screening (LinkedIn Hiring Assistant, AI video-interview scoring). Candidates have no equivalent representation in that same automated pipeline.
- Candidates spend hours on repetitive early-stage back-and-forth (salary range, remote policy, notice period) across dozens of applications, often ending in silence rather than an answer.
- Existing one-sided AI screening tools are already drawing scrutiny over transparency: candidates want to know when they're talking to AI, and want the option to reach a human instead.

## 3. Goals

- Let a candidate's agent hold a genuine two-way conversation with a recruiter's agent — asking questions, not just answering them.
- Give recruiters a ranked, auditable shortlist every morning instead of manually screening every applicant.
- Give candidates an actual reason when they're passed over, instead of silence.
- Make the system inclusive of transferable skills: a candidate can present a persona that reframes existing experience for an adjacent role, without fabricating experience they don't have.

## 4. Non-goals

- The agent does not make any binding hiring, compensation, or advancement decision. A human always makes that call.
- The agent does not fabricate skills, roles, titles, or outcomes not already present in the candidate's verified data.
- This is not a replacement for the human interview — it replaces the earliest, most repetitive round of screening only.

## 5. Personas

- **Candidate (e.g. Sarah Chen):** actively job-searching, tired of applying into a black box, wants faster and more honest signal on fit.
- **Recruiter (e.g. TechCorp Talent team):** screening a high volume of applicants per role, wants a defensible, auditable shortlist without spending hours per candidate.

## 6. User stories

1. As a candidate, I can describe what I'm looking for (roles, salary floor/target, work arrangement, notice period, non-negotiables) so my agent can screen accurately on my behalf.
2. As a candidate, I can link my own portfolio/GitHub so my agent only speaks from material I've explicitly provided.
3. As a candidate, I can define a tone and one or more personas (e.g. "Product Manager framing") so my agent presents my real experience in the language a specific role calls for, without inventing anything new.
4. As a recruiter, my agent has a structured-plus-freeform conversation with each candidate's agent overnight, ending early if a hard dealbreaker is identified.
5. As a recruiter, I see a ranked dashboard each morning with a score, a rubric breakdown, an audit trail of what data was used, and the full transcript on request.
6. As a recruiter, I decide — the agent never decides — whether a candidate advances or is passed over.
7. As a candidate, I'm always told upfront that I'm talking to a recruiter's AI, and I can opt out to request a human instead.
8. As a candidate, I receive the actual reason I was or wasn't advanced.

## 7. Functional requirements by screen

### 7.1 Create Your Agent
- Profile basics (name, headline) pulled from existing LinkedIn data.
- Target roles, salary floor/target, work arrangement, notice period.
- Non-negotiables (dealbreakers) that end a conversation early if unmet.
- Portfolio/links field — the agent may only reference links the candidate has explicitly added.
- Tone description (free text).
- Persona builder: name + framing notes per persona, describing which existing experience to lead with and which vocabulary to use for an adjacent role.
- Additional free-text context for negotiation (goals, flexibility).
- Guardrail toggles, two of which are locked on: grounded-data-only, and always-disclose-AI-with-opt-out.

### 7.2 Agent Conversation
- Structured core questions (salary, arrangement, notice period) plus freeform follow-ups.
- Visible tagging of each message as Structured, Follow-up, or System.
- Early termination on a hard dealbreaker mismatch, with a system message explaining why.
- Disclosure banner stating this is an AI-to-AI conversation and when it ran.

### 7.3 Recruiter Dashboard
- Ranked list of candidates by fit score.
- Per-candidate rubric breakdown (technical skills, salary fit, location/arrangement fit, availability).
- Audit trail listing exactly which data sources were used.
- Full transcript available on click.
- Explicit decision control per candidate: Advance to interview / Pass. No default or auto-decision.

## 8. Guardrails & safety requirements

- **Grounded tailoring only:** agents may reframe verified experience for a persona but must state "not addressed in available data" rather than infer, extrapolate, or round up.
- **Scoped data access:** candidate agents may only use LinkedIn profile data and links the candidate has explicitly provided — no open-ended web crawling of the candidate's name.
- **Standing disclosure:** every candidate is told they are interacting with an AI agent, with a visible option to request a human recruiter instead.
- **No autonomous decisions:** neither agent can make a binding commitment (interview offer, compensation agreement, rejection) — only a human recruiter can.
- **Auditability:** every conversation and every score is logged and reviewable, including which specific data justified each rubric line item.
- **Bias monitoring:** because this system rewards well-documented profiles, rubric outcomes should be periodically audited for correlation with profile completeness/polish as a proxy for unrelated demographic factors.

## 9. Success metrics

- Time-to-shortlist per open role.
- Reduction in candidates who receive no reason after being screened out (today's ghosting rate).
- Recruiter override rate on agent rankings (signal for trust/accuracy over time).
- Candidate opt-out rate on the AI disclosure step (leading indicator of a trust problem).

## 10. Risks

| Risk | Mitigation |
|---|---|
| Candidate or recruiter agent overstates fit to "win" the match | Grounded-only guardrail; explicit "not addressed" fallback instead of inference |
| Bias baked into rubric scales at machine speed | Periodic audit of rubric outcomes against profile completeness/demographics proxy |
| Candidates uncomfortable being screened by AI without knowing | Standing, unavoidable disclosure with human opt-out |
| Over-trust in agent rankings by recruiters | Full transcript always available; no auto-decisioning; human makes every call |

## 11. Related work / context

- LinkedIn's Hiring Assistant (GA September 2025) — recruiter-side sourcing, pre-screening, and outreach automation.
- LinkedIn Hiring Pro AI interview screening (piloted March 2026) — one-directional AI evaluation of candidate video responses.
- Research on LLM-based negotiator agents exhibiting distinct behavioral stances (e.g. "Cunning vs. Kind") in bargaining — informs the need for explicit honesty constraints on the recruiter-side agent.

## 12. Open questions

- Should candidates be able to see the recruiter agent's rubric before the conversation, or only the outcome?
- How long should transcripts and scores be retained, and who can request deletion?
- Should there be a rate limit on how many recruiter-agent conversations a single candidate agent can run concurrently?
