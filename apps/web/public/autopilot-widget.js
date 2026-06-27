(() => {
  const script = document.currentScript;

  if (!script) return;

  const apiUrl = script.dataset.apiUrl || "http://localhost:4000/api";
  const organizationSlug = script.dataset.organizationSlug || "";
  const widgetToken = script.dataset.widgetToken || "";
  const title = script.dataset.title || "Reception AI";
  const visitorKey = `autopilot.visitor.${organizationSlug}`;
  const conversationKey = `autopilot.conversation.${organizationSlug}`;

  if (!organizationSlug) {
    console.warn("Autopilot widget missing data-organization-slug.");
    return;
  }

  const existingVisitor = window.localStorage.getItem(visitorKey);
  const visitorId = existingVisitor || `visitor_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
  window.localStorage.setItem(visitorKey, visitorId);

  let conversationId = window.localStorage.getItem(conversationKey);

  const root = document.createElement("div");
  root.id = "autopilot-one-widget";
  root.style.position = "fixed";
  root.style.right = "24px";
  root.style.bottom = "24px";
  root.style.zIndex = "2147483000";
  root.style.fontFamily = "Inter, system-ui, sans-serif";

  const panel = document.createElement("div");
  panel.style.display = "none";
  panel.style.width = "360px";
  panel.style.maxWidth = "calc(100vw - 40px)";
  panel.style.height = "520px";
  panel.style.maxHeight = "calc(100vh - 120px)";
  panel.style.marginBottom = "12px";
  panel.style.border = "1px solid rgba(255,255,255,.16)";
  panel.style.borderRadius = "24px";
  panel.style.overflow = "hidden";
  panel.style.background = "#070a12";
  panel.style.color = "#f7fbff";
  panel.style.boxShadow = "0 24px 80px rgba(0,0,0,.45)";

  const header = document.createElement("div");
  header.textContent = title;
  header.style.padding = "18px";
  header.style.fontWeight = "800";
  header.style.borderBottom = "1px solid rgba(255,255,255,.12)";

  const messages = document.createElement("div");
  messages.style.height = "360px";
  messages.style.overflowY = "auto";
  messages.style.padding = "14px";

  const form = document.createElement("form");
  form.style.display = "grid";
  form.style.gridTemplateColumns = "1fr auto";
  form.style.gap = "8px";
  form.style.padding = "14px";
  form.style.borderTop = "1px solid rgba(255,255,255,.12)";

  const input = document.createElement("input");
  input.placeholder = "Type your message...";
  input.maxLength = 2000;
  input.style.border = "1px solid rgba(255,255,255,.16)";
  input.style.borderRadius = "999px";
  input.style.background = "rgba(255,255,255,.06)";
  input.style.color = "#f7fbff";
  input.style.padding = "12px 14px";

  const send = document.createElement("button");
  send.type = "submit";
  send.textContent = "Send";
  send.style.border = "0";
  send.style.borderRadius = "999px";
  send.style.background = "#8ee6c9";
  send.style.color = "#06100d";
  send.style.fontWeight = "800";
  send.style.padding = "0 16px";

  const bubble = document.createElement("button");
  bubble.type = "button";
  bubble.textContent = "AI";
  bubble.style.width = "64px";
  bubble.style.height = "64px";
  bubble.style.border = "0";
  bubble.style.borderRadius = "999px";
  bubble.style.background = "#8ee6c9";
  bubble.style.color = "#06100d";
  bubble.style.fontWeight = "800";
  bubble.style.boxShadow = "0 18px 60px rgba(0,0,0,.32)";

  function addMessage(content, sender) {
    const message = document.createElement("div");
    message.textContent = content;
    message.style.maxWidth = "86%";
    message.style.padding = "11px 13px";
    message.style.margin = "0 0 10px";
    message.style.borderRadius = "16px";
    message.style.lineHeight = "1.45";
    message.style.fontSize = "14px";
    message.style.whiteSpace = "pre-wrap";
    message.style.marginLeft = sender === "customer" ? "auto" : "0";
    message.style.background = sender === "customer" ? "#8ee6c9" : "rgba(255,255,255,.07)";
    message.style.color = sender === "customer" ? "#06100d" : "#f7fbff";
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }

  addMessage("Hi. How can we help?", "ai");

  bubble.addEventListener("click", () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    input.focus();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    input.value = "";
    addMessage(text, "customer");
    send.disabled = true;

    try {
      const response = await fetch(`${apiUrl}/public/reception-ai/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationSlug,
          message: text,
          conversationId: conversationId || undefined,
          visitorId,
          widgetToken: widgetToken || undefined,
          websiteUrl: window.location.href,
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Reception AI could not answer.");

      conversationId = data.conversationId;
      window.localStorage.setItem(conversationKey, conversationId);
      addMessage(data.reply, "ai");
    } catch (error) {
      addMessage(error instanceof Error ? error.message : "Reception AI could not answer.", "ai");
    } finally {
      send.disabled = false;
    }
  });

  form.append(input, send);
  panel.append(header, messages, form);
  root.append(panel, bubble);
  document.body.appendChild(root);
})();
