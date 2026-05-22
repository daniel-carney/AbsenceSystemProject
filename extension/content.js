/**
 * ABSENCE NOTIFICATION SYSTEM - CONTENT SCRIPT
 * This script runs automatically when a student visits the Student Portal.
 * It listens for Course Keys in the URL and saves them for the student.
 * 
 * PORTFOLIO VERSION: Sanitized for security.
 */

// 1. INITIALIZATION
console.log("Absence Notification System: Deep Linking Active.");

/**
 * DEEP LINKING LOGIC
 * Automatically captures Course Keys from the URL (e.g. ?key=SMITH-BIO101)
 */
function handleDeepLink() {
  // Parse the current URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const courseKey = urlParams.get('key');

  if (courseKey) {
    console.log("Course Key detected in URL: " + courseKey);

    // Save the key to the extension's local storage
    chrome.storage.local.set({ 'courseKey': courseKey.toUpperCase() }, () => {
      console.log("Course Key has been auto-registered.");
      
      // Provide feedback on the webpage itself
      const statusNote = document.createElement('div');
      statusNote.style = "background: #28a745; color: white; padding: 10px; text-align: center; font-weight: bold; position: sticky; top: 0; z-index: 9999;";
      statusNote.innerText = "✓ COURSE KEY REGISTERED: " + courseKey.toUpperCase();
      document.body.prepend(statusNote);

      // Remove the key from the URL to keep things clean
      window.history.replaceState({}, document.title, window.location.pathname);
    });
  }
}

// Execute the check when the page finishes loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleDeepLink);
} else {
  handleDeepLink();
}
