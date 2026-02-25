/* ============================================================
   MOBWASH SETTINGS LOGIC — INLINE EDITING (SAFE)
   - Does NOT restore defaults / localStorage
   - session.js is the source of truth for loading values
   ============================================================ */

const Settings = {
  init() {
    this.initEditableInputs();
    this.initEditableSpans();
  },

  // Inputs: just allow editing without snapping back to defaultValue
  initEditableInputs() {
    document.querySelectorAll(".setting-info input").forEach((input) => {
      input.addEventListener("blur", () => {
        // Do nothing here (saving happens in your firebase settings save logic later)
        navigator.vibrate?.(10);
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
        if (e.key === "Escape") {
          // revert to what session.js originally hydrated into the input
          input.value = input.dataset.originalValue || input.value;
          input.blur();
        }
      });

      // store original so ESC works
      input.dataset.originalValue = input.value || "";
    });
  },

  // Span -> input edit (no localStorage writes)
  initEditableSpans() {
    document.querySelectorAll(".setting-item").forEach((item) => {
      const editIcon = item.querySelector(".bx-edit-alt");
      const span = item.querySelector(".setting-info span");
      const title = item.querySelector(".setting-info strong");

      if (!editIcon || !span || !title) return;

      editIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        this.makeSpanEditable(span, editIcon);
      });
    });
  },

  makeSpanEditable(span, icon) {
    if (span.dataset.editing) return;
    span.dataset.editing = "true";

    const originalValue = span.textContent.trim();
    const input = document.createElement("input");
    input.type = "text";
    input.value = originalValue;
    input.style.width = "100%";
    input.style.fontSize = "0.85rem";
    input.style.fontWeight = "600";

    icon.classList.replace("bx-edit-alt", "bx-check");
    icon.style.opacity = "1";

    span.replaceWith(input);
    input.focus();

    const save = () => {
      const value = input.value.trim() || originalValue;

      const newSpan = document.createElement("span");
      newSpan.textContent = value;

      input.replaceWith(newSpan);

      icon.classList.replace("bx-check", "bx-edit-alt");
      icon.style.opacity = "0.5";
      navigator.vibrate?.(10);

      // NOTE: saving to Firestore/Auth should be handled by a dedicated firebase save handler
      // This file now only handles the UI editing.
    };

    const cancel = () => {
      const newSpan = document.createElement("span");
      newSpan.textContent = originalValue;
      input.replaceWith(newSpan);

      icon.classList.replace("bx-check", "bx-edit-alt");
      icon.style.opacity = "0.5";
    };

    input.addEventListener("blur", save);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
      if (e.key === "Escape") cancel();
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Settings.init();
});