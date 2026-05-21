/**
 * ==============================================================================
 * MASTER GATEWAY SCRIPT
 * ==============================================================================
 * 
 * ROLE: The "Central Switchboard"
 * This script is the single point of contact for the Chrome Extension and Portals.
 * 
 * ACTIONS HANDLED:
 * 1. 'submit'        -> Relays student absence data to a professor's private API.
 * 2. 'register'      -> (Handshake) Links a professor's live URL to a Course Key.
 * 3. 'register_prof' -> (Factory) Creates a brand new course system for a professor.
 */

const SYSTEM_PASSCODE = "[REDACTED_FOR_SECURITY]"; // Placeholder for public portfolio

function doPost(e) {
  try {
    // 1. DATA EXTRACTION
    var data = JSON.parse(e.postData.contents);
    
    // 2. RESOURCE INITIALIZATION
    var masterSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var directory = masterSheet.getDataRange().getValues();
    
    // --------------------------------------------------------------------------
    // ACTION CASE A: FACTORY REGISTRATION (From Admin Portal)
    // --------------------------------------------------------------------------
    if (data.action === "register_prof") {
      // Security Check: Verify the passcode before triggering the Factory
      if (data.passcode !== SYSTEM_PASSCODE) {
        return ContentService.createTextOutput(JSON.stringify({ 
          "result": "error", "message": "Unauthorized: Invalid System Passcode" 
        })).setMimeType(ContentService.MimeType.JSON);
      }

      // Trigger the Factory Script (logic found in MASTER_FACTORY.js)
      var result = registerNewProfessor(data.profName, data.profEmail, data.courseName);
      
      return ContentService.createTextOutput(JSON.stringify({ 
        "result": "success", "message": result 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // --------------------------------------------------------------------------
    // ACTION CASE B: PROFESSOR API HANDSHAKE (Linking Column C)
    // --------------------------------------------------------------------------
    if (data.action === "register") {
      for (var i = 1; i < directory.length; i++) {
        if (directory[i][0] === data.courseKey) {
          masterSheet.getRange(i + 1, 3).setValue(data.apiUrl);
          return ContentService.createTextOutput(JSON.stringify({ 
            "result": "success", "message": "API URL Registered Successfully" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ 
        "result": "error", "message": "Course Key not found in Master Directory." 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // --------------------------------------------------------------------------
    // ACTION CASE C: STUDENT SUBMISSION (Relay)
    // --------------------------------------------------------------------------
    var targetApiUrl = "";
    for (var i = 1; i < directory.length; i++) {
      if (directory[i][0] == data.courseKey) {
        targetApiUrl = directory[i][2]; 
        break;
      }
    }
    
    if (targetApiUrl === "" || targetApiUrl == null) {
      return ContentService.createTextOutput(JSON.stringify({ 
        "result": "error", "message": "Invalid Course Key. Please check your syllabus." 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var options = {
      'method' : 'post',
      'contentType': 'application/json',
      'payload' : JSON.stringify(data)
    };
    
    var response = UrlFetchApp.fetch(targetApiUrl, options);
    return ContentService.createTextOutput(response.getContentText()).setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      "result": "error", "message": "Gateway System Error: " + error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
