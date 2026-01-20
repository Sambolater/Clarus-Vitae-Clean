# 12 - ADVISORY TEAM PROFILES
## Human Authority Behind Every Recommendation

> **Reference**: See `00_MASTER_PROJECT_BRIEF.md` Section "Human Authority Behind Every Recommendation" for team requirements.

---

## Task Objective

Build the team profile system that establishes human credibility and expertise behind the platform. For users making $150K decisions, they need to know: who is telling me this, and why should I trust them?

---

## Requirements (From Brief)

- **Named Advisory Team**: Real people with photos, credentials, backgrounds, properties visited
- **Editorial bylines**: All content attributed to named authors
- **"Verified Researcher" reviews**: Team reviews clearly distinguished
- **Trust signals**: Collective expertise metrics
- **Contact accessibility**: Users can request specific advisors
- **Expertise transparency**: Clear specializations

---

## Deliverables

### 1. Team Member Data Structure

```typescript
// packages/types/src/team.ts

export interface TeamMember {
  id: string;
  slug: string;
  
  // Basic Info
  name: string;
  title: string;           // "Senior Wellness Advisor"
  role: TeamRole;          // Founder, Senior Advisor, Advisor, Contributor
  
  // Bio
  bio: string;             // Full bio (500-1000 words)
  shortBio: string;        // Summary (2-3 sentences)
  
  // Credentials & Background
  credentials: string[];   // "MD", "Certified Wellness Coach", etc.
  certifications: string[];
  education: Education[];
  previousRoles: PreviousRole[];
  
  // Expertise
  specializations: string[];  // "Medical Longevity", "Weight Management", etc.
  focusAreas: string[];       // Links to focus area IDs
  languages: string[];
  
  // Experience Metrics
  propertiesVisited: number;
  programsEvaluated: number;
  yearsExperience: number;
  
  // Media
  photoUrl: string;
  photoAlt: string;
  
  // Contact
  isContactAvailable: boolean;
  linkedinUrl?: string;
  
  // Display
  displayOrder: number;
  isActive: boolean;
}

export type TeamRole = 'founder' | 'senior_advisor' | 'advisor' | 'contributor' | 'medical_advisor';

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year?: number;
}

export interface PreviousRole {
  organization: string;
  title: string;
  years: string;
  description?: string;
}

export interface PropertyVisit {
  teamMemberId: string;
  propertyId: string;
  visitDate: Date;
  visitType: 'full_program' | 'site_visit' | 'evaluation' | 'invited';
  notes?: string;
  reviewId?: string;
}
```

### 2. Team Page

```typescript
// apps/web/app/about/team/page.tsx

export default async function TeamPage() {
  const teamMembers = await getActiveTeamMembers();
  const collectiveStats = await getCollectiveStats();
  
  return (
    <div>
      <TeamHero stats={collectiveStats} />
      <TrustStatement />
      <TeamGrid members={teamMembers} />
      <ContactAdvisorCTA />
    </div>
  );
}
```

### 3. Team Hero with Collective Stats

```typescript
// packages/ui/src/components/team/TeamHero.tsx

interface CollectiveStats {
  totalMembers: number;
  totalPropertiesVisited: number;
  totalProgramsEvaluated: number;
  totalYearsExperience: number;
  countriesCovered: number;
}

export function TeamHero({ stats }: { stats: CollectiveStats }) {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif mb-4">Our Advisory Team</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-12">
          Real expertise. Real visits. Real recommendations you can trust.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <StatCard number={stats.totalPropertiesVisited} label="Properties Visited" suffix="+" />
          <StatCard number={stats.totalProgramsEvaluated} label="Programs Evaluated" suffix="+" />
          <StatCard number={stats.totalYearsExperience} label="Combined Years Experience" suffix="+" />
          <StatCard number={stats.countriesCovered} label="Countries Covered" />
          <StatCard number={stats.totalMembers} label="Expert Advisors" />
        </div>
      </div>
    </section>
  );
}
```

### 4. Team Member Card

```typescript
// packages/ui/src/components/team/TeamMemberCard.tsx

export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <Image src={member.photoUrl} alt={member.photoAlt} className="w-24 h-24 rounded-full mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-center">{member.name}</h3>
      <p className="text-gray-600 text-center mb-2">{member.title}</p>
      
      <div className="flex flex-wrap justify-center gap-1 mb-4">
        {member.credentials.slice(0, 3).map(cred => (
          <span key={cred} className="text-xs bg-slate-100 px-2 py-1 rounded">{cred}</span>
        ))}
      </div>
      
      <div className="flex justify-center gap-4 text-sm text-gray-500 mb-4">
        <span>{member.propertiesVisited} properties</span>
        <span>•</span>
        <span>{member.yearsExperience} years</span>
      </div>
      
      <p className="text-sm text-gray-600 text-center mb-4">
        Specializes in: {member.specializations.slice(0, 3).join(', ')}
      </p>
      
      <Link href={`/about/team/${member.slug}`} className="block text-center text-emerald-600 hover:underline">
        View full profile →
      </Link>
    </div>
  );
}
```

### 5. Individual Profile Page

```typescript
// apps/web/app/about/team/[slug]/page.tsx

export default async function TeamMemberPage({ params }: { params: { slug: string } }) {
  const member = await getTeamMemberBySlug(params.slug);
  const visits = await getMemberPropertyVisits(member.id);
  const reviews = await getMemberReviews(member.id);
  
  return (
    <div>
      <TeamMemberHeader member={member} />
      <TeamMemberBio member={member} />
      <TeamMemberCredentials member={member} />
      <TeamMemberVisits visits={visits} />
      <TeamMemberReviews reviews={reviews} />
      {member.isContactAvailable && <ContactThisAdvisor member={member} />}
    </div>
  );
}
```

### 6. Editorial Byline Component

```typescript
// packages/ui/src/components/team/EditorialByline.tsx

interface EditorialBylineProps {
  author: TeamMember;
  publishDate: Date;
  readTime?: number;
  variant?: 'full' | 'compact';
}

export function EditorialByline({ author, publishDate, readTime, variant = 'full' }: EditorialBylineProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Image src={author.photoUrl} alt={author.name} className="w-6 h-6 rounded-full" />
        <span>By {author.name}</span>
        <span>•</span>
        <time>{formatDate(publishDate)}</time>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-4 py-4 border-y">
      <Image src={author.photoUrl} alt={author.name} className="w-12 h-12 rounded-full" />
      <div>
        <Link href={`/about/team/${author.slug}`} className="font-medium hover:text-emerald-600">
          {author.name}
        </Link>
        <p className="text-sm text-gray-600">{author.title} • {author.propertiesVisited} properties visited</p>
        <p className="text-sm text-gray-500">{formatDate(publishDate)}{readTime && ` • ${readTime} min read`}</p>
      </div>
    </div>
  );
}
```

### 7. Team Review Badge

```typescript
// packages/ui/src/components/team/TeamReviewBadge.tsx

export function TeamReviewBadge({ member, visitCircumstances }: { member: TeamMember; visitCircumstances: string }) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-3">
        <Image src={member.photoUrl} alt={member.name} className="w-10 h-10 rounded-full" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{member.name}</span>
            <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded">Verified Researcher</span>
          </div>
          <p className="text-sm text-gray-600">{member.title} • {visitCircumstances}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        This review was written by a Clarus Vitae team member.{' '}
        <Link href={`/about/team/${member.slug}`} className="underline">View their profile</Link>
      </p>
    </div>
  );
}
```

### 8. Contact Advisor Component

```typescript
// packages/ui/src/components/team/ContactAdvisor.tsx

export function ContactAdvisor({ member, context }: { member?: TeamMember; context?: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-6">
      {member ? (
        <>
          <div className="flex items-center gap-3 mb-4">
            <Image src={member.photoUrl} alt={member.name} className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-gray-600">{member.title}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Have questions{context ? ` about ${context}` : ''}? {member.name.split(' ')[0]} can help.
          </p>
        </>
      ) : (
        <>
          <h3 className="font-semibold mb-2">Speak with an Advisor</h3>
          <p className="text-gray-600 mb-4">Our team can help you find the right wellness destination.</p>
        </>
      )}
      
      <Button onClick={() => openAdvisorContact(member?.id)} className="w-full">
        Request Consultation
      </Button>
      <p className="text-xs text-gray-500 mt-3 text-center">No obligation. Free initial consultation.</p>
    </div>
  );
}
```

### 9. Property Page Team Section

```typescript
// packages/ui/src/components/team/PropertyTeamSection.tsx

export function PropertyTeamSection({ teamVisits }: { teamVisits: PropertyVisit[] }) {
  if (teamVisits.length === 0) return null;
  
  return (
    <section className="border-t pt-8 mt-8">
      <h2 className="text-xl font-semibold mb-4">Verified by Our Team</h2>
      <p className="text-gray-600 mb-6">
        {teamVisits.length} team member{teamVisits.length > 1 ? 's have' : ' has'} personally visited this property.
      </p>
      
      <div className="space-y-4">
        {teamVisits.map(visit => (
          <TeamVisitCard key={`${visit.teamMemberId}-${visit.visitDate}`} visit={visit} />
        ))}
      </div>
    </section>
  );
}
```

---

## Acceptance Criteria

- [ ] Team page displays all active members with collective stats
- [ ] Individual profile pages show full credentials and history
- [ ] Editorial bylines link to author profiles
- [ ] Team review badges clearly distinguish team reviews
- [ ] Property pages show which team members visited
- [ ] Contact advisor functionality works
- [ ] Mobile-responsive layouts
- [ ] SEO metadata for team pages

---

## Notes

- Minimum 3 team members required for MVP
- All credentials must be verifiable
- Photos should be professional but approachable
- Consider video introductions for Phase 2

---

*Human authority is a key differentiator. Make the team visible and credible.*
