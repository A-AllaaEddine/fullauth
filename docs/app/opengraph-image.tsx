import { ImageResponse } from 'next/og';

export const alt = 'FullAuth — TypeScript authentication for web and mobile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 82px',
          background: '#f4f2eb',
          color: '#17221f',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 26, fontWeight: 700 }}>
          <svg width="52" height="52" viewBox="12 8 76 88" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#17221F" d="M43 12h35v17H63c-7 0-11 4-11 11v2H32v-5c0-15 4-25 11-25Z" />
            <path fill="#2E8A62" d="M32 46h54L73 61c-2 3-5 4-9 4H14l13-15c1-2 3-4 5-4Z" />
            <path fill="#17221F" d="M33 70h20v10c0 9-5 14-14 14h-6V70Z" />
          </svg>
          <span>fullauth</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 64, lineHeight: 1.05, letterSpacing: -3, fontWeight: 700 }}>One auth core. Every surface.</div>
          <div style={{ fontSize: 26, color: '#58635c' }}>TypeScript · Next.js · React · React Native</div>
        </div>
        <div style={{ width: '100%', height: 1, background: '#d7d9d0' }} />
      </div>
    ),
    { ...size },
  );
}
