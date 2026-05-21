/**
 * ABSENCE NOTIFICATION SYSTEM - LOGIC CONTROLLER
 * Handles form validation, data packaging, and secure transmission.
 */

// Listener: Runs whenever the 'Submit Notification' button is clicked
document.getElementById('submitBtn').addEventListener('click', async () => {
  
  // 1. DATA COLLECTION
  // Capture values currently typed into the HTML input fields
  const courseKey = document.getElementById('courseKey').value.trim();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const date = document.getElementById('date').value;
  const reason = document.getElementById('reason').value;
  const statusDiv = document.getElementById('status');

  // 2. FRONT-END VALIDATION
  // Prevents empty submissions and ensures basic data integrity
  if (!courseKey || !name || !email || !date) {
    statusDiv.innerText = "❌ Please fill out all fields.";
    statusDiv.style.color = "red";
    return; // Exit function early if validation fails
  }

  // 3. UI PROGRESS FEEDBACK
  statusDiv.innerText = "⏳ Submitting to University Cloud...";
  statusDiv.style.color = "#001E44"; // Navy

  // 4. DATA PACKAGING (JSON)
  // We include 'action: submit' so the Master Gateway knows this is a student entry
  const payload = {
    action: "submit",
    courseKey: courseKey,
    name: name,
    email: email,
    absenceDate: date,
    reason: reason
  };

  try {
    // 5. SECURE TRANSMISSION (AJAX Fetch)
    // We send a POST request to the Master Gateway URL.
    const response = await fetch("https://script.google.com/macros/s/[REDACTED_MASTER_GATEWAY_ID]/exec", {
      method: "POST", 
      headers: { "Content-Type": "text/plain;charset=utf-8" }, 
      body: JSON.stringify(payload) 
    });

    // 6. RESPONSE ANALYSIS
    // The Gateway responds with JSON indicating if the key was valid and the relay was successful.
    const result = await response.json();

    if (result.result === "success") {
      // SUCCESS STATE: Notification confirmed
      statusDiv.innerText = "✅ Submission Sent! Check your email.";
      statusDiv.style.color = "green";
      
      // Clear inputs (except Course Key) so students don't double-submit by accident
      document.getElementById('name').value = "";
      document.getElementById('email').value = "";
      document.getElementById('date').value = "";
    } else {
      // ERROR STATE: Usually caused by an incorrect Course Key
      statusDiv.innerText = "❌ " + (result.message || "Error sending.");
      statusDiv.style.color = "red";
    }
    
  } catch (error) {
    // NETWORK ERROR: Internet down or Google services unreachable
    statusDiv.innerText = "❌ Connection Error. Try again.";
    statusDiv.style.color = "red";
    console.error("Technical Debug Info:", error); 
  }
});
