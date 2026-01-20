# 11 - INQUIRY SYSTEM
## Lead Capture & Property Connection

> **Reference**: See `00_MASTER_PROJECT_BRIEF.md` for business model (lead generation) and privacy requirements (encrypted handling, secure channels).

---

## Task Objective

Build the inquiry system that connects interested users with properties while maintaining strict privacy standards. This is the primary revenue mechanism - handle it with care for both user privacy and business viability.

---

## Business Context

- Lead generation fees: $200-$2,000 per qualified inquiry
- Direct affiliate partnerships: 5-15% commissions
- User trust is paramount - one privacy breach destroys the business
- Properties want qualified leads, not spam

---

## Deliverables

### 1. Inquiry Types

```typescript
// packages/types/src/inquiries.ts

export type InquiryType = 
  | 'standard'      // Normal encrypted inquiry
  | 'secure'        // Enhanced privacy, minimal data retention
  | 'consultation'; // Phase 2: Paid advisory service

export interface InquiryInput {
  // Required
  propertyId: string;
  name: string;
  email: string;
  inquiryType: InquiryType;
  consentContactProperty: boolean;
  
  // Optional
  phone?: string;
  programId?: string;
  message?: string;
  preferredDates?: string;
  budgetRange?: string;
  focusAreas?: string[];
  
  // Privacy
  consentFollowup: boolean;
  
  // For secure inquiries
  alternativeContactMethod?: 'signal' | 'secure_callback';
  alternativeContactValue?: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  programId?: string;
  inquiryType: InquiryType;
  
  // Status tracking
  status: InquiryStatus;
  statusHistory: StatusChange[];
  
  // Timestamps
  createdAt: Date;
  sentToPropertyAt?: Date;
  propertyResponseAt?: Date;
  conversionConfirmedAt?: Date;
  
  // Deletion
  deletionRequestedAt?: Date;
  scheduledDeletionAt?: Date;
}

export type InquiryStatus = 
  | 'new'
  | 'sent_to_property'
  | 'property_viewed'
  | 'property_responded'
  | 'converted'
  | 'closed'
  | 'deleted';

export interface StatusChange {
  from: InquiryStatus;
  to: InquiryStatus;
  timestamp: Date;
  notes?: string;
}
```

### 2. Standard Inquiry Form

```typescript
// apps/web/components/inquiries/InquiryForm.tsx

interface InquiryFormProps {
  property: Property;
  program?: Program;
  variant?: 'modal' | 'inline' | 'page';
}

/**
 * Standard inquiry form
 * Clean, minimal, privacy-focused
 */
export function InquiryForm({ property, program, variant = 'modal' }: InquiryFormProps) {
  return (
    <form onSubmit={handleSubmit}>
      {/* Property context */}
      <PropertyHeader property={property} program={program} />
      
      {/* Contact info */}
      <Input name="name" label="Your Name" required />
      <Input name="email" type="email" label="Email" required />
      <Input name="phone" type="tel" label="Phone (optional)" />
      
      {/* Inquiry details */}
      <Textarea 
        name="message" 
        label="Tell us about your goals"
        placeholder="What are you hoping to achieve? Any specific health concerns or interests?"
      />
      
      <Input name="preferredDates" label="Preferred dates (optional)" />
      
      <Select name="budgetRange" label="Budget range (optional)">
        <option value="">Prefer not to say</option>
        <option value="under_10k">Under $10,000</option>
        <option value="10k_25k">$10,000 - $25,000</option>
        <option value="25k_50k">$25,000 - $50,000</option>
        <option value="50k_100k">$50,000 - $100,000</option>
        <option value="over_100k">$100,000+</option>
      </Select>
      
      {/* Focus areas multi-select */}
      <FocusAreaSelector name="focusAreas" label="Areas of interest" />
      
      {/* Consent */}
      <ConsentCheckboxes />
      
      {/* Privacy note */}
      <PrivacyNote />
      
      {/* Submit */}
      <Button type="submit">Send Inquiry</Button>
      
      {/* Secure option link */}
      <SecureInquiryOption propertyId={property.id} />
    </form>
  );
}
```

### 3. Secure Inquiry Option

```typescript
// apps/web/components/inquiries/SecureInquiryForm.tsx

interface SecureInquiryFormProps {
  property: Property;
}

/**
 * Enhanced privacy inquiry form
 * For sensitive situations (addiction, mental health, discretion-critical)
 */
export function SecureInquiryForm({ property }: SecureInquiryFormProps) {
  return (
    <form>
      <SecureInquiryExplanation />
      
      {/* Minimal required info */}
      <Input name="name" label="Name or pseudonym" required />
      
      {/* Alternative contact methods */}
      <RadioGroup name="contactMethod" label="Preferred contact method">
        <Radio value="email">Encrypted email</Radio>
        <Radio value="signal">Signal (most secure)</Radio>
        <Radio value="secure_callback">Secure callback</Radio>
      </RadioGroup>
      
      {/* Contact value based on method */}
      <ConditionalContactInput />
      
      {/* Message */}
      <Textarea 
        name="message" 
        label="Your inquiry (encrypted)"
        placeholder="Share only what you're comfortable sharing"
      />
      
      {/* Enhanced privacy options */}
      <Checkbox name="autoDelete">
        Auto-delete inquiry after property contact (7 days)
      </Checkbox>
      
      <Checkbox name="noFollowup">
        Do not contact me for any follow-up
      </Checkbox>
      
      <Button type="submit">Send Secure Inquiry</Button>
    </form>
  );
}

function SecureInquiryExplanation() {
  return (
    <div className="bg-slate-50 p-4 rounded">
      <h3>Enhanced Privacy Inquiry</h3>
      <ul>
        <li>Your inquiry is encrypted end-to-end</li>
        <li>We store minimal data</li>
        <li>Auto-deletion available</li>
        <li>Alternative contact methods supported</li>
        <li>No tracking of this page visit</li>
      </ul>
    </div>
  );
}
```

### 4. Consent Components

```typescript
// apps/web/components/inquiries/ConsentCheckboxes.tsx

export function ConsentCheckboxes() {
  return (
    <div className="space-y-3">
      {/* Required consent */}
      <Checkbox name="consentContactProperty" required>
        I consent to sharing my contact information with {propertyName} so they 
        can respond to my inquiry. <RequiredIndicator />
      </Checkbox>
      
      {/* Optional follow-up */}
      <Checkbox name="consentFollowup">
        Clarus Vitae may contact me for feedback after my visit (optional)
      </Checkbox>
      
      {/* Privacy policy acknowledgment */}
      <p className="text-sm text-gray-600">
        By submitting, you agree to our{' '}
        <Link href="/privacy">Privacy Policy</Link>. Your information is 
        encrypted and only shared with the specific property you're inquiring about.
      </p>
    </div>
  );
}
```

### 5. Privacy Note Component

```typescript
// apps/web/components/inquiries/PrivacyNote.tsx

export function PrivacyNote() {
  return (
    <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded border border-emerald-100">
      <ShieldIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-medium text-emerald-800">Your Privacy Protected</p>
        <ul className="text-emerald-700 mt-1 space-y-1">
          <li>✓ Information encrypted before storage</li>
          <li>✓ Shared only with this property</li>
          <li>✓ Never sold to third parties</li>
          <li>✓ Delete anytime in Privacy Dashboard</li>
        </ul>
        <p className="mt-2">
          <Link href="/privacy/dashboard" className="underline">
            Manage your data
          </Link>
          {' | '}
          <button 
            type="button" 
            onClick={() => openSecureInquiry()}
            className="underline"
          >
            Need extra privacy?
          </button>
        </p>
      </div>
    </div>
  );
}
```

### 6. Inquiry API Endpoints

```typescript
// apps/web/app/api/inquiries/route.ts

import { encryptPII } from '@clarus/utils/privacy';
import { createInquiry, notifyProperty } from '@clarus/database';

export async function POST(request: Request) {
  const body = await request.json();
  
  // Validate required fields
  if (!body.propertyId || !body.name || !body.email || !body.consentContactProperty) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  
  // Encrypt PII before storage
  const encryptedInquiry = {
    property_id: body.propertyId,
    program_id: body.programId,
    inquiry_type: body.inquiryType || 'standard',
    name_encrypted: await encryptPII(body.name, process.env.ENCRYPTION_KEY!),
    email_encrypted: await encryptPII(body.email, process.env.ENCRYPTION_KEY!),
    phone_encrypted: body.phone 
      ? await encryptPII(body.phone, process.env.ENCRYPTION_KEY!) 
      : null,
    message_encrypted: body.message 
      ? await encryptPII(body.message, process.env.ENCRYPTION_KEY!) 
      : null,
    preferred_dates: body.preferredDates,
    budget_range: body.budgetRange,
    focus_areas: body.focusAreas,
    consent_contact_property: body.consentContactProperty,
    consent_followup: body.consentFollowup,
    status: 'new'
  };
  
  // Store inquiry
  const inquiry = await createInquiry(encryptedInquiry);
  
  // Queue notification to property (async)
  await queuePropertyNotification(inquiry.id);
  
  // Send confirmation to user
  await sendUserConfirmation(body.email, inquiry.id);
  
  return Response.json({ 
    success: true, 
    inquiryId: inquiry.id,
    message: 'Your inquiry has been sent. The property will contact you directly.'
  });
}
```

```typescript
// apps/web/app/api/inquiries/secure/route.ts

/**
 * Secure inquiry endpoint
 * Additional protections:
 * - No request logging
 * - Immediate encryption
 * - Minimal data retention
 * - Alternative contact methods
 */

export async function POST(request: Request) {
  // Disable logging for this request
  const body = await request.json();
  
  // Validate
  if (!body.propertyId || !body.name || !body.contactMethod) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  
  // For Signal/secure callback, validate contact value
  if (body.contactMethod !== 'email' && !body.contactValue) {
    return Response.json({ error: 'Contact value required' }, { status: 400 });
  }
  
  // Create with secure flag
  const inquiry = await createSecureInquiry({
    ...body,
    inquiryType: 'secure',
    autoDelete: body.autoDelete,
    noFollowup: body.noFollowup
  });
  
  // If auto-delete requested, schedule deletion
  if (body.autoDelete) {
    await scheduleInquiryDeletion(inquiry.id, 7); // 7 days
  }
  
  return Response.json({
    success: true,
    inquiryId: inquiry.id,
    message: 'Your secure inquiry has been sent.'
  });
}
```

### 7. Property Notification Service

```typescript
// packages/database/src/services/inquiry-notification.ts

interface PropertyNotification {
  inquiryId: string;
  propertyId: string;
  decryptedData: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
    preferredDates?: string;
    budgetRange?: string;
    focusAreas?: string[];
  };
}

/**
 * Send inquiry to property
 * Options:
 * 1. Email to property contact
 * 2. API push (for integrated partners)
 * 3. Webhook (for CRM integrations)
 */
export async function notifyProperty(inquiryId: string): Promise<void> {
  const inquiry = await getInquiry(inquiryId);
  const property = await getProperty(inquiry.property_id);
  
  // Decrypt PII for sending to property
  const decryptedData = await decryptInquiryPII(inquiry);
  
  // Determine notification method
  if (property.notification_method === 'api') {
    await sendViaAPI(property.api_endpoint, decryptedData);
  } else if (property.notification_method === 'webhook') {
    await sendViaWebhook(property.webhook_url, decryptedData);
  } else {
    await sendViaEmail(property.inquiry_email, decryptedData);
  }
  
  // Update inquiry status
  await updateInquiryStatus(inquiryId, 'sent_to_property');
}
```

### 8. Inquiry Confirmation Email

```typescript
// packages/utils/src/email/templates/inquiry-confirmation.ts

export const inquiryConfirmationTemplate = {
  subject: 'Your inquiry to {propertyName} has been sent',
  
  body: `
    Hi {name},
    
    Your inquiry to {propertyName} has been submitted successfully.
    
    What happens next:
    - The property will receive your inquiry within 24 hours
    - They will contact you directly at {email}
    - Most properties respond within 2-3 business days
    
    Your inquiry reference: {inquiryId}
    
    Manage your data:
    You can view, export, or delete your inquiry data anytime at:
    {privacyDashboardUrl}
    
    Questions about Clarus Vitae? Reply to this email.
    
    Best,
    The Clarus Vitae Team
  `
};
```

### 9. Inquiry Status Tracking

```typescript
// apps/web/app/api/inquiries/[id]/status/route.ts

/**
 * Endpoint for properties to update inquiry status
 * Used for lead attribution and analytics
 */

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Authenticate property (API key or session)
  const apiKey = request.headers.get('X-Property-API-Key');
  if (!apiKey || !(await validatePropertyAPIKey(apiKey, params.id))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { status, notes } = await request.json();
  
  // Validate status transition
  const validStatuses = ['property_viewed', 'property_responded', 'converted', 'closed'];
  if (!validStatuses.includes(status)) {
    return Response.json({ error: 'Invalid status' }, { status: 400 });
  }
  
  await updateInquiryStatus(params.id, status, notes);
  
  return Response.json({ success: true });
}
```

### 10. Lead Attribution Dashboard (Admin)

```typescript
// apps/admin/pages/inquiries/index.tsx

/**
 * Admin dashboard for inquiry/lead management
 * - View all inquiries (encrypted, decryption on demand)
 * - Filter by property, status, date
 * - Track conversions
 * - Generate revenue reports
 */

interface InquiryDashboard {
  totalInquiries: number;
  byStatus: Record<InquiryStatus, number>;
  byProperty: Array<{ propertyId: string; count: number }>;
  conversionRate: number;
  revenueGenerated: number;  // Based on commission structure
}
```

### 11. Batch Inquiry (From Comparison)

```typescript
// apps/web/components/inquiries/BatchInquiryForm.tsx

interface BatchInquiryFormProps {
  properties: Property[];
}

/**
 * Send inquiry to multiple properties at once
 * From comparison tool
 */
export function BatchInquiryForm({ properties }: BatchInquiryFormProps) {
  return (
    <form>
      <h2>Inquire About {properties.length} Properties</h2>
      
      {/* List properties being inquired about */}
      <PropertyList properties={properties} />
      
      {/* Single form for all */}
      <Input name="name" label="Your Name" required />
      <Input name="email" label="Email" required />
      <Input name="phone" label="Phone (optional)" />
      
      <Textarea 
        name="message" 
        label="Your inquiry"
        placeholder="This message will be sent to all selected properties"
      />
      
      {/* Per-property consent */}
      <div className="space-y-2">
        <p className="font-medium">Send inquiry to:</p>
        {properties.map(p => (
          <Checkbox key={p.id} name={`consent_${p.id}`} defaultChecked>
            {p.name}
          </Checkbox>
        ))}
      </div>
      
      <ConsentCheckboxes isBatch />
      
      <Button type="submit">Send to {properties.length} Properties</Button>
    </form>
  );
}
```

---

## Inquiry Flow Diagram

```
User browses property
        ↓
Clicks "Inquire" / "Contact Property"
        ↓
Standard Form ←→ Secure Form option
        ↓
Fills form, provides consent
        ↓
Submit
        ↓
┌─────────────────────────────────────┐
│ API: Encrypt PII, Store inquiry     │
│ Status: 'new'                       │
└─────────────────────────────────────┘
        ↓
User confirmation email sent
        ↓
Property notification queued
        ↓
┌─────────────────────────────────────┐
│ Property receives inquiry           │
│ Status: 'sent_to_property'          │
└─────────────────────────────────────┘
        ↓
Property contacts user directly
        ↓
┌─────────────────────────────────────┐
│ Property updates status (optional)  │
│ Status: 'property_responded'        │
└─────────────────────────────────────┘
        ↓
Conversion confirmed (for attribution)
        ↓
┌─────────────────────────────────────┐
│ Commission/lead fee processed       │
│ Status: 'converted'                 │
└─────────────────────────────────────┘
```

---

## Acceptance Criteria

- [ ] Standard inquiry form submits successfully
- [ ] Secure inquiry form works with all contact methods
- [ ] PII encrypted before database storage
- [ ] Property receives inquiry notification
- [ ] User receives confirmation email
- [ ] Inquiry status trackable
- [ ] Batch inquiry works from comparison
- [ ] Consent checkboxes required and recorded
- [ ] Privacy note displays correctly
- [ ] Auto-delete works for secure inquiries
- [ ] Admin can view inquiry dashboard
- [ ] Lead attribution tracks conversions

---

## Notes

- Never store PII unencrypted
- Properties must not receive browsing history or other inquiries
- User can delete inquiry anytime via Privacy Dashboard
- Consider rate limiting to prevent spam
- Future: CRM integrations for partner properties

---

*The inquiry system is the revenue engine. Balance conversion optimization with privacy protection.*
