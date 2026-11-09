# Contributing to UAH.today

Thank you for your interest in improving UAH.today! We welcome community contributions, bug fixes, bank feed improvements, and feature proposals.

---

## Code of Conduct

Please maintain professional, respectful communication. Discriminatory or offensive remarks will not be tolerated.

---

## Development Workflow

1. **Fork and branch**:
   - Fork the repository.
   - Create a feature branch: `git checkout -b feature/my-feature` or `bugfix/issue-description`.

2. **Guidelines**:
   - Write clean, self-documenting TypeScript code.
   - Run type checks: `npm run lint`.
   - Run unit tests: `npm test`.
   - Verify Ukrainian copy leaks: `npm run check:i18n`.
   - Test production build: `npm run build`.

3. **Submitting Changes**:
   - Commit with clear, descriptive commit messages.
   - Open a pull request against the `main` branch.
   - Describe what problem your PR solves and attach screenshots if making UI changes.

---

## Reporting Issues

Use GitHub Issues to report bugs or suggest enhancements. Please include:
- Clear description of the unexpected behavior.
- Reproduction steps.
- Device / browser details if applicable.
