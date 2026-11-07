# Apnora24 simple setup checklist

## A. Add the files

1. Extract `apnora24-simple-netlify.zip`.
2. Back up the current `index.html` and `script.js` from your website project.
3. Copy `index.html`, `script.js`, `config.js` and `chat-widget.css` into the same folder where your existing `index.html` is deployed.
4. Keep your existing `styles.css` and `assets/` folder. They are intentionally not replaced by this package.
5. If your project already contains `config.js`, merge the WhatsApp setting rather than replacing other settings.

## B. Configure your WhatsApp contact number (optional)

Open `config.js` and change:

```js
whatsappNumber: ""
```

to your official Apnora24 WhatsApp Business number in international format, digits only. Example format for an Indian number:

```js
whatsappNumber: "919876543210"
```

Use your real business number, not the example. This is a public contact number, not an API token. If left blank, the enquiry form still works; the post-submission WhatsApp link is simply not shown.

## C. Enable Netlify Forms

1. Sign in to Netlify and open the existing Apnora24 site.
2. Open **Forms**.
3. If form detection is disabled, select **Enable form detection**.
4. Deploy the updated website after enabling detection. Detection takes effect on a new deploy.
5. After deployment, return to **Forms** and confirm that `apnora24-enquiry` appears as an active form.

Official guide: https://docs.netlify.com/manage/forms/setup/

## D. Set up email notifications (optional but recommended)

1. In the Apnora24 Netlify site, open **Forms → Form notifications** or **Forms → Submission notifications** (the exact label can vary in the UI).
2. Add an email notification for the `apnora24-enquiry` form.
3. Select an eligible email recipient. Netlify's current documentation says email notification recipients must be active members of the Netlify team.
4. Save and submit one test enquiry to verify the notification.

Official guide: https://docs.netlify.com/manage/forms/notifications/

## E. Test the form

1. Open the deployed Apnora24 website.
2. Submit a test enquiry with a valid 10-digit Indian mobile number.
3. Tick the contact-consent checkbox.
4. Submit the form.
5. In Netlify, open **Forms → apnora24-enquiry → Submissions** and confirm the test record appears.
6. Check the configured email inbox.
7. If a WhatsApp number was configured, click **Continue on WhatsApp** and verify that the prefilled message opens. The customer must press Send in WhatsApp.
8. Test the floating FAQ assistant for services, pricing, Care Rewards, service areas, callback and WhatsApp actions. Also test “Do you help with doctor visits?” (routine assistance) and “medical emergency” (must advise calling 112). Verify prices and offers match the live page.

If the submission does not appear, confirm form detection was enabled before the latest deploy and check the form's spam submissions.

## What you do NOT need

- No Google account or Google Cloud project.
- No Google Sheets API or service account.
- No Meta Developer login or WhatsApp Cloud API.
- No OpenAI API key.
- No Netlify Functions, Node.js, npm install or backend deployment.

## What this simple version does and does not do

**It does:** save enquiries in Netlify Forms, allow CSV export, send optional Netlify email notifications, open a customer-initiated WhatsApp chat, and answer common website questions using predefined responses.

**It does not:** automatically send WhatsApp messages, provide a generative-AI chatbot, sync submissions to Google Sheets automatically, or create bookings. Those features require a later integration/provider setup.


## F. SEO, social sharing and legal pages

1. Keep `privacy-policy.html`, `terms.html`, `sitemap.xml` and `robots.txt` in the same publish-root folder as `index.html`.
2. Replace every `[INSERT ...]` placeholder in both legal pages with verified business details.
3. Review the Privacy Policy and Terms & Conditions with a qualified adviser before publishing.
4. Confirm `https://apnora24.in/assets/care-companionship.jpg` exists and is publicly accessible. This image is used for Open Graph and Twitter sharing previews.
5. After deployment, test `https://apnora24.in/sitemap.xml` and `https://apnora24.in/robots.txt`.
6. Add `apnora24.in` to Google Search Console, verify ownership and submit `https://apnora24.in/sitemap.xml`.
7. Test the homepage and legal-page share previews with the relevant social-platform preview/debugging tools.
8. Confirm the canonical domain is the preferred HTTPS hostname and that any alternate hostname redirects to it.


## G. Chatbot acceptance tests

1. Open and close the chatbot using its launcher and close button; confirm Escape also closes it.
2. Ask “What are your prices?” and verify the answer matches the current pricing section exactly.
3. Ask “Tell me about Care Rewards” and verify the percentages/credits match the Care Rewards section.
4. Ask “Can someone accompany my father to a doctor appointment?” and verify it describes non-clinical assistance rather than classifying it as an emergency.
5. Ask “Someone has chest pain” and verify the answer directs the visitor to call 112 immediately.
6. Click “Request callback” and confirm the page scrolls to the enquiry form.
7. Configure the official WhatsApp number, click “WhatsApp” and verify the chat opens. If no number is configured, verify the callback form fallback.
8. Test on a narrow mobile viewport and verify the chat panel, quick-action buttons and message input remain usable.
