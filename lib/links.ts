// Function to build deal links with Impact tracking for Udemy
export function buildDealLink(deal: { provider?: string; url: string; impactUrl?: string; coupon?: string }) {
  const provider = String(deal.provider || "").toLowerCase().trim();
  
  // If impactUrl is provided, use it directly
  if (deal.impactUrl && deal.impactUrl.startsWith('http')) {
    console.log('Using provided impactUrl');
    return deal.impactUrl;
  }
  
  try {
    // For Udemy links, we'll let the STAT tag handle the transformation
    if (provider === 'udemy') {
      console.log('Udemy link - STAT tag will handle transformation');
      
      // Just ensure the URL is clean and return it
      const url = new URL(deal.url);
      
      // Remove any tracking parameters that might interfere with STAT tag
      const paramsToRemove = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'irgwc', 'clickid', 'irclickid', 'ir_adid', 'ir_affiliate', 'ir_pi'
      ];
      
      paramsToRemove.forEach(param => {
        url.searchParams.delete(param);
      });
      
      // Preserve coupon code if it exists
      let couponCode = deal.coupon || '';
      if (!couponCode) {
        const couponMatch = deal.url.match(/[?&](?:couponCode|coupon)=([^&]+)/i);
        if (couponMatch) {
          couponCode = decodeURIComponent(couponMatch[1]);
          // Add coupon code to the URL if not already present
          if (!url.searchParams.has('couponCode') && !url.searchParams.has('coupon')) {
            url.searchParams.set('coupon', couponCode);
          }
        }
      }
      
      console.log('Returning clean URL for STAT tag:', url.toString());
      return url.toString();
    }
    
    // For non-Udemy links, return as is
    console.log('Non-Udemy link, returning original URL');
    return deal.url;
    
  } catch (error) {
    console.error('Error processing URL:', error);
    return deal.url; // Fallback to original URL on error
  }
}
