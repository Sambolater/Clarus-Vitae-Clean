# Connect clarusvitae.com to Vercel (GoDaddy)

## Step 1: Add Domain in Vercel
1. Go to: https://vercel.com/agentics-advisory/clarus-vitae/settings/domains
2. Click **"Add"**
3. Enter: `clarusvitae.com`
4. Click **"Add"**

Vercel will show you DNS records to add.

---

## Step 2: Update GoDaddy DNS

1. Log in to [GoDaddy](https://godaddy.com)
2. Go to **My Products** → Find `clarusvitae.com` → Click **DNS**
3. Delete any existing A records or CNAME for `@` and `www`

### Add these records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `@` | `76.76.21.21` | 600 |
| **CNAME** | `www` | `cname.vercel-dns.com` | 600 |

4. Click **Save**

---

## Step 3: Verify in Vercel
1. Go back to Vercel domain settings
2. Wait 5-10 minutes for DNS propagation
3. Both `clarusvitae.com` and `www.clarusvitae.com` should show ✅

---

## Troubleshooting
- **Still not working after 30 min?** Clear browser cache or try incognito
- **SSL error?** Vercel auto-provisions SSL, wait up to 24 hours
- **Check propagation:** https://dnschecker.org/#A/clarusvitae.com

---

*Once done, your site will be live at https://clarusvitae.com* 🎉
