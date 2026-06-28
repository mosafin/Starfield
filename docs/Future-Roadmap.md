# Future Roadmap — Post v1.0.0

This document lists planned directions after the Version 1.0 Release Candidate. **No dates are committed.** Items require validated game data before implementation.

## v1.0.x maintenance

- Bug fixes from RC player feedback
- Catalogue corrections (missions, locations, knowledge) without coordinate changes
- Performance tuning if baselines regress
- Additional automated browser smoke tests

## v1.1 — Catalogue depth (data-only packs)

- **Terran Armada** modular pack (mirror Shattered Space framework)
- Expanded mission metadata (rewards, choices) where verified
- More named locations in under-covered systems
- Knowledge entries for temples, powers, and crew with validated map links

## v1.2 — Community packs

- Documented `registerAtlasPack()` workflow for community catalogues
- Pack validation tooling in dev UI
- Optional pack signing / checksum guidance

## v2.0 considerations (breaking — not planned for RC)

- Save v3 only if a compelling feature requires it (would ship with migration)
- Self-hosted CDN bundle for fully offline distribution
- Optional PWA install wrapper

## Explicitly out of scope

- In-game mod integration or live game sync
- Multiplayer or cloud accounts
- Replacing Bethesda's starmap or automating gameplay
- Guessed coordinates or unverified quest outcomes

## How to suggest features

Open an issue or PR with:

1. Validated in-game source or wiki reference
2. Which atlas view(s) it affects
3. Confirmation it does not require save format changes (preferred)

See `docs/Developer-Guide.md` for contribution constraints.
