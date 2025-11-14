document.addEventListener("DOMContentLoaded", () => {
  const jobForm = document.getElementById("jobForm");
  const postedJobs = document.getElementById("postedJobs");
  const jobList = document.getElementById("job-list");

  // Save jobs
  if (jobForm) {
    jobForm.addEventListener("submit", e => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const location = document.getElementById("location").value;
      const pay = document.getElementById("pay").value;

      const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
      jobs.push({ title, location, pay });
      localStorage.setItem("jobs", JSON.stringify(jobs));
      alert("Job posted successfully!");
      jobForm.reset();
      showPostedJobs();
    });
  }

  // Show posted jobs (Employer)
  function showPostedJobs() {
    if (!postedJobs) return;
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    postedJobs.innerHTML = "";
    jobs.forEach(j => {
      const li = document.createElement("li");
      li.textContent = `${j.title} - ${j.location} - ${j.pay}`;
      postedJobs.appendChild(li);
    });
  }

  // Show available jobs (Driver)
  function showAvailableJobs() {
    if (!jobList) return;
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    jobList.innerHTML = "";
    jobs.forEach(j => {
      const li = document.createElement("li");
      li.textContent = `${j.title} - ${j.location} - ${j.pay}`;
      jobList.appendChild(li);
    });
  }

  showPostedJobs();
  showAvailableJobs();
});

// ========== POST JOB ==========
document.addEventListener("DOMContentLoaded", () => {
  const jobForm = document.querySelector(".job-form");

  if (jobForm) {
    jobForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const jobTitle = document.getElementById("jobTitle").value.trim();
      const duration = document.getElementById("duration").value.trim();
      const payRange = document.getElementById("payRange").value.trim();
      const location = document.getElementById("location").value.trim();
      const description = document.getElementById("description").value.trim();

      const newJob = { jobTitle, duration, payRange, location, description };

      // Retrieve existing jobs or create a new array
      let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
      jobs.push(newJob);
      localStorage.setItem("jobs", JSON.stringify(jobs));

      alert("✅ Job posted successfully!");
      jobForm.reset();
    });
  }

  // ========== LOAD JOBS IN MY HIRES ==========
  const jobList = document.querySelector(".job-list");
  if (jobList && !document.querySelector(".job-form")) {
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    if (jobs.length === 0) {
      jobList.innerHTML = `<p style="color:#aaa;">No job posts yet.</p>`;
    } else {
      jobList.innerHTML = jobs.map((job) => `
        <div class="job-card">
          <h4>${job.jobTitle}</h4>
          <p><strong>Location:</strong> ${job.location}</p>
          <p><strong>Duration:</strong> ${job.duration}</p>
          <p><strong>Pay Range:</strong> ${job.payRange}</p>
          <p><strong>Description:</strong> ${job.description}</p>
          <button class="btn gray">View Applicants</button>
        </div>
      `).join("");
    }
  }

  // ========== SETTINGS MANAGEMENT ==========
  const settingsForm = document.querySelector(".settings-form");
  if (settingsForm) {
    const businessName = document.getElementById("businessName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    // Load saved settings
    const settings = JSON.parse(localStorage.getItem("settings")) || {};
    if (settings.businessName) businessName.value = settings.businessName;
    if (settings.email) email.value = settings.email;

    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newSettings = {
        businessName: businessName.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
      };
      localStorage.setItem("settings", JSON.stringify(newSettings));
      alert("✅ Settings updated successfully!");
    });
  }

  // ========== SIMPLE MESSAGES ==========
  const chatBox = document.querySelector(".chat-box");
  const chatInput = document.querySelector(".chat-input");
  if (chatBox && chatInput) {
    const inputField = chatInput.querySelector("input");
    const messages = JSON.parse(localStorage.getItem("messages")) || [];

    function renderMessages() {
      chatBox.innerHTML = messages
        .map(
          (msg) =>
            `<div class="message ${msg.sender}">
              <p>${msg.text}</p>
            </div>`
        )
        .join("");
    }

    renderMessages();

    chatInput.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = inputField.value.trim();
      if (text === "") return;

      messages.push({ text, sender: "sent" });
      localStorage.setItem("messages", JSON.stringify(messages));
      inputField.value = "";
      renderMessages();
    });
  }
});


// ============ DRIVER DASHBOARD SCRIPT ============

// ✅ Local storage keys
const JOBS_KEY = "private_jobs";
const HIRES_KEY = "private_driver_hires";
const PROFILE_KEY = "private_driver_profile";
const EARNINGS_KEY = "private_driver_earnings";
const MESSAGES_KEY = "private_driver_messages";

// ✅ Mock job data (you can later fetch this from backend)
const sampleJobs = [
  { id: 1, title: "Executive Driver", location: "Lekki, Lagos", duration: "Monthly", pay: "₦120,000", description: "Driver needed for corporate executive in Lekki." },
  { id: 2, title: "Intercity Driver", location: "Abuja", duration: "3 days", pay: "₦60,000", description: "Drive client from Abuja to Kaduna and back." },
  { id: 3, title: "Event Chauffeur", location: "Ikeja, Lagos", duration: "Weekend", pay: "₦35,000", description: "Polite driver needed for wedding event transportation." },
];

// ✅ Load sample jobs into localStorage if not already
if (!localStorage.getItem(JOBS_KEY)) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(sampleJobs));
}

// ✅ Utility function to get and set data
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ============ PAGE FUNCTIONS ============

// ✅ JOB FEED PAGE
if (document.getElementById("jobFeed")) {
  const jobs = getData(JOBS_KEY);
  const container = document.getElementById("jobFeed");

  if (jobs.length === 0) {
    container.innerHTML = `<p>No jobs available right now.</p>`;
  } else {
    container.innerHTML = jobs.map(job => `
      <div class="job-card">
        <h4>${job.title}</h4>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Duration:</strong> ${job.duration}</p>
        <p><strong>Pay:</strong> ${job.pay}</p>
        <p>${job.description}</p>
        <button class="btn green" onclick="applyJob(${job.id})">Apply</button>
      </div>
    `).join("");
  }
}

// ✅ APPLY FOR JOB
function applyJob(id) {
  const jobs = getData(JOBS_KEY);
  const job = jobs.find(j => j.id === id);
  if (!job) return;

  const hires = getData(HIRES_KEY);
  if (hires.find(h => h.id === id)) {
    alert("You’ve already applied for this job!");
    return;
  }

  hires.push(job);
  setData(HIRES_KEY, hires);

  // Add to earnings summary
  const earnings = getData(EARNINGS_KEY);
  earnings.push({ jobId: id, pay: job.pay });
  setData(EARNINGS_KEY, earnings);

  alert("Job application submitted successfully!");
}

// ✅ MY HIRES PAGE
if (document.getElementById("myHires")) {
  const hires = getData(HIRES_KEY);
  const container = document.getElementById("myHires");

  if (hires.length === 0) {
    container.innerHTML = `<p>You haven't applied for any jobs yet.</p>`;
  } else {
    container.innerHTML = hires.map(hire => `
      <div class="job-card">
        <h4>${hire.title}</h4>
        <p><strong>Location:</strong> ${hire.location}</p>
        <p><strong>Duration:</strong> ${hire.duration}</p>
        <p><strong>Pay:</strong> ${hire.pay}</p>
        <button class="btn gray">Pending Approval</button>
      </div>
    `).join("");
  }
}

// ✅ EARNINGS PAGE
if (document.getElementById("totalEarnings")) {
  const earnings = getData(EARNINGS_KEY);
  const jobCount = earnings.length;
  const totalAmount = earnings.reduce((sum, e) => {
    const amount = parseInt(e.pay.replace(/[₦,]/g, "")) || 0;
    return sum + amount;
  }, 0);

  document.getElementById("jobCount").textContent = jobCount;
  document.getElementById("totalEarnings").textContent = totalAmount.toLocaleString();
}

// ✅ MESSAGES PAGE
if (document.querySelector(".chat-box")) {
  const chatBox = document.querySelector(".chat-box");
  const chatForm = document.querySelector(".chat-input");
  const input = chatForm.querySelector("input");

  const messages = getData(MESSAGES_KEY);
  renderMessages();

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text === "") return;

    const msg = { text, sender: "driver", time: new Date().toLocaleTimeString() };
    messages.push(msg);
    setData(MESSAGES_KEY, messages);
    input.value = "";
    renderMessages();
  });

  function renderMessages() {
    chatBox.innerHTML = messages.map(m => `
      <div class="message ${m.sender}">
        <p>${m.text}</p>
        <span>${m.time}</span>
      </div>
    `).join("");
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// ✅ SETTINGS PAGE
if (document.querySelector(".settings-form")) {
  const profile = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
  const form = document.querySelector(".settings-form");

  form.fullName.value = profile.fullName || "";
  form.email.value = profile.email || "";
  form.phone.value = profile.phone || "";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const updatedProfile = {
      fullName: form.fullName.value,
      email: form.email.value,
      phone: form.phone.value
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));
    alert("Profile updated successfully!");
  });
}

// ============ EMPLOYER DASHBOARD SCRIPT ============

// ✅ Local storage keys
const JOBS_KEY = "private_jobs";
const EMPLOYER_KEY = "private_employer_profile";
const APPLICANTS_KEY = "private_job_applicants";

// ✅ Get & Set utilities
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ✅ POST A JOB
const jobForm = document.querySelector(".job-form");
if (jobForm) {
  jobForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("jobTitle").value.trim();
    const duration = document.getElementById("duration").value.trim();
    const payRange = document.getElementById("payRange").value.trim();
    const location = document.getElementById("location").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!title || !duration || !payRange || !location) {
      alert("Please fill out all required fields!");
      return;
    }

    const jobs = getData(JOBS_KEY);
    const newJob = {
      id: Date.now(),
      title,
      duration,
      pay: payRange,
      location,
      description,
      employer: JSON.parse(localStorage.getItem(EMPLOYER_KEY))?.businessName || "Unknown Employer",
      applicants: []
    };

    jobs.push(newJob);
    setData(JOBS_KEY, jobs);

    alert("✅ Job posted successfully! Drivers can now see it.");
    jobForm.reset();

    displayJobs(); // refresh list below
  });
}

// ✅ DISPLAY EMPLOYER'S JOB POSTS
const jobListSection = document.querySelector(".job-list");
function displayJobs() {
  if (!jobListSection) return;
  const jobs = getData(JOBS_KEY);

  if (jobs.length === 0) {
    jobListSection.innerHTML = `<p>No job posts yet.</p>`;
  } else {
    jobListSection.innerHTML = jobs
      .map(
        (job) => `
      <div class="job-card">
        <h4>${job.title}</h4>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Duration:</strong> ${job.duration}</p>
        <p><strong>Pay Range:</strong> ${job.pay}</p>
        <p><strong>Description:</strong> ${job.description}</p>
        <button class="btn gray" onclick="viewApplicants(${job.id})">View Applicants</button>
      </div>
    `
      )
      .join("");
  }
}
displayJobs();

// ✅ VIEW APPLICANTS (for future backend linking)
function viewApplicants(jobId) {
  const applicants = getData(APPLICANTS_KEY).filter(
    (a) => a.jobId === jobId
  );
  if (applicants.length === 0) {
    alert("No applicants yet for this job.");
  } else {
    alert(`Applicants:\n\n${applicants
      .map((a) => `👤 ${a.driverName} — ${a.status}`)
      .join("\n")}`);
  }
}
