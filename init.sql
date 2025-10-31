-- Initialize VulHub Development Database
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom functions for better performance
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create tables
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    school_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(50) DEFAULT 'beginner',
    points INTEGER DEFAULT 100,
    vulhub_path VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    points_awarded INTEGER DEFAULT 0,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    tier VARCHAR(50) DEFAULT 'bronze',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments to tables for documentation
COMMENT ON TABLE tenants IS 'Multi-tenant organization data';
COMMENT ON TABLE users IS 'User accounts with role-based access';
COMMENT ON TABLE projects IS 'Cybersecurity challenge projects';
COMMENT ON TABLE submissions IS 'User project submissions and reviews';
COMMENT ON TABLE badges IS 'Achievement badges for gamification';
COMMENT ON TABLE user_badges IS 'User badge assignments';
COMMENT ON TABLE leaderboards IS 'User rankings and scores';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_project_id ON submissions(project_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_leaderboards_tenant_id ON leaderboards(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_total_points ON leaderboards(total_points DESC);

-- Create triggers for updated_at columns
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON badges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboards_updated_at BEFORE UPDATE ON leaderboards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default tenant
INSERT INTO tenants (id, name, slug) VALUES 
    ('00000000-0000-0000-0000-000000000000', 'Default Organization', 'default')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample users
INSERT INTO users (id, tenant_id, school_id, name, email, password_hash, role, points, level) VALUES 
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'CS001', 'Neo', 'neo@matrix.com', '$2b$10$example', 'student', 1820, 4),
    ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'CS002', 'Trinity', 'trinity@matrix.com', '$2b$10$example', 'student', 1710, 4),
    ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'CS003', 'Morpheus', 'morpheus@matrix.com', '$2b$10$example', 'student', 1660, 4),
    ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'CS004', 'Oracle', 'oracle@matrix.com', '$2b$10$example', 'student', 1600, 3),
    ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'CS005', 'Acid Burn', 'acid@hackers.com', '$2b$10$example', 'student', 1540, 3),
    ('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', 'CS006', 'Zero Cool', 'zero@hackers.com', '$2b$10$example', 'student', 1490, 3),
    ('77777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000000', 'CS007', 'Crash Override', 'crash@hackers.com', '$2b$10$example', 'student', 1450, 3),
    ('88888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000000', 'CS008', 'The Architect', 'architect@matrix.com', '$2b$10$example', 'student', 1425, 3),
    ('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000000', 'CS009', 'Cypher', 'cypher@matrix.com', '$2b$10$example', 'student', 1370, 3),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000000', 'CS010', 'Tank', 'tank@matrix.com', '$2b$10$example', 'student', 1330, 3),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000000', 'CS011', 'Dozer', 'dozer@matrix.com', '$2b$10$example', 'student', 1290, 2),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '00000000-0000-0000-0000-000000000000', 'CS012', 'Root', 'root@hackers.com', '$2b$10$example', 'student', 1260, 2),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '00000000-0000-0000-0000-000000000000', 'CS013', 'Elliot Alderson', 'elliot@mrrobot.com', '$2b$10$example', 'student', 1210, 2),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '00000000-0000-0000-0000-000000000000', 'CS014', 'Darlene', 'darlene@mrrobot.com', '$2b$10$example', 'student', 1185, 2),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', '00000000-0000-0000-0000-000000000000', 'CS015', 'Lisbeth Salander', 'lisbeth@dragon.com', '$2b$10$example', 'student', 1150, 2),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'ADMIN001', 'Admin User', 'admin@vulhub.com', '$2b$10$example', 'admin', 0, 1)
ON CONFLICT (school_id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, tenant_id, name, description, difficulty, points, vulhub_path) VALUES 
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'Next.js Middleware Authorization Bypass', 'Framework / Auth Bypass • CVE-2025-29927', 'intermediate', 150, 'framework/nextjs/CVE-2025-29927'),
    ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'Langflow validate/code Pre-Auth RCE', 'LLM / RCE • CVE-2025-3248', 'advanced', 250, 'llm/langflow/CVE-2025-3248'),
    ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'H2 Console Authentication RCE', 'Database / RCE • CVE-2018-10054', 'intermediate', 180, 'database/h2/CVE-2018-10054'),
    ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'Confluence OGNL Pre-Auth RCE', 'Expression Injection / RCE • CVE-2022-26134', 'advanced', 220, 'expression-injection/confluence/CVE-2022-26134'),
    ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'Spring Cloud Function SpEL Injection', 'Expression Injection / RCE • CVE-2022-22963', 'intermediate', 160, 'expression-injection/spring/CVE-2022-22963'),
    ('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', 'PostgreSQL Privilege Escalation', 'Privilege Escalation • CVE-2018-1058', 'advanced', 200, 'priv-esc/postgresql/CVE-2018-1058'),
    ('77777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000000', 'Drupal XSS by File Upload', 'CMS / XSS • CVE-2019-6341', 'beginner', 120, 'cms/drupal/CVE-2019-6341')
ON CONFLICT (id) DO NOTHING;

-- Insert sample badges
INSERT INTO badges (id, name, description, icon, tier) VALUES 
    ('11111111-1111-1111-1111-111111111111', 'First Blood', 'Complete your first challenge', '🔴', 'bronze'),
    ('22222222-2222-2222-2222-222222222222', 'Bug Hunter', 'Find and report 5 vulnerabilities', '🐛', 'silver'),
    ('33333333-3333-3333-3333-333333333333', 'Code Master', 'Complete 10 challenges', '💻', 'gold'),
    ('44444444-4444-4444-4444-444444444444', 'Security Expert', 'Complete 25 challenges', '🛡️', 'platinum'),
    ('55555555-5555-5555-5555-555555555555', 'Top Performer', 'Reach the top 10 on leaderboard', '🏆', 'diamond')
ON CONFLICT (id) DO NOTHING;