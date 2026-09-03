if (!name || !phone) {
  setFormError('Please fill in at least your name and phone number to submit the form.')
  setFormStatus('error')
  return
}

if (phone.replace(/\D/g, '').length < 10) {
  setFormError('Please enter a valid phone number (at least 10 digits).')
  setFormStatus('error')
  return
}

setFormStatus('submitting')
setFormError('')

try {
  // 1. Dynamic data insertion for any public visitor
  const { data, error } = await supabase.from('leads').insert([{
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : null,
    message: message ? message.trim() : null,
    source: 'contact-form',
    status: 'new',
    qualified: false,
  }])

  // Real-time console debugging log
  console.log("Supabase Insert Result:", { data, error })

  if (error) throw error

  setFormStatus('success')
  setForm({ name: '', phone: '', email: '', message: '' })

  // Optional Edge Function Notification Call
  try {
    await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ name, phone, email, message }),
    })
  } catch (notifyErr) {
    console.warn("Notification error:", notifyErr)
  }

} catch (err: any) {
  console.error("EXACT PUBLIC FORM ERROR:", err)
  setFormError(err?.message || 'Something went wrong. Please try again or call us at +91 93193 07289.')
  setFormStatus('error')
}