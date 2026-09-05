<form className="contact-form" onSubmit={handleSubmit}>
  {formStatus === 'success' && (
    <div className="form-success">
      Thank you! Your enquiry has been received. Our team will contact you within 24 hours.
    </div>
  )}
  {formStatus === 'error' && (
    <div className="form-error">
      Please fill in at least your name and phone number to submit the form.
    </div>
  )}

  <div className="form-group">
    <label htmlFor="contact-name">Full Name *</label>
    <input
      id="contact-name"
      name="name"
      type="text"
      autoComplete="name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      placeholder="Enter your full name"
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="contact-phone">Phone Number *</label>
    <input
      id="contact-phone"
      name="phone"
      type="tel"
      autoComplete="tel"
      value={form.phone}
      onChange={(e) => setForm({ ...form, phone: e.target.value })}
      placeholder="Enter your phone number"
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="contact-email">Email (Optional)</label>
    <input
      id="contact-email"
      name="email"
      type="email"
      autoComplete="email"
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
      placeholder="Enter your email"
    />
  </div>

  <div className="form-group">
    <label htmlFor="contact-message">Message (Optional)</label>
    <textarea
      id="contact-message"
      name="message"
      value={form.message}
      onChange={(e) => setForm({ ...form, message: e.target.value })}
      placeholder="Any specific questions or requirements?"
    />
  </div>

  <button
    type="submit"
    className="form-submit"
    disabled={formStatus === 'submitting'}
  >
    {formStatus === 'submitting' ? 'Submitting...' : 'Submit Enquiry'}
  </button>
</form>