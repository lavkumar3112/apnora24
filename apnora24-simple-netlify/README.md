# Apnora24 — Simple Netlify Forms Package

This package removes the Google Sheets API, Meta Developer setup, WhatsApp Cloud API, OpenAI API, server functions and build dependencies.

It uses:
- Netlify Forms to collect website enquiries.
- Netlify's dashboard to view submissions and export CSV.
- Netlify email submission notifications (configured once in the Netlify UI).
- An optional click-to-chat link to your existing WhatsApp Business number.
- A small predefined FAQ helper embedded in the website. It is not an AI chatbot and needs no API key.

## Files in this package

- `index.html` — Apnora24 page from the supplied HTML, updated with Netlify form fields, consent and FAQ helper markup.
- `script.js` — mobile navigation, Netlify Forms AJAX submission, WhatsApp follow-up link and predefined FAQ answers.
- `config.js` — public WhatsApp contact number setting. No secrets belong here.
- `chat-widget.css` — responsive styles for the FAQ assistant and consent field.
- `SETUP_CHECKLIST.md` — exact setup steps.

## Install into your existing Netlify website

1. Download and extract the ZIP.
2. Back up your current `index.html` and `script.js`.
3. Copy the four files (`index.html`, `script.js`, `config.js`, `chat-widget.css`) into the same publish folder as your current `index.html`.
4. Keep your existing `styles.css` and `assets/` folder. They were not included because they were not supplied with the HTML attachment. Do not delete or replace them.
5. If your site already has a `config.js`, merge the `APNORA24_CONFIG.whatsappNumber` setting into it rather than overwriting unrelated configuration.
6. Follow `SETUP_CHECKLIST.md`, then deploy.

The form is present in static HTML, so Netlify can detect it at deploy time. The JavaScript AJAX request uses URL-encoded form data as required by Netlify Forms.

## Important

- Netlify Forms detection must be enabled in your Netlify site before redeploying.
- Form submissions are stored in Netlify, not in a Google Sheet. You can export them as CSV from the Forms dashboard.
- Netlify email notifications are configured in the dashboard. Netlify currently requires the notification recipient to be an active member of the Netlify team; check the current plan and UI requirements.
- WhatsApp is not sent automatically. After a successful form submission, the customer can choose the displayed WhatsApp link to open a prefilled message and send it themselves.
- The FAQ helper provides predefined answers based on the information in the supplied Apnora24 page. It does not use generative AI and does not read customer records.
- Never collect sensitive medical records, identity documents or payment details in this form.


## SEO and legal pages added

- `privacy-policy.html` — privacy policy draft for the current Netlify enquiry form and WhatsApp hand-off.
- `terms.html` — terms draft aligned to the services and indicative prices shown in the supplied `index.html`.
- `sitemap.xml` — sitemap for the homepage and legal pages.
- `robots.txt` — allows search-engine crawling and declares the sitemap.

The homepage now includes canonical, Open Graph, Twitter Card and Organization structured-data metadata, plus footer links to the legal pages.

Before launch, replace every `[INSERT ...]` placeholder in both legal pages, verify the live social image at `https://apnora24.in/assets/care-companionship.jpg`, and obtain legal review. Keep your existing `styles.css` and `assets/` directory in the Netlify publish folder; they were not included in the source ZIP and have not been changed.

## Chatbot behaviour and limitations

- Quick actions cover services, pricing, Care Rewards, service areas, callback requests and WhatsApp.
- FAQ answers are aligned to the prices, offers, policies and service descriptions shown in `index.html`.
- Routine doctor appointments and hospital accompaniment are treated as non-clinical assistance enquiries; explicit medical emergencies receive 112 guidance.
- The chatbot does not confirm bookings, provider availability, medical advice or live human support.
- Configure `whatsappNumber` in `config.js` to enable the WhatsApp quick action. If blank, the chatbot directs visitors to the callback form.
- The WhatsApp message is generic by design; it does not place enquiry form personal details into a third-party URL.
