/**
 * Contact Form Controller & Query Dispatcher
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
    // Real-time character count
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

    // Live validation on blur
    [this.nameInput, this.emailInput, this.messageInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          this.validateField(input);
        }
      });
    });

    // Form submission
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
      window.toast && window.toast('Please fix the errors before submitting.', 'warning');
      return;
    }

    const name = this.nameInput.value.trim();
    const email = this.emailInput.value.trim();
    const subject = this.subjectSelect ? this.subjectSelect.value : 'General Inquiry';
    const message = this.messageInput.value.trim();

    // Disable button during process
    this.setLoading(true);

    try {
      // Check if user has configured Formspree / API endpoint
      if (PORTFOLIO_CONFIG.contact.formspreeEndpoint) {
        const response = await fetch(PORTFOLIO_CONFIG.contact.formspreeEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ name, email, subject, message })
        });

        if (!response.ok) {
          throw new Error('Endpoint submission failed.');
        }

        window.toast && window.toast('Your message has been sent successfully!', 'success');
      } else {
        // Compose mailto URI
        const targetEmail = PORTFOLIO_CONFIG.contact.email || 'contact@example.com';
        const mailtoSubject = encodeURIComponent(`[${subject}] Message from ${name}`);
        const mailtoBody = encodeURIComponent(
          `Hi,\n\nName: ${name}\nEmail: ${email}\nCategory: ${subject}\n\nMessage:\n${message}\n\nSent via Portfolio Contact Form`
        );
        const mailtoUrl = `mailto:${targetEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

        // Trigger mail client
        window.location.href = mailtoUrl;

        window.toast && window.toast('Message prepared! Opening your mail client...', 'success');
      }

      this.form.reset();
      if (this.charCountEl) this.charCountEl.textContent = '0 / 1000';
    } catch (err) {
      console.error(err);
      window.toast && window.toast('Failed to dispatch message. Please try sending directly to email.', 'warning');
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(isLoading) {
    if (!this.submitBtn) return;
    if (isLoading) {
      this.submitBtn.disabled = true;
      this.submitBtn.innerHTML = `
        <svg style="animation: spin 1s linear infinite; width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle>
        </svg>
        <span>Preparing Query...</span>
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
