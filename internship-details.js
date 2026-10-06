(async function() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  const loadingDetails = document.getElementById('loadingDetails');
  const errorDetails = document.getElementById('errorDetails');
  const internshipContent = document.getElementById('internshipContent');

  if (!slug || !window.hynaSupabase) {
    loadingDetails.style.display = 'none';
    errorDetails.style.display = 'block';
    return;
  }

  try {
    const { data: program, error } = await window.hynaSupabase
      .from('internship_programs')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !program) {
      throw error || new Error("Program not found");
    }

    loadingDetails.style.display = 'none';
    internshipContent.style.display = 'block';

    document.getElementById('internCategory').textContent = program.category || 'Internship';
    document.getElementById('internTitle').textContent = program.title;
    document.title = `${program.title} | Hyna`;
    document.getElementById('internShortDesc').textContent = program.short_description || '';
    
    const metaContainer = document.getElementById('internMeta');
    let tagsHtml = '';
    if (program.experience_level) tagsHtml += `<span class="tag">${program.experience_level}</span>`;
    if (program.duration) tagsHtml += `<span class="tag">${program.duration}</span>`;
    if (program.mode) tagsHtml += `<span class="tag">${program.mode}</span>`;
    if (program.location) tagsHtml += `<span class="tag">${program.location}</span>`;
    if (program.skills && program.skills.length > 0) {
      tagsHtml += `<span class="tag" style="background:rgba(255,255,255,0.1)">Skills: ${program.skills.join(', ')}</span>`;
    }
    metaContainer.innerHTML = tagsHtml;

    document.getElementById('internDesc').innerHTML = (program.description || 'N/A').replace(/\n/g, '<br/>');
    document.getElementById('internResp').innerHTML = (program.responsibilities || 'N/A').replace(/\n/g, '<br/>');
    document.getElementById('internLearning').innerHTML = (program.learning_outcomes || 'N/A').replace(/\n/g, '<br/>');
    document.getElementById('internEligibility').innerHTML = (program.eligibility || 'N/A').replace(/\n/g, '<br/>');

    const applyBtn = document.getElementById('applyBtn');
    applyBtn.href = `apply.html?program_id=${program.id}&title=${encodeURIComponent(program.title)}`;

  } catch (err) {
    console.error('Error loading internship details:', err);
    loadingDetails.style.display = 'none';
    errorDetails.style.display = 'block';
  }
})();
