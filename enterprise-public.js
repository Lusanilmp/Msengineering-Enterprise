(() => {
  'use strict';
  const config = window.MSE_CONFIG || {};
  function safeGoogleUrl(value) {
    try { const url = new URL(value); return url.protocol === 'https:' && (url.hostname === 'g.page' || url.hostname === 'maps.app.goo.gl' || /(^|\.)google\.(com|co\.za)$/.test(url.hostname)) ? url.href : null; } catch { return null; }
  }
  const profile = document.getElementById('google-profile-link');
  const review = document.getElementById('google-review-link');
  const profileUrl = safeGoogleUrl(config.googleProfileUrl);
  const reviewUrl = safeGoogleUrl(config.googleReviewUrl);
  if (profile && profileUrl) { profile.href = profileUrl; profile.textContent = 'View Google reviews'; }
  if (review && reviewUrl) { review.href = reviewUrl; review.hidden = false; }
})();
