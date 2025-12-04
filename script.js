// ---------------- MOCK DOCTORS ----------------
const doctors = [
  { id: 1, 
    name: "Dr. Aisha Sharma", 
    specialty: "General Physician", 
    experience: "8 years", 
    about: "Handles fever, infections and chronic issues.", 
    slots: ["9:00 AM", "10:00 AM", "2:00 PM"] 
},
  { 
    id: 2, 
    name: "Dr. Rohit Verma", 
    specialty: "Dermatologist", 
    experience: "10 years", 
    about: "Skincare, acne treatment and cosmetic procedures.", 
    slots: ["12:00 PM", "3:00 PM", "5:00 PM"] },
  { id: 3, 
    name: "Dr. Neha Gupta", 
    specialty: "Pediatrician", 
    experience: "6 years", 
    about: "Child specialist, vaccinations and growth issues.", 
    slots: ["11:00 AM", "1:00 PM"] },
  { id: 4, 
    name: "Dr. Sameer Patel", 
    specialty: "Cardiologist", 
    experience: "12 years", 
    about: "Heart specialist focusing on cardiac health, ECG, cholesterol, and heart diagnosis.", 
    slots: ["9:30 AM", "11:00 AM", "4:00 PM"] },
  { id: 5, 
    name: "Dr. Priya Nair", 
    specialty: "Gynecologist", 
    experience: "9 years", 
    about: "Specialist in pregnancy care, menstrual issues, and fertility guidance.", 
    slots: ["10:00 AM", "1:00 PM", "6:00 PM"] },
  { id: 6, 
    name: "Dr. Arjun Mehta", 
    specialty: "Orthopedic", 
    experience: "7 years", 
    about: "Expert in bone, joint and muscle problems; handles fractures and injuries.", 
    slots: ["9:00 AM", "12:00 PM", "3:00 PM"] },
  { id: 7, 
    name: "Dr. Kavita Joshi", 
    specialty: "Neurologist", 
    experience: "14 years", 
    about: "Brain & nerve specialist treating migraines, seizures and neurological disorders.", 
    slots: ["11:00 AM", "2:00 PM", "5:00 PM"] }
];


// ---------------- THEME ----------------
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("themeToggle");
  const html = document.documentElement;

  const saved = localStorage.getItem("theme");
  if (saved === "dark") html.classList.add("dark");

  btn?.addEventListener("click", () => {
    html.classList.toggle("dark");
    localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");
  });
});


// ---------------- AUTOCOMPLETE + SEARCH ----------------
const searchInput = document.getElementById("searchInput");
const autocompleteList = document.getElementById("autocompleteList");

function showSuggestions() {
  if (!searchInput) return;

  const query = searchInput.value.toLowerCase().trim();
  autocompleteList.innerHTML = "";

  if (!query) {
    autocompleteList.classList.add("hidden");
    loadDoctors();
    return;
  }

  const matches = doctors.filter(doc => doc.name.toLowerCase().includes(query));

  matches.forEach(doc => {
    let div = document.createElement("div");
    div.className = "p-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer";
    div.textContent = doc.name;

    div.onclick = () => {
      searchInput.value = doc.name;
      autocompleteList.classList.add("hidden");
      loadDoctors();
    };

    autocompleteList.appendChild(div);
  });

  autocompleteList.classList.remove("hidden");
}

searchInput?.addEventListener("input", () => {
  showSuggestions();
  loadDoctors();
});


// ---------------- SPECIALTY FILTER ----------------
function loadSpecialties() {
  const select = document.getElementById("specialtyFilter");
  if (!select) return;

  [...new Set(doctors.map(d => d.specialty))]
    .sort()
    .forEach(s => {
      let opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      select.appendChild(opt);
    });
}


// ---------------- DOCTOR LIST ----------------
function loadDoctors() {
  const list = document.getElementById("doctorList");
  if (!list) return;

  const search = (searchInput?.value || "").toLowerCase().trim();
  const filter = document.getElementById("specialtyFilter")?.value || "";

  let filtered = doctors
    .filter(doc => doc.name.toLowerCase().includes(search))
    .filter(doc => filter === "" || doc.specialty === filter);

  // ❗ Change layout to 1 column when searching
  if (search || filter) {
    list.classList.remove("md:grid-cols-2");
  } else {
    list.classList.add("md:grid-cols-2");
  }

  list.innerHTML = "";

  if (filtered.length === 0) {
    list.innerHTML = `<p class="text-center text-red-500 text-lg">No doctors found</p>`;
    return;
  }

  filtered.forEach(doc => {
    list.innerHTML += `
      <div class="bg-white dark:bg-gray-800 p-4 shadow rounded flex justify-between">
        <div>
          <h3 class="text-xl font-bold">${doc.name}</h3>
          <p class="text-gray-600 dark:text-gray-300">${doc.specialty} • ${doc.experience}</p>
          <p class="mt-1 text-gray-700 dark:text-gray-400">${doc.about}</p>
        </div>

        <button onclick="bookDoctor(${doc.id})"
                class="px-4 py-2 bg-blue-600 text-white rounded">
          Book
        </button>
      </div>`;
  });
}

function bookDoctor(id) {
  window.location.href = "booking.html?doctor=" + id;
}


// ---------------- BOOKING PAGE ----------------
if (document.getElementById("bookingArea")) {
  const params = new URLSearchParams(location.search);
  const doc = doctors.find(d => d.id == params.get("doctor"));

  if (doc) loadBookingForm(doc);
  else document.getElementById("bookingArea").innerHTML =
    "<p class='text-red-500'>Doctor Not Found</p>";
}

let selectedSlot = null;

function loadBookingForm(doc) {
  let slotHTML = doc.slots.map(s =>
    `<button class="px-3 py-1 border rounded hover:bg-blue-600 hover:text-white"
             onclick="selectSlot('${s}', this)">
      ${s}
    </button>`).join("");

  document.getElementById("bookingArea").innerHTML = `
      <h2 class="text-2xl font-bold">${doc.name}</h2>
      <p>${doc.specialty} • ${doc.experience}</p>
      <p class="mt-2">${doc.about}</p>

      <h3 class="font-semibold mt-4">Select Slot</h3>
      <div id="slotArea" class="flex gap-2 flex-wrap">${slotHTML}</div>

      <input id="pName" class="border p-2 w-full mt-4 rounded" placeholder="Patient Name">
      <input id="phone" class="border p-2 w-full mt-3 rounded" placeholder="Phone">

      <button onclick="confirmBooking('${doc.name}')"
              class="w-full mt-5 bg-green-600 text-white py-2 rounded">
        Confirm Appointment
      </button>
  `;
}

function selectSlot(slot, btn) {
  selectedSlot = slot;
  document.querySelectorAll("#slotArea button").forEach(b =>
    b.classList.remove("bg-blue-600", "text-white")
  );
  btn.classList.add("bg-blue-600", "text-white");
}

function confirmBooking(doctor) {
  const name = document.getElementById("pName").value;
  const phone = document.getElementById("phone").value;

  if (!name || !phone || !selectedSlot) {
    alert("Please complete all details.");
    return;
  }

  alert(`
✔ Appointment Confirmed!

Doctor: ${doctor}
Patient: ${name}
Phone: ${phone}
Slot: ${selectedSlot}
  `);
}


// ---------------- INITIAL LOAD ----------------
if (document.getElementById("doctorList")) {
  loadDoctors();
  loadSpecialties();
}
