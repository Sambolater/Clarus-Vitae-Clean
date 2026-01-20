# 07 - PRIVACY INFRASTRUCTURE
## Clarus Vitae - Privacy-First Architecture Implementation

> **Reference**: See `00_MASTER_PROJECT_BRIEF.md` Section "Privacy as Foundation" for complete privacy requirements.

---

## Task Objective

Implement the comprehensive privacy infrastructure that enables the platform's core promise: users can research sensitive wellness topics with complete confidence that their data is protected, never sold, and fully under their control.

---

## Privacy Requirements (From Brief)

1. **Research Mode**: Browse entire site without tracking, cookies, or data capture
2. **Zero third-party data sharing**: Never sold to insurers, data brokers, or third parties
3. **Encrypted lead handling**: All inquiry data encrypted in transit and at rest
4. **No retargeting**: No Facebook pixels, Google remarketing, or ad tracking
5. **Data minimization**: Collect only what's necessary
6. **Right to deletion**: One-click complete data deletion within 30 days
7. **Transparency**: Clear explanation of data practices
8. **GDPR++ approach**: Exceed legal minimums globally

---

## Deliverables

### 1. Research Mode Implementation

```typescript
// packages/utils/src/privacy/research-mode.ts

export interface PrivacyState {
  researchMode: boolean;
  analyticsConsent: boolean;
  functionalCookiesConsent: boolean;
  lastUpdated: Date;
}

/**
 * Research Mode Features:
 * - No cookies set (except essential session if logged in)
 * - No analytics tracking
 * - No local storage persistence
 * - No browser fingerprinting
 * - Clean URL parameters (strip tracking params)
 */

export const RESEARCH_MODE_DEFAULTS: PrivacyState = {
  researchMode: true,  // DEFAULT ON
  analyticsConsent: false,
  functionalCookiesConsent: false,
  lastUpdated: new Date()
};

// Strip tracking parameters from URLs
export const TRACKING_PARAMS_TO_STRIP = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'msclkid', 'mc_cid', 'mc_eid',
  'ref', 'source', 'affiliate'
];

export function cleanUrl(url: string): string {
  const urlObj = new URL(url);
  TRACKING_PARAMS_TO_STRIP.forEach(param => {
    urlObj.searchParams.delete(param);
  });
  return urlObj.toString();
}

export function isResearchMode(): boolean {
  // Check for explicit opt-out cookie only
  if (typeof document !== 'undefined') {
    return !document.cookie.includes('privacy_mode=full');
  }
  return true; // Default to research mode
}
```

### 2. Cookie Consent Banner (Minimal, Non-Intrusive)

```typescript
// apps/web/components/privacy/CookieConsent.tsx

/**
 * Unlike typical cookie banners that push users to "Accept All",
 * this banner:
 * - Defaults to Research Mode (no tracking)
 * - Only appears once, briefly
 * - Doesn't block content
 * - Makes privacy the easy choice
 */

interface ConsentOptions {
  essential: boolean;      // Always true, required for site function
  analytics: boolean;      // Self-hosted Plausible only
  functional: boolean;     // Saved comparisons, preferences
}

const DEFAULT_CONSENT: ConsentOptions = {
  essential: true,
  analytics: false,
  functional: false
};
```

**Banner Copy**:
```
Your privacy matters. By default, we don't track you or use cookies.

[Continue Privately] (primary action)
[Customize Settings] (secondary, opens modal)
```

### 3. Encryption Service

```typescript
// packages/utils/src/privacy/encryption.ts

import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;

export interface EncryptedData {
  encrypted: Buffer;
  iv: Buffer;
  authTag: Buffer;
  salt: Buffer;
}

/**
 * Encrypt sensitive data (PII) before database storage
 * Uses AES-256-GCM with unique IV per encryption
 */
export async function encryptPII(
  plaintext: string,
  masterKey: string
): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  
  const key = await scryptAsync(masterKey, salt, KEY_LENGTH) as Buffer;
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final()
  ]);
  
  const authTag = cipher.getAuthTag();
  
  // Format: salt:iv:authTag:encrypted (all base64)
  return [
    salt.toString('base64'),
    iv.toString('base64'),
    authTag.toString('base64'),
    encrypted.toString('base64')
  ].join(':');
}

/**
 * Decrypt PII data retrieved from database
 */
export async function decryptPII(
  encryptedString: string,
  masterKey: string
): Promise<string> {
  const [saltB64, ivB64, authTagB64, encryptedB64] = encryptedString.split(':');
  
  const salt = Buffer.from(saltB64, 'base64');
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(authTagB64, 'base64');
  const encrypted = Buffer.from(encryptedB64, 'base64');
  
  const key = await scryptAsync(masterKey, salt, KEY_LENGTH) as Buffer;
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  return decipher.update(encrypted) + decipher.final('utf8');
}

/**
 * Hash email for lookups without exposing actual email
 * Uses deterministic hashing so we can find records
 */
export async function hashEmail(email: string, pepper: string): Promise<string> {
  const hash = await scryptAsync(
    email.toLowerCase().trim(),
    pepper,
    32
  ) as Buffer;
  return hash.toString('hex');
}
```

### 4. Inquiry Encryption Layer

```typescript
// packages/database/src/services/inquiry-service.ts

import { encryptPII, decryptPII, hashEmail } from '@clarus/utils/privacy';

interface InquiryInput {
  propertyId: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  consentContactProperty: boolean;
  consentFollowup: boolean;
  inquiryType: 'standard' | 'secure';
}

interface EncryptedInquiry {
  property_id: string;
  name_encrypted: string;
  email_encrypted: string;
  email_hash: string;  // For deduplication/lookup
  phone_encrypted: string | null;
  message_encrypted: string | null;
  consent_contact_property: boolean;
  consent_followup: boolean;
  inquiry_type: string;
}

export async function createEncryptedInquiry(
  input: InquiryInput,
  encryptionKey: string,
  emailPepper: string
): Promise<EncryptedInquiry> {
  return {
    property_id: input.propertyId,
    name_encrypted: await encryptPII(input.name, encryptionKey),
    email_encrypted: await encryptPII(input.email, encryptionKey),
    email_hash: await hashEmail(input.email, emailPepper),
    phone_encrypted: input.phone 
      ? await encryptPII(input.phone, encryptionKey) 
      : null,
    message_encrypted: input.message 
      ? await encryptPII(input.message, encryptionKey) 
      : null,
    consent_contact_property: input.consentContactProperty,
    consent_followup: input.consentFollowup,
    inquiry_type: input.inquiryType
  };
}
```

### 5. Secure Inquiry Channel (High-Sensitivity Option)

```typescript
// apps/web/app/api/inquiries/secure/route.ts

/**
 * Secure inquiry endpoint for high-sensitivity inquiries
 * Additional protections:
 * - No logging of request contents
 * - Immediate encryption
 * - Option to provide Signal contact instead of email
 * - Auto-deletion after property contact
 */

export async function POST(request: Request) {
  // Disable request logging for this endpoint
  const body = await request.json();
  
  // Validate minimum required fields
  if (!body.propertyId || !body.contactMethod) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  
  // Support alternative contact methods
  const contactMethods = ['email', 'signal', 'secure_callback'];
  if (!contactMethods.includes(body.contactMethod)) {
    return Response.json({ error: 'Invalid contact method' }, { status: 400 });
  }
  
  // Process with enhanced encryption
  // ... implementation
}
```

### 6. Data Deletion Service

```typescript
// packages/database/src/services/deletion-service.ts

export interface DeletionRequest {
  userId?: string;
  email?: string;
  includeBackups: boolean;  // Schedule backup purge within 30 days
}

export interface DeletionResult {
  requestId: string;
  itemsQueued: {
    inquiries: number;
    reviews: number;
    comparisons: number;
    userAccount: boolean;
  };
  estimatedCompletionDate: Date;
  backupPurgeDate: Date | null;
}

/**
 * Complete data deletion implementation
 * - Immediately marks records as deleted
 * - Removes from active database
 * - Schedules backup purge (within 30 days per policy)
 * - Sends confirmation email
 */
export async function requestDataDeletion(
  request: DeletionRequest
): Promise<DeletionResult> {
  const requestId = generateDeletionRequestId();
  
  // Find all user data by email hash or user ID
  const userData = await findAllUserData(request);
  
  // Soft delete immediately (removes from queries)
  await softDeleteAllUserData(userData);
  
  // Queue hard deletion
  await queueHardDeletion(userData, requestId);
  
  // Schedule backup purge
  const backupPurgeDate = request.includeBackups 
    ? addDays(new Date(), 30) 
    : null;
  
  if (backupPurgeDate) {
    await scheduleBackupPurge(userData, backupPurgeDate);
  }
  
  return {
    requestId,
    itemsQueued: {
      inquiries: userData.inquiries.length,
      reviews: userData.reviews.length,
      comparisons: userData.comparisons.length,
      userAccount: userData.user !== null
    },
    estimatedCompletionDate: addDays(new Date(), 7),
    backupPurgeDate
  };
}
```

### 7. Privacy Dashboard Component

```typescript
// apps/web/app/privacy/dashboard/page.tsx

/**
 * User-facing privacy dashboard
 * Accessible without account for inquiry lookup
 */

// Features:
// - View what data we have (by email lookup with verification)
// - Download all data (GDPR export)
// - Delete all data (one-click)
// - Update consent preferences
// - View/revoke property inquiry permissions
```

**Dashboard Sections**:
1. **Your Data Summary**: What we have, when collected
2. **Active Inquiries**: Status of property inquiries
3. **Download Your Data**: JSON/CSV export
4. **Delete Everything**: One-click deletion with confirmation
5. **Consent Settings**: Update preferences

### 8. No-Track Analytics Setup (Plausible)

```typescript
// apps/web/lib/analytics.ts

/**
 * Privacy-respecting analytics using self-hosted Plausible
 * - No cookies
 * - No personal data
 * - No cross-site tracking
 * - Only aggregated metrics
 * - User can opt-out easily
 */

export function initAnalytics() {
  // Only init if user has opted in AND not in research mode
  if (isResearchMode() || !hasAnalyticsConsent()) {
    return;
  }
  
  // Plausible script loads only with consent
  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  script.src = `${process.env.NEXT_PUBLIC_PLAUSIBLE_HOST}/js/script.js`;
  document.head.appendChild(script);
}

// Track events without PII
export function trackEvent(name: string, props?: Record<string, string | number>) {
  if (isResearchMode() || !hasAnalyticsConsent()) {
    return;
  }
  
  // Plausible event tracking
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(name, { props });
  }
}
```

### 9. Content Security Policy

```typescript
// apps/web/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Strict CSP - blocks all third-party tracking
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // Tighten for production
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co",  // Only our services
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // Block all tracking/ad networks
    "script-src-elem 'self'",  // No external scripts
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  // Additional privacy headers
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  // Strip tracking params from URL
  const url = new URL(request.url);
  let cleaned = false;
  TRACKING_PARAMS.forEach(param => {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      cleaned = true;
    }
  });
  
  if (cleaned) {
    return NextResponse.redirect(url);
  }
  
  return response;
}

const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'msclkid', 'mc_cid', 'mc_eid'
];
```

### 10. Privacy Policy Page Content Structure

```markdown
# Privacy Policy

## Our Commitment
[Clear statement that privacy is foundational, not an afterthought]

## What We Collect

### When Browsing (Research Mode - Default)
- Nothing. No cookies, no tracking, no data.

### When You Submit an Inquiry
- Name, email, phone (optional)
- Your message
- Which property you're interested in

### When You Create an Account (Optional)
- Email address
- Saved properties and comparisons
- Your preferences

## What We DON'T Do
- ❌ Sell your data to anyone, ever
- ❌ Share with data brokers
- ❌ Share with insurance companies
- ❌ Use retargeting ads
- ❌ Track you across other websites
- ❌ Use Facebook Pixel or Google Analytics
- ❌ Fingerprint your browser

## How We Protect Your Data
- AES-256 encryption for all personal information
- Data stored in [jurisdiction] with strict privacy laws
- Regular security audits
- Minimal data retention

## Your Rights
- **Access**: See all data we have about you
- **Export**: Download your data anytime
- **Delete**: One-click complete deletion
- **Forget**: Removed from backups within 30 days

## Inquiries & Properties
When you inquire about a property:
- We share ONLY with that specific property
- They receive: your name, contact info, message
- They do NOT receive: your browsing history, other inquiries, comparisons

## Contact
[Direct contact for privacy questions]
```

---

## File Structure

```
packages/
  utils/
    src/
      privacy/
        index.ts
        research-mode.ts
        encryption.ts
        consent.ts
        deletion.ts
        
apps/
  web/
    app/
      privacy/
        page.tsx              # Privacy policy
        dashboard/
          page.tsx            # User privacy dashboard
        delete/
          page.tsx            # Deletion request flow
      api/
        privacy/
          export/
            route.ts          # Data export endpoint
          delete/
            route.ts          # Deletion request endpoint
          consent/
            route.ts          # Consent management
    components/
      privacy/
        CookieConsent.tsx
        PrivacyBadge.tsx      # "Research Mode Active" indicator
        DataExportButton.tsx
        DeleteDataModal.tsx
    middleware.ts             # CSP and privacy headers
```

---

## Acceptance Criteria

- [ ] Research Mode active by default (no cookies without consent)
- [ ] Cookie consent banner appears once, non-intrusively
- [ ] All PII encrypted before database storage
- [ ] Decryption working for authorized access
- [ ] Secure inquiry channel functional
- [ ] Data export generates complete user data file
- [ ] One-click deletion queues all user data for removal
- [ ] CSP blocks all third-party tracking scripts
- [ ] URL tracking parameters automatically stripped
- [ ] Privacy policy page complete and accurate
- [ ] Privacy dashboard accessible and functional
- [ ] No third-party scripts in page source (verify)
- [ ] Plausible analytics only loads with explicit consent

---

## Testing Checklist

- [ ] Browse site in incognito - no cookies set
- [ ] Submit inquiry - verify encryption in database
- [ ] Request data export - verify completeness
- [ ] Request deletion - verify removal
- [ ] Check network tab - no third-party requests
- [ ] Verify CSP blocks injected tracking scripts
- [ ] Test privacy dashboard email lookup flow

---

*This infrastructure is foundational. Complete before building inquiry forms or user accounts.*
