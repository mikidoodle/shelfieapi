import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
  return NextResponse.redirect('https://testflight.apple.com/join/cmfmEKkt')
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/review/:uuid*',
}