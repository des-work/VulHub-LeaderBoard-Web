/**
 * Structured Data Components
 * 
 * JSON-LD structured data for search engines
 * Improves SEO and enables rich snippets
 */

'use client';

import { useEffect } from 'react';

interface OrganizationSchemaProps {
  siteUrl?: string;
  logo?: string;
  socialProfiles?: string[];
}

/**
 * Organization Schema
 * Defines the organization (CSUSB Cybersecurity Program) for search engines
 */
export function OrganizationSchema({
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  logo = '/logo.png',
  socialProfiles = [],
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CSUSB Cybersecurity Program',
    url: siteUrl,
    logo: `${siteUrl}${logo}`,
    ...(socialProfiles.length > 0 && {
      sameAs: socialProfiles,
    }),
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'organization-schema';
    
    // Remove existing script if present
    const existing = document.getElementById('organization-schema');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);
    
    return () => {
      const scriptElement = document.getElementById('organization-schema');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [schema]);

  return null;
}

interface WebSiteSchemaProps {
  siteUrl?: string;
  searchUrl?: string;
}

/**
 * WebSite Schema
 * Defines the website structure and search functionality
 */
export function WebSiteSchema({
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  searchUrl,
}: WebSiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VulHub Leaderboard',
    url: siteUrl,
    description: 'A gamified platform for cybersecurity students to practice, compete, and grow.',
    ...(searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: searchUrl,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'website-schema';
    
    const existing = document.getElementById('website-schema');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);
    
    return () => {
      const scriptElement = document.getElementById('website-schema');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [schema]);

  return null;
}

/**
 * BreadcrumbList Schema
 * For navigation breadcrumbs
 */
export function BreadcrumbListSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'breadcrumb-schema';
    
    const existing = document.getElementById('breadcrumb-schema');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);
    
    return () => {
      const scriptElement = document.getElementById('breadcrumb-schema');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [schema]);

  return null;
}

