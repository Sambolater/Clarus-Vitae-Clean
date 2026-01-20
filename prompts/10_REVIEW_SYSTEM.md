# 10 - REVIEW SYSTEM
## Outcome-Focused Guest Reviews

> **Reference**: See `00_MASTER_PROJECT_BRIEF.md` Section "Outcome-Focused Reviews: Did It Work?" for review philosophy and dimensions.

---

## Task Objective

Build a review system that asks "Did it work?" rather than "Was it nice?" - capturing outcome-focused feedback that helps users evaluate whether a property can deliver the health results they're seeking.

---

## Review Philosophy (From Brief)

Standard hospitality reviews ask "Was it nice?" This audience asks "Did it work?"

**What makes our reviews different**:
- Focus on health outcomes, not just experience quality
- Measurable results tracking (optional, self-reported)
- Follow-up reviews at 30/90/180 days
- Team member reviews clearly distinguished
- Verification of actual stays

---

## Deliverables

### 1. Review Data Structure

```typescript
// packages/types/src/reviews.ts

export interface Review {
  id: string;
  propertyId: string;
  programId?: string;
  
  // Reviewer info (encrypted in storage)
  reviewerDisplayName: string;  // "Sarah M.", "Verified Guest", etc.
  
  // Visit details
  visitDate: Date;
  stayDuration: number;  // days
  programType: string;
  
  // Is this from our team?
  isTeamReview: boolean;
  teamMemberId?: string;
  visitCircumstances?: string;  // "Invited visit", "Paid independently"
  
  // Standard rating (1-5)
  ratingOverall: number;
  
  // Outcome ratings (1-5) - for Tier 1 & 2 primarily
  outcomeRatings: OutcomeRatings;
  
  // Experience ratings (1-5)
  experienceRatings: ExperienceRatings;
  
  // Text content
  title: string;
  reviewText: string;
  pros?: string;
  cons?: string;
  
  // Measurable outcomes (optional)
  outcomes?: MeasurableOutcomes;
  
  // Follow-ups
  followUps?: FollowUpReviews;
  
  // Verification
  isVerifiedStay: boolean;
  verificationMethod?: string;
  
  // Status
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  
  createdAt: Date;
  updatedAt: Date;
}

export interface OutcomeRatings {
  goalAchievement: number;        // "Did you achieve your stated health goals?"
  protocolQuality: number;         // "How comprehensive was your personalized protocol?"
  followupQuality: number;         // "How useful was the take-home/follow-up guidance?"
  physicianEndorsement: number;    // "Would your personal physician endorse this program?"
}

export interface ExperienceRatings {
  facilities: number;
  service: number;
  food: number;
  value: number;
}

export interface MeasurableOutcomes {
  // Biomarker changes
  biomarkers?: Array<{
    name: string;          // e.g., "HbA1c", "LDL", "Cortisol"
    before: number;
    after: number;
    unit: string;
  }>;
  
  // Biological age
  biologicalAgeChange?: number;  // Negative = improvement
  
  // Weight
  weightChange?: number;  // kg, negative = loss
  
  // Subjective improvements
  energyLevelChange?: number;      // -5 to +5
  sleepQualityChange?: number;     // -5 to +5
  stressLevelChange?: number;      // -5 to +5
  painLevelChange?: number;        // -5 to +5
  
  // Other
  customOutcomes?: Array<{
    description: string;
    change: string;
  }>;
}

export interface FollowUpReviews {
  thirtyDays?: FollowUpEntry;
  ninetyDays?: FollowUpEntry;
  oneEightyDays?: FollowUpEntry;
}

export interface FollowUpEntry {
  date: Date;
  resultsSustained: 'fully' | 'mostly' | 'partially' | 'not_sustained';
  notes: string;
  updatedOutcomes?: Partial<MeasurableOutcomes>;
}
```

### 2. Review Submission Form

```typescript
// apps/web/components/reviews/ReviewSubmissionForm.tsx

interface ReviewSubmissionFormProps {
  propertyId: string;
  propertyName: string;
  propertyTier: PropertyTier;
  programs?: Program[];
}

/**
 * Multi-step review submission form
 * Steps adapt based on property tier
 */
export function ReviewSubmissionForm({
  propertyId,
  propertyName,
  propertyTier,
  programs
}: ReviewSubmissionFormProps) {
  // Step 1: Visit Details
  // Step 2: Outcome Ratings (Tier 1 & 2) or Experience Ratings (Tier 3)
  // Step 3: Written Review
  // Step 4: Measurable Outcomes (Optional)
  // Step 5: Contact Info & Verification
}
```

**Form Steps Detail**:

**Step 1: Visit Details**
```
- When did you visit? (date picker)
- How long was your stay? (number of days)
- Which program did you complete? (dropdown or "General stay")
- Is this your first visit? (yes/no)
```

**Step 2: Outcome Ratings** (Tier 1 & 2)
```
Goal Achievement
"Did you achieve your stated health goals?"
[1] Far below expectations → [5] Exceeded all expectations

Protocol Quality  
"How comprehensive and personalized was your treatment protocol?"
[1] Generic, one-size-fits-all → [5] Deeply personalized to my needs

Follow-up Quality
"How useful was the take-home guidance and follow-up support?"
[1] Minimal or none → [5] Comprehensive and actionable

Physician Endorsement
"Would your personal physician endorse this program?"
[1] Definitely not → [5] Absolutely, evidence-based approach
```

**Step 2 Alternative: Experience Ratings** (Tier 3)
```
Facilities
Service
Food & Dining
Value for Money
Overall Wellness Experience
```

**Step 3: Written Review**
```
- Title for your review
- Your experience (text area)
- What went well? (pros)
- What could be improved? (cons)
```

**Step 4: Measurable Outcomes** (Optional)
```
"Help future guests by sharing your results. All fields optional."

Biomarker Changes (add multiple)
- Biomarker name
- Before value
- After value

Other Improvements
- Energy level change (slider -5 to +5)
- Sleep quality change (slider)
- Stress level change (slider)

Custom Outcomes (free text)
```

**Step 5: Contact & Verification**
```
- Display name preference: "Sarah M." / "Verified Guest" / Custom
- Email (for verification, encrypted)
- Consent checkboxes:
  [ ] I consent to my review being published
  [ ] Contact me for follow-up reviews at 30/90/180 days
  [ ] I confirm this review reflects my genuine experience
```

### 3. Review Display Components

```typescript
// packages/ui/src/components/reviews/ReviewCard.tsx

interface ReviewCardProps {
  review: Review;
  variant?: 'compact' | 'full';
  showOutcomes?: boolean;
}

/**
 * Individual review display
 * Shows outcome focus prominently
 */
export function ReviewCard({ review, variant = 'compact', showOutcomes = true }: ReviewCardProps) {
  return (
    <div>
      {/* Header: Name, date, stay duration, verified badge */}
      <ReviewHeader review={review} />
      
      {/* Team review badge if applicable */}
      {review.isTeamReview && <TeamReviewBadge review={review} />}
      
      {/* Outcome ratings visualization */}
      {showOutcomes && <OutcomeRatingsDisplay ratings={review.outcomeRatings} />}
      
      {/* Review text */}
      <ReviewContent review={review} truncate={variant === 'compact'} />
      
      {/* Measurable outcomes if provided */}
      {review.outcomes && <MeasurableOutcomesDisplay outcomes={review.outcomes} />}
      
      {/* Follow-up status */}
      {review.followUps && <FollowUpStatus followUps={review.followUps} />}
    </div>
  );
}
```

```typescript
// packages/ui/src/components/reviews/OutcomeRatingsDisplay.tsx

interface OutcomeRatingsDisplayProps {
  ratings: OutcomeRatings;
  layout?: 'horizontal' | 'vertical' | 'compact';
}

/**
 * Visual display of outcome ratings
 * Different from typical star ratings
 */
export function OutcomeRatingsDisplay({ ratings, layout = 'horizontal' }: OutcomeRatingsDisplayProps) {
  const dimensions = [
    { key: 'goalAchievement', label: 'Goals Achieved', icon: 'target' },
    { key: 'protocolQuality', label: 'Protocol Quality', icon: 'clipboard' },
    { key: 'followupQuality', label: 'Follow-up Support', icon: 'refresh' },
    { key: 'physicianEndorsement', label: 'Medical Credibility', icon: 'stethoscope' }
  ];
  
  // Render as bars, circles, or numeric display based on layout
}
```

```typescript
// packages/ui/src/components/reviews/MeasurableOutcomesDisplay.tsx

interface MeasurableOutcomesDisplayProps {
  outcomes: MeasurableOutcomes;
}

/**
 * Display self-reported measurable outcomes
 * Shows before/after comparisons
 * Clearly labeled as self-reported
 */
export function MeasurableOutcomesDisplay({ outcomes }: MeasurableOutcomesDisplayProps) {
  return (
    <div>
      <h4>Reported Outcomes <span className="text-sm text-gray-500">(self-reported)</span></h4>
      
      {/* Biomarker changes as before/after cards */}
      {outcomes.biomarkers?.map(b => (
        <BiomarkerChangeCard key={b.name} biomarker={b} />
      ))}
      
      {/* Subjective changes as +/- indicators */}
      <SubjectiveChangesGrid outcomes={outcomes} />
    </div>
  );
}
```

```typescript
// packages/ui/src/components/reviews/TeamReviewBadge.tsx

interface TeamReviewBadgeProps {
  review: Review;
}

/**
 * Clearly identifies team member reviews
 * Shows who visited, circumstances, and credentials
 */
export function TeamReviewBadge({ review }: TeamReviewBadgeProps) {
  // "Reviewed by [Name], [Title]"
  // "Visit type: [Paid independently / Invited visit / Full program evaluation]"
  // Link to team member profile
}
```

### 4. Review Aggregation & Summaries

```typescript
// packages/ui/src/components/reviews/ReviewSummary.tsx

interface ReviewSummaryProps {
  propertyId: string;
  reviews: Review[];
}

/**
 * Aggregated review summary for property pages
 * Shows outcome-focused metrics prominently
 */
export function ReviewSummary({ propertyId, reviews }: ReviewSummaryProps) {
  const summary = calculateReviewSummary(reviews);
  
  return (
    <div>
      {/* Overall and outcome averages */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard label="Overall" value={summary.overallAverage} />
        <MetricCard label="Goals Achieved" value={summary.goalAchievementAvg} />
        <MetricCard label="Protocol Quality" value={summary.protocolQualityAvg} />
        <MetricCard label="Follow-up Support" value={summary.followupQualityAvg} />
        <MetricCard label="Medical Credibility" value={summary.physicianEndorsementAvg} />
      </div>
      
      {/* Review count and verified percentage */}
      <p>{summary.totalReviews} reviews ({summary.verifiedPercentage}% verified stays)</p>
      
      {/* Results sustainability */}
      <ResultsSustainabilityChart followUps={summary.followUpData} />
      
      {/* Team reviews highlight */}
      {summary.teamReviewCount > 0 && (
        <TeamReviewsHighlight count={summary.teamReviewCount} />
      )}
    </div>
  );
}

function calculateReviewSummary(reviews: Review[]) {
  // Calculate all averages
  // Count verified vs unverified
  // Aggregate follow-up data
  // Identify team reviews
}
```

### 5. Follow-Up Review System

```typescript
// apps/web/app/api/reviews/followup/route.ts

/**
 * System for collecting follow-up reviews
 * - Automated email reminders at 30/90/180 days (if consented)
 * - Unique secure links for each follow-up
 * - Track results sustainability over time
 */

// Email templates for follow-up requests
const FOLLOWUP_TEMPLATES = {
  thirtyDays: {
    subject: "How are your results holding up? (30-day check-in)",
    body: "..."
  },
  ninetyDays: {
    subject: "90 days later: Are you still seeing benefits?",
    body: "..."
  },
  oneEightyDays: {
    subject: "6-month follow-up: Long-term results check",
    body: "..."
  }
};
```

```typescript
// apps/web/components/reviews/FollowUpForm.tsx

interface FollowUpFormProps {
  originalReview: Review;
  followUpPeriod: '30' | '90' | '180';
}

/**
 * Streamlined follow-up review form
 * Much shorter than original review
 */
export function FollowUpForm({ originalReview, followUpPeriod }: FollowUpFormProps) {
  return (
    <form>
      {/* Results sustainability */}
      <RadioGroup
        label="How well have your results sustained?"
        options={[
          { value: 'fully', label: 'Fully sustained - still experiencing all benefits' },
          { value: 'mostly', label: 'Mostly sustained - most benefits continue' },
          { value: 'partially', label: 'Partially sustained - some benefits faded' },
          { value: 'not_sustained', label: 'Not sustained - benefits have faded' }
        ]}
      />
      
      {/* Optional: Updated biomarkers */}
      <OptionalSection label="Update any biomarkers?">
        {/* Biomarker update fields */}
      </OptionalSection>
      
      {/* Notes */}
      <textarea label="Any additional notes on your long-term experience?" />
    </form>
  );
}
```

### 6. Review Filtering & Sorting

```typescript
// packages/ui/src/components/reviews/ReviewFilters.tsx

interface ReviewFiltersProps {
  onFilterChange: (filters: ReviewFilters) => void;
}

interface ReviewFilters {
  sortBy: 'recent' | 'highest_outcome' | 'most_helpful' | 'verified_only';
  programType?: string;
  ratingMin?: number;
  timeframe?: '6months' | '1year' | '2years' | 'all';
  hasOutcomes?: boolean;
  teamReviewsOnly?: boolean;
}

/**
 * Filter and sort controls for review listings
 */
export function ReviewFilters({ onFilterChange }: ReviewFiltersProps) {
  // Sort dropdown
  // Filter checkboxes/dropdowns
  // "Show only verified" toggle
  // "With measurable outcomes" toggle
}
```

### 7. Review Verification System

```typescript
// packages/database/src/services/review-verification.ts

interface VerificationRequest {
  reviewId: string;
  method: 'email' | 'booking_confirmation' | 'property_confirm';
}

/**
 * Verify that reviewer actually stayed at property
 */
export async function verifyReview(request: VerificationRequest): Promise<boolean> {
  switch (request.method) {
    case 'email':
      // Send verification email with unique link
      break;
    case 'booking_confirmation':
      // User uploads booking confirmation (blurred personal details)
      break;
    case 'property_confirm':
      // Property confirms guest stayed (for partners)
      break;
  }
}
```

### 8. Review Moderation

```typescript
// apps/admin/components/reviews/ReviewModeration.tsx

/**
 * Admin interface for review moderation
 * - Queue of pending reviews
 * - Flag suspicious content
 * - Approve/reject with notes
 * - Edit for clarity (with disclosure)
 */

interface ModerationAction {
  reviewId: string;
  action: 'approve' | 'reject' | 'flag' | 'edit';
  notes: string;
  editedContent?: Partial<Review>;
}
```

---

## Review Guidelines (Display to Users)

```markdown
## Review Guidelines

### What Makes a Helpful Review

**Do share:**
- Specific health goals you had and whether they were met
- Details about your personalized protocol
- Measurable outcomes (biomarkers, weight, energy levels)
- Quality of medical staff and their attention
- Follow-up support you received
- Whether you'd return or recommend to others

**Please don't:**
- Include identifying information about other guests
- Share specific medical advice
- Review a property you haven't visited
- Write reviews for compensation (other than our verification incentives)

### Verification

Reviews marked "Verified Stay" have been confirmed through:
- Email verification
- Booking confirmation
- Property confirmation

### Team Reviews

Our advisory team members also write reviews. These are always clearly marked 
and disclose whether the visit was paid independently or hosted by the property.
```

---

## Acceptance Criteria

- [ ] Review submission form works for all property tiers
- [ ] Outcome ratings display correctly
- [ ] Measurable outcomes can be entered and displayed
- [ ] Team reviews clearly distinguished
- [ ] Review summary aggregates correctly
- [ ] Follow-up emails send at correct intervals
- [ ] Follow-up form captures sustainability data
- [ ] Verification flow works
- [ ] Review filters and sorting work
- [ ] Reviews display well on property pages
- [ ] Mobile-friendly review submission
- [ ] Moderation queue functional

---

## Notes

- Outcome ratings are more important than experience ratings for Tier 1 & 2
- Always label measurable outcomes as "self-reported"
- Follow-up reviews are key differentiator - invest in good UX
- Consider incentives for follow-up completion (non-monetary)
- Future: Aggregate outcome trends across properties

---

*The review system should help users answer "Will this work for me?" not just "Is this nice?"*
