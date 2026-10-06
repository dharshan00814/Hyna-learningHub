document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const subject = document.getElementById('contactSubject').value;
  const message = document.getElementById('contactMessage').value;
  
  const btn = this.querySelector('button');
  const successMsg = document.getElementById('contactSuccess');
  const errorMsg = document.getElementById('contactError');
  
  btn.textContent = 'Sending...';
  btn.disabled = true;
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';

  try {
    if (!window.hynaSupabase) throw new Error('Supabase not initialized');

    const { error } = await window.hynaSupabase
      .from('contact_messages')
      .insert([
        { name, email, subject, message }
      ]);

    if (error) throw error;

    successMsg.style.display = 'block';
    this.reset();
  } catch (err) {
    console.error('Error sending message:', err);
    errorMsg.style.display = 'block';
  } finally {
    btn.textContent = 'Send Message';
    btn.disabled = false;
  }
});
