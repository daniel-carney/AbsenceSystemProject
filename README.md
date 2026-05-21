# Absence Notification System

## Overview
A scalable, multi-tenant academic communication system designed to replace unstructured absence emails with a professional data stream. This repository serves as a **Sanitized Blueprint** demonstrating full-stack architecture, institutional-grade UI/UX, and automated SaaS provisioning.

### 🔑 Key Engineering Highlights
- **Full-Stack Relay Architecture:** Uses a central Master Gateway (Google Apps Script) to route student data to private, professor-owned databases.
- **Automated Provisioning Engine:** Features a custom-built "Factory" script that autonomously clones templates, manages permissions, and registers new courses via a secure portal.
- **Institutional Brand Alignment:** Developed with high-fidelity adherence to university brand guidelines, including exact color palettes and the official Roboto typeface.
- **Accessibility & Inclusion:** Built to **WCAG 2.1 Level AA** standards, ensuring usability for all students via high-contrast design and screen-reader-optimized HTML.
- **Security-First Design:** Implements server-side timestamp authority, authorization gating (access code verification), and structural interface isolation.

---

## 🏗️ Architecture
1. **Chrome Extension (Frontend):** A write-only tool for students to submit notifications securely.
2. **Master Gateway (Router):** A central Switchboard that handles data routing and administrative handshakes.
3. **Automated Factory (Automation):** A provisioning logic that scales the system to an unlimited number of courses.
4. **Institutional Portals (Web):** Distinct student and faculty interfaces designed for high engagement and secure administration.

---

## 🔒 Security & Privacy
This project was built with student privacy as a foundational requirement.
- **PII Minimization:** No sensitive University ID numbers are collected.
- **Data Isolation:** The Relay system ensures that data is stored in professor-owned spreadsheets, unreachable by other faculty or the central admin.
- **Transparency:** All backend logic is transparent and verifiable by institutional IT departments.

---

## 💼 Portfolio Note
*This repository has been sanitized for security purposes. Production API URLs, Spreadsheet IDs, and System Passcodes have been replaced with `[REDACTED]` placeholders to protect the live university instance while showcasing the underlying engineering logic and architectural design.*

---
**Built with logic, math, and a commitment to academic excellence.**
