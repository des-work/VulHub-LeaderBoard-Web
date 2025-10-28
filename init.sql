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

-- Add comments to tables for documentation
COMMENT ON TABLE tenants IS 'Multi-tenant organization data';
COMMENT ON TABLE users IS 'User accounts with role-based access';
COMMENT ON TABLE projects IS 'Cybersecurity challenge projects';
COMMENT ON TABLE submissions IS 'User project submissions and reviews';
COMMENT ON TABLE badges IS 'Achievement badges for gamification';
COMMENT ON TABLE user_badges IS 'User badge assignments';
COMMENT ON TABLE leaderboards IS 'User rankings and scores';
COMMENT ON TABLE event_store IS 'Domain events for audit trails';
COMMENT ON TABLE audit_logs IS 'System audit logging';

-- Create indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_tenant ON users(email, tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_last_login ON users(last_login_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_difficulty ON projects(difficulty);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_active ON projects(is_active);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_public ON projects(is_public);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_category_difficulty ON projects(category, difficulty);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submissions_user_tenant ON submissions(user_id, tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submissions_project ON submissions(project_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submissions_reviewed_at ON submissions(reviewed_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_badges_category ON badges(category);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_badges_active ON badges(is_active);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_badges_user_tenant ON user_badges(user_id, tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_badges_earned_at ON user_badges(earned_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leaderboards_rank ON leaderboards(rank);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leaderboards_score ON leaderboards(score);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_event_store_aggregate ON event_store(aggregate_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_event_store_type ON event_store(event_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_event_store_occurred ON event_store(occurred_on);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_success ON audit_logs(success);

-- Create a view for user statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.tenant_id,
    COUNT(DISTINCT s.id) as submission_count,
    COUNT(DISTINCT CASE WHEN s.status = 'APPROVED' THEN s.id END) as approved_submissions,
    COUNT(DISTINCT ub.id) as badge_count,
    COALESCE(SUM(s.score), 0) as total_score,
    COALESCE(l.rank, 0) as current_rank
FROM users u
LEFT JOIN submissions s ON u.id = s.user_id AND u.tenant_id = s.tenant_id
LEFT JOIN user_badges ub ON u.id = ub.user_id AND u.tenant_id = ub.tenant_id
LEFT JOIN leaderboards l ON u.id = l.user_id AND u.tenant_id = l.tenant_id
GROUP BY u.id, u.email, u.first_name, u.last_name, u.tenant_id, l.rank;

-- Create a view for project statistics
CREATE OR REPLACE VIEW project_stats AS
SELECT 
    p.id,
    p.name,
    p.category,
    p.difficulty,
    p.points,
    p.tenant_id,
    COUNT(DISTINCT s.id) as submission_count,
    COUNT(DISTINCT CASE WHEN s.status = 'APPROVED' THEN s.id END) as approved_submissions,
    COUNT(DISTINCT CASE WHEN s.status = 'PENDING' THEN s.id END) as pending_submissions,
    COUNT(DISTINCT CASE WHEN s.status = 'REJECTED' THEN s.id END) as rejected_submissions,
    ROUND(AVG(s.score), 2) as average_score,
    MAX(s.score) as highest_score,
    MIN(s.score) as lowest_score
FROM projects p
LEFT JOIN submissions s ON p.id = s.project_id AND p.tenant_id = s.tenant_id
GROUP BY p.id, p.name, p.category, p.difficulty, p.points, p.tenant_id;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO vulhub;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO vulhub;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO vulhub;
