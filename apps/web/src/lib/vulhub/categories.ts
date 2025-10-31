/**
 * VulHub Challenge Categories and Vulnerabilities
 * Data sourced from https://vulhub.org/environments
 */

export interface VulnerabilityInfo {
  id: string;
  name: string;
  cve?: string;
  category: string;
  description: string;
  tags: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface CategoryInfo {
  id: string;
  name: string;
  count: number;
  description: string;
  icon: string;
}

export const VULHUB_CATEGORIES: CategoryInfo[] = [
  {
    id: 'auth-bypass',
    name: 'Auth Bypass',
    count: 39,
    description: 'Authentication and authorization bypass vulnerabilities',
    icon: '🔓'
  },
  {
    id: 'rce',
    name: 'RCE',
    count: 188,
    description: 'Remote Code Execution vulnerabilities',
    icon: '💻'
  },
  {
    id: 'sql-injection',
    name: 'SQL Injection',
    count: 20,
    description: 'SQL injection vulnerabilities',
    icon: '💉'
  },
  {
    id: 'xss',
    name: 'XSS',
    count: 2,
    description: 'Cross-Site Scripting vulnerabilities',
    icon: '🔗'
  },
  {
    id: 'ssrf',
    name: 'SSRF',
    count: 9,
    description: 'Server-Side Request Forgery',
    icon: '🌐'
  },
  {
    id: 'path-traversal',
    name: 'Path Traversal',
    count: 45,
    description: 'Directory and path traversal vulnerabilities',
    icon: '📁'
  },
  {
    id: 'deserialization',
    name: 'Deserialization',
    count: 35,
    description: 'Insecure deserialization vulnerabilities',
    icon: '📦'
  },
  {
    id: 'framework',
    name: 'Framework',
    count: 40,
    description: 'Framework-specific vulnerabilities',
    icon: '🏗️'
  },
  {
    id: 'cms',
    name: 'CMS',
    count: 15,
    description: 'Content Management System vulnerabilities',
    icon: '📝'
  },
  {
    id: 'database',
    name: 'Database',
    count: 17,
    description: 'Database vulnerabilities',
    icon: '🗄️'
  },
  {
    id: 'llm',
    name: 'LLM',
    count: 3,
    description: 'Large Language Model vulnerabilities',
    icon: '🤖'
  },
  {
    id: 'ssti',
    name: 'SSTI',
    count: 3,
    description: 'Server-Side Template Injection',
    icon: '📄'
  }
];

export const VULHUB_VULNERABILITIES: VulnerabilityInfo[] = [
  // Framework
  {
    id: 'nextjs-middleware-bypass',
    name: 'Next.js Middleware Authorization Bypass',
    cve: 'CVE-2025-29927',
    category: 'framework',
    description: 'Authorization bypass in Next.js middleware allowing unauthorized access',
    tags: ['nextjs', 'auth-bypass', 'framework'],
    difficulty: 'medium'
  },
  
  // LLM
  {
    id: 'langflow-rce',
    name: 'Langflow validate/code API Pre-Auth RCE',
    cve: 'CVE-2025-3248',
    category: 'llm',
    description: 'Pre-authentication remote code execution in Langflow validate/code API',
    tags: ['langflow', 'rce', 'llm', 'pre-auth'],
    difficulty: 'hard'
  },
  
  // Auth Bypass
  {
    id: 'apache-superset-jwt',
    name: 'Apache Superset Hardcoded JWT Secret Key',
    cve: 'CVE-2023-27524',
    category: 'auth-bypass',
    description: 'Hardcoded JWT secret key leads to authentication bypass',
    tags: ['apache', 'superset', 'jwt', 'hardcoding'],
    difficulty: 'easy'
  },
  {
    id: 'apache-ofbiz-auth',
    name: 'Apache OFBiz Authentication Bypass Leads to RCE',
    cve: 'CVE-2024-45195',
    category: 'auth-bypass',
    description: 'Authentication bypass vulnerability leading to remote code execution',
    tags: ['apache', 'ofbiz', 'auth-bypass', 'rce'],
    difficulty: 'hard'
  },
  
  // RCE
  {
    id: 'php-backdoor',
    name: 'PHP 8.1.0-dev User-Agent Backdoor RCE',
    cve: undefined,
    category: 'rce',
    description: 'Backdoor in PHP 8.1.0-dev allowing remote code execution via User-Agent header',
    tags: ['php', 'backdoor', 'rce'],
    difficulty: 'easy'
  },
  {
    id: 'craftcms-conditions',
    name: 'CraftCMS ConditionsController Pre-Auth RCE',
    cve: 'CVE-2023-41892',
    category: 'rce',
    description: 'Pre-authentication remote code execution in CraftCMS ConditionsController',
    tags: ['craftcms', 'cms', 'pre-auth', 'rce'],
    difficulty: 'medium'
  },
  {
    id: 'tomcat-deserialization',
    name: 'Tomcat Session Deserialization RCE',
    cve: 'CVE-2025-24813',
    category: 'deserialization',
    description: 'Remote code execution via session deserialization in Apache Tomcat',
    tags: ['tomcat', 'deserialization', 'rce', 'webserver'],
    difficulty: 'hard'
  },
  
  // SQL Injection
  {
    id: 'cacti-sql-rce',
    name: 'Cacti graph_view.php SQL Injection Leads to RCE',
    cve: 'CVE-2023-39361',
    category: 'sql-injection',
    description: 'SQL injection vulnerability that can be escalated to RCE',
    tags: ['cacti', 'sql-injection', 'rce'],
    difficulty: 'medium'
  },
  {
    id: 'metersphere-sql',
    name: 'MeterSphere v1.15.4 Authenticated SQL Injection',
    cve: 'CVE-2021-45788',
    category: 'sql-injection',
    description: 'Authenticated SQL injection in MeterSphere',
    tags: ['metersphere', 'sql-injection', 'authenticated'],
    difficulty: 'easy'
  },
  
  // Path Traversal
  {
    id: 'struts2-upload',
    name: 'Struts2 S2-067 Upload Path Traversal',
    cve: 'CVE-2024-53677',
    category: 'path-traversal',
    description: 'Path traversal vulnerability in file upload functionality',
    tags: ['struts2', 'path-traversal', 'framework', 'upload'],
    difficulty: 'medium'
  },
  {
    id: 'gradio-file-read',
    name: 'Gradio Arbitrary File Read',
    cve: 'CVE-2024-1561',
    category: 'path-traversal',
    description: 'Arbitrary file read via path traversal in Gradio',
    tags: ['gradio', 'llm', 'path-traversal', 'file-read'],
    difficulty: 'easy'
  },
  
  // SSRF
  {
    id: 'geoserver-ssrf',
    name: 'GeoServer Unauthenticated SSRF',
    cve: 'CVE-2021-40822',
    category: 'ssrf',
    description: 'Unauthenticated server-side request forgery in GeoServer',
    tags: ['geoserver', 'ssrf', 'unauthenticated'],
    difficulty: 'medium'
  },
  
  // Deserialization
  {
    id: 'apache-superset-pickle',
    name: 'Apache Superset Python Pickle Deserialization RCE',
    cve: 'CVE-2023-37941',
    category: 'deserialization',
    description: 'Remote code execution via Python pickle deserialization',
    tags: ['apache', 'superset', 'deserialization', 'python', 'rce'],
    difficulty: 'hard'
  },
  {
    id: 'activemq-deserialization',
    name: 'Apache ActiveMQ OpenWire Protocol Deserialization RCE',
    cve: 'CVE-2023-46604',
    category: 'deserialization',
    description: 'Deserialization vulnerability in OpenWire protocol',
    tags: ['activemq', 'message-queue', 'deserialization', 'rce'],
    difficulty: 'hard'
  },
  
  // Database
  {
    id: 'h2-console-rce',
    name: 'H2 Database Web Console Authentication RCE',
    cve: 'CVE-2018-10054',
    category: 'database',
    description: 'Remote code execution via authenticated H2 console',
    tags: ['h2', 'database', 'rce', 'web-console'],
    difficulty: 'medium'
  }
];

// Helper functions
export function getCategoryById(id: string): CategoryInfo | undefined {
  return VULHUB_CATEGORIES.find(cat => cat.id === id);
}

export function getVulnerabilitiesByCategory(categoryId: string): VulnerabilityInfo[] {
  return VULHUB_VULNERABILITIES.filter(vuln => vuln.category === categoryId);
}

export function searchVulnerabilities(query: string): VulnerabilityInfo[] {
  const lowerQuery = query.toLowerCase();
  return VULHUB_VULNERABILITIES.filter(vuln => 
    vuln.name.toLowerCase().includes(lowerQuery) ||
    vuln.description.toLowerCase().includes(lowerQuery) ||
    vuln.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    (vuln.cve && vuln.cve.toLowerCase().includes(lowerQuery))
  );
}

export function searchCategories(query: string): CategoryInfo[] {
  const lowerQuery = query.toLowerCase();
  return VULHUB_CATEGORIES.filter(cat =>
    cat.name.toLowerCase().includes(lowerQuery) ||
    cat.description.toLowerCase().includes(lowerQuery)
  );
}

