# UAH.today — Product Improvement & Technical Specification

**Project:** UAH.today  
**Repository:** https://github.com/devcodex2025/exchange-rates-ukraine  
**Current deployment:** https://exchange-rates-ukraine.vercel.app/  
**Technology:** React, TypeScript, Vite, Tailwind CSS, Node.js, Vercel  
**Document type:** Product Requirements Document + Technical Specification  
**Priority:** High

---

# 1. Project Overview

## 1.1. Objective

Transform UAH.today into a modern, high-performance Ukrainian currency exchange rate comparison platform.

The platform must provide reliable exchange rate information, useful financial tools, transparent data sources, and an excellent user experience.

The project must also be technically and editorially prepared for Google AdSense monetization.

This is not simply a visual redesign. The objective is to improve the product architecture, functionality, content quality, SEO, performance, accessibility, and monetization readiness.

## 1.2. Main Goals

1. Establish a clear product identity and unique value proposition.
2. Improve the existing currency comparison functionality.
3. Introduce useful features that differentiate the platform from competitors.
4. Implement a proper SEO architecture.
5. Meet Google AdSense publisher policies.
6. Achieve a Lighthouse Performance score of 100/100 as the target.
7. Create a modern, responsive UI/UX.
8. Improve reliability and accuracy of financial data.
9. Prepare the project for long-term growth and monetization.

# 2. Product Positioning and Unique Value Proposition

## 2.1. Product Identity

**UAH.today — Find the best exchange rate in Ukraine.**

UAH.today is an independent currency comparison platform that helps users find the most favorable exchange rates across Ukrainian banks.

The platform should answer three important questions:

- Where can I buy foreign currency at the best price?
- Where can I sell foreign currency at the best price?
- How much will my money be worth at different banks?

## 2.2. Unique Value Proposition (USP)

The platform must differentiate itself through the following capabilities:

**1. Best Rate Finder**

Automatically identify the best available buying and selling rates across supported banks.

**2. Real-time Bank Comparison**

Compare exchange rates from multiple Ukrainian banks in one interface.

**3. Smart Currency Converter**

Calculate currency conversions using the best available bank rate or a selected bank.

**4. Transparent Data Sources**

Display the original data provider, last successful update, and data freshness.

**5. Currency Market Insights**

Provide useful information about exchange rate movements and differences between banks and the official NBU rate.

**6. Fast and Simple Experience**

Allow users to find the information they need without unnecessary navigation or registration.

# 3. Core Product Functionality

## 3.1. Main Dashboard

Redesign the homepage around the primary user objective: finding the best exchange rate.

Required sections:

- Header and navigation.
- Main heading and short product description.
- Currency overview cards.
- Best buying and selling rates.
- Bank comparison table.
- Currency converter.
- Data source information.
- Market insights.
- Educational content.
- FAQ.
- Footer.

The first screen must immediately communicate what the platform does.

Avoid oversized decorative hero sections that push useful financial information below the fold.

## 3.2. Currency Support

The platform must support:

- USD — US Dollar.
- EUR — Euro.
- PLN — Polish Zloty.
- GBP — British Pound.
- CHF — Swiss Franc.

The architecture should allow additional currencies without major modifications.

Only display currencies for which reliable source data is available.

## 3.3. Bank Comparison

Supported institutions:

- National Bank of Ukraine (NBU).
- PrivatBank.
- monobank.
- Raiffeisen Bank.
- Oschadbank.
- PUMB.

The comparison table must display:

- Bank name and logo.
- Currency.
- Buying rate.
- Selling rate.
- Official NBU rate.
- Data source.
- Last successful update.
- Data freshness status.

Required functionality:

- Currency filtering.
- Bank search.
- Sorting by buying rate.
- Sorting by selling rate.
- Highlighting the best available offer.
- Responsive mobile layout.

Important:

The best buying rate and best selling rate must be calculated independently. They may belong to different banks.

Never display missing data as zero or invent a replacement rate.

## 3.4. Smart Currency Converter

Improve the existing converter.

Required functionality:

- Amount input.
- Source currency selection.
- Destination currency selection.
- Swap currencies.
- Bank selection.
- Best available rate selection.
- Instant calculation.
- Quick amount presets.
- Clear explanation of the applied exchange rate.

Example:

User enters 1,000 UAH and selects USD.

The converter should automatically calculate the result using the best available selling rate.

When converting USD to UAH, it should use the best available buying rate.

Display:

- Converted amount.
- Applied exchange rate.
- Selected bank.
- Last update time.
- Informational disclaimer.

Handle invalid inputs, zero values, unavailable rates, and API failures correctly.

## 3.5. Best Exchange Rate Finder

Introduce a dedicated feature that identifies:

- Best bank to buy USD.
- Best bank to sell USD.
- Best bank to buy EUR.
- Best bank to sell EUR.
- Equivalent comparisons for supported currencies.

The result should be immediately visible without requiring users to inspect the entire table.

Example:

"Best USD selling rate: Bank X — 41.20 UAH"

The system must calculate this from currently available and valid bank data.

## 3.6. Currency Market Insights

Introduce an informative section with genuinely useful financial information.

Possible features:

- Difference between the official NBU rate and commercial bank rates.
- Difference between the best and worst available bank rates.
- Buying and selling spread.
- Daily exchange rate changes when historical data is available.
- Short explanations of currency market terminology.

Do not generate historical trends from current data.

Historical charts must only be displayed when reliable historical data is available.

## 3.7. Data Freshness

Every source must have independent metadata.

Required fields:

- sourceName
- fetchedAt
- sourceUpdatedAt
- status
- isStale
- errorMessage

The interface must distinguish:

- Fresh data.
- Cached data.
- Stale data.
- Temporarily unavailable data.

Do not update the displayed source timestamp merely because the API endpoint was requested again.

# 4. Backend and Data Architecture

## 4.1. API Refactoring

Currently, data retrieval logic exists in both:

- server.ts
- api/rates.ts

Consolidate the implementation into reusable services.

Suggested structure:

src/
- services/
  - rates/
    - nbu.service.ts
    - privatbank.service.ts
    - monobank.service.ts
    - raiffeisen.service.ts
    - oshchadbank.service.ts
    - pumb.service.ts
    - rates-aggregator.service.ts
  - cache/
    - cache.service.ts
- lib/
  - rates/
    - normalize.ts
    - validation.ts

api/
- rates.ts

Each provider must have an isolated integration and error-handling mechanism.

## 4.2. Data Sources

Priority order:

1. Official bank APIs.
2. Official bank data feeds.
3. Authorized third-party data providers.
4. HTML parsing only as a last resort.

Avoid fragile HTML scraping based on regular expressions.

If scraping is unavoidable:

- Implement structured HTML parsing.
- Validate every extracted value.
- Detect unexpected page changes.
- Record parsing failures.
- Never publish unverified values.

Review the applicable terms of service and data usage permissions for every provider.

## 4.3. Caching

Implement reliable caching to reduce API calls and improve response times.

Requirements:

- Provider-specific cache durations.
- Stale-while-revalidate strategy.
- Request timeouts.
- Retry strategy with exponential backoff.
- Protection against concurrent duplicate requests.
- Graceful fallback to previously validated data.

Monobank must respect its API rate limits.

## 4.4. API Response

Use a consistent normalized response format.

Example:

{
  "base": "UAH",
  "updatedAt": "2026-11-09T00:00:00Z",
  "rates": [
    {
      "currency": "USD",
      "bank": "PrivatBank",
      "buy": 41.00,
      "sell": 41.50,
      "source": "official_api",
      "fetchedAt": "2026-11-09T00:00:00Z",
      "status": "fresh"
    }
  ]
}

The example values are illustrative, not actual market rates.

Requirements:

- Consistent data types.
- Explicit null values for missing rates.
- Source-specific timestamps.
- Validated numerical values.
- Predictable error responses.
- API documentation.

## 4.5. API Performance

- Avoid unnecessary upstream requests on every page visit.
- Use caching at the provider and CDN levels where appropriate.
- Do not make frontend rendering depend on all bank APIs responding simultaneously.
- Return partial results when individual providers fail.
- Keep the public API lightweight.

# 5. SEO Architecture

SEO must be treated as a core product requirement.

## 5.1. Technical SEO

Implement:

- Unique title for every indexable page.
- Unique meta description.
- Canonical URLs.
- Correct hreflang configuration.
- Open Graph metadata.
- Twitter/X metadata.
- XML sitemap.
- robots.txt.
- Structured data where appropriate.
- Semantic HTML.
- Breadcrumb navigation.
- Correct HTTP status codes.

## 5.2. Rendering and Indexability

The existing application uses React Router and dynamically changes metadata.

Improve this architecture to ensure that search engine crawlers receive meaningful page content and metadata.

Evaluate:

- Static site generation (SSG).
- Prerendering.
- Server-side rendering (SSR).

Prefer static generation or prerendering for pages that do not require user-specific data.

The exchange rate data can be loaded separately from the initial page shell.

Every indexable route must contain its own meaningful content in the initial HTML response.

## 5.3. Required Pages

### Ukrainian

- /
- /kurs-dolara
- /kurs-evro
- /kurs-zlotogo
- /kurs-funta
- /kurs-nbu
- /konverter-valyut
- /kurs-dolara-privatbank
- /kurs-dolara-monobank
- /pro-nas
- /kontakty
- /privacy-policy
- /terms

### English

- /en
- /en/usd-uah-rate
- /en/eur-uah-rate
- /en/currency-converter
- /en/exchange-rates-ukraine
- /en/about
- /en/contact
- /en/privacy-policy
- /en/terms

Each SEO landing page must provide unique information and functionality.

Do not create large numbers of nearly identical pages with only different currency names.

## 5.4. Content Strategy

Add original, useful editorial content.

Suggested topics:

- How exchange rates work in Ukraine.
- What is the difference between NBU and commercial bank rates?
- How to choose the best USD exchange rate.
- How to calculate currency exchange spreads.
- How to exchange EUR in Ukraine.
- How bank buying and selling rates work.
- Why exchange rates differ between banks.

Content must be factually accurate, maintained, and written for users.

Avoid automatically generating large volumes of repetitive SEO pages.

## 5.5. Structured Data

Use structured data only when it accurately describes visible page content.

Recommended schemas:

- WebSite.
- WebPage.
- Organization.
- BreadcrumbList.
- FAQPage, where eligible and appropriate.

Do not use misleading FinancialService or Dataset markup to imply that the platform is a bank or financial institution.

Validate all structured data with Google's testing tools.

# 6. Google AdSense Readiness

## 6.1. Objective

Prepare the platform for Google AdSense review and monetization.

AdSense approval cannot be guaranteed by technical implementation alone.

The website must provide sufficient original value, transparent information, functional navigation, and compliance with Google Publisher Policies.

## 6.2. Mandatory Pages

Implement fully accessible pages:

- About Us.
- Contact.
- Privacy Policy.
- Terms of Use.

All pages must be available in the relevant language.

## 6.3. Privacy Policy

Rewrite the existing Privacy Policy.

It must accurately disclose:

- What information the website collects.
- Server logs and technical information.
- Cookies and local storage.
- Google AdSense usage.
- Third-party advertising technologies.
- Advertising cookies and identifiers.
- IP address processing where applicable.
- Data sharing and processing by third parties.
- User privacy rights.
- Contact information.

Include the required disclosure that third-party vendors, including Google, may use cookies, web beacons, IP addresses, or similar technologies for advertising.

Do not claim that the site does not collect information if server logs or advertising services process it.

## 6.4. Cookie Consent

Implement a consent solution appropriate for the website's target audience and applicable legal requirements.

Requirements:

- Clear cookie information.
- Consent preferences where required.
- Ability to withdraw or change consent.
- Correct handling of advertising consent signals.
- Google-certified CMP integration where required for applicable regions, including the EEA, UK, and Switzerland.

## 6.5. Ad Placement

Design the layout with future advertising placements in mind.

Suggested locations:

- Below the main currency overview.
- Between informational content sections.
- Within longer educational articles.
- At the end of relevant content.

Rules:

- Clearly distinguish advertisements from actual exchange rate information.
- Never place ads next to controls in a way that encourages accidental clicks.
- Do not obscure the currency converter.
- Avoid intrusive popups.
- Avoid aggressive sticky advertising.
- Never prioritize advertising over the main product functionality.

Ad placements must not negatively affect usability or Core Web Vitals.

## 6.6. AdSense Technical Integration

Prepare:

- AdSense script integration.
- Publisher verification.
- ads.txt support.
- Correct crawler accessibility.
- HTTPS.
- Privacy disclosures.
- Consent integration.

Only add the real publisher ID and production advertising configuration after the account and site are configured.

Do not use placeholder publisher IDs in production.

# 7. UI/UX Redesign

## 7.1. Design Direction

Create a modern fintech-inspired interface.

Visual direction:

- Minimalistic.
- Clean.
- Professional.
- Data-oriented.
- Modern typography.
- Strong visual hierarchy.
- Consistent spacing.
- Subtle animations.
- Excellent readability.

Avoid unnecessary gradients, decorative animations, oversized illustrations, and excessive card layouts.

## 7.2. Color System

Suggested direction:

- Primary: Deep navy.
- Accent: Modern blue or cyan.
- Positive: Green.
- Warning: Amber.
- Background: Light neutral.
- Dark mode: Deep slate.

Colors must maintain sufficient contrast and accessibility.

## 7.3. Responsive Design

Support:

- Mobile: 320px and above.
- Tablet.
- Desktop.
- Large desktop displays.

Requirements:

- No horizontal overflow.
- Touch-friendly controls.
- Readable financial data.
- Mobile-optimized comparison table.
- Responsive navigation.
- Consistent spacing.

## 7.4. Accessibility

Target WCAG 2.2 AA where applicable.

Implement:

- Semantic HTML.
- Keyboard navigation.
- Visible focus states.
- Accessible form labels.
- Screen reader support.
- Sufficient color contrast.
- Reduced-motion support.

## 7.5. Dark Mode

Maintain light and dark modes.

Requirements:

- System preference detection.
- Manual switching.
- Persistent preference.
- No theme flashing during initial rendering.

# 8. Performance Optimization

## 8.1. Main Objective

Target Lighthouse Performance: 100/100.

Test both mobile and desktop production builds.

The score must be optimized without sacrificing functionality, content quality, or accessibility.

## 8.2. Core Web Vitals

Target the following real-world metrics at the 75th percentile:

| Metric | Target |
|---|---:|
| LCP | ≤ 2.5 seconds |
| INP | ≤ 200 ms |
| CLS | ≤ 0.1 |

## 8.3. Optimization Requirements

- Remove unnecessary JavaScript.
- Implement code splitting.
- Lazy-load non-critical components.
- Optimize images.
- Use modern image formats.
- Avoid loading unnecessary video assets.
- Reduce third-party scripts.
- Minimize CSS.
- Remove unused dependencies.
- Optimize font loading.
- Avoid layout shifts.
- Implement appropriate caching headers.
- Reduce unnecessary React re-renders.
- Optimize API response sizes.

The initial viewport must render without waiting for all external currency providers.

## 8.4. Performance Testing

Use:

- Google Lighthouse.
- PageSpeed Insights.
- Chrome DevTools.
- WebPageTest.

Run at least three production Lighthouse tests per target environment and compare median results.

Measure performance both before and after AdSense integration.

Ads and third-party scripts must be lazy-loaded where appropriate.

Document any performance regressions introduced by advertising integrations.

# 9. GitHub Repository Improvements

## 9.1. README.md

Completely rewrite the existing README.

The current README contains a placeholder clone URL and does not sufficiently explain the product.

The new README must include:

1. Project name and description.
2. Product purpose.
3. Unique value proposition.
4. Main features.
5. Supported currencies.
6. Supported banks.
7. Data sources.
8. Screenshots.
9. Architecture overview.
10. Technology stack.
11. Installation instructions.
12. Development instructions.
13. Environment variables.
14. API documentation.
15. Deployment instructions.
16. Privacy and data handling information.
17. Contribution guidelines.
18. License.

## 9.2. Repository Structure

Organize the repository logically.

Suggested structure:

- src/components
- src/pages
- src/services
- src/hooks
- src/lib
- src/styles
- api
- public
- scripts
- docs
- tests

Avoid unnecessary architectural complexity.

## 9.3. GitHub Project Quality

Add:

- Descriptive repository description.
- Relevant topics.
- Professional README.
- Screenshots.
- License file, if the project is intended to be open source.
- CONTRIBUTING.md.
- Issue templates.
- Pull request template.
- GitHub Actions CI.
- Automated linting and build checks.

Do not claim an open-source license unless one is actually selected and included.

# 10. Testing and Quality Assurance

## 10.1. Unit Tests

Cover:

- Rate normalization.
- Currency conversion.
- Best rate calculation.
- Missing data handling.
- Invalid numerical values.
- Stale data detection.
- Currency formatting.

## 10.2. Integration Tests

Test:

- Each bank provider.
- API aggregation.
- Cache behavior.
- Provider failures.
- Partial API responses.
- Timeout handling.
- Rate validation.

## 10.3. End-to-End Tests

Test the following user journeys:

1. Open the homepage.
2. View current USD rates.
3. Compare banks.
4. Find the best selling rate.
5. Find the best buying rate.
6. Convert UAH to USD.
7. Convert USD to UAH.
8. Select a specific bank.
9. Switch language.
10. Switch theme.
11. Navigate to informational pages.
12. Use the website on mobile.

Recommended tools: Vitest and Playwright.

# 11. Analytics and Monitoring

Prepare optional integrations for:

- Google Search Console.
- Google Analytics 4.
- Google AdSense.
- Vercel Analytics.
- Vercel Speed Insights.

Track important product interactions:

- Currency converter usage.
- Currency selection.
- Bank filtering.
- Best rate selection.
- Language selection.

Analytics and advertising scripts must respect applicable consent requirements.

Monitor:

- API availability.
- Provider failures.
- Data freshness.
- Application errors.
- Performance regressions.

# 12. Security and Reliability

Implement:

- HTTPS-only production access.
- Secure HTTP headers.
- Input validation.
- API request timeouts.
- Safe error handling.
- Dependency auditing.
- No exposed API secrets.
- No sensitive information in client bundles.
- Appropriate rate limiting.
- Protection against abuse of forced-refresh endpoints.

Do not expose internal error details to visitors.

# 13. Acceptance Criteria

The project is considered complete when the following conditions are met.

### Product

- [ ] Clear product identity and USP.
- [ ] Functional currency comparison.
- [ ] Correct best buying and selling rate calculations.
- [ ] Functional currency converter.
- [ ] Transparent source information.
- [ ] Correct handling of missing and stale data.
- [ ] Fully responsive design.

### SEO

- [ ] Unique content for every indexable route.
- [ ] Correct canonical URLs.
- [ ] Correct hreflang configuration.
- [ ] Valid sitemap.
- [ ] Correct robots.txt.
- [ ] Search-engine-readable HTML.
- [ ] Valid structured data.
- [ ] No broken internal links.
- [ ] No unintended duplicate indexable pages.

### AdSense

- [ ] Complete Privacy Policy.
- [ ] About Us page.
- [ ] Contact page.
- [ ] Terms of Use.
- [ ] Appropriate cookie consent implementation.
- [ ] ads.txt configuration.
- [ ] Functional navigation.
- [ ] No intrusive or misleading ad placements.
- [ ] Original and useful editorial content.
- [ ] Compliance review against current Google Publisher Policies.

### Performance

- [ ] Lighthouse Performance target: 100/100.
- [ ] Lighthouse Accessibility: 100/100 target.
- [ ] Lighthouse Best Practices: 100/100 target.
- [ ] Lighthouse SEO: 100/100 target.
- [ ] Core Web Vitals meet Google's good thresholds.
- [ ] No major console errors.
- [ ] No significant layout shifts.
- [ ] No unnecessary blocking resources.

### GitHub

- [ ] Professional README.
- [ ] Correct repository installation instructions.
- [ ] Clean project structure.
- [ ] CI build and lint checks.
- [ ] Automated tests.
- [ ] Documented API.
- [ ] No exposed secrets.

# 14. Implementation Priorities

## Phase 1 — Audit and Foundation

- Review the complete source code.
- Identify existing bugs.
- Refactor the API architecture.
- Fix rate calculation and freshness issues.
- Establish the final product architecture.

## Phase 2 — UI/UX

- Redesign homepage.
- Improve navigation.
- Redesign currency cards.
- Improve comparison table.
- Improve converter.
- Implement responsive layouts.
- Improve accessibility.

## Phase 3 — Product Features

- Best Rate Finder.
- Currency market insights.
- Improved source transparency.
- Historical data support, if reliable sources are available.

## Phase 4 — SEO and Content

- Implement SEO-friendly rendering.
- Create dedicated landing pages.
- Improve metadata.
- Fix sitemap and hreflang.
- Add original educational content.
- Implement structured data.

## Phase 5 — AdSense Preparation

- Rewrite Privacy Policy.
- Create Terms of Use.
- Create About and Contact pages.
- Implement consent management.
- Prepare advertising placements.
- Configure ads.txt.

## Phase 6 — Performance and Testing

- Optimize JavaScript.
- Optimize assets.
- Implement caching.
- Run Lighthouse tests.
- Run end-to-end tests.
- Fix all critical issues.

## Phase 7 — GitHub and Production

- Rewrite README.
- Update project documentation.
- Configure CI.
- Deploy production build.
- Verify all routes.
- Verify SEO and AdSense readiness.

# 15. Final Definition of Success

UAH.today should become a professional currency comparison platform that provides real value beyond simply displaying exchange rates.

The finished product must be:

- Fast.
- Reliable.
- Easy to understand.
- Mobile-first.
- SEO-friendly.
- Accessible.
- Technically maintainable.
- Ready for Google AdSense review.
- Designed for future growth.

**Primary product promise:**

"Compare Ukrainian bank exchange rates, find the best deal, and convert your money in seconds."

The priority is to build a useful product first and monetize it without compromising user experience.

---

**Important implementation rule:** Audit the existing code before replacing components or introducing new dependencies. Reuse working functionality where possible, preserve correct API integrations, and avoid unnecessary rewrites.
