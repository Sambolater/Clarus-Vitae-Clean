# API Documentation

This document describes the API routes available in the Clarus Vitae platform.

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://clarusvitae.com/api`

## Authentication

Most API routes are public. Authentication will be added for administrative functions in future phases.

## Endpoints

### Health Check

```
GET /api/health
```

Returns the health status of the application.

**Response**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T12:00:00.000Z",
  "version": "0.1.0"
}
```

---

### Properties

> Note: These endpoints will be implemented in Task 04.

#### List Properties

```
GET /api/properties
```

Returns a paginated list of properties.

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tier` | string | Filter by tier (TIER_1, TIER_2, TIER_3) |
| `country` | string | Filter by country |
| `minScore` | number | Minimum Clarus Index score |
| `focusArea` | string | Filter by focus area |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |

**Response**

```json
{
  "data": [
    {
      "id": "clx...",
      "slug": "clinique-la-prairie",
      "name": "Clinique La Prairie",
      "tier": "TIER_1",
      "location": {
        "country": "Switzerland",
        "city": "Montreux"
      },
      "clarusIndexScore": 92,
      "priceRange": "$50,000 - $150,000",
      "featuredImage": {
        "url": "...",
        "alt": "..."
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### Get Property

```
GET /api/properties/:slug
```

Returns a single property by slug.

**Response**

```json
{
  "id": "clx...",
  "slug": "clinique-la-prairie",
  "name": "Clinique La Prairie",
  "tier": "TIER_1",
  "overview": "...",
  "location": {
    "country": "Switzerland",
    "region": "Vaud",
    "city": "Montreux",
    "coordinates": {
      "latitude": 46.4312,
      "longitude": 6.9107
    }
  },
  "pricing": {
    "minPrice": 50000,
    "maxPrice": 150000,
    "currency": "USD",
    "typicalStayDays": {
      "min": 7,
      "max": 14
    }
  },
  "clarusIndex": {
    "overallScore": 92,
    "tier": "EXCEPTIONAL",
    "dimensions": {
      "clinicalRigor": { "score": 95, "weight": 0.30 },
      "outcomeEvidence": { "score": 90, "weight": 0.25 },
      "programDepth": { "score": 92, "weight": 0.20 },
      "experienceQuality": { "score": 88, "weight": 0.15 },
      "valueAlignment": { "score": 85, "weight": 0.10 }
    },
    "assessmentDate": "2024-01-15",
    "assessedBy": "Dr. Sarah Chen"
  },
  "focusAreas": ["LONGEVITY", "MEDICAL_ASSESSMENT"],
  "treatments": [...],
  "images": [...],
  "reviews": [...]
}
```

---

### Treatments

> Note: These endpoints will be implemented in Task 05.

#### List Treatments

```
GET /api/treatments
```

Returns a paginated list of treatments.

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category |
| `evidenceLevel` | string | Filter by evidence level |
| `page` | number | Page number |
| `limit` | number | Items per page |

#### Get Treatment

```
GET /api/treatments/:slug
```

Returns a single treatment by slug.

---

### Inquiries

> Note: These endpoints will be implemented in Task 11.

#### Submit Inquiry

```
POST /api/inquiries
```

Submit an inquiry about a property.

**Request Body**

```json
{
  "propertyId": "clx...",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "message": "I'm interested in...",
  "preferredContact": "email",
  "interests": ["longevity", "detox"],
  "budgetRange": "$50,000-$100,000",
  "travelDates": {
    "earliest": "2024-03-01",
    "latest": "2024-06-30",
    "flexible": true
  },
  "isSecure": false
}
```

**Response**

```json
{
  "success": true,
  "inquiryId": "clx...",
  "message": "Your inquiry has been submitted successfully."
}
```

---

### Search

> Note: These endpoints will be implemented in Task 06.

#### Search

```
GET /api/search
```

Search across properties and treatments.

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query |
| `type` | string | Filter by type (property, treatment) |
| `limit` | number | Max results (default: 10) |

---

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email"
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

API requests are rate limited:

- Anonymous: 100 requests per minute
- Authenticated: 1000 requests per minute (future)

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705752000
```
