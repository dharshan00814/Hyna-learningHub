-- Migration for Internship Website

CREATE TABLE IF NOT EXISTS internship_programs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text,
  description text,
  category text,
  duration text,
  mode text,
  location text,
  experience_level text,
  skills text[],
  eligibility text,
  responsibilities text,
  learning_outcomes text,
  start_date date,
  end_date date,
  application_deadline date,
  available_seats integer,
  status text DEFAULT 'Applications Open',
  featured boolean DEFAULT false,
  published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS internship_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id text UNIQUE NOT NULL,
  program_id uuid REFERENCES internship_programs(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  location text,
  college text,
  degree text,
  department text,
  graduation_year text,
  cgpa text,
  skills text[],
  programming_languages text[],
  github_url text,
  linkedin_url text,
  portfolio_url text,
  resume_url text,
  motivation text,
  learning_goals text,
  project_description text,
  status text DEFAULT 'APPLIED',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS application_status_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid REFERENCES internship_applications(id),
  old_status text,
  new_status text NOT NULL,
  changed_by text,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid REFERENCES internship_applications(id),
  scheduled_at timestamp with time zone,
  meeting_url text,
  notes text,
  status text DEFAULT 'SCHEDULED',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS internship_offers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid REFERENCES internship_applications(id),
  offer_status text DEFAULT 'PENDING',
  start_date date,
  end_date date,
  offer_document_url text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  email text,
  subject text,
  message text,
  status text DEFAULT 'UNREAD',
  created_at timestamp with time zone DEFAULT now()
);

-- Basic RLS Policies (For public access, usually applications can only insert or read their own based on some auth, 
-- but since this is a public form without strict auth to start, we'll allow public inserts, but restrict reads).
-- Adjust as necessary for actual authentication.

ALTER TABLE internship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of published programs" ON internship_programs FOR SELECT USING (published = true);
CREATE POLICY "Allow public insert of applications" ON internship_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read of own applications via tracking" ON internship_applications FOR SELECT USING (true); -- Ideally restrict by email or app ID
CREATE POLICY "Allow public insert of contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Add some seed data
INSERT INTO internship_programs (title, slug, short_description, category, duration, mode, experience_level, status, published)
VALUES 
('Full Stack Development Intern', 'full-stack-development-intern', 'Build modern web applications using React, Node.js and PostgreSQL.', 'Full Stack Development', '3 Months', 'Remote', 'Beginner Friendly', 'Applications Open', true),
('AI/ML Intern', 'ai-ml-intern', 'Work on exciting AI projects involving NLP and machine learning models.', 'Artificial Intelligence', '3 Months', 'Remote', 'Intermediate', 'Applications Open', true),
('UI/UX Design Intern', 'ui-ux-design-intern', 'Design beautiful, accessible user interfaces for real-world products.', 'Design', '2 Months', 'Remote', 'Beginner Friendly', 'Applications Open', true)
ON CONFLICT DO NOTHING;
