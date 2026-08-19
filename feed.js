const form = document.getElementById("feedbackForm");
const popup = document.getElementById("successPopup");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        session: document.getElementById("session").value,
        date: document.getElementById("date").value,
        overall: document.querySelector('input[name="overall"]:checked')?.value,
        content: document.querySelector('input[name="content"]:checked')?.value,
        trainer: document.querySelector('input[name="trainer"]:checked')?.value,
        presentation: document.querySelector('input[name="presentation"]:checked')?.value,
        interaction: document.querySelector('input[name="interaction"]:checked')?.value,
        experience: document.querySelector('input[name="experience"]:checked')?.value,
        liked: document.getElementById("liked").value,
        improvement: document.getElementById("improvement").value,
        comments: document.getElementById("comments").value
    };

    const emailData = {
        _subject: `New HYGEN Feedback - ${formData.name}`,
        name: formData.name,
        email: formData.email,
        session: formData.session,
        date: formData.date,
        overallSessionRating: formData.overall,
        contentQuality: formData.content,
        speakerTrainer: formData.trainer,
        presentationRating: formData.presentation,
        interactionRating: formData.interaction,
        overallExperience: formData.experience,
        likedMost: formData.liked,
        improvements: formData.improvement,
        additionalComments: formData.comments
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

        popup.classList.add("show");
        form.reset();
    } catch (error) {
        alert("Sorry, your feedback could not be sent. Please try again.");
        console.error(error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
});

function closePopup() {
    popup.classList.remove("show");
}