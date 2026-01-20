-- Clarus Vitae Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE "PropertyTier" AS ENUM ('TIER_1', 'TIER_2', 'TIER_3');
CREATE TYPE "WellnessApproach" AS ENUM ('CLINICAL', 'INTEGRATIVE', 'HOLISTIC', 'LIFESTYLE');
CREATE TYPE "FocusArea" AS ENUM ('LONGEVITY', 'DETOX', 'WEIGHT_METABOLIC', 'STRESS_BURNOUT', 'FITNESS_PERFORMANCE', 'BEAUTY_AESTHETIC', 'HOLISTIC_SPIRITUAL', 'MEDICAL_ASSESSMENT', 'POST_ILLNESS', 'ADDICTION_BEHAVIORAL', 'COGNITIVE_BRAIN', 'SLEEP', 'WOMENS_HEALTH', 'MENS_HEALTH', 'GENERAL_REJUVENATION');
CREATE TYPE "TreatmentCategory" AS ENUM ('DIAGNOSTICS', 'REGENERATIVE', 'CELLULAR', 'DETOXIFICATION', 'HYPERBARIC', 'CRYOTHERAPY', 'IV_THERAPIES', 'HORMONE', 'AESTHETIC', 'BODY_MANUAL', 'MIND_NEURO', 'TRADITIONAL');
CREATE TYPE "DiagnosticCategory" AS ENUM ('IMAGING', 'GENETIC', 'BIOMARKERS', 'MICROBIOME', 'CARDIOVASCULAR', 'COGNITIVE', 'METABOLIC');
CREATE TYPE "EquipmentCategory" AS ENUM ('MRI', 'CT', 'ULTRASOUND', 'HYPERBARIC', 'CRYOTHERAPY', 'IV_INFUSION', 'LASER', 'OTHER');
CREATE TYPE "EvidenceLevel" AS ENUM ('STRONG', 'MODERATE', 'EMERGING', 'EXPERIMENTAL', 'TRADITIONAL');
CREATE TYPE "PartnershipStatus" AS ENUM ('NONE', 'CONTACTED', 'IN_DISCUSSION', 'LEAD_GEN', 'AFFILIATE', 'PREMIUM');
CREATE TYPE "DiscretionLevel" AS ENUM ('ULTRA_HIGH', 'HIGH', 'STANDARD');
CREATE TYPE "GenderSeparation" AS ENUM ('FULL', 'PARTIAL', 'NONE', 'ON_REQUEST');
CREATE TYPE "SoloFriendliness" AS ENUM ('OPTIMIZED', 'GOOD', 'COUPLES_FOCUSED');
CREATE TYPE "LGBTQWelcoming" AS ENUM ('EXPLICITLY_WELCOMING', 'WELCOMING', 'CULTURALLY_CONSERVATIVE');
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED');
CREATE TYPE "GoalAchievement" AS ENUM ('FULLY', 'PARTIALLY', 'NOT_ACHIEVED');
CREATE TYPE "PhysicianEndorsement" AS ENUM ('YES', 'PROBABLY', 'UNSURE', 'NO');
CREATE TYPE "ContactMethod" AS ENUM ('EMAIL', 'PHONE', 'SECURE_EMAIL', 'SIGNAL');
CREATE TYPE "BudgetRange" AS ENUM ('UNDER_5K', 'FIVE_TO_10K', 'TEN_TO_25K', 'TWENTYFIVE_TO_50K', 'FIFTY_TO_100K', 'OVER_100K');
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'SENT_TO_PROPERTY', 'CONVERTED', 'CLOSED');
CREATE TYPE "ArticleCategory" AS ENUM ('DESTINATION_GUIDE', 'BUYERS_GUIDE', 'TREATMENT_EXPLAINER', 'INDUSTRY_NEWS', 'PRACTITIONER_INTERVIEW', 'EXPERIENCE_ARTICLE');
CREATE TYPE "IndexTier" AS ENUM ('EXCEPTIONAL', 'DISTINGUISHED', 'NOTABLE', 'CURATED');

-- ============================================
-- TABLES
-- ============================================

-- Property
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "nearestAirport" TEXT,
    "transferTime" TEXT,
    "tier" "PropertyTier" NOT NULL,
    "approach" "WellnessApproach",
    "focusAreas" "FocusArea"[],
    "priceMin" INTEGER NOT NULL,
    "priceMax" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "website" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "foundedYear" INTEGER,
    "capacity" INTEGER,
    "accommodationType" TEXT,
    "diningDescription" TEXT,
    "facilitiesDescription" TEXT,
    "setting" TEXT,
    "overallScore" DOUBLE PRECISION,
    "clinicalRigorScore" DOUBLE PRECISION,
    "outcomeEvidenceScore" DOUBLE PRECISION,
    "programDepthScore" DOUBLE PRECISION,
    "experienceQualityScore" DOUBLE PRECISION,
    "valueAlignmentScore" DOUBLE PRECISION,
    "physicianPatientRatio" TEXT,
    "avgBookingLeadTime" TEXT,
    "returnGuestPercentage" INTEGER,
    "staffTenure" TEXT,
    "actualCustomization" TEXT,
    "postVisitFollowup" TEXT,
    "discretionLevel" "DiscretionLevel",
    "genderSeparatedFacilities" "GenderSeparation",
    "religiousDietaryOptions" TEXT[],
    "privacyArchitecture" TEXT,
    "prayerFacilities" TEXT,
    "languagesMedical" TEXT[],
    "languagesService" TEXT[],
    "soloTravelerFriendly" "SoloFriendliness",
    "lgbtqWelcoming" "LGBTQWelcoming",
    "partnershipStatus" "PartnershipStatus" NOT NULL DEFAULT 'NONE',
    "affiliateLink" TEXT,
    "leadGenAgreement" BOOLEAN NOT NULL DEFAULT false,
    "verifiedByProperty" BOOLEAN NOT NULL DEFAULT false,
    "lastPropertyContact" TIMESTAMP(3),
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "editorChoice" TEXT,
    "verifiedExcellence" BOOLEAN NOT NULL DEFAULT false,
    "risingStar" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- TierOneDetails
CREATE TABLE "TierOneDetails" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "medicalDirector" TEXT,
    "medicalDirectorCreds" TEXT,
    "medicalTeamSize" INTEGER,
    "certifications" TEXT[],
    "hospitalAffiliations" TEXT[],
    "researchPublications" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TierOneDetails_pkey" PRIMARY KEY ("id")
);

-- PropertyImage
CREATE TABLE "PropertyImage" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "aspectRatio" TEXT NOT NULL,
    "category" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyImage_pkey" PRIMARY KEY ("id")
);

-- Program
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "focusAreas" "FocusArea"[],
    "inclusions" TEXT[],
    "exclusions" TEXT[],
    "typicalSchedule" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- Treatment
CREATE TABLE "Treatment" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" TEXT[],
    "category" "TreatmentCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "howItWorks" TEXT,
    "whatItAddresses" TEXT[],
    "evidenceLevel" "EvidenceLevel" NOT NULL,
    "evidenceSummary" TEXT,
    "typicalProtocol" TEXT,
    "priceRangeMin" INTEGER,
    "priceRangeMax" INTEGER,
    "potentialRisks" TEXT,
    "contraindications" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

-- Diagnostic
CREATE TABLE "Diagnostic" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "DiagnosticCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "whatItMeasures" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagnostic_pkey" PRIMARY KEY ("id")
);

-- Equipment
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "category" "EquipmentCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "capabilities" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- PropertyTreatment (junction)
CREATE TABLE "PropertyTreatment" (
    "propertyId" TEXT NOT NULL,
    "treatmentId" TEXT NOT NULL,
    "notes" TEXT,
    "priceAtProperty" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyTreatment_pkey" PRIMARY KEY ("propertyId","treatmentId")
);

-- PropertyDiagnostic (junction)
CREATE TABLE "PropertyDiagnostic" (
    "propertyId" TEXT NOT NULL,
    "diagnosticId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyDiagnostic_pkey" PRIMARY KEY ("propertyId","diagnosticId")
);

-- PropertyEquipment (junction)
CREATE TABLE "PropertyEquipment" (
    "propertyId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "installationYear" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyEquipment_pkey" PRIMARY KEY ("propertyId","equipmentId")
);

-- TreatmentEquipment (junction)
CREATE TABLE "TreatmentEquipment" (
    "treatmentId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TreatmentEquipment_pkey" PRIMARY KEY ("treatmentId","equipmentId")
);

-- ClarusIndexScore
CREATE TABLE "ClarusIndexScore" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "tier" "IndexTier" NOT NULL,
    "dimensions" JSONB NOT NULL,
    "assessmentDate" TIMESTAMP(3) NOT NULL,
    "assessedBy" TEXT NOT NULL,
    "methodology" TEXT NOT NULL DEFAULT 'v1.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClarusIndexScore_pkey" PRIMARY KEY ("id")
);

-- TeamMember
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "credentials" TEXT[],
    "specializations" TEXT[],
    "languages" TEXT[],
    "propertiesVisited" TEXT[],
    "programsCompleted" INTEGER NOT NULL DEFAULT 0,
    "photoUrl" TEXT,
    "linkedinUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- Review
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT,
    "reviewerName" TEXT,
    "isTeamReview" BOOLEAN NOT NULL DEFAULT false,
    "teamMemberId" TEXT,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "programType" TEXT NOT NULL,
    "stayLengthDays" INTEGER NOT NULL,
    "statedGoals" TEXT[],
    "overallRating" INTEGER NOT NULL,
    "serviceRating" INTEGER,
    "facilitiesRating" INTEGER,
    "diningRating" INTEGER,
    "valueRating" INTEGER,
    "goalAchievement" "GoalAchievement",
    "protocolQualityRating" INTEGER,
    "followupQualityRating" INTEGER,
    "physicianEndorsement" "PhysicianEndorsement",
    "bioAgeChange" INTEGER,
    "weightChange" DOUBLE PRECISION,
    "energyImprovement" INTEGER,
    "sleepImprovement" INTEGER,
    "specificOutcomes" TEXT,
    "reviewText" TEXT NOT NULL,
    "pros" TEXT[],
    "cons" TEXT[],
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationMethod" TEXT,
    "followUp30Days" TEXT,
    "followUp90Days" TEXT,
    "followUp180Days" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "moderationNotes" TEXT,
    "propertyResponse" TEXT,
    "propertyRespondedAt" TIMESTAMP(3),
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- Inquiry
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "preferredContact" "ContactMethod" NOT NULL DEFAULT 'EMAIL',
    "interestedProperties" TEXT[],
    "dates" TEXT,
    "datesFlexible" BOOLEAN NOT NULL DEFAULT true,
    "durationInterest" TEXT,
    "primaryGoals" TEXT[],
    "budgetRange" "BudgetRange",
    "additionalNotes" TEXT,
    "anonymousInquiry" BOOLEAN NOT NULL DEFAULT false,
    "secureChannelRequest" BOOLEAN NOT NULL DEFAULT false,
    "sourcePage" TEXT,
    "sourceUrl" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "assignedTo" TEXT,
    "propertyNotified" BOOLEAN NOT NULL DEFAULT false,
    "propertyNotifiedAt" TIMESTAMP(3),
    "contactConsent" BOOLEAN NOT NULL DEFAULT false,
    "privacyPolicyAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- Article
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "authorId" TEXT,
    "category" "ArticleCategory" NOT NULL,
    "tags" TEXT[],
    "featuredImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- ============================================
-- UNIQUE CONSTRAINTS
-- ============================================

CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");
CREATE UNIQUE INDEX "TierOneDetails_propertyId_key" ON "TierOneDetails"("propertyId");
CREATE UNIQUE INDEX "Treatment_slug_key" ON "Treatment"("slug");
CREATE UNIQUE INDEX "Diagnostic_slug_key" ON "Diagnostic"("slug");
CREATE UNIQUE INDEX "Equipment_slug_key" ON "Equipment"("slug");
CREATE UNIQUE INDEX "TeamMember_slug_key" ON "TeamMember"("slug");
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX "Property_tier_idx" ON "Property"("tier");
CREATE INDEX "Property_country_idx" ON "Property"("country");
CREATE INDEX "Property_published_idx" ON "Property"("published");
CREATE INDEX "Property_overallScore_idx" ON "Property"("overallScore");
CREATE INDEX "Property_approach_idx" ON "Property"("approach");

CREATE INDEX "PropertyImage_propertyId_idx" ON "PropertyImage"("propertyId");
CREATE INDEX "PropertyImage_isFeatured_idx" ON "PropertyImage"("isFeatured");

CREATE INDEX "Program_propertyId_idx" ON "Program"("propertyId");
CREATE INDEX "Program_durationDays_idx" ON "Program"("durationDays");

CREATE INDEX "Treatment_category_idx" ON "Treatment"("category");
CREATE INDEX "Treatment_evidenceLevel_idx" ON "Treatment"("evidenceLevel");
CREATE INDEX "Treatment_published_idx" ON "Treatment"("published");

CREATE INDEX "Diagnostic_category_idx" ON "Diagnostic"("category");
CREATE INDEX "Diagnostic_published_idx" ON "Diagnostic"("published");

CREATE INDEX "Equipment_category_idx" ON "Equipment"("category");

CREATE INDEX "PropertyTreatment_treatmentId_idx" ON "PropertyTreatment"("treatmentId");
CREATE INDEX "PropertyDiagnostic_diagnosticId_idx" ON "PropertyDiagnostic"("diagnosticId");
CREATE INDEX "PropertyEquipment_equipmentId_idx" ON "PropertyEquipment"("equipmentId");
CREATE INDEX "TreatmentEquipment_equipmentId_idx" ON "TreatmentEquipment"("equipmentId");

CREATE INDEX "ClarusIndexScore_propertyId_idx" ON "ClarusIndexScore"("propertyId");
CREATE INDEX "ClarusIndexScore_tier_idx" ON "ClarusIndexScore"("tier");
CREATE INDEX "ClarusIndexScore_overallScore_idx" ON "ClarusIndexScore"("overallScore");

CREATE INDEX "TeamMember_published_idx" ON "TeamMember"("published");

CREATE INDEX "Review_propertyId_idx" ON "Review"("propertyId");
CREATE INDEX "Review_status_idx" ON "Review"("status");
CREATE INDEX "Review_isTeamReview_idx" ON "Review"("isTeamReview");
CREATE INDEX "Review_overallRating_idx" ON "Review"("overallRating");

CREATE INDEX "Inquiry_status_idx" ON "Inquiry"("status");
CREATE INDEX "Inquiry_propertyId_idx" ON "Inquiry"("propertyId");
CREATE INDEX "Inquiry_createdAt_idx" ON "Inquiry"("createdAt");

CREATE INDEX "Article_category_idx" ON "Article"("category");
CREATE INDEX "Article_published_idx" ON "Article"("published");
CREATE INDEX "Article_publishedAt_idx" ON "Article"("publishedAt");

-- ============================================
-- FOREIGN KEYS
-- ============================================

ALTER TABLE "TierOneDetails" ADD CONSTRAINT "TierOneDetails_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyImage" ADD CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Program" ADD CONSTRAINT "Program_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyTreatment" ADD CONSTRAINT "PropertyTreatment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyTreatment" ADD CONSTRAINT "PropertyTreatment_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyDiagnostic" ADD CONSTRAINT "PropertyDiagnostic_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyDiagnostic" ADD CONSTRAINT "PropertyDiagnostic_diagnosticId_fkey" FOREIGN KEY ("diagnosticId") REFERENCES "Diagnostic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyEquipment" ADD CONSTRAINT "PropertyEquipment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PropertyEquipment" ADD CONSTRAINT "PropertyEquipment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TreatmentEquipment" ADD CONSTRAINT "TreatmentEquipment_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TreatmentEquipment" ADD CONSTRAINT "TreatmentEquipment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClarusIndexScore" ADD CONSTRAINT "ClarusIndexScore_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
