# 02 - DATABASE SCHEMA & PRISMA SETUP
## Clarus Vitae Platform - Data Foundation

> **Estimated Time**: 3-4 hours
> **Dependencies**: Task 01 (Repository Setup)
> **Blocks**: Task 04 (Property Profiles), Task 05 (Treatment Database), Task 08 (Review System)

---

## Objective

Design and implement the complete PostgreSQL database schema using Prisma ORM. This schema must support all current MVP features AND accommodate future features without requiring breaking migrations.

---

## Context

Clarus Vitae is a premium wellness research platform with three property tiers:
- **Tier 1**: Medical Longevity ($20K-$150K) - Clinique La Prairie, Lanserhof, SHA
- **Tier 2**: Integrated Wellness ($5K-$30K) - Chiva-Som, Kamalaya, Canyon Ranch  
- **Tier 3**: Luxury Destination ($3K-$15K) - Aman, Four Seasons, Six Senses

The platform features:
- Proprietary "Clarus Index" scoring system
- Treatment-first discovery (users search by treatment, not just location)
- Dark data (proprietary info properties don't publish)
- Outcome-focused reviews
- Privacy-first lead capture

---

## Schema Requirements

### Core Entities

#### Properties
```prisma
model Property {
  id                    String   @id @default(cuid())
  slug                  String   @unique
  name                  String
  description           String   @db.Text
  
  // Location
  city                  String
  country               String
  region                String?
  latitude              Float?
  longitude             Float?
  nearestAirport        String?
  transferTime          String?
  
  // Classification
  tier                  PropertyTier  // TIER_1, TIER_2, TIER_3
  approach              WellnessApproach  // CLINICAL, INTEGRATIVE, HOLISTIC, LIFESTYLE
  focusAreas            FocusArea[]
  
  // Pricing
  priceMin              Int
  priceMax              Int
  currency              String   @default("USD")
  
  // Details
  website               String?
  contactEmail          String?
  contactPhone          String?
  foundedYear           Int?
  capacity              Int?      // rooms/guests
  accommodationType     String?
  diningDescription     String?  @db.Text
  facilitiesDescription String?  @db.Text
  setting               String?   // Beachfront, Mountain, Urban, etc.
  
  // Clarus Index Scores (calculated, stored for performance)
  overallScore          Float?
  clinicalRigorScore    Float?
  outcomeEvidenceScore  Float?
  programDepthScore     Float?
  experienceQualityScore Float?
  valueAlignmentScore   Float?
  
  // Dark Data (proprietary)
  physicianPatientRatio String?
  avgBookingLeadTime    String?
  returnGuestPercentage Int?
  staffTenure           String?
  actualCustomization   String?  @db.Text
  postVisitFollowup     String?  @db.Text
  discretionLevel       DiscretionLevel?
  
  // Cultural Fit
  genderSeparatedFacilities GenderSeparation?
  religiousDietaryOptions   String[]
  privacyArchitecture       String?
  prayerFacilities          String?
  languagesMedical          String[]
  languagesService          String[]
  soloTravelerFriendly      SoloFriendliness?
  lgbtqWelcoming            LGBTQWelcoming?
  
  // Partnership
  partnershipStatus     PartnershipStatus @default(NONE)
  affiliateLink         String?
  leadGenAgreement      Boolean  @default(false)
  verifiedByProperty    Boolean  @default(false)
  lastPropertyContact   DateTime?
  
  // Metadata
  published             Boolean  @default(false)
  featured              Boolean  @default(false)
  editorChoice          String?  // "Best for Executive Burnout", etc.
  verifiedExcellence    Boolean  @default(false)  // Team completed program
  risingStar            Boolean  @default(false)
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  // Relations
  programs              Program[]
  treatments            PropertyTreatment[]
  diagnostics           PropertyDiagnostic[]
  images                PropertyImage[]
  reviews               Review[]
  inquiries             Inquiry[]
  tierOneDetails        TierOneDetails?
  
  @@index([tier])
  @@index([country])
  @@index([published])
  @@index([overallScore])
}

model TierOneDetails {
  id                    String   @id @default(cuid())
  propertyId            String   @unique
  property              Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  
  medicalDirector       String?
  medicalDirectorCreds  String?
  medicalTeamSize       Int?
  certifications        String[]
  hospitalAffiliations  String[]
  researchPublications  String[]
}
```

#### Programs
```prisma
model Program {
  id                String   @id @default(cuid())
  propertyId        String
  property          Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  
  name              String
  description       String   @db.Text
  durationDays      Int
  price             Int
  currency          String   @default("USD")
  
  focusAreas        FocusArea[]
  inclusions        String[]
  exclusions        String[]
  typicalSchedule   String?  @db.Text
  
  published         Boolean  @default(true)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([propertyId])
}
```

#### Treatments & Diagnostics
```prisma
model Treatment {
  id                String   @id @default(cuid())
  slug              String   @unique
  name              String
  aliases           String[]
  category          TreatmentCategory
  
  description       String   @db.Text
  howItWorks        String?  @db.Text
  whatItAddresses   String[]
  evidenceLevel     EvidenceLevel
  evidenceSummary   String?  @db.Text
  
  typicalProtocol   String?  @db.Text
  priceRangeMin     Int?
  priceRangeMax     Int?
  
  potentialRisks    String?  @db.Text
  contraindications String[]
  
  published         Boolean  @default(true)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  properties        PropertyTreatment[]
  equipment         TreatmentEquipment[]
  
  @@index([category])
  @@index([evidenceLevel])
}

model Diagnostic {
  id                String   @id @default(cuid())
  slug              String   @unique
  name              String
  category          DiagnosticCategory
  
  description       String   @db.Text
  whatItMeasures    String   @db.Text
  
  published         Boolean  @default(true)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  properties        PropertyDiagnostic[]
}

model Equipment {
  id                String   @id @default(cuid())
  slug              String   @unique
  name              String
  brand             String?
  model             String?
  category          EquipmentCategory
  
  description       String   @db.Text
  capabilities      String[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  treatments        TreatmentEquipment[]
  properties        PropertyEquipment[]
}

// Junction Tables
model PropertyTreatment {
  propertyId        String
  treatmentId       String
  property          Property  @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  treatment         Treatment @relation(fields: [treatmentId], references: [id], onDelete: Cascade)
  
  notes             String?
  priceAtProperty   Int?
  
  @@id([propertyId, treatmentId])
}

model PropertyDiagnostic {
  propertyId        String
  diagnosticId      String
  property          Property   @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  diagnostic        Diagnostic @relation(fields: [diagnosticId], references: [id], onDelete: Cascade)
  
  notes             String?
  
  @@id([propertyId, diagnosticId])
}

model PropertyEquipment {
  propertyId        String
  equipmentId       String
  property          Property  @relation(fields: [propertyId], references: [id])
  equipment         Equipment @relation(fields: [equipmentId], references: [id])
  
  installationYear  Int?
  notes             String?
  
  @@id([propertyId, equipmentId])
}

model TreatmentEquipment {
  treatmentId       String
  equipmentId       String
  treatment         Treatment @relation(fields: [treatmentId], references: [id])
  equipment         Equipment @relation(fields: [equipmentId], references: [id])
  
  @@id([treatmentId, equipmentId])
}
```

#### Reviews
```prisma
model Review {
  id                    String   @id @default(cuid())
  propertyId            String
  property              Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  
  // Reviewer (optional user link for future)
  userId                String?
  reviewerName          String?  // Can be anonymous
  isTeamReview          Boolean  @default(false)
  teamMemberId          String?
  teamMember            TeamMember? @relation(fields: [teamMemberId], references: [id])
  
  // Visit Context
  visitDate             DateTime
  programType           String
  stayLengthDays        Int
  statedGoals           String[]
  
  // Experience Ratings (1-5)
  overallRating         Int
  serviceRating         Int?
  facilitiesRating      Int?
  diningRating          Int?
  valueRating           Int?
  
  // Outcome Ratings (Tier 1 & 2)
  goalAchievement       GoalAchievement?  // FULLY, PARTIALLY, NOT_ACHIEVED
  protocolQualityRating Int?
  followupQualityRating Int?
  physicianEndorsement  PhysicianEndorsement?
  
  // Measurable Outcomes (optional self-report)
  bioAgeChange          Int?      // years, negative = improvement
  weightChange          Float?    // kg
  energyImprovement     Int?      // 1-10 scale
  sleepImprovement      Int?      // 1-10 scale
  specificOutcomes      String?   @db.Text
  
  // Written Review
  reviewText            String    @db.Text
  pros                  String[]
  cons                  String[]
  
  // Verification
  verified              Boolean   @default(false)
  verificationMethod    String?   // "receipt", "booking_confirmation"
  
  // Sustainability Follow-ups
  followUp30Days        String?   @db.Text
  followUp90Days        String?   @db.Text
  followUp180Days       String?   @db.Text
  
  // Moderation
  status                ReviewStatus @default(PENDING)
  moderationNotes       String?
  
  // Property Response
  propertyResponse      String?   @db.Text
  propertyRespondedAt   DateTime?
  
  helpfulCount          Int       @default(0)
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  @@index([propertyId])
  @@index([status])
  @@index([isTeamReview])
}
```

#### Inquiries (Lead Capture)
```prisma
model Inquiry {
  id                    String   @id @default(cuid())
  propertyId            String?
  property              Property? @relation(fields: [propertyId], references: [id])
  
  // Contact (encrypted in application layer)
  name                  String?   // Optional for anonymous
  email                 String    // Encrypted
  phone                 String?   // Encrypted
  preferredContact      ContactMethod @default(EMAIL)
  
  // Inquiry Details
  interestedProperties  String[]  // Property IDs if multiple
  dates                 String?
  datesFlexible         Boolean   @default(true)
  durationInterest      String?
  primaryGoals          String[]
  budgetRange           BudgetRange?
  additionalNotes       String?   @db.Text
  
  // Privacy Preferences
  anonymousInquiry      Boolean   @default(false)
  secureChannelRequest  Boolean   @default(false)
  
  // Attribution
  sourcePage            String?
  sourceUrl             String?
  utmSource             String?
  utmMedium             String?
  utmCampaign           String?
  
  // Processing
  status                InquiryStatus @default(NEW)
  assignedTo            String?
  propertyNotified      Boolean   @default(false)
  propertyNotifiedAt    DateTime?
  
  // Consent
  contactConsent        Boolean   @default(false)
  privacyPolicyAccepted Boolean   @default(false)
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  @@index([status])
  @@index([propertyId])
  @@index([createdAt])
}
```

#### Team Members
```prisma
model TeamMember {
  id                    String   @id @default(cuid())
  slug                  String   @unique
  name                  String
  title                 String
  
  bio                   String   @db.Text
  credentials           String[]
  specializations       String[]
  languages             String[]
  
  propertiesVisited     String[]  // Property IDs
  programsCompleted     Int       @default(0)
  
  photoUrl              String?
  linkedinUrl           String?
  
  published             Boolean   @default(true)
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  reviews               Review[]
  articles              Article[]
}
```

#### Content (Editorial)
```prisma
model Article {
  id                    String   @id @default(cuid())
  slug                  String   @unique
  title                 String
  
  excerpt               String?  @db.Text
  content               String   @db.Text  // Markdown or HTML
  
  authorId              String?
  author                TeamMember? @relation(fields: [authorId], references: [id])
  
  category              ArticleCategory
  tags                  String[]
  
  featuredImage         String?
  
  published             Boolean  @default(false)
  publishedAt           DateTime?
  
  seoTitle              String?
  seoDescription        String?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([category])
  @@index([published])
}
```

### Enums
```prisma
enum PropertyTier {
  TIER_1  // Medical Longevity
  TIER_2  // Integrated Wellness
  TIER_3  // Luxury Destination
}

enum WellnessApproach {
  CLINICAL
  INTEGRATIVE
  HOLISTIC
  LIFESTYLE
}

enum FocusArea {
  LONGEVITY
  DETOX
  WEIGHT_METABOLIC
  STRESS_BURNOUT
  FITNESS_PERFORMANCE
  BEAUTY_AESTHETIC
  HOLISTIC_SPIRITUAL
  MEDICAL_ASSESSMENT
  POST_ILLNESS
  ADDICTION_BEHAVIORAL
  COGNITIVE_BRAIN
  SLEEP
  WOMENS_HEALTH
  MENS_HEALTH
  GENERAL_REJUVENATION
}

enum TreatmentCategory {
  DIAGNOSTICS
  REGENERATIVE
  CELLULAR
  DETOXIFICATION
  HYPERBARIC
  CRYOTHERAPY
  IV_THERAPIES
  HORMONE
  AESTHETIC
  BODY_MANUAL
  MIND_NEURO
  TRADITIONAL
}

enum DiagnosticCategory {
  IMAGING
  GENETIC
  BIOMARKERS
  MICROBIOME
  CARDIOVASCULAR
  COGNITIVE
  METABOLIC
}

enum EquipmentCategory {
  MRI
  CT
  ULTRASOUND
  HYPERBARIC
  CRYOTHERAPY
  IV_INFUSION
  LASER
  OTHER
}

enum EvidenceLevel {
  STRONG         // Multiple RCTs, meta-analyses
  MODERATE       // Some RCTs, consistent results
  EMERGING       // Limited studies, promising
  EXPERIMENTAL   // Early research, theoretical
  TRADITIONAL    // Historical use, limited modern research
}

enum PartnershipStatus {
  NONE
  CONTACTED
  IN_DISCUSSION
  LEAD_GEN
  AFFILIATE
  PREMIUM
}

enum DiscretionLevel {
  ULTRA_HIGH    // NDA standard, no social media
  HIGH
  STANDARD
}

enum GenderSeparation {
  FULL
  PARTIAL
  NONE
  ON_REQUEST
}

enum SoloFriendliness {
  OPTIMIZED
  GOOD
  COUPLES_FOCUSED
}

enum LGBTQWelcoming {
  EXPLICITLY_WELCOMING
  WELCOMING
  CULTURALLY_CONSERVATIVE
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
  FLAGGED
}

enum GoalAchievement {
  FULLY
  PARTIALLY
  NOT_ACHIEVED
}

enum PhysicianEndorsement {
  YES
  PROBABLY
  UNSURE
  NO
}

enum ContactMethod {
  EMAIL
  PHONE
  SECURE_EMAIL
  SIGNAL
}

enum BudgetRange {
  UNDER_5K
  FIVE_TO_10K
  TEN_TO_25K
  TWENTYFIVE_TO_50K
  FIFTY_TO_100K
  OVER_100K
}

enum InquiryStatus {
  NEW
  CONTACTED
  QUALIFIED
  SENT_TO_PROPERTY
  CONVERTED
  CLOSED
}

enum ArticleCategory {
  DESTINATION_GUIDE
  BUYERS_GUIDE
  TREATMENT_EXPLAINER
  INDUSTRY_NEWS
  PRACTITIONER_INTERVIEW
  EXPERIENCE_ARTICLE
}
```

---

## Deliverables

1. **Complete Prisma Schema**
   - All models defined
   - All enums defined
   - Proper relations and indexes
   - Comments for complex fields

2. **Initial Migration**
   - `prisma migrate dev` runs successfully
   - Migration files committed

3. **Database Client**
   - Typed Prisma client exported from `packages/database`
   - Proper TypeScript configuration

4. **Seed Script**
   - `prisma/seed.ts` with sample data
   - At least 5 sample properties (mix of tiers)
   - At least 10 sample treatments
   - At least 2 sample team members

5. **Documentation**
   - Entity relationship diagram
   - Field documentation for non-obvious fields

---

## Verification Checklist

- [ ] `pnpm db:generate` creates types without errors
- [ ] `pnpm db:push` applies schema to database
- [ ] `pnpm db:seed` populates sample data
- [ ] All relations work correctly
- [ ] Indexes are properly defined for query patterns
- [ ] Schema supports all MVP features
- [ ] Schema accommodates future features without breaking changes

---

## Notes

- Use `@db.Text` for any field that might exceed 255 characters
- All user-provided content fields should support NULL for privacy
- Inquiry contact fields will be encrypted at application layer
- Consider JSON fields for highly dynamic data (but prefer structured where possible)
- Add database-level constraints where appropriate

---

## Next Tasks

Once complete, these tasks can proceed:
- Task 04: Property Profiles (depends on Property model)
- Task 05: Treatment Database (depends on Treatment model)
- Task 08: Review System (depends on Review model)
