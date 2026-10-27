-- Brookfield Realty & Investment Ltd. — D1 schema
-- Run via: npx wrangler d1 execute brookfield-db --file=./src/server/db/schema.sql
-- (add --local for local dev, omit for the remote production database)

PRAGMA foreign_keys = ON;

-- Admin-only accounts. No realtor/consultant/customer accounts exist in
-- this system by design — see Phase 2 brief section 10 & 19.
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  property_type TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('residential', 'commercial', 'land', 'investment')),
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT,
  price INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN' CHECK (currency IN ('NGN', 'USD')),
  price_note TEXT,
  description TEXT NOT NULL DEFAULT '',
  bedrooms INTEGER,
  bathrooms INTEGER,
  land_size TEXT,
  building_size TEXT,
  features TEXT NOT NULL DEFAULT '[]',        -- JSON array of strings
  payment_plan TEXT,
  availability TEXT NOT NULL DEFAULT 'available' CHECK (availability IN ('available', 'reserved', 'sold')),
  featured INTEGER NOT NULL DEFAULT 0,          -- 0/1
  published INTEGER NOT NULL DEFAULT 1,         -- 0/1
  inspection_available INTEGER NOT NULL DEFAULT 1, -- 0/1
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_availability ON properties(availability);
CREATE INDEX IF NOT EXISTS idx_properties_published ON properties(published);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);

-- Images are referenced by URL only. Binary data is never stored in D1
-- (see Phase 2 brief section 3 & 6, and COST_NOTES.md for the storage
-- decision behind these URLs).
CREATE TABLE IF NOT EXISTS property_images (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_property_images_property ON property_images(property_id);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Coming Soon' CHECK (status IN ('Ongoing', 'Completed', 'Coming Soon')),
  image_url TEXT,
  units_info TEXT,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);

CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  photo_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_team_published ON team_members(published);

CREATE TABLE IF NOT EXISTS careers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  employment_type TEXT NOT NULL CHECK (employment_type IN ('Full-time', 'Part-time', 'Contract')),
  description TEXT NOT NULL DEFAULT '',
  requirements TEXT NOT NULL DEFAULT '[]',      -- JSON array of strings
  application_instructions TEXT,
  application_contact TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'archived')),
  posted_at TEXT,
  closing_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_careers_status ON careers(status);

-- Phase 3: enquiries, inspection requests, and career applications ---------

-- One table covers general enquiries, property enquiries, inspection
-- requests, and investment enquiries (enquiry_type distinguishes them) —
-- see Phase 3 brief section 5, which explicitly asks for one simple table
-- rather than a table per type.
--
-- property_id is a real foreign key (the relationship), and property_title
-- / property_location / property_price_snapshot are a *small* snapshot
-- taken at submission time — not a duplicate of the full property record —
-- so an enquiry still makes sense to a human even if the property is later
-- edited, unpublished, or deleted (brief section 12).
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  enquiry_type TEXT NOT NULL CHECK (enquiry_type IN ('general', 'property', 'inspection', 'investment')),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  property_id TEXT REFERENCES properties(id) ON DELETE SET NULL,
  property_title TEXT,
  property_location TEXT,
  property_price_snapshot INTEGER,
  property_currency_snapshot TEXT,
  preferred_inspection_date TEXT,
  preferred_inspection_time TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'completed', 'closed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_type ON enquiries(enquiry_type);
CREATE INDEX IF NOT EXISTS idx_enquiries_property ON enquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at);

-- Kept separate from `enquiries` per brief section 8. career_id is a real
-- foreign key; job_title is a small snapshot for the same reason as
-- properties above (the vacancy may later close or be edited).
CREATE TABLE IF NOT EXISTS career_applications (
  id TEXT PRIMARY KEY,
  career_id TEXT REFERENCES careers(id) ON DELETE SET NULL,
  job_title TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  cover_message TEXT NOT NULL,
  resume_url TEXT,
  resume_storage_key TEXT,
  resume_filename TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON career_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_career ON career_applications(career_id);

-- Existing D1 / SQLite databases created before private CV storage:
-- ALTER TABLE career_applications ADD COLUMN resume_storage_key TEXT;
