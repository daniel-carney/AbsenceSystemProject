/**
 * ABSENCE NOTIFICATION SYSTEM - LOGIC CONTROLLER
 * Handles form validation, data packaging, and persistent storage.
 * 
 * PORTFOLIO VERSION: Sanitized for security.
 */

// 1. INITIALIZATION: Load saved data when the popup opens
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['courseKey', 'name', 'email'], (result) => {
    if (result.courseKey) document.getElementById('courseKey').value = result.courseKey;
    if (result.name) document.getElementById('name').value = result.name;
    if (result.email) document.getElementById('email').value = result.email;
  });
});

// Listener: Runs whenever the 'Submit Notification' button is clicked
document.getElementById('submitBtn').addEventListener('click', async () => {

  // 2. DATA COLLECTION
  const courseKey = document.getElementById('courseKey').value.trim();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const date = document.getElementById('date').value;
  const reason = document.getElementById('reason').value;
  const statusDiv = document.getElementById('status');

  // 3. FRONT-END VALIDATION
  if (!courseKey || !name || !email || !date) {
    statusDiv.innerText = "❌ Please fill out all fields.";
    statusDiv.style.color = "red";
    return;
  }

  // PERSISTENCE: Save the info for next time
  chrome.storage.local.set({
    courseKey: courseKey,
    name: name,
    email: email
  });

  // 4. UI PROGRESS FEEDBACK
  statusDiv.innerText = "⏳ Submitting to University Cloud...";
  statusDiv.style.color = "#001E44"; // Navy

  // 5. DATA PACKAGING (JSON)
  const payload = {
    action: "submit",
    courseKey: courseKey,
    name: name,
    email: email,
    absenceDate: date,
    reason: reason
  };

  try {
    // 6. SECURE TRANSMISSION (AJAX Fetch)
    // REDACTED: Production endpoint replaced with placeholder for portfolio safety
    const response = await fetch("https://script.google.com/macros/s/[REDACTED_FOR_PORTFOLIO]/exec", {
      method: "POST", 
      headers: { "Content-Type": "text/plain;charset=utf-8" }, 
      body: JSON.stringify(payload) 
    });

    // 7. RESPONSE ANALYSIS
    const result = await response.json();

    if (result.result === "success") {
      statusDiv.innerText = "✅ Submission Sent! Check your email.";
      statusDiv.style.color = "green";
      
      document.getElementById('name').value = "";
      document.getElementById('email').value = "";
      document.getElementById('date').value = "";
    } else {
      statusDiv.innerText = "❌ " + (result.message || "Error sending.");
      statusDiv.style.color = "red";
    }
    
  } catch (error) {
    statusDiv.innerText = "❌ Connection Error (Redacted Endpoint).";
    statusDiv.style.color = "red";
    console.log("Note: This error is expected as the production URL is redacted.");
  }
});
