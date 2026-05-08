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
- [ ] **DMCA / copyright takedown surface** — Does this product expose any user-generated content beyond internal-only messaging? Examples: public comments, file uploads, shared documents, public profiles, customer-facing forums. If yes, **re-evaluate whether to register a DMCA agent** with the U.S. Copyright Office (~$6 + ~1 hour) and add a takedown section to the ToS. The current Pedant Studios stance is no DMCA registration — WebCenter's only user-content surface is private firm-internal messaging, so DMCA risk is minimal. New products with broader content surfaces may flip the cost-benefit. Document the evaluation outcome in this product's launch notes regardless of decision.

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

**Click-through requirement.** Every product must implement an explicit ToS acceptance click-through for individual users (not just the organization signup):

- **For self-signup users** (firm admins, B2C users): include "By clicking [Sign Up], you agree to the [Terms of Service](link) and [Privacy Policy](link)" above the signup button. The click is the acceptance.
- **For Authorized Users joining via invitation:** on first sign-in, show a brief modal: "Please review our [Terms of Service](link) and [Privacy Policy](link). By clicking 'I agree and continue', you accept these terms with respect to your individual use of the Service." Single button. Record acceptance with user ID, timestamp, and ToS version.
- **For ToS material updates:** on next sign-in after a material change, show a re-acceptance prompt with a link to the changes.

This is the lowest-friction click-through pattern that's legally defensible — see ToS §2 ("we will ask you to indicate acceptance"). The implementation lives in each product's auth/onboarding code; this checklist just flags that it's required.

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

## Subscription billing & auto-renewal compliance

If the new product has paid plans (subscriptions, trials, etc.), it inherits commitments made in the ToS that must be operationalized in the product itself. This section captures those commitments and the patterns to satisfy them.

US auto-renewal compliance is a patchwork of CARLA (California), ROSCA (federal), the FTC's Click-to-Cancel rule (status in flux), and state laws in NY, IL, FL, OR, CT, CO, and others. Most have similar requirements; CARLA is the strictest, so satisfying CARLA generally satisfies the others.

### Operational commitments — every paid product must do all of these

Each is something the ToS commits to. If the product can't deliver, the ToS is misleading.

- [ ] **Free trial does NOT auto-convert to paid.** No surprise charge after a trial expires; user must actively upgrade. (WebCenter pattern: trial expires → reverts to Free plan.)
- [ ] **Auto-renewal disclosure displayed at checkout** in visual proximity to the price and the consent action (the Subscribe / Sign up button).
- [ ] **Affirmative consent captured** — the user clicks an unambiguous action button, not pre-checked.
- [ ] **Confirmation email sent** after every paid plan start. Stripe sends this by default; verify the template includes recurring charge details, frequency, and a cancellation link.
- [ ] **Cancellation is online, self-service, 24/7.** No phone call, written notice, or chat session required.
- [ ] **Cancellation method is at least as easy as enrollment.** If signup is online in 5 clicks, cancellation can't take 6.
- [ ] **Cancellation confirmation email sent** after cancellation is processed.
- [ ] **Annual anniversary reminder** sent ~14 days before each yearly subscription anniversary, even for monthly subscriptions, summarizing usage and confirming auto-renewal continues. (Defensive against state requirements that apply to subscriptions over a year.)
- [ ] **Material price change notice** — at least 30 days advance notice of any price increase before it takes effect. (ToS §5.)
- [ ] **Click-through ToS** captured at signup and on first sign-in (per ToS §2). Acceptance recorded with user ID, timestamp, and ToS/Privacy version. See [Click-through ToS implementation](#click-through-tos-implementation).

### Stripe settings to verify

For Stripe Checkout (the recommended setup):

- [ ] **Subscription mode** — enabled
- [ ] **Subscription details displayed prominently** at checkout (price, frequency, cancellation policy)
- [ ] **Automatic confirmation email** — enabled (Stripe sends this by default; double-check template)
- [ ] **Customer Portal** — enabled, with cancellation option turned on
- [ ] **Cancellation reason capture** — optional but useful for product feedback
- [ ] **Tax handling** — configured per business setup (Stripe Tax or manual)
- [ ] **California consent disclosure** — Stripe Checkout has built-in language; verify it's enabled OR use the recommended custom language below
- [ ] **Past-due grace period** — 7 days configured to match ToS §5

### CA-compliant disclosure language for checkout (the "magic words")

California's Auto-Renewal Law (Bus. & Prof. Code §§17600–17606) requires "automatic renewal offer terms" to be presented "clearly and conspicuously" in "visual proximity" to the request for consent. The disclosure must include:

1. The recurring nature of the charges
2. The amount of the charge (and that it may change, with the new amount if known)
3. The length of the renewal term, or that the service is continuous
4. The minimum purchase obligation, if any
5. A description of the cancellation policy

**Recommended display text near the Subscribe / Sign up button:**

```
[Product Name] — [Plan name]
$X.XX per [month/year], billed automatically each [month/year] until you cancel.

You can cancel anytime online by going to [path to cancellation, e.g., 
Admin → Billing → Manage Subscription]. Cancellation takes effect at the end 
of your current billing period.

By clicking "Subscribe", you agree to these recurring charges and to our 
[Terms of Service](link) and [Privacy Policy](link).
```

**Required elements** present in the recommended text above:

- ✅ Recurring nature ("billed automatically each [period]")
- ✅ Amount ("$X.XX per [period]")
- ✅ Length of renewal term ("until you cancel" — continuous)
- ✅ Cancellation method ("online, by going to [path]")
- ✅ Cancellation effective date ("end of your current billing period")
- ✅ Affirmative consent ("By clicking 'Subscribe'")
- ✅ Linked to legal docs

**Confirmation email template should also include:**

- Plan name
- Recurring charge amount and frequency
- Next charge date
- How to cancel (link to Manage Subscription)
- Acknowledgment that the user authorized the recurring charges

### Renewal reminder schedule (state-by-state-safe approach)

Different states have different reminder requirements. The "any state" defensive schedule:

| Trigger | Reminder type | Timing |
|---|---|---|
| Annual subscription anniversary (or 12 months of cumulative active subscription) | Renewal reminder + summary of usage + confirmation auto-renewal continues | ~14 days before anniversary |
| Material price change | Pricing change notice | ≥30 days before change takes effect |
| Trial expiration (if any) | Trial-ending notification with explicit "won't auto-charge" language | ~3 days before trial ends |
| Past-due payment | Notification + grace period reminder | At fail-time and ~5 days into the 7-day grace |
| Cancellation processed | Cancellation confirmation | Immediately after cancellation |

**Skip reminders if:**

- The subscription has been cancelled (don't spam ex-customers)
- The user has unsubscribed from all marketing email — but **continue sending transactional reminders** (renewal, price change, cancellation), tagged as transactional. Transactional email isn't governed by marketing-email opt-out.

**Why annual anniversaries matter for monthly subscriptions:** Some state laws and emerging interpretations of CARLA apply renewal-reminder requirements to any subscription that has run for over a year, even if billed monthly. Sending an annual reminder is cheap insurance.

### Documented consent flow

For audit purposes, document the actual flow of consent for each product. Update this section when implementing or changing the flow.

**WebCenter consent flow (current; verify on each release):**

1. **Sign-up page (B2B firm admin self-signup)** — admin enters firm name, location, admin name, username, email, and password. Link to ToS and Privacy Policy displayed below the Sign-up button.
2. **Pre-checkout disclosure (when upgrading to a paid plan)** — plan details, price, recurring nature, and cancellation policy displayed in visual proximity to the Subscribe button.
3. **ToS + Privacy Policy acceptance** — captured by clicking Sign up / Subscribe with the inline notice present.
4. **Stripe Checkout** — payment details + Stripe's automatic disclosure of recurring charges.
5. **Confirmation email** — sent by Stripe with subscription summary and cancellation link.
6. **First sign-in (Authorized User from invitation)** — click-through ToS + Privacy Policy modal. Acceptance recorded with user ID, timestamp, IP, ToS/Privacy version.
7. **In-app billing page** — always-visible plan status + Manage Subscription button → Stripe Customer Portal.
8. **Cancellation flow** — Manage Subscription → Stripe Portal → confirm cancellation → confirmation email sent. Access continues until end of period.

When adding a new product, document its actual consent flow here as a parallel subsection.

### Click-through ToS implementation

Per ToS §2, every Authorized User must accept the ToS on first sign-in. Implementation requirements:

- [ ] **Modal on first successful sign-in** (post-invitation acceptance OR self-signup)
- [ ] **Modal contents:**
  - Brief intro paragraph
  - Links to full Terms of Service and Privacy Policy
  - Single "I agree and continue" button
- [ ] **Acceptance recorded:**
  - User ID
  - Timestamp (UTC)
  - Version of ToS accepted (e.g., `2026-05-06`)
  - Version of Privacy Policy accepted
  - IP address
- [ ] **Re-prompt logic:**
  - Material ToS update → re-prompt all existing users on next sign-in
  - Material Privacy Policy update → re-prompt
  - Show what's new since last acceptance
- [ ] **UI:**
  - Cannot be dismissed without acceptance
  - Cannot bypass the modal to use the app

### What requires outside counsel review before non-beta GA

- Final CARLA-compliant disclosure language (the "magic words" above are a strong starting point but specific phrasing matters; review with attorney)
- Click-to-Cancel rule compliance once the legal status stabilizes
- State-specific renewal reminder schedules for any state where you onboard 100+ customers
- Documentation of the consent flow as it actually operates (screenshots, email templates, timestamps) — for audit defense

---

## Pre-launch verification

Before announcing the product:

- [ ] Privacy policy updated with all five surgical edits (or fewer, as applicable). The "Last updated" date is current. The change is described in the email to existing subscribers.
- [ ] Terms of service updated (or beta caveat covers it).
- [ ] **Subscription billing & auto-renewal compliance** — every operational commitment in that section is implemented in the product. Specifically: free trial doesn't auto-charge; checkout displays the CA-compliant disclosure; click-through ToS captures user acceptance; cancellation works in the Stripe portal; confirmation emails fire correctly.
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
