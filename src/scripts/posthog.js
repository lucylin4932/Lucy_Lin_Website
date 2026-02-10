// PostHog Analytics via Supabase Edge Function
import { supabase } from '../integrations/supabase/client.js';

class PostHogTracker {
  constructor() {
    this.distinctId = this.getOrCreateDistinctId();
    this.sessionId = this.getOrCreateSessionId();
  }

  // Generate or retrieve distinct ID for user identification
  getOrCreateDistinctId() {
    let distinctId = localStorage.getItem('posthog_distinct_id');
    if (!distinctId) {
      distinctId = 'user_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('posthog_distinct_id', distinctId);
    }
    return distinctId;
  }

  // Generate or retrieve session ID
  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('posthog_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('posthog_session_id', sessionId);
    }
    return sessionId;
  }

  // Track an event
  async capture(eventName, properties = {}) {
    try {
      const eventData = {
        event: eventName,
        distinctId: this.distinctId,
        properties: {
          ...properties,
          session_id: this.sessionId,
          $current_url: window.location.href,
          $pathname: window.location.pathname,
          $host: window.location.host,
          $referrer: document.referrer,
          $screen_width: window.screen.width,
          $screen_height: window.screen.height,
          $viewport_width: window.innerWidth,
          $viewport_height: window.innerHeight,
          language: navigator.language,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }
      };

      const { data, error } = await supabase.functions.invoke('posthog-track', {
        body: eventData
      });

      if (error) {
        console.error('PostHog tracking error:', error);
      } else {
        console.log('Event tracked:', eventName, data);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  // Track page view
  trackPageView() {
    this.capture('$pageview', {
      page_title: document.title,
      page_language: document.documentElement.lang || 'zh-CN'
    });
  }

  // Identify user (for logged in users)
  identify(userId, userProperties = {}) {
    this.distinctId = userId;
    localStorage.setItem('posthog_distinct_id', userId);
    this.capture('$identify', userProperties);
  }
}

// Create global instance
window.posthog = new PostHogTracker();

// Auto-track page view on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.posthog.trackPageView();
  });
} else {
  window.posthog.trackPageView();
}

// Track navigation clicks
document.addEventListener('click', (e) => {
  const target = e.target.closest('a');
  if (target) {
    const href = target.getAttribute('href');
    const text = target.textContent.trim();
    
    window.posthog.capture('link_clicked', {
      link_text: text,
      link_href: href,
      link_type: href?.startsWith('#') ? 'internal_anchor' : href?.startsWith('http') ? 'external' : 'internal'
    });
  }

  // Track button clicks
  const button = e.target.closest('button');
  if (button) {
    const buttonText = button.textContent.trim();
    const buttonId = button.id || 'unknown';
    
    window.posthog.capture('button_clicked', {
      button_text: buttonText,
      button_id: buttonId
    });
  }
});

// Track scroll depth
let maxScrollDepth = 0;
let scrollCheckpoints = [25, 50, 75, 90, 100];
let trackedCheckpoints = new Set();

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);
  
  if (scrollPercent > maxScrollDepth) {
    maxScrollDepth = scrollPercent;
  }

  scrollCheckpoints.forEach(checkpoint => {
    if (scrollPercent >= checkpoint && !trackedCheckpoints.has(checkpoint)) {
      trackedCheckpoints.add(checkpoint);
      window.posthog.capture('scroll_depth', {
        depth_percentage: checkpoint,
        page_title: document.title
      });
    }
  });
});

// Track time on page
let pageLoadTime = Date.now();
let timeOnPageTracked = false;

window.addEventListener('beforeunload', () => {
  if (!timeOnPageTracked) {
    const timeSpent = Math.round((Date.now() - pageLoadTime) / 1000);
    window.posthog.capture('time_on_page', {
      duration_seconds: timeSpent,
      page_title: document.title,
      max_scroll_depth: maxScrollDepth
    });
    timeOnPageTracked = true;
  }
});

// Track language toggle
window.addEventListener('languageChanged', (e) => {
  window.posthog.capture('language_changed', {
    new_language: e.detail?.language || 'unknown',
    page_title: document.title
  });
});

export default window.posthog;
