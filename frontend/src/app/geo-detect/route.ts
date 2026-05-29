import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    
    // Obtain the actual client IP
    let ip = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || '');
    
    // If running locally, we might not have a public IP to look up
    if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      ip = '';
    }

    const geoUrl = ip 
      ? `https://get.geojs.io/v1/ip/country/${ip}.json` 
      : 'https://get.geojs.io/v1/ip/country.json';

    const geoResponse = await fetch(geoUrl, { cache: 'no-store' });
    
    if (geoResponse.ok) {
      const geoData = await geoResponse.json();
      const countryCode = geoData?.country;

      if (countryCode === "AR") return NextResponse.json({ country: "AR" });
      if (countryCode === "DO") return NextResponse.json({ country: "DO" });
    }
    
    return NextResponse.json({ country: "OTHER" });
  } catch (error) {
    console.error("Error in geo API:", error);
    return NextResponse.json({ country: "OTHER" });
  }
}
