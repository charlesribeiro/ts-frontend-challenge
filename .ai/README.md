# .ai

Long-form context for AI agents and for humans picking this project up. Kept in
the repository so it is versioned alongside the code it describes.

[AGENTS.md](../AGENTS.md) is the quick reference: commands, conventions, working
agreements. This folder holds the background that is too long for it.

| File                                             | Contents                                              |
| ------------------------------------------------ | ----------------------------------------------------- |
| [architecture.md](architecture.md)               | Objective, layering, component boundaries and scope   |
| [angular17.md](angular17.md)                     | Angular 17 APIs, conventions and code style           |
| [implementation-plan.md](implementation-plan.md) | Phased delivery plan and definitions of done          |
| [decisions.md](decisions.md)                     | Log of technical decisions and their trade-offs       |
| [prompts/](prompts)                              | Reusable task prompts for features, bugfixes, reviews |

## Keeping this current

Stale context is worse than no context, because agents follow it confidently.
When you change the structure or a convention, update the relevant file in the
same pull request. When you make a decision worth remembering, append an entry
to `decisions.md` rather than editing history.
