/**
 * Global Loading Page
 * 
 * Displayed during page transitions in Next.js
 */

import { PageLoader } from '../components/common/Loading';

export default function Loading() {
  return <PageLoader message="Loading page..." />;
}

