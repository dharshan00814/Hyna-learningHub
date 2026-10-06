// Hygenz LearnHub premium page interactions
(function(){
  const nav=document.querySelector('.navbar');
  const toggle=document.querySelector('.mobile-toggle');
  const links=document.querySelector('.nav-links');
  if(nav){window.addEventListener('scroll',()=>nav.classList.toggle('nav-scrolled',window.scrollY>60),{passive:true});}
  if(toggle&&links){
    toggle.setAttribute('aria-expanded','false');
    toggle.addEventListener('click',()=>{
      const isOpen=links.classList.toggle('active');
      toggle.classList.toggle('active',isOpen);
      toggle.setAttribute('aria-expanded',isOpen?'true':'false');
    });
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      toggle.classList.remove('active');
      links.classList.remove('active');
      toggle.setAttribute('aria-expanded','false');
    }));
  }

  const revealObserver=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('show');revealObserver.unobserve(entry.target);}});
  },{threshold:.16,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal,.glass-card,.cta-band,.timeline-item,.stat-card').forEach((el,i)=>{
    el.classList.add('reveal');
    el.style.transitionDelay=`${Math.min(i%6*70,350)}ms`;
    revealObserver.observe(el);
  });

  const counters=document.querySelectorAll('[data-count]');
  const counterObserver=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target;
      const target=parseInt(el.dataset.count,10)||0;
      const suffix=el.dataset.suffix||'';
      const duration=1300;
      const start=performance.now();
      const tick=(now)=>{
        const p=Math.min((now-start)/duration,1);
        const eased=1-Math.pow(1-p,3);
        el.textContent=Math.floor(target*eased).toLocaleString()+suffix;
        if(p<1)requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },{threshold:.55});
  counters.forEach(c=>counterObserver.observe(c));

  document.querySelectorAll('.faq-question').forEach(q=>{
    q.addEventListener('click',()=>{
      const item=q.closest('.faq-item');
      if(!item)return;
      item.classList.toggle('active');
      const expanded=item.classList.contains('active');
      q.setAttribute('aria-expanded',expanded?'true':'false');
    });
  });

  document.querySelectorAll('.btn,button,.nav-cta').forEach(btn=>{
    btn.addEventListener('click',function(e){
      const rect=this.getBoundingClientRect();
      const ripple=document.createElement('span');
      ripple.className='ripple';
      ripple.style.left=(e.clientX-rect.left)+'px';
      ripple.style.top=(e.clientY-rect.top)+'px';
      this.appendChild(ripple);
      setTimeout(()=>ripple.remove(),650);
    });
  });

  const parallax=document.querySelectorAll('.orb,.floating-card');
  window.addEventListener('mousemove',(e)=>{
    const x=(e.clientX/window.innerWidth-.5)*18;
    const y=(e.clientY/window.innerHeight-.5)*18;
    parallax.forEach((el,i)=>{el.style.translate=`${x/(i+1)}px ${y/(i+1)}px`;});
  },{passive:true});

  // Load Internships from Supabase
  const internshipsList = document.getElementById('internshipsList');
  const loadingInternships = document.getElementById('loadingInternships');

  async function loadInternships() {
    if (!internshipsList || !window.hynaSupabase) return;

    try {
      const { data: programs, error } = await window.hynaSupabase
        .from('internship_programs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (!programs || programs.length === 0) {
        internshipsList.innerHTML = '<p class="muted">No internships are currently open. Please check back later.</p>';
        return;
      }

      internshipsList.innerHTML = ''; // Clear loading

      programs.forEach((program, i) => {
        const article = document.createElement('article');
        article.className = 'glass-card reveal';
        article.style.transitionDelay = `${Math.min(i % 6 * 70, 350)}ms`;
        
        let tagsHtml = '';
        if (program.experience_level) tagsHtml += `<span class="tag">${program.experience_level}</span>`;
        if (program.duration) tagsHtml += `<span class="tag">${program.duration}</span>`;
        if (program.mode) tagsHtml += `<span class="tag">${program.mode}</span>`;
        
        const skillsList = program.skills && program.skills.length > 0 
          ? `<p class="muted" style="font-size:0.8rem; margin:10px 0;">Skills: ${program.skills.join(', ')}</p>` 
          : '';

        article.innerHTML = `
          <div class="card-body">
            <h3 style="margin-bottom:8px;">${program.title}</h3>
            <p class="muted" style="font-size:0.9rem; line-height:1.4;">${program.short_description || ''}</p>
            ${skillsList}
            <div class="meta" style="margin-top:15px; margin-bottom:20px;">
              ${tagsHtml}
            </div>
            <a class="btn btn-ghost" href="internship-details.html?slug=${program.slug}" style="width:100%; text-align:center;">View Internship</a>
          </div>
        `;
        internshipsList.appendChild(article);
        
        // Setup observer for new cards
        const revealObserver=new IntersectionObserver((entries)=>{
          entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('show');revealObserver.unobserve(entry.target);}});
        },{threshold:.16,rootMargin:'0px 0px -40px 0px'});
        revealObserver.observe(article);
      });

    } catch (err) {
      console.error('Error loading internships:', err);
      internshipsList.innerHTML = '<p class="muted" style="color:var(--danger)">Failed to load internships. Please try again later.</p>';
    }
  }

  // Initial load
  loadInternships();
})();
