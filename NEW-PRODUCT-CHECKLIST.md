# Launching a new product — checklist

This doc lists what has to change when Pedant Studios adds a new product to the portfolio. The policy and site are designed to scale by adding subsections, not by rewriting — this checklist makes that concrete.

> Audience: future me (or any other solo operator continuing this project). Skim once before launch, work through it in order, check off as you go. Most steps take a few minutes; the legal-review step is the one that needs lead time.

---

## Before you start

Decide these things first because they shape everything below.

- [ ] **Product name** — final, not a working name. Used as a directory name, in the docs sidebar, in the policy, and in URLs.
- [ ] **Audience model** — B2B (you process data on behalf of customer firms) or B2C (you control data directly)? This determines the privacy-policy role you list and whether you need a DPA template.
- [ ] **Pricing model** — free-only, free + paid, paid-only? Per-user, per-location, flat? Affects the marketing copy and ToS.
- [ ] **Data categories collected** — list them concretely. Will inform the privacy-policy disclosure.
- [ ] **Sub-processors** — will the product use a new service (analytics, email, storage) not already on the global list? If yes, add it to the privacy policy.
- [ ] **Beta vs. GA** — if launching as beta, the existing beta notice in the privacy policy still covers it. If launching as GA (no beta caveat), get the privacy policy and ToS reviewed by counsel before going live.

---

## Privacy policy — the five surgical edits

The policy at `src/pages/privacy.astro` is designed for product-by-product extension. Don't rewrite; add subsections.

### 1. Section 1 (Who we are and what this covers)

Add the new product to the bulleted list:

```diff
  <li>Our products, including <strong>WebCenter</strong> (a workforce management application for small firms)</li>
+ <li><strong>{NewProduct}</strong> (one-line description)</li>
```

### 2. Section 2 (Roles)

Add a row to the table only if the role differs from the existing rows. Specifically:

- B2B with multi-tenant structure (firm = controller, you = processor): existing row covers it; reuse with the new product's name in the description.
- **B2C product (you = controller for end users directly):** add a new row.
- Different controller/processor mix: add a row that describes it.

### 3. Section 3 (What we collect, why, and how long)

Add a new subsection with parallel naming. Pattern:

```html
<h3 class="...">{NewProduct} — {audience}</h3>
<ul class="...">
  <li><strong>Account information</strong> — ...</li>
  <li>...</li>
</ul>
```

Cover at minimum: account fields, content data, retention behavior, and any product-specific categories (location data, sensitive PI, etc.).

### 4. Section 5 (Product-specific privacy features)

Only if the product has a notable privacy feature worth calling out (cross-firm boundary, end-to-end encryption, ephemerality, etc.). Add as a subheading:

```html
<h3 class="...">{NewProduct} — {feature name}</h3>
<p>...</p>
```

If nothing's distinct, skip — don't invent a feature for symmetry.

### 5. Section 7 (Cookies and tracking)

Add product-specific cookies if any. Most products will use a session cookie; mention it parallel to WebCenter's session cookie.

### Other policy sections

These rarely change per product, but check them anyway:

- **Section 4 (Service providers)** — add any new sub-processor (analytics, storage, etc.).
- **Section 8 (Security)** — add only if practices materially differ for this product (rare).
- **Section 9 (Privacy rights)** — usually unchanged; check the "if you're an employee whose data is in WebCenter" subsection — needs updating if the new product also has a processor relationship.
- **Section 10 (No sale or sharing)** — must remain accurate; if the new product changes anything, update before launch.
- **Section 14 (Changes to this policy)** — adding a new product is a "material change." Send the 30-day advance notice email to subscribers describing the additions.

### Update the "Last updated" date and contents nav

```diff
- const lastUpdated = '2026-05-05';
+ const lastUpdated = '{today}';
```

If you added a section, update the contents `<ol>` near the top accordingly.

---

## Terms of Service — surgical edits

The ToS at `src/pages/terms.astro` is structured to cover all current and future Pedant Studios products without rewrites. Most of the document (definitions, billing, IP, AUP, liability, disputes, general provisions) applies firm-wide. A few sections need product-specific edits when adding a new product:

### 1. Section 1 (Definitions)

If the new product has a different audience model (e.g., B2C consumer product where the user IS the Customer rather than a firm acting on behalf of employees), update the **"Customer"** and **"Authorized Users"** definitions to be inclusive of that pattern.

### 2. Section 2 (Acceptance — who is bound)

If the new product is B2C (no organization signing on behalf of others), the second paragraph about organizations doesn't apply but is still useful as-is. Add a paragraph covering the new product if its acceptance flow differs.

### 3. Section 3 (The Service — what we don't commit to)

If the new product has different non-commitments (e.g., a calendar app might explicitly not commit to syncing with specific external calendar providers), add or generalize the bullet list.

### 4. Section 5 (Subscription, billing, and cancellation)

Update the **Plans** subsection if the new product has a different pricing model (e.g., per-user instead of per-location, or one-time purchase instead of subscription).

### 5. Section 7 (Acceptable use)

Add product-specific prohibitions if the new product has them. The "bypass cross-tenant privacy boundary in WebCenter" bullet is WebCenter-specific; for a new product with different security architecture, add a parallel bullet or replace it.

### 6. Section 8 (Termination — Effect of termination)

Update the data export bullet if the new product's export format differs from CSV.

### Sections that rarely need product-specific updates

- Section 4 (Account registration) — applies firm-wide
- Section 6 (Customer Data and IP) — generic framing applies firm-wide
- Section 9 (Confidentiality) — applies firm-wide
- Section 10 (Warranties / disclaimers) — applies firm-wide; note the beta-AS-IS language is product-agnostic
- Section 11 (Indemnification) — applies firm-wide
- Section 12 (Limitation of liability) — applies firm-wide; the cap structure scales across products
- Section 13 (Privacy) — references the privacy policy, which is updated separately per the steps above
- Section 14 (Term and changes) — material-change notice process is firm-wide
- Section 15 (Governing law, venue, disputes) — firm-wide
- Section 16 (General provisions) — firm-wide

### Update the "Last updated" date

Bump `lastUpdated` in `terms.astro` to today and call out the change in the 30-day advance notice email to existing customers (a new product launch is a material change).

### When to involve outside counsel

Before going GA (not beta) on the platform — or before launching any product with a substantially different commercial structure — these specific items in the ToS deserve attorney review:

- Final limitation-of-liability cap structure (especially the Free-tier $100 floor)
- Indemnification scope and how it interacts with the cap
- Auto-renewal disclosure language (CA Auto-Renewal Law, FTC Click-to-Cancel)
- Whether to add an arbitration / class-waiver clause
- Final governing-law and venue selection

The current ToS is appropriate for the beta period.

---

## Marketing site (this repo)

### New product page

- [ ] Create `src/pages/{product-slug}.astro` modeled on `webcenter.astro`. Sections:
  - Hero with product name, audience, value prop, CTAs
  - "Who it's for" — concrete vertical fit
  - Pain-point / solution cards
  - Features grid
  - Pricing tiers (if applicable)
  - "What it doesn't do" — honest non-goals (Pedant Studios style)
  - Bottom CTA
  - Email signup with `list="{product-slug}"`
- [ ] Add JSON-LD `SoftwareApplication` schema with the product's offers (see `webcenter.astro` for the pattern)
- [ ] Set page-specific `title` and `description` for SEO

### Header navigation (`src/components/Header.astro`)

- [ ] Add a nav link to the new product page between WebCenter and Docs.

### Footer (`src/components/Footer.astro`)

- [ ] Add the new product to the "Products" column.

### Homepage (`src/pages/index.astro` and `src/components/HomepageFeatures/index.tsx`)

- [ ] Add the new product card to the `Products` array in `HomepageFeatures/index.tsx`. Set `status` to `'beta'`, `'live'`, or `'coming-soon'` as appropriate.
- [ ] If the new product replaces the placeholder "More to come" card or warrants different homepage treatment, adjust `index.astro`.

### 404 page (`src/pages/404.astro`)

- [ ] Add a quick-link button to the new product so 404 visitors can recover.

---

## Email signup pipeline (Resend)

### In Resend dashboard

- [ ] Create a new **Topic** for the product:
  - Name: `{Product name} updates`
  - **Default subscription: Opt-out** (not Opt-in — see the gotcha below)
  - Visibility: Public
- [ ] Copy the Topic ID.

> **Resend gotcha:** Topic "Default subscription mode" is counter-intuitively named.
> - "Opt-in" = all contacts auto-subscribe (not what you want)
> - "Opt-out" = only explicit opt-ins receive (what you want for per-form routing)
>
> Cannot be changed after creation. If you set it wrong, delete and recreate.

### In this repo

- [ ] Update `src/pages/api/subscribe.ts`:
  - Add the new product slug to `ALLOWED_LISTS`:
    ```diff
    - const ALLOWED_LISTS = ['general', 'webcenter'] as const;
    + const ALLOWED_LISTS = ['general', 'webcenter', '{product-slug}'] as const;
    ```
  - Add the case to `getTopicId`:
    ```ts
    case '{product-slug}':
      return env.RESEND_TOPIC_ID_{PRODUCT_SLUG_UPPER};
    ```
- [ ] Update `.env.example` with the new env var, including the comment block describing setup.
- [ ] Update `README.md` with the new env var row in the Environment Variables table, and bump the "set N env vars" count in the Resend setup section.

### In Vercel project settings

- [ ] Add the new env var (`RESEND_TOPIC_ID_{PRODUCT}`) to all three environments (Production, Preview, Development).
- [ ] Redeploy or push a trivial commit to pick up the new env var.

---

## Docs hub (`pedant-studios-docs` sibling repo)

### Add the product's docs section

- [ ] Create `docs/{product-slug}/` with subdirectories matching the product's structure (typical: `getting-started/`, `features/`, `admin/`, `troubleshooting/`).
- [ ] Add `_category_.json` to each directory with a `label` and `position`.
- [ ] Write at least an `overview.md` so the section isn't empty.
- [ ] Each MD file gets `description:` frontmatter for SEO.

### Update the docs hub root

- [ ] `docs/intro.md` — add the new product to the product list.
- [ ] `src/components/HomepageFeatures/index.tsx` — add the new product card to the `Products` array.
- [ ] `docusaurus.config.ts` — update the footer's "Products" links if you list products there.

### Verify

- [ ] `npm run build` — should pass without warnings.
- [ ] Sitemap auto-updates (`@astrojs/sitemap` and Docusaurus both regenerate on build).

---

## Memory / context (`~/.claude/projects/.../memory/`)

- [ ] Update `MEMORY.md` with the new product's status.
- [ ] If the product warrants its own memory file (architecture, decisions, design), create one and link from `MEMORY.md`.
- [ ] Update `product-direction.md` if the new product affects the portfolio strategy or vertical focus.

---

## Pre-launch verification

Before announcing the product:

- [ ] Privacy policy updated with all five surgical edits (or fewer, as applicable). The "Last updated" date is current. The change is described in the email to existing subscribers.
- [ ] Terms of service updated (or beta caveat covers it).
- [ ] All env vars set in Vercel; production deploy is healthy.
- [ ] Test the new product's email signup form end-to-end:
  - Submit your own email
  - Verify the operator notification arrives at `CONTACT_TO_EMAIL`
  - Check Resend dashboard — contact created, opted into the new topic
- [ ] Sub-processors — if you added one (e.g., analytics), verify the contract / DPA is in place before personal data flows to them.
- [ ] Footer links reach the new product. Header links work. 404 page links to the new product.
- [ ] Lighthouse score on the new product page is acceptable (>90 on Performance, Accessibility, SEO, Best Practices).
- [ ] OG image renders for the new product when the URL is shared (test with [opengraph.dev](https://www.opengraph.dev/) or a similar tool).
- [ ] The new product appears in `sitemap-0.xml`.

---

## Post-launch follow-ups

- [ ] Send the 30-day advance notice (per privacy policy section 14) to existing email subscribers describing the new data collection. If you delayed launch by 30 days from this notice, you're already in compliance; otherwise hold launch.
- [ ] Monitor Resend deliverability for the first week — new topics sometimes have lower initial deliverability scores until contacts engage.
- [ ] Watch the contact form for first-week privacy questions and update the policy or troubleshooting docs if specific themes emerge.
- [ ] Within 90 days, revisit the privacy policy: were there practices we documented that we don't actually do? Were there practices we do that we forgot to document? Tighten alignment.

---

## When this doc is wrong

If you go through this and something's missing or out of date — like the policy structure shifted, or Resend's API changed again, or we added a new sub-processor we should mention by default — fix this doc as you go. Future-you will thank current-you.

Last reviewed: 2026-05-05.
