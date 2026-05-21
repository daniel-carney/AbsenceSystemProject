/**
 * ==============================================================================
 * MASTER FACTORY SCRIPT
 * ==============================================================================
 * 
 * ROLE: The "Assembly Line"
 * This script automates the creation of a unique Absence Notification System 
 * for every professor who registers. 
 * 
 * THE LIFECYCLE:
 * 1. Clone the 'Golden Template' sheet.
 * 2. Share ownership with the professor.
 * 3. Generate a unique Course Key.
 * 4. Register the course in the Master Directory.
 * 5. Email the professor the 'Welcome Kit' with activation steps.
 */

/**
 * TEST FUNCTION: Used by the admin to manually trigger a registration.
 */
function runFactoryTest() {
  var profName = "Test Professor";
  var profEmail = "[REDACTED_ADMIN_EMAIL]"; 
  var courseName = "Intro to Web Development";
  
  registerNewProfessor(profName, profEmail, courseName);
}

/**
 * THE ENGINE: Handles the heavy lifting of cloning and sharing.
 */
function registerNewProfessor(profName, profEmail, courseName) {
  // CONFIGURATION: The ID of your professionally styled 'Golden Template'
  var templateId = "[REDACTED_GOOGLE_SHEET_ID]"; 
  
  var masterSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    // --------------------------------------------------------------------------
    // 1. COURSE KEY GENERATION
    // --------------------------------------------------------------------------
    // Format: [LASTNAME]-[COURSENAME]-[RANDOM_4_DIGIT_CODE]
    var lastName = profName.split(' ').pop().toUpperCase();
    var cleanCourse = courseName.replace(/\s+/g, '').toUpperCase();
    var randomCode = Math.floor(1000 + Math.random() * 9000);
    var courseKey = lastName + "-" + cleanCourse + "-" + randomCode;

    // --------------------------------------------------------------------------
    // 2. DOCUMENT CLONING & PERMISSIONS
    // --------------------------------------------------------------------------
    var templateFile = DriveApp.getFileById(templateId);
    // Create a pixel-perfect copy of the template including all script code
    var newFile = templateFile.makeCopy("Absence Log: " + courseName + " (" + profName + ")");
    
    // Grant the professor Editor access immediately
    newFile.addEditor(profEmail);
    var newSheetUrl = newFile.getUrl();
    var newSheetId = newFile.getId();
    
    // --------------------------------------------------------------------------
    // 3. INTERNAL CONFIGURATION (The 'Memory')
    // --------------------------------------------------------------------------
    // We create a hidden sheet to store the Course Key. This allows the sheet
    // to 'know' who it belongs to when it tries to register its API URL later.
    var newSheet = SpreadsheetApp.openById(newSheetId);
    var configSheet = newSheet.insertSheet("SYSTEM_CONFIG");
    configSheet.hideSheet(); // Keep the config sheet hidden from the professor
    configSheet.getRange("A1").setValue(courseKey);

    // --------------------------------------------------------------------------
    // 4. MASTER DIRECTORY LOGGING
    // --------------------------------------------------------------------------
    // Row format: [Course Key, Prof Email, Private API URL (Empty), Sheet Link]
    masterSheet.appendRow([
      courseKey, 
      profEmail, 
      "",           // Placeholder for the URL the professor will provide
      newSheetUrl
    ]);

    // --------------------------------------------------------------------------
    // 5. THE WELCOME KIT (Professional Communication)
    // --------------------------------------------------------------------------
    var welcomeBody = "Hello Professor " + profName + ",\n\n" +
                      "Your automated absence tracking system for " + courseName + " has been created.\n\n" +
                      "--- ACTION REQUIRED: 3-MINUTE ACTIVATION ---\n" +
                      "- (Note: You will be asked to grant permissions for the script to run; please see the security section below for details).\n\n" +
                      "1. OPEN YOUR SHEET: " + newSheetUrl + "\n\n" +
                      "2. GENERATE YOUR API URL:\n" +
                      "   - Inside the sheet, go to 'Extensions' > 'Apps Script'.\n" +
                      "   - Click the blue 'Deploy' button (top right) > 'New Deployment'.\n" +
                      "   - Select 'Web App'. Set 'Execute as' to 'Me' and 'Who has access' to 'Anyone'.\n" +
                      "   - Click 'Deploy' and COPY the provided Web App URL.\n\n" +
                      "3. ACTIVATE:\n" +
                      "   - Go back to the Spreadsheet tab.\n" +
                      "   - Click the 'Absence System' menu at the top and select 'Finalize & Activate Setup'.\n" +
                      "   - Paste your copied URL into the box and click OK.\n\n" +
                      "Your unique Course Key for students is: " + courseKey + "\n\n" +
                      "--- SECURITY & PRIVACY NOTE ---\n" +
                      "To ensure students' data stays in your control, this system is 'Professor-Owned.' All logic runs directly within your University Google account. \n\n" +
                      "When you click 'Deploy' or 'Finalize Setup', you will see a standard Google security prompt; this is required for the script to log student data to your sheet and send automated receipts to students. \n\n" +
                      "Because you own this script, the code is 100% transparent and can be inspected by you or your IT department at any time.\n\n" +
                      "Thank you for using the Absence Notification System!";

    // Dispatch the email from the admin's account
    MailApp.sendEmail(profEmail, "ACTION REQUIRED: Your Absence System is Ready", welcomeBody);

    Logger.log("Successfully created course: " + courseKey);
    return "Success! Course Key: " + courseKey;

  } catch (e) {
    // Error Logging for Admin troubleshooting
    Logger.log("Factory Error: " + e.toString());
    return "Error: " + e.toString();
  }
}
