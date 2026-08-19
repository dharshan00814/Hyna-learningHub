// ======================================
// HYGEN HACKATHON JS
// ======================================

// Form
const form = document.getElementById("hackathonForm");

// ==========================
// Success Popup
// ==========================

function createPopup(message) {

    const popup = document.createElement("div");

    popup.className = "popup";

    popup.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <h2>Registration Successful!</h2>
        <p>${message}</p>
    `;

    document.body.appendChild(popup);

    setTimeout(() => {

        popup.classList.add("show");

    }, 100);

    setTimeout(() => {

        popup.classList.remove("show");

        setTimeout(() => {

            popup.remove();

        }, 500);

    }, 3500);

}

// ==========================
// Submit
// ==========================

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const button = form.querySelector("button");

    button.disabled = true;

    button.innerHTML = `
    <i class="fa-solid fa-spinner fa-spin"></i>
    Registering...
    `;

    setTimeout(() => {

        button.disabled = false;

        button.innerHTML = `
        Register Now
        `;

        createPopup(
            "Welcome to Hygen Hackathon 2026 🚀"
        );

        form.reset();

    }, 2500);

});

// ==========================
// Scroll Animation
// ==========================

const observer = new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},

{

threshold:.2

}

);

document.querySelectorAll(".card,.form-box,.faq-box,.timeline-box div").forEach(el=>{

el.classList.add("hidden");

observer.observe(el);

});

// ==========================
// Navbar Blur
// ==========================

window.addEventListener("scroll",()=>{

const nav=document.querySelector(".navbar");

if(window.scrollY>80){

nav.style.background="rgba(15,15,20,.75)";

nav.style.backdropFilter="blur(25px)";

}else{

nav.style.background="rgba(255,255,255,.05)";

}

});

// ==========================
// Card Hover
// ==========================

document.querySelectorAll(".card").forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.style.transform="translateY(-10px) scale(1.03)";

});

card.addEventListener("mouseleave",()=>{

card.style.transform="translateY(0px) scale(1)";

});

});

// ==========================
// Button Ripple
// ==========================

document.querySelectorAll("button,.register-btn").forEach(btn=>{

btn.addEventListener("click",function(e){

let ripple=document.createElement("span");

ripple.className="ripple";

this.appendChild(ripple);

let x=e.offsetX;
let y=e.offsetY;

ripple.style.left=x+"px";
ripple.style.top=y+"px";

setTimeout(()=>{

ripple.remove();

},600);

});

});