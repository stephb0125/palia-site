let quests = [];
let resources = [];

document.addEventListener("DOMContentLoaded", () => {
  loadData();
  setupTabs();
});

async function loadData() {
  try {
    console.log("Loading data...");

    const qRes = await fetch("./quests.json");
    const rRes = await fetch("./resources.json");

    if (!qRes.ok || !rRes.ok) {
      throw new Error("JSON files not found (check paths)");
    }

    quests = await qRes.json();
    resources = await rRes.json();

    console.log("Data loaded successfully:", { quests, resources });

    render();
  } catch (err) {
    console.error("Load failed:", err);

    document.body.innerHTML = `
      <div style="
        color:white;
        font-family:Arial;
        text-align:center;
        margin-top:50px;
      ">
        <h1>⚠️ Failed to load data</h1>
        <p>Check console (F12) for details</p>
      </div>
    `;
  }
}

function setupTabs() {
  const questsTab = document.getElementById("quests");
  if (questsTab) questsTab.classList.add("active");
}

function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));

  const el = document.getElementById(tab);
  if (el) el.classList.add("active");

  render();
}

function render() {
  const searchEl = document.getElementById("search");
  const skillEl = document.getElementById("skillFilter");
  const regionEl = document.getElementById("regionFilter");

  const search = searchEl ? searchEl.value.toLowerCase() : "";
  const skill = skillEl ? skillEl.value : "all";
  const region = regionEl ? regionEl.value : "all";

  const questBox = document.getElementById("quests");
  const resourceBox = document.getElementById("resources");

  if (!questBox || !resourceBox) {
    console.warn("Missing DOM containers");
    return;
  }

  questBox.innerHTML = "";
  resourceBox.innerHTML = "";

  // 🧭 QUESTS
  quests
    .filter(q =>
      (skill === "all" || q.skill === skill) &&
      (region === "all" || q.region === region) &&
      q.title.toLowerCase().includes(search)
    )
    .forEach(q => {
      questBox.innerHTML += `
        <div class="card">
          ${q.image ? `<img src="${q.image}" alt="">` : ""}
          <h3>${q.title}</h3>
          <p><b>Skill:</b> ${q.skill}</p>
          <p><b>Region:</b> ${q.region}</p>
          <p>${q.description}</p>
        </div>
      `;
    });

  // 🌿 RESOURCES
  resources
    .filter(r => r.name.toLowerCase().includes(search))
    .forEach(r => {
      resourceBox.innerHTML += `
        <div class="card">
          <h3>${r.name}</h3>
          <p><b>Location:</b> ${r.location}</p>
          <p><b>Use:</b> ${r.use}</p>
        </div>
      `;
    });

  // If empty state
  if (questBox.innerHTML === "") {
    questBox.innerHTML = "<p style='color:white'>No quests found</p>";
  }

  if (resourceBox.innerHTML === "") {
    resourceBox.innerHTML = "<p style='color:white'>No resources found</p>";
  }
}
