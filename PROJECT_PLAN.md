# Project Blueprint: Weekly Digest Absence System (Enterprise Relay Edition)

## Overview
A scalable, multi-tenant academic communication system. 
- **Students** use a single Chrome Extension to submit absences.
- **Master Gateway** acts as a central switchboard to route data securely.
- **Professor Sheets** are private, professor-owned databases that log data and send authentic university emails.
- **Factory System** automates the creation, sharing, and registration of new course systems.

---

## 1. Architecture: The Relay System
- **Chrome Extension (Frontend):** A single tool for all students. It captures data + a `Course Key` and communicates exclusively with the Master Gateway.
- **Master Gateway (Switchboard):** A central script that handles routing logic, professor registration, and security gating.
- **Master Directory (Admin Database):** A private Google Sheet (owned by Admin) that maps `Course Keys` to specific `Professor API URLs`.
- **Professor Private API:** A script inside each professor's sheet that runs as THEM (ensuring genuine university email receipts).

---

## 2. Phase 1: The Master Infrastructure (Completed ✅)
The central "Brain" of the system.
- **Master Directory:** Tracks all participating courses and their backend status.
- **Master Gateway Script (`MASTER_GATEWAY.js`):** Intelligently routes student submissions (`submit`), handles professor handshakes (`register`), and triggers the automation factory (`register_prof`).

---

## 3. Phase 2: The Professor Template (Completed ✅)
The "Golden Blueprint" cloned for every new course.
- **Design:** Institutional high-fidelity theme using Penn State Navy and Beaver Blue.
- **Formatting:** Dynamic zebra stripes, frozen headers, and 8-point rhythmic spacing.
- **Automation:** 
  - **Absence System Menu:** Allows one-click "Finalize & Activate" setup.
  - **Weekly Digest:** Automatic Friday summary emails with tabular data formatting.
  - **SYSTEM_CONFIG:** Hidden configuration layer that stores course-specific metadata.
  - **Analytics Dashboard:** An automated visual reporting tab featuring:
    - **Detection:** Bar charts identifying the "Top 5" most missed dates.
    - **Trends:** Chronological line charts visualizing attendance patterns over the semester.
    - **Dynamic Queries:** Uses Google Query Language (GQL) for real-time data aggregation.

---

## 4. Phase 3: The Automated Onboarding Wizard (Completed ✅)
The self-service "Assembly Line."
- **The Factory Script (`MASTER_FACTORY.js`):** Autonomously clones the template, grants professor permissions, generates unique Course Keys, and initiates the routing bridge.
- **The Welcome Kit:** An automated, proactive email that guides faculty through a 3-minute technical activation process with full security transparency.

---

## 5. Phase 4: Portals & Integration (Completed ✅)
Professional web interfaces for students and faculty.
- **Student Portal (`student_portal.html`):** An engaging, modern landing page with clear 1-2-3 instructions and an integrated "Important Note" regarding syllabus policy.
- **Professor Portal (`admin_portal.html`):** A secure, hidden administrative tool featuring **Access Code Gating** and a real-time status console for course provisioning.

---

## 6. Institutional Alignment & Accessibility
The system is built to adhere to official **Penn State University Online Standards**.
- **Official Branding:** Implements exact HEX codes for Nittany Navy (`#001E44`), Beaver Blue (`#1E407C`), and Puissant Blue (`#005DAA`).
- **Typography:** Utilizes **Roboto** for maximum legibility across all digital interfaces.
- **Watermark Branding:** Employs a subtle 10% opacity background logo in the header for a professional, integrated aesthetic.
- **WCAG 2.1 Compliance:** High color contrast and accessible Slate Gray text (`#31343A`) ensure inclusivity for all users.

---

## 7. Security & Robustness Highlights
- **Server-Side Timestamp Authority:** Prevents student clock-spoofing via Google's atomic clock.
- **Interface Isolation:** Physical decoupling of student and professor portals via hidden URLs.
- **Authorization Gating:** Passcode verification protects the Factory engine from unauthorized use.
- **Data Isolation:** Blind Relay architecture ensures no cross-professor data exposure.

---

## 8. Phase 5: Portfolio & Resumé Strategy
To demonstrate engineering proficiency to prospective employers while maintaining system security.
- **Dual-Repository Model:** 
  - **Private Production Repo:** Contains live API URLs and system access codes for actual university use.
  - **Public Portfolio Repo:** A "Sanitized" version where all sensitive secrets are replaced with placeholders (e.g., `YOUR_API_URL_HERE`).
- **Resumé Highlights:**
  - Full-stack architecture using Google Apps Script (Backend) and Chrome Extensions (Frontend).
  - Institutional high-fidelity UI/UX design (WCAG 2.1 compliant).
  - Automated SaaS provisioning engine ("The Factory").
  - Comprehensive documentation including a formal Security & Robustness Manifesto and Privacy Policy.

---

## 9. Final Launch Checklist
- [ ] Create **Private** GitHub Repository (Production).
- [ ] Upload `student_portal.html` and `faculty-resources.html`.
- [ ] Implement Chrome Extension Storage Persistence.
- [ ] Create "Sanitized" branch/repo for Public Portfolio.
- [ ] Create Privacy Policy document.
- [ ] Submit to Chrome Web Store.
