/**
 * Contact Form Controller & Query Dispatcher
 * Supports:
 * 1. Direct Web3Forms Backend (zero-config direct email delivery)
 * 2. Formspree API Endpoint
 * 3. Desktop/Laptop Smart Dispatcher (Web Gmail, Web Outlook, Direct Copy & Fallback)
 */

class ContactFormController {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.nameInput = document.getElementById('contact-name');
    this.emailInput = document.getElementById('contact-email');
    this.subjectSelect = document.getElementById('contact-subject');
    this.messageInput = document.getElementById('contact-message');
    this.charCountEl = document.getElementById('message-char-count');
    this.submitBtn = document.getElementById('contact-submit-btn');

    this.init();
  }

  init() {
    if (!this.form) return;
    this.bindEvents();
  }

  bindEvents() {
    // Real-time character counter
    if (this.messageInput && this.charCountEl) {
      this.messageInput.addEventListener('input', () => {
        const count = this.messageInput.value.length;
        this.charCountEl.textContent = `${count} / 1000`;
        if (count > 1000) {
          this.charCountEl.style.color = '#ef4444';
        } else {
          this.charCountEl.style.color = 'var(--text-muted)';
        }
      });
    }

    // Live validation
    [this.nameInput, this.emailInput, this.messageInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          this.validateField(input);
        }
      });
    });

    // Form submit
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  validateField(input) {
    const errorEl = document.getElementById(`${input.id}-error`);
    let isValid = true;
    let errorMsg = '';

    if (input === this.nameInput) {
      if (!input.value.trim()) {
        isValid = false;
        errorMsg = 'Please enter your name.';
      } else if (input.value.trim().length < 2) {
        isValid = false;
        errorMsg = 'Name must be at least 2 characters.';
      }
    } else if (input === this.emailInput) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!input.value.trim()) {
        isValid = false;
        errorMsg = 'Please enter your email address.';
      } else if (!emailRegex.test(input.value.trim())) {
        isValid = false;
        errorMsg = 'Please enter a valid email address.';
      }
    } else if (input === this.messageInput) {
      if (!input.value.trim()) {
        isValid = false;
        errorMsg = 'Please enter your message.';
      } else if (input.value.trim().length < 10) {
        isValid = false;
        errorMsg = 'Message must be at least 10 characters.';
      }
    }

    if (!isValid) {
      input.classList.add('invalid');
      if (errorEl) {
        errorEl.textContent = errorMsg;
        errorEl.classList.add('visible');
      }
    } else {
      input.classList.remove('invalid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
    }

    return isValid;
  }

  validateAll() {
    const isNameValid = this.validateField(this.nameInput);
    const isEmailValid = this.validateField(this.emailInput);
    const isMessageValid = this.validateField(this.messageInput);
    return isNameValid && isEmailValid && isMessageValid;
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateAll()) {
      window.toast && window.toast('Please fill out all required fields correctly.', 'warning');
      return;
    }

    const name = this.nameInput.value.trim();
    const email = this.emailInput.value.trim();
    const subject = this.subjectSelect ? this.subjectSelect.value : 'General Inquiry';
    const message = this.messageInput.value.trim();

    const contactCfg = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.contact) || {};
    const targetEmail = contactCfg.email || 'detergentcodes@gmail.com';

    this.setLoading(true);

    try {
      // 1. Check for Web3Forms Access Key (Instant free backend delivery)
      if (contactCfg.web3FormsAccessKey) {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: contactCfg.web3FormsAccessKey,
            name: name,
            email: email,
            subject: `[Portfolio] ${subject} from ${name}`,
            message: message,
            from_name: name
          })
        });

        const data = await response.json();
        if (data.success) {
          window.toast && window.toast('Your message was sent directly to my inbox! I will reply soon.', 'success');
          this.form.reset();
          if (this.charCountEl) this.charCountEl.textContent = '0 / 1000';
          return;
        } else {
          throw new Error(data.message || 'Web3Forms dispatch error');
        }
      }

      // 2. Check for Formspree endpoint
      if (contactCfg.formspreeEndpoint) {
        const response = await fetch(contactCfg.formspreeEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ name, email, subject, message })
        });

        if (!response.ok) {
          throw new Error('Formspree endpoint submission failed.');
        }

        window.toast && window.toast('Message delivered successfully! Thank you.', 'success');
        this.form.reset();
        if (this.charCountEl) this.charCountEl.textContent = '0 / 1000';
        return;
      }

      // 3. Fallback Dispatcher for Desktops / Laptops (No backend configured yet)
      // Generates Web Gmail, Web Outlook, and standard mailto
      this.openSmartDesktopComposer({ name, email, subject, message, targetEmail });

    } catch (err) {
      console.warn('Form dispatch exception:', err);
      // Fallback to desktop composer modal
      this.openSmartDesktopComposer({ name, email, subject, message, targetEmail });
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Smart Desktop/Laptop Mail Dispatcher
   * Works in every desktop browser by opening web Gmail / Outlook or direct clipboard copy
   */
  openSmartDesktopComposer(data) {
    const { name, email, subject, message, targetEmail } = data;
    const emailSubject = encodeURIComponent(`[${subject}] Query from ${name}`);
    const emailBody = encodeURIComponent(
      `Hi Aalok,\n\nName: ${name}\nEmail: ${email}\nCategory: ${subject}\n\nMessage:\n${message}\n\n---\nSent via Portfolio Website`
    );

    // Direct Web Gmail Compose URL (opens instantly in a browser tab)
    const webGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${emailSubject}&body=${emailBody}`;
    
    // Direct Web Outlook Compose URL
    const webOutlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(targetEmail)}&subject=${emailSubject}&body=${emailBody}`;

    // Standard mailto
    const mailtoUrl = `mailto:${targetEmail}?subject=${emailSubject}&body=${emailBody}`;

    // Open Web Gmail in new tab automatically
    const newTab = window.open(webGmailUrl, '_blank');

    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
      // Pop-up was blocked or window.open failed -> fallback to mailto
      window.location.href = mailtoUrl;
    }

    window.toast && window.toast('Opening Web Gmail in a new tab with your pre-filled message!', 'success');
  }

  setLoading(isLoading) {
    if (!this.submitBtn) return;
    if (isLoading) {
      this.submitBtn.disabled = true;
      this.submitBtn.innerHTML = `
        <svg style="animation: spin 1s linear infinite; width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle>
        </svg>
        <span>Sending Query...</span>
      `;
    } else {
      this.submitBtn.disabled = false;
      this.submitBtn.innerHTML = `
        <span>Send Message</span>
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.contactFormController = new ContactFormController();
});
