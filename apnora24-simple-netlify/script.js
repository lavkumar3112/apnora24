// Footer year
const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

// Mobile navigation
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

// Netlify Forms: static HTML detection + URL-encoded AJAX submission.
const enquiryForm = document.getElementById("enquiryForm");
if (enquiryForm) {
  enquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!enquiryForm.reportValidity()) return;

    const submitButton = enquiryForm.querySelector('button[type="submit"]');
    const hint = document.getElementById("formHint");
    const whatsappLink = document.getElementById("whatsappAfterSubmit");
    const formData = new FormData(enquiryForm);

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }
    if (whatsappLink) whatsappLink.hidden = true;
    if (hint) hint.textContent = "Submitting your enquiry. Please wait...";

    try {
      const encoded = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
        if (typeof value === "string") encoded.append(key, value);
      }
      encoded.set("form-name", enquiryForm.getAttribute("name"));

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encoded.toString()
      });
      if (!response.ok) throw new Error(`Netlify form returned ${response.status}`);

      // Meta Pixel: track successful enquiry submission
      // Only fires if the visitor accepted marketing cookies.
      if (window.fbq && window.apnoraPixelLoaded) {
        window.fbq("track", "Lead");
      }
      enquiryForm.reset();
      if (hint) {
        hint.textContent = "Thank you! Your enquiry has been received. The Apnora24 team will contact you shortly.";
        hint.style.color = "#174d3b";
      }

      // Prepare WhatsApp message using the submitted enquiry details.
      const number = String(
        window.APNORA24_CONFIG?.whatsappNumber || ""
      ).replace(/\D/g, "");

      if (whatsappLink && number.length >= 10) {

        // Read values from FormData captured before the form was reset.
        const getField = (fieldName) =>
          String(formData.get(fieldName) || "").trim();

        const customerName = getField("name");
        const customerPhone = getField("phone");
        const customerArea = getField("area");
        const selectedService = getField("service");
        const additionalDetails = getField("message");

        const message = [
          "Hello Apnora24, I have submitted an enquiry through your website.",
          "",
          "*Enquiry Details*",
          `Name: ${customerName || "Not provided"}`,
          `Mobile: ${customerPhone || "Not provided"}`,
          `Area / PIN code: ${customerArea || "Not provided"}`,
          `Service Required: ${selectedService || "Not provided"}`,
          `Additional Details / Preferred Date & Time: ${additionalDetails || "Not provided"}`,
          "",
          "Please contact me regarding availability and booking.",
          "Thank you."
        ].join("\n");

        whatsappLink.href =
          `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

        whatsappLink.hidden = false;
        whatsappLink.textContent = "Continue on WhatsApp →";

      } else if (whatsappLink) {

        whatsappLink.hidden = true;

        console.error(
          "Apnora24 WhatsApp number is missing or invalid in config.js"
        );
      }
    } catch (error) {
      console.error("Apnora24 enquiry submission failed:", error);
      if (hint) {
        hint.textContent = "We couldn't submit your enquiry. Please check your internet connection and try again, or contact us on WhatsApp.";
        hint.style.color = "#a33b32";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit enquiry <span>→</span>';
      }
    }
  });
}

// Apnora24 predefined FAQ assistant. Answers are intentionally aligned with index.html.
// This is a rule-based website helper, not a live agent or generative-AI service.
const chatLaunch = document.getElementById("apnoraChatLaunch");
const chatPanel = document.getElementById("apnoraChatPanel");
const chatClose = document.getElementById("apnoraChatClose");
const chatMessages = document.getElementById("apnoraChatMessages");
const chatForm = document.getElementById("apnoraChatForm");
const chatInput = document.getElementById("apnoraChatInput");
const chatQuick = document.getElementById("apnoraChatQuick");

function addChatMessage(message, sender = "bot") {
  if (!chatMessages) return;
  const bubble = document.createElement("div");
  bubble.className = `apnora-chat-bubble ${sender}`;
  bubble.textContent = message; // Never render user input as HTML.
  chatMessages.appendChild(bubble);
  // Keep the widget responsive during long sessions.
  while (chatMessages.children.length > 60) {
    if (chatMessages.children.length > 1) chatMessages.removeChild(chatMessages.children[1]);
    else break;
  }
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function openEnquiryForm() {
  const formSection = document.getElementById("enquiry");
  formSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => document.querySelector('#enquiryForm input[name="name"]')?.focus({ preventScroll: true }), 350);
}

function openApnoraWhatsApp() {
  const number = String(window.APNORA24_CONFIG?.whatsappNumber || "").replace(/\D/g, "");
  if (!number) {
    addChatMessage("WhatsApp contact is not configured yet. Please use the Request a callback form below, or contact the business using the number published on the website.");
    openEnquiryForm();
    return;
  }
  const message = "Hello Apnora24, I would like to know more about your services. Please assist me.";
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

function getFaqAnswer(question) {
  const q = question.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();

  // Emergency guidance must take priority over ordinary service/doctor-visit matches.
  const urgentMedical = /\b(chest pain|heart attack|stroke|unconscious|not breathing|difficulty breathing|can't breathe|cannot breathe|severe bleeding|heavy bleeding|poisoning|seizure|suicid|self harm|medical emergency|ambulance|emergency medical)\b/.test(q);
  if (urgentMedical) {
    return "If someone may be experiencing a medical emergency, call India's emergency number 112 now or go to the nearest emergency department. Apnora24 is not an ambulance, emergency-response, nursing or medical-treatment provider. Please do not wait for a website enquiry or callback.";
  }

  if (/\b(hi|hello|hey|namaste|good morning|good evening)\b/.test(q)) {
    return "Namaste! I can help with Apnora24 services, pricing, Care Rewards, service areas and booking enquiries. What would you like to know?";
  }

  if (/\b(price|prices|pricing|cost|charge|charges|rate|rates|how much|package|packages|gst|travel fee|travel charge)\b/.test(q)) {
    return "The assistance prices displayed on our website are:\n• 1 hour: ₹149 + GST\n• 2 hours: ₹249 + GST\n• 3 hours: ₹349 + GST\n• 6 hours: ₹599 + GST\n• 9 hours: ₹849 + GST.\n\nThere is no minimum booking duration; assistance starts from 1 hour. Applicable travel charges are communicated before booking. Travel bands shown are 0–3 km free, above 3–7 km ₹49, above 7–12 km ₹99, above 12–18 km ₹149, and ₹99 for an additional destination/other point. Final payable amount is confirmed before booking.";
  }

  if (/\b(reward|rewards|discount|refer|referral|loyalty|family pack|monthly plan|family care|promotion|promotions)\b/.test(q)) {
    return "Apnora24 Care Rewards currently displayed on the website include:\n• Loyalty: 5% off the next eligible booking after your first completed booking; 7% off on the third completed booking; 10% off from the fourth onwards.\n• Family Pack: 8% off a pre-booked pack of 4 visits.\n• Monthly Care Plan: 10% off for 8 or more eligible visits in a month.\n• Refer & Care: ₹150 service credit for the referrer and ₹150 off for the referred customer after their first completed and paid booking.\n• Family Care Special: ask about 10% off when two eligible family members use the service.\nOnly one offer can be used per booking; eligibility and final terms are confirmed by the team.";
  }

  if (/\b(area|areas|location|locations|delhi|noida|greater noida|gurugram|gurgaon|ghaziabad|faridabad|coverage|pin code|pincode)\b/.test(q)) {
    return "Apnora24 is setting up services across Delhi NCR, including Delhi, Noida, Greater Noida, Gurugram, Ghaziabad and Faridabad. Coverage is not automatic for every locality; the team confirms your PIN code, provider availability and schedule before accepting a booking. Please share your area in the callback form.";
  }

  // Routine doctor visits and hospital accompaniment are supported assistance enquiries.
  if (/\b(doctor visit|doctor's visit|doctor appointment|doctor consultation|hospital visit|hospital appointment|check.?up|medical appointment|report collection|medicine pick.?up|medicine drop|accompany|attendant|hospital assistance)\b/.test(q)) {
    return "Yes, you can enquire about non-clinical Hospital Assistance and accompaniment for appointments, check-ups, reports and medicine pick-up/drop, as well as doctor visits under Elderly Care. Share the hospital/locality, preferred date and time in the enquiry form. The team will confirm the agreed scope and availability. We do not provide diagnosis, nursing procedures or medical treatment.";
  }

  if (/\b(nursing|injection|dressing|diagnosis|medical treatment|treatment|clinical|ambulance|medical advice|prescription)\b/.test(q)) {
    return "Apnora24 provides non-clinical assistance only. The website does not offer diagnosis, nursing procedures, injections, clinical treatment or ambulance services. For a medical concern, contact a qualified healthcare professional; for an emergency in India, call 112.";
  }

  if (/\b(elder|elderly|parent|parents|mother|father|grandmother|grandfather|senior citizen|old age)\b/.test(q)) {
    return "Elderly Care can include companionship and walks, doctor and temple visits, and everyday assistance. Tell us the type of support, locality and preferred schedule through the enquiry form so the team can confirm scope and availability.";
  }
  if (/\b(pet|dog|cat|feeding|pet walk)\b/.test(q)) {
    return "Pet Care can include pet visits and feeding support, walks and other agreed routine tasks. Share your locality, pet-care needs and preferred timing so the team can confirm availability.";
  }
  if (/\b(personal assistance|errand|shopping|walk|temple|event visit)\b/.test(q)) {
    return "Personal Assistance can include shopping and errands, temple or event visits, and morning/evening walks. Share the task, location and preferred timing in the enquiry form for confirmation.";
  }
  if (/\b(event|function|wedding)\b/.test(q)) {
    return "Event Assistance is one of the services listed by Apnora24. Please share the event type, date, venue/locality and the assistance required so the team can check scope and availability.";
  }
  if (/\b(compassion|bereavement|grief|loss)\b/.test(q)) {
    return "Compassion Support is listed among Apnora24's services. Please contact the team through the enquiry form to discuss the kind of practical assistance needed and confirm availability.";
  }
  if (/\b(driver|driving|chauffeur)\b/.test(q)) {
    return "Driver Assistance is listed among Apnora24's services. Please share the date, route/locality, duration and requirement in the enquiry form. The team will confirm availability and applicable charges.";
  }
  if (/\b(security|guard|watchman)\b/.test(q)) {
    return "Security Assistance is listed among Apnora24's services. Please share the location, date, duration and type of assistance required. The team will confirm the service scope and availability before accepting a booking.";
  }
  if (/\b(urgent|emergency|24.?7|24 hours|night|late night)\b/.test(q)) {
    return "You can enquire about 24×7 Urgent Assistance for urgent non-medical support. It is subject to actual provider availability and confirmation; it is not an emergency medical response service. For medical emergencies in India, call 112.";
  }

  if (/\b(cancel|cancellation|refund|reschedule|change booking)\b/.test(q)) {
    return "The website currently displays this proposed cancellation schedule: more than 12 hours before, free; 4–12 hours, 25%; 1–4 hours, 50%; after the provider reaches the location, 100%. The page says the final approved policy and amount will be shared during confirmation. Please verify the applicable terms with the team before booking.";
  }

  if (/\b(book|booking|callback|call me|contact|human|team|support|enquir|availability|available)\b/.test(q)) {
    return "To request a callback, use the enquiry form on this page. Share your name, 10-digit mobile number, area/PIN code and required service. The Apnora24 team will confirm the service scope, coverage, availability and final price before accepting a booking.";
  }

  if (/\b(service|services|what do you do|what do you offer|help with)\b/.test(q)) {
    return "Apnora24 lists these services: Elderly Care, Hospital Assistance, Pet Care, Personal Assistance, 24×7 Urgent non-medical Assistance, Event Assistance, Compassion Support, Driver Assistance and Security Assistance. Scope, locality and provider availability are confirmed before booking. Which service would you like to know about?";
  }

  return "I can help with Apnora24 services, pricing, Care Rewards, Delhi NCR coverage, cancellation information and callback requests. Try asking “What are your prices?”, “Do you help with doctor visits?” or “Which areas do you cover?”. For a specific requirement, submit the enquiry form and the team can assist.";
}

function askFaq(question) {
  const clean = String(question || "").trim();
  if (!clean) return;
  addChatMessage(clean, "user");
  addChatMessage(getFaqAnswer(clean), "bot");
}

if (chatLaunch && chatPanel) {
  chatLaunch.addEventListener("click", () => {
    const opening = chatPanel.hidden;
    chatPanel.hidden = !opening;
    chatLaunch.setAttribute("aria-expanded", String(opening));
    if (opening) chatInput?.focus();
  });
}
chatClose?.addEventListener("click", () => {
  if (chatPanel) chatPanel.hidden = true;
  chatLaunch?.setAttribute("aria-expanded", "false");
  chatLaunch?.focus();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && chatPanel && !chatPanel.hidden) {
    chatPanel.hidden = true;
    chatLaunch?.setAttribute("aria-expanded", "false");
    chatLaunch?.focus();
  }
});
chatForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  askFaq(chatInput?.value || "");
  if (chatInput) { chatInput.value = ""; chatInput.focus(); }
});
chatQuick?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-chat-action]");
  if (!button) return;
  const action = button.dataset.chatAction;
  const prompts = {
    services: "What services do you offer?",
    pricing: "What are your prices and packages?",
    rewards: "Tell me about Care Rewards",
    areas: "Which areas do you cover?"
  };
  if (prompts[action]) askFaq(prompts[action]);
  else if (action === "booking") {
    addChatMessage("I'd like to request a callback.", "user");
    addChatMessage("Please complete the callback form. The team will confirm coverage, availability and pricing.");
    openEnquiryForm();
  } else if (action === "whatsapp") {
    addChatMessage("I'd like to continue on WhatsApp.", "user");
    openApnoraWhatsApp();
  }
});

// Apnora24 cookie consent
document.addEventListener("DOMContentLoaded", function () {
  const banner = document.getElementById("apnoraCookieBanner");
  const acceptButton = document.getElementById("apnoraAcceptCookies");
  const rejectButton = document.getElementById("apnoraRejectCookies");

  if (!banner || !acceptButton || !rejectButton) return;

  let consent = null;

  try {
    consent = localStorage.getItem("apnora24_marketing_consent");
  } catch (error) {
    console.warn("Cookie consent storage unavailable.");
  }

  if (!consent) {
    banner.hidden = false;
  }

  acceptButton.addEventListener("click", function () {
    window.apnoraEnableMarketingTracking();
    banner.hidden = true;
  });

  rejectButton.addEventListener("click", function () {
    window.apnoraRejectMarketingTracking();
    banner.hidden = true;
  });
});

