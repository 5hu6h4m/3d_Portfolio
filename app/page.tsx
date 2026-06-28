/**
 * app/page.tsx — Server Component Entry Point
 *
 * Intentionally a Server Component (no 'use client').
 * `dynamic = 'force-dynamic'` prevents Next.js from statically prerendering
 * this route, which would crash because the portfolio uses browser-only APIs
 * (WebGL, AudioContext, Lenis smooth scroll).
 *
 * The entire portfolio is loaded client-side only via next/dynamic with ssr:false,
 * so no browser globals are ever accessed during the Node.js build phase.
 */
export const dynamic = 'force-dynamic';

import loadDynamic from 'next/dynamic';

// Load the entire portfolio experience client-side only.
// ssr: false ensures PortfolioClient.tsx is NEVER executed in Node.js.
const PortfolioApp = loadDynamic(
  () => import('../components/PortfolioClient'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#030712',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f97316',
          fontFamily: 'monospace',
          gap: '12px'
        }}
      >
        <div style={{ fontSize: '11px', letterSpacing: '0.3em', opacity: 0.7 }}>
          HIDDEN LEAF COMMAND FILE
        </div>
        <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.2em' }}>
          INITIALIZING SHINOBI WORLD...
        </div>
      </div>
    )
  }
);

export default function Page() {
  return <PortfolioApp />;
}
