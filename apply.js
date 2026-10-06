// Form
const form = document.getElementById("registerForm");
const programSelect = document.getElementById("programId");

// Modal
const modal = document.getElementById("successModal");
const details = document.getElementById("registrationDetails");
const closeBtn = document.getElementById("modalClose");

function generateApplicationId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `HYN-INT-APP-2026-${timestamp}${random}`;
}

// Load Programs
async function loadPrograms() {
    if (!window.hynaSupabase) return;
    try {
        const { data, error } = await window.hynaSupabase
            .from('internship_programs')
            .select('id, title')
            .eq('published', true)
            .order('title');

        if (error) throw error;
        
        programSelect.innerHTML = '<option value="">-- Select an Internship --</option>';
        data.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.title;
            programSelect.appendChild(option);
        });

        // Pre-select if URL has program_id
        const urlParams = new URLSearchParams(window.location.search);
        const urlProgramId = urlParams.get('program_id');
        if (urlProgramId) {
            programSelect.value = urlProgramId;
        }
    } catch (err) {
        console.error("Failed to load programs", err);
        programSelect.innerHTML = '<option value="">Error loading programs</option>';
    }
}

document.addEventListener("DOMContentLoaded", loadPrograms);

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector("button");
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    // Get Selected Skills
    const skills = [...document.querySelectorAll(".skillCheck:checked")]
        .map(skill => skill.value);

    const appId = generateApplicationId();

    // Collect Data
    const data = {
        application_id: appId,
        program_id: document.getElementById("programId").value,
        full_name: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        college: document.getElementById("college").value,
        department: document.getElementById("department").value,
        graduation_year: document.getElementById("year").value,
        skills: skills,
        programming_languages: document.getElementById("programmingLanguages").value.split(',').map(s => s.trim()),
        github_url: document.getElementById("github").value,
        linkedin_url: document.getElementById("linkedin").value,
        portfolio_url: document.getElementById("portfolio").value,
        motivation: document.getElementById("about").value,
        learning_goals: document.getElementById("learningGoals").value,
        project_description: document.getElementById("projectDesc").value,
        status: "APPLIED"
    };

    try {
        const { error } = await window.hynaSupabase
            .from('internship_applications')
            .insert([data]);

        if (error) {
            throw error;
        }

        // Add history entry (this could also be done via a trigger in Supabase)
        // Since we enabled public inserts, we can try to insert a history record if we want, but it requires getting the ID.
        // For simplicity, we just rely on the main insert for now.

        details.innerHTML = `
            <div class="detail-row"><span class="label">Application ID</span><span class="value" style="color:var(--success); font-weight:bold; font-size:1.2rem;">${appId}</span></div>
            <div class="detail-row"><span class="label">Name</span><span class="value">${data.full_name}</span></div>
            <div class="detail-row"><span class="label">Email</span><span class="value">${data.email}</span></div>
        `;

        modal.classList.add("active");
        form.reset();
    } catch (error) {
        alert("Sorry, your application could not be submitted. Please try again.");
        console.error(error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
});

// Close Modal
closeBtn.onclick = () => {
    modal.classList.remove("active");
};

window.onclick = function(e){
    if(e.target === modal){
        modal.classList.remove("active");
    }
}