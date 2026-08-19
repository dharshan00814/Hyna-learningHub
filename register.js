
// Form
const form = document.getElementById("registerForm");

// Modal
const modal = document.getElementById("successModal");
const details = document.getElementById("registrationDetails");
const closeBtn = document.getElementById("modalClose");
const anotherBtn = document.getElementById("viewAnotherBtn");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector("button");
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Get Selected Skills
    const skills = [...document.querySelectorAll(".skillCheck:checked")]
        .map(skill => skill.value)
        .join(", ");

    // Collect Data
    const data = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,

        college: document.getElementById("college").value,
        department: document.getElementById("department").value,
        year: document.getElementById("year").value,
        studentId: document.getElementById("studentId").value,

        skills: skills || "Not selected",

        experienceLevel: document.getElementById("experienceLevel").value,
        programmingLanguages: document.getElementById("programmingLanguages").value,

        about: document.getElementById("about").value,

        linkedin: document.getElementById("linkedin").value,
        github: document.getElementById("github").value,
        portfolio: document.getElementById("portfolio").value
    };

    const emailData = {
        _subject: `New HYGEN Registration - ${data.fullName}`,
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dob,
        gender: data.gender,
        college: data.college,
        department: data.department,
        yearOfStudy: data.year,
        studentId: data.studentId,
        skills: data.skills,
        experienceLevel: data.experienceLevel,
        programmingLanguages: data.programmingLanguages,
        about: data.about,
        linkedin: data.linkedin,
        github: data.github,
        portfolio: data.portfolio
    };

    try {
        const response = await fetch("https://formsubmit.co/ajax/jdharshan2@gmail.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            throw new Error("Email sending failed");
        }

        details.innerHTML = `
            <div class="detail-row"><span class="label">Name</span><span class="value">${data.fullName}</span></div>
            <div class="detail-row"><span class="label">Email</span><span class="value">${data.email}</span></div>
            <div class="detail-row"><span class="label">Phone</span><span class="value">${data.phone}</span></div>
            <div class="detail-row"><span class="label">College</span><span class="value">${data.college}</span></div>
            <div class="detail-row"><span class="label">Department</span><span class="value">${data.department}</span></div>
            <div class="detail-row"><span class="label">Year</span><span class="value">${data.year}</span></div>
            <div class="detail-row full"><span class="label">Skills</span><span class="value">${data.skills}</span></div>
            <div class="detail-row full"><span class="label">About</span><span class="value">${data.about}</span></div>
        `;

        modal.classList.add("active");
        form.reset();
    } catch (error) {
        alert("Sorry, your registration could not be sent. Please try again.");
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

anotherBtn.onclick = () => {
    modal.classList.remove("active");
};

window.onclick = function(e){
    if(e.target === modal){
        modal.classList.remove("active");
    }
}