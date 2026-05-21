/**
 * ==============================================================================
 * PROFESSOR PRIVATE API - MASTER TEMPLATE VERSION
 * ==============================================================================
 * 
 * PURPOSE: 
 * This script is the "Brain" inside every professor's individual spreadsheet. 
 * When the 'Factory' clones your master sheet, this code is copied with it.
 * 
 * IT HANDLES:
 * 1. The custom 'Absence System' menu (User Interface).
 * 2. Receiving student data from the Master Gateway (API).
 * 3. Sending authentic email receipts to students (Branding).
 * 4. Compiling and sending the Weekly Summary to the professor (Automation).
 */

// ------------------------------------------------------------------------------
// 1. THE USER INTERFACE (Spreadsheet Menu)
// ------------------------------------------------------------------------------

/**
 * The 'onOpen' function is a special Google trigger. 
 * It runs automatically every time the professor opens their sheet.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  
  // Creates a new top-level menu button next to 'Help'
  ui.createMenu('Absence System')
      .addItem('1. Finalize & Activate Setup', 'finalizeSetup') // Button 1
      .addItem('2. Send Manual Weekly Report (Test)', 'sendWeeklyDigest') // Button 2 (For testing)
      .addToUi();
}

/**
 * Runs when the professor clicks 'Finalize & Activate Setup'.
 * Primarily used to trigger the 'Authorization' popup so the script has 
 * permission to send emails from the professor's account.
 */
function finalizeSetup() {
  var ui = SpreadsheetApp.getUi();
  
  // 1. Ask the professor for their newly generated Web App URL
  var response = ui.prompt(
    "Activation Required", 
    "Please paste your Web App URL below (the one you just created in 'Deploy > New Deployment'):", 
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() == ui.Button.OK) {
    var apiUrl = response.getResponseText();
    
    if (apiUrl.indexOf("https://script.google.com") === -1) {
      ui.alert("Error", "That does not look like a valid Google Web App URL. Please try again.", ui.ButtonSet.OK);
      return;
    }

    // 2. Get the unique Course Key hidden in this sheet
    var courseKey = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SYSTEM_CONFIG").getRange("A1").getValue();
    
    // 3. 'Phone Home' to the Master Gateway to register this URL
    // CHANGE THIS URL to your Master Gateway URL
    var masterGatewayUrl = "https://script.google.com/macros/s/[REDACTED_MASTER_GATEWAY_ID]/exec";
    
    var payload = {
      "action": "register",
      "courseKey": courseKey,
      "apiUrl": apiUrl
    };
    
    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload)
    };
    
    try {
      UrlFetchApp.fetch(masterGatewayUrl, options);
      ui.alert("Success!", "Your Absence System is now active and linked to the master directory.", ui.ButtonSet.OK);
    } catch (e) {
      ui.alert("Registration Error", "Could not link to master directory: " + e.toString(), ui.ButtonSet.OK);
    }
  }
}


// ------------------------------------------------------------------------------
// 2. THE API GATEWAY (Student Submission Handler)
// ------------------------------------------------------------------------------

/**
 * The 'doPost' function runs whenever the Master Gateway forwards student data here.
 * Because the Professor 'owns' this script, the emails sent here come from THEM.
 */
function doPost(e) {
  try {
    // Parse the incoming 'package' of data from the Master Gateway
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Logic: Determine if the submission was 'On Time' or 'Late'
    // We compare 'Now' (today) with the 'Absence Date' selected by the student
    var today = new Date();
    var absenceDate = new Date(data.absenceDate);
    var status = (today <= absenceDate) ? "On Time" : "LATE SUBMISSION";
    
    // Log the student's info into the next available row of the spreadsheet
    sheet.appendRow([
      new Date(),       // Column A: Automatic timestamp
      data.name,        // Column B: Student Name
      data.email,       // Column C: Student Email
      data.absenceDate, // Column D: Date of Absence
      data.reason,      // Column E: Reason (from dropdown)
      status            // Column F: Submission Status
    ]);
    
    // CONSTRUCT THE RECEIPT EMAIL
    // Since this script runs as the professor, the email is 100% authentic.
    var emailBody = "Hello " + data.name + ",\n\n" +
                    "This is an automated receipt confirming that your absence notification has been recorded for " + data.absenceDate + ".\n\n" +
                    "Status: " + status + "\n\n" +
                    "Please keep this email for your records.";

    // MailApp is the service that actually sends the email
    MailApp.sendEmail(data.email, "Absence Submission Receipt", emailBody);
    
    // Respond back to the Master Gateway with a 'Success' message
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (f) {
    // If anything breaks, send the technical error back for debugging
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": f.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


// ------------------------------------------------------------------------------
// 3. THE WEEKLY DIGEST (Automated Summary)
// ------------------------------------------------------------------------------

/**
 * Scans the sheet for any entries from the past 7 days, 
 * builds an HTML table, and emails it to the professor.
 */
function sendWeeklyDigest() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues(); // Gets all rows and columns
  var today = new Date();
  
  // Calculate 7 days ago in milliseconds (7 days * 24h * 60m * 60s * 1000ms)
  var oneWeekAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000)); 
  
  // Automatically detects the email of the person who owns/opens this sheet
  var professorEmail = Session.getActiveUser().getEmail(); 
  var rowsToReport = [];
  
  // Loop through the spreadsheet rows (skipping the header at index 0)
  for (var i = 1; i < data.length; i++) {
    var submissionTimestamp = new Date(data[i][0]); // Column A: Timestamp
    
    // If the submission happened within the last 7 days, add it to our report list
    if (submissionTimestamp >= oneWeekAgo) {
      rowsToReport.push(data[i]);
    }
  }
  
  // If no one was absent, send a simple 'Quiet Week' update
  if (rowsToReport.length === 0) {
    MailApp.sendEmail(professorEmail, "Weekly Absence Report: No absences", "No absences were reported this week.");
    return;
  }
  
  // BUILD THE HTML TABLE FOR THE EMAIL
  // We use inline CSS styles to make the table look professional in an inbox
  var tableHtml = "<h2>Weekly Absence Summary</h2>" +
                  "<table border='1' style='border-collapse: collapse; width: 100%; font-family: sans-serif;'>" +
                  "<tr style='background-color: #f2f2f2; text-align: left;'>" +
                  "<th>Student Name</th><th>Email</th><th>Absence Date</th><th>Reason</th><th>Status</th>" +
                  "</tr>";
  
  for (var j = 0; j < rowsToReport.length; j++) {
    tableHtml += "<tr>" +
                 "<td style='padding: 8px;'>" + rowsToReport[j][1] + "</td>" + // Name
                 "<td style='padding: 8px;'>" + rowsToReport[j][2] + "</td>" + // Email
                 "<td style='padding: 8px;'>" + rowsToReport[j][3] + "</td>" + // Date
                 "<td style='padding: 8px;'>" + rowsToReport[j][4] + "</td>" + // Reason
                 "<td style='padding: 8px;'>" + rowsToReport[j][5] + "</td>" + // Status
                 "</tr>";
  }
  tableHtml += "</table>";
  
  // SEND THE EMAIL
  MailApp.sendEmail({
    to: professorEmail,
    subject: "Weekly Absence Report: " + today.toLocaleDateString(),
    htmlBody: tableHtml
  });
}
