# Lotlite Edu Backend API Documentation

This document outlines the available REST API endpoints for the Lotlite Edu backend service. The server runs locally on `http://localhost:5000` by default. All endpoints are prefixed with `/api`.

---

## 1. Leads Service

Handles the creation of leads, saving them to the database, and forwarding them to external CRMs like Callyzer.

### Create Lead
* **Endpoint:** `/api/leads`
* **Method:** `POST`
* **Description:** Saves a new lead in MongoDB and forwards the lead data to the Callyzer
* **Headers:** `Content-Type: application/json`
* **Body:**
```json
{
  "fullName": "John Doe",
  "email": "johndoe@example.com",
  "phone": "9876543210",
  "programCategory": "UG Program",
  "programSpecialization": "BBA",
  "lead_tags": ["Lotlite Edu"]
}
```

### Proxy Callyzer Lead
* **Endpoint:** `/api/callyzer/lead`
* **Method:** `POST`
* **Description:** Acts as a direct proxy to the Callyzer CRM `lead/capture` endpoint without saving the lead locally.
* **Headers:** `Content-Type: application/json`
* **Body:** This endpoint accepts the exact raw payload required by the Callyzer API. Below is the transformed payload that the `/api/leads` route currently generates under the hood:
```json
{
  "leads": [
    {
      "first_name": "Joh",
      "last_name": "n Doe",
      "contact_numbers": [
        "91-9876543210"
      ],
      "fields": {
        "InputBox1780143703106": "johndoe@example.com",
        "InputBox1780143703123": "UG Program",
        "InputBox1780143703131": "BBA"
      }
    }
  ],
  "lead_tags": [
    "Lotlite Edu"
  ],
  "assignment": {
    "strategy": "Round Robin"
  },
  "existing_lead": {
    "lead_details": "UpdateBlankOnly",
    "assignee": "Ignore",
    "lead_tags": "Ignore"
  },
  "is_map_existing_call_logs": true
}
```

---

## 2. WhatsApp Service

Handles automated WhatsApp notifications sent to users via the Meta Graph API.

### Send WhatsApp Acknowledgement
* **Endpoint:** `/api/whatsapp/acknowledge`
* **Method:** `POST`
* **Description:** Sends an automated template-based WhatsApp message acknowledging the receipt of a user's application. Requires `WHATSAPP_API_URL` and `WHATSAPP_API_TOKEN` to be configured in `.env`.
* **Headers:** `Content-Type: application/json`
* **Body:**
```json
{
  "fullName": "John Doe",
  "phone": "9876543210",
  "programCategory": "UG Program",
  "programSpecialization": "BBA"
}
```

---

## 3. Email Service

Handles automated email notifications sent to users via SMTP.

### Send Email Acknowledgement
* **Endpoint:** `/api/email/acknowledge`
* **Method:** `POST`
* **Description:** Sends an automated HTML email acknowledging the receipt of a user's application. Requires SMTP credentials (e.g., Mailtrap, Gmail, SendGrid) to be configured in `.env`.
* **Headers:** `Content-Type: application/json`
* **Body:**
```json
{
  "fullName": "John Doe",
  "email": "johndoe@example.com",
  "programCategory": "UG Program",
  "programSpecialization": "BBA"
}
```
