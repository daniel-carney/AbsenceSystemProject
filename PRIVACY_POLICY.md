# Privacy Policy: Absence Notification System

**Effective Date:** May 22, 2026

The Absence Notification System is built with a "Privacy-First" architecture, specifically designed for university environments. This policy outlines how data is handled within the system.

### 1. Data Collection
We believe in data minimization. The system only collects information necessary to notify a professor of an absence:
- **Student Name:** To identify the individual.
- **University Email:** To deliver an automated receipt.
- **Absence Details:** Date and reason for absence.
- **Course Key:** To route the data to the correct professor.

**Note:** We explicitly do NOT collect sensitive identifiers such as University ID numbers.

### 2. Data Storage & Ownership
- **Multi-Tenant Isolation:** All absence data is stored directly within the **Professor's private Google Spreadsheet**.
- **No Central Database:** We do not maintain a central database of student absences. Once the data is relayed to the professor, it exists only within their university-managed Google Workspace.
- **Write-Only Access:** The Chrome Extension is "Write-Only." It can push data to a professor's sheet but has no technical mechanism to read or query existing data.

### 3. Extension Permissions
The extension requires minimal permissions to function:
- **Storage:** Used only to "remember" your Name, Email, and Course Key on your local device for ease of use.
- **Host Permissions:** Used only to communicate with the Master Gateway and the official Student Portal. We do **not** track your browsing history or access data on unrelated websites.

### 4. Third-Party Sharing
We do not sell, trade, or share any data with third parties. All communication occurs strictly between the student's browser and the university-managed Google Cloud environment.

### 5. Transparency
The source code for this system is open and verifiable. Professors own their individual instances of the logic, allowing for full institutional audit and control.


