/* ============================================================================
   Helix Box Landing Page Interactive Script
   ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  console.log("Helix Box Landing Page Initialized.");
});

// Copy CLI command to clipboard
function copyCliCommand() {
  const cliText = "npx helixbox-cli -n";
  navigator.clipboard.writeText(cliText).then(() => {
    const copyIcon = document.getElementById("copyIcon");
    if (copyIcon) {
      copyIcon.className = "fa-solid fa-check";
      copyIcon.style.color = "#34d399";
      setTimeout(() => {
        copyIcon.className = "fa-regular fa-copy";
        copyIcon.style.color = "";
      }, 2000);
    }
  });
}

// Interactive CLI Playground Tab Switcher
function switchPlaygroundTab(tabKey) {
  const buttons = document.querySelectorAll(".playground-tabs .tab-btn");
  buttons.forEach(btn => btn.classList.remove("active"));
  
  const targetBtn = event.currentTarget;
  if (targetBtn) targetBtn.classList.add("active");

  const consoleOutput = document.getElementById("playgroundOutput");
  if (!consoleOutput) return;

  if (tabKey === 'pair') {
    consoleOutput.innerHTML = `<code>$ npx helixbox-cli -n
Helixbox CLI v0.1.124
Generating secure session code...

Code: ettE6SRCHU
Connecting to gateway https://helixbox-proxy.onrender.com...
✔ App connected! (single secure E2E session)</code>`;
  } else if (tabKey === 'ai') {
    consoleOutput.innerHTML = `<code>$ helixbox-cli --ai "Fix build error in manager/src/index.ts"
[AI Assistant] Analyzing terminal log traceback...
Found missing environment variable fallback: MANAGER_ADMIN_PASSWORD
Applying fix to manager/src/index.ts (Line 483)...
✔ Build succeeded in 1.2s!</code>`;
  } else if (tabKey === 'x402') {
    consoleOutput.innerHTML = `<code>$ fetch https://helixbox-manager.onrender.com/v2/x402/ai/completion
HTTP/1.1 402 Payment Required
X-PAYMENT-REQUEST: scheme=algorand-x402, recipient=HELIXBOX...ALGO_ADDR, amount=10000 (0.01 USDC)

Signing transaction on Algorand MainNet...
Transaction Hash: 2Z7X9K4M8P0Q... Confirmed (< 1s)
Retrying with X-PAYMENT-RESPONSE proof...
HTTP/1.1 200 OK (AI completion delivered!)</code>`;
  }
}
