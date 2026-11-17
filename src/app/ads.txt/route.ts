import { NextResponse } from 'next/server';

export async function GET() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'pub-1624182310549814';
  const content = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}