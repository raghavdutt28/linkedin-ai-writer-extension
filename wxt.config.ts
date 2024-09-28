import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  runner: {
    startUrls: ["https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin"],
  },
  manifest: {
    permissions: ['storage', 'tabs'],
    name: "Linkedin AI Reply",
    description: "Automatically reply to LinkedIn messages using AI models",
    "action": {
      "default_icon": {
        "16": "icon/16.png",
        "32": "icon/32.png",
        "48": "icon/48.png",
        "96": "icon/96.png",
        "128": "icon/128.png"
      }
    },
    "web_accessible_resources": [
      {
        "resources": ["icon/*"],
        "matches": ["*://*.linkedin.com/*"]
      }
    ],
  },
});


