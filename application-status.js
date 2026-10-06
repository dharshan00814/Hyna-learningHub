document.getElementById('trackForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const appId = document.getElementById('appId').value.trim();
  const resultDiv = document.getElementById('statusResult');
  const btn = this.querySelector('button');
  
  if (!appId || !window.hynaSupabase) return;
  
  btn.textContent = 'Checking...';
  btn.disabled = true;
  resultDiv.style.display = 'none';

  try {
    const { data: application, error } = await window.hynaSupabase
      .from('internship_applications')
      .select('*, internship_programs(title)')
      .eq('application_id', appId)
      .single();

    if (error || !application) {
      throw error || new Error('Application not found');
    }

    const currentStatus = application.status || 'APPLIED';
    const allStatuses = ['APPLIED', 'UNDER REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'];
    let rejected = currentStatus === 'REJECTED';

    let timelineHtml = '<div class="status-timeline">';
    
    let currentIndex = allStatuses.indexOf(currentStatus);
    if (rejected) currentIndex = 1; // Under review -> Rejected
    
    for (let i = 0; i < allStatuses.length; i++) {
      const step = allStatuses[i];
      
      let classes = 'timeline-step';
      let icon = '';
      
      if (rejected && i === 2) {
        // Replace SHORTLISTED with REJECTED
        classes += ' active';
        icon = '✕';
        timelineHtml += `
          <div class="${classes}">
            <div class="timeline-icon">${icon}</div>
            <div class="timeline-content">Rejected</div>
          </div>
        `;
        break; // Stop timeline
      }

      if (i < currentIndex) {
        classes += ' completed';
        icon = '✓';
      } else if (i === currentIndex && !rejected) {
        classes += ' active';
        icon = '●';
      } else {
        icon = '○';
      }

      timelineHtml += `
        <div class="${classes}">
          <div class="timeline-icon">${icon}</div>
          <div class="timeline-content">${step.charAt(0) + step.slice(1).toLowerCase()}</div>
        </div>
      `;

      if (i < allStatuses.length - 1 && (!rejected || i < 1)) {
        timelineHtml += `<div class="timeline-line"></div>`;
      }
    }
    timelineHtml += '</div>';

    const programTitle = application.internship_programs ? application.internship_programs.title : 'Internship Program';

    resultDiv.innerHTML = `
      <h3 style="margin-bottom:5px;">${application.full_name}</h3>
      <p class="muted" style="margin-bottom:20px;">Applying for: <strong>${programTitle}</strong></p>
      ${timelineHtml}
      <p style="margin-top:20px; font-size:0.9rem; color:var(--muted)">Last updated: ${new Date(application.updated_at).toLocaleDateString()}</p>
    `;
    resultDiv.style.display = 'block';

  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = `<p style="color:var(--danger)">Could not find an application with ID: ${appId}</p>`;
    resultDiv.style.display = 'block';
  } finally {
    btn.textContent = 'Check Status';
    btn.disabled = false;
  }
});
