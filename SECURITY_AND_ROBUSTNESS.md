# Security & System Robustness Manifesto
## Absence Notification System

This document outlines the architectural safeguards, security protocols, and accessibility standards implemented to ensure the integrity, privacy, and reliability of the Absence Notification System.

---

### 1. Timestamp Integrity (Anti-Spoofing Protocol)
**The Threat:** A student attempts to back-date a late submission by changing the local clock/date on their computer.
**The Defense:** The system employs **Server-Side Authority**.
- The `Status` (On Time vs. Late) is not determined by the student's browser.
- Upon receipt of data, the Google Apps Script Gateway queries its own internal atomic clock (`new Date()`).
- This server-side timestamp is used for all logical calculations, rendering local computer manipulation ineffective.

### 2. Multi-Tenant Data Isolation (The Relay Architecture)
**The Threat:** An unauthorized user attempts to view or edit the absence records of other students or other courses.
**The Defense:** The system uses a **Blind Relay** architecture.
- **Master Gateway:** The central switchboard (owned by the admin) handles routing; it does not store the content of student absences.
- **Private APIs:** Each professor owns their own spreadsheet and private API URL. 
- **No Read Access:** The student extension is "Write-Only." It has no technical mechanism to read data back or query the database.

### 3. Privacy by Design (PII Minimization)
**The Threat:** Exposure of sensitive data in the event of a breach.
**The Defense:** **Minimal Data Collection**.
- The system explicitly avoids collecting sensitive identifiers such as University IDs.
- **Email as Identifier:** Uses the student's university email as the primary identifier, serving both for logging and the delivery of the automated receipt.

### 4. Input Validation & Verification
**The Threat:** Incomplete or "nonsense" data submissions.
**The Defense:** **Double-Layer Validation**.
- **Client-Side:** The Chrome Extension validates that all fields are populated before transmission.
- **Key Verification:** The Master Gateway verifies the `Course Key` against a master directory. Invalid keys are rejected at the gateway.

### 5. Automated Receipt & The "Paper Trail"
**The Threat:** Dispute over submission existence.
**The Defense:** **Automated Receipting**.
- Every successful submission triggers an immediate email receipt sent to the student.
- This receipt contains the server-side timestamp and exact data submitted, serving as the official record of notice.

### 6. Professor-Controlled Ownership
**The Threat:** Unauthorized administrative access to private faculty records.
**The Defense:** **Direct Ownership**.
- Professors are the owners of their specific spreadsheets and scripts. 
- They control sharing permissions and can deactivate their system at any time by stopping their private deployment.

### 7. Structural Portal Separation (Interface Isolation)
**The Threat:** Accidental or malicious interference with the administrative Factory script.
**The Defense:** **Physical URL Decoupling**.
- **Student Landing Page:** Publicly accessible hub for downloads and instructions.
- **Professor Portal:** Hosted on a separate, un-indexed "Hidden URL" to prevent unauthorized access.

### 8. Authorization Gating (Access Code Protection)
**The Threat:** Unauthorized users or bots triggering the automated creation of course databases.
**The Defense:** **Two-Factor Authorization**.
- The Professor Portal requires a specific **System Access Code** (`[REDACTED_FOR_PORTFOLIO]`) to reveal the registration form.
- The Master Gateway performs a secondary server-side check; it will reject any `register_prof` request that does not include this secret passcode.

### 9. Permission Rationale & Transparency
**The Concern:** High-level permission requests (Spreadsheets/Email) during activation.
**The Explanation:** These are **Standard Scopes** required for core functionality.
- **Spreadsheet Access:** Required to write data to the log. The script only interacts with the active sheet it is bound to.
- **Email Access:** Required to send authentic receipts on the professor's behalf to the student.
- **Safeguard:** Code is 100% transparent. Professors own their clone and can inspect every line of logic before authorizing.

### 10. Inclusive Design & Accessibility Compliance
**The Threat:** Exclusion of users with visual impairments or those using assistive technologies.
**The Defense:** **WCAG 2.1 Level AA Adherence**.
- **Institutional Branding:** Uses official Penn State colors tested for high contrast.
- **Typography:** Implements **Roboto**, a highly legible sans-serif typeface, with body text set to accessible **Slate Gray** (`#31343A`) to reduce ocular fatigue.
- **Structural Hierarchy:** HTML follows a sequential heading hierarchy (H1 > H2 > H3) for optimized screen-reader navigation.
- **Responsive Adaptability:** All portals are mobile-responsive, ensuring functionality across all device types.

### 11. Cloud Infrastructure & Version Security
**The Threat:** Code tampering, accidental deletion, or unauthorized source code inspection.
**The Defense:** **Secure Repository Management**.
- **Version Control Safety:** GitHub maintains a permanent record of all code changes, allowing for instantaneous system restoration in the event of an error or breach.
- **Static Hosting Sandbox:** GitHub Pages only serves static content (HTML/CSS/JS). The absence of a live server runtime on GitHub eliminates common vulnerabilities such as SQL injection or server-side script execution.
- **Sensitive Data Decoupling:** No student absence data is stored on GitHub. Data remains strictly within the encrypted Google Enterprise environment, ensuring that a breach of the code repository does not result in a breach of student privacy.
- **Private Repository Masking:** Utilizing private repositories for hosting ensures that the underlying source code remains hidden from the general public while the front-facing portals remain functional for students and staff.

### 12. Analytical Integrity (Visual Accuracy)
**The Threat:** Misleading or manipulated visual data leading to incorrect faculty decisions.
**The Defense:** **Automated Server-Side Aggregation**.
- **Query Gating:** The "Analytics Dashboard" does not rely on manual data entry or client-side calculations. It uses secure, server-side Query Language (GQL) to pull directly from the raw, timestamped log.
- **Immutable Logic:** Formulas are "pre-loaded" into the Golden Template, ensuring that every professor uses the exact same validated logic for calculating crisis dates and attendance trends.
- **Source-Truth Synchronization:** Charts update automatically as data arrives in the master log, eliminating the risk of human error or "stale" data visualization.

---
**Conclusion:** 
The Absence Notification System is designed with a "Security-First" and "Inclusive-Always" mindset. By combining server-side logic, data isolation, administrative gating, secure cloud infrastructure, and total accessibility, the system provides a professional, tamper-proof, and data-driven environment for the entire academic community.
