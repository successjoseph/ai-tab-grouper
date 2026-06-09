// ─── Popup Script ─────────────────────────────

const totalTabsEl = document.getElementById("total-tabs");
const aiTabsEl    = document.getElementById("ai-tabs");
const statusPill  = document.getElementById("status-pill");
const statusText  = document.getElementById("status-text");
const rescanBtn   = document.getElementById("rescan-btn");
const toast       = document.getElementById("toast");

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.className = "toast show" + (isError ? " error" : "");
  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

function loadStats() {
  chrome.runtime.sendMessage({ action: "getStats" }, (response) => {
    if (!response) return;

    totalTabsEl.textContent = response.totalTabs;
    aiTabsEl.textContent    = response.aiTabs;

    if (response.hasGroup) {
      statusPill.className = "status-pill";
      statusText.textContent = "AI group is active";
    } else if (response.aiTabs > 0) {
      statusPill.className = "status-pill no-group";
      statusText.textContent = "AI tabs found, no group yet";
    } else {
      statusPill.className = "status-pill no-group";
      statusText.textContent = "No AI tabs open";
    }
  });
}

rescanBtn.addEventListener("click", () => {
  rescanBtn.disabled = true;
  rescanBtn.textContent = "⏳ Scanning...";

  chrome.runtime.sendMessage({ action: "rescan" }, (response) => {
    rescanBtn.disabled = false;
    rescanBtn.textContent = "🔍 Scan & Group All AI Tabs";

    if (response?.success) {
      const count = response.grouped;
      showToast(
        count > 0
          ? `✅ Grouped ${count} AI tab${count !== 1 ? "s" : ""}`
          : "No AI tabs found to group"
      );
      loadStats();
    } else {
      showToast("Something went wrong. Try again.", true);
    }
  });
});

// Load stats when popup opens
loadStats();
