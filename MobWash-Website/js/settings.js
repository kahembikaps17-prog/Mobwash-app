/* ============================================================
   MOBWASH SETTINGS LOGIC — EXECUTIVE INLINE EDITING (ENHANCED)
   ============================================================ */

const Settings = {
    init() {
        this.initEditableInputs();
        this.initEditableSpans();
        this.restoreSavedValues();
    },

    /* ----------------------------------------
       INPUT FIELDS (Name, Email)
    ---------------------------------------- */
    initEditableInputs() {
        document.querySelectorAll('.setting-info input').forEach(input => {
            const label = input.previousElementSibling?.textContent;
            if (!label) return;

            const key = `settings-${label}`;

            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    input.value = localStorage.getItem(key) || input.defaultValue;
                    return;
                }
                localStorage.setItem(key, input.value.trim());
                navigator.vibrate?.(10);
            });

            input.addEventListener('keydown', e => {
                if (e.key === 'Enter') input.blur();
                if (e.key === 'Escape') {
                    input.value = localStorage.getItem(key) || input.defaultValue;
                    input.blur();
                }
            });
        });
    },

    /* ----------------------------------------
       INLINE SPAN → INPUT EDITING
    ---------------------------------------- */
    initEditableSpans() {
        document.querySelectorAll('.setting-item').forEach(item => {
            const editIcon = item.querySelector('.bx-edit-alt');
            const span = item.querySelector('.setting-info span');
            const title = item.querySelector('.setting-info strong');

            if (!editIcon || !span || !title) return;

            const key = `settings-${title.textContent}`;

            editIcon.addEventListener('click', e => {
                e.stopPropagation();
                this.makeSpanEditable(span, editIcon, key);
            });
        });
    },

    makeSpanEditable(span, icon, storageKey) {
        if (span.dataset.editing) return;
        span.dataset.editing = 'true';

        const originalValue = span.textContent.trim();
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalValue;
        input.style.width = '100%';
        input.style.fontSize = '0.85rem';
        input.style.fontWeight = '600';

        // Icon → checkmark
        icon.classList.replace('bx-edit-alt', 'bx-check');
        icon.style.opacity = '1';

        span.replaceWith(input);
        input.focus();

        const save = () => {
            const value = input.value.trim() || originalValue;

            const newSpan = document.createElement('span');
            newSpan.textContent = value;
            delete newSpan.dataset?.editing;

            localStorage.setItem(storageKey, value);
            input.replaceWith(newSpan);

            icon.classList.replace('bx-check', 'bx-edit-alt');
            icon.style.opacity = '0.5';
            navigator.vibrate?.(10);
        };

        const cancel = () => {
            const newSpan = document.createElement('span');
            newSpan.textContent = originalValue;
            input.replaceWith(newSpan);

            icon.classList.replace('bx-check', 'bx-edit-alt');
            icon.style.opacity = '0.5';
        };

        input.addEventListener('blur', save);
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') input.blur();
            if (e.key === 'Escape') cancel();
        });
    },

    /* ----------------------------------------
       RESTORE SAVED VALUES
    ---------------------------------------- */
    restoreSavedValues() {
        // Restore inputs
        document.querySelectorAll('.setting-info input').forEach(input => {
            const label = input.previousElementSibling?.textContent;
            if (!label) return;

            const saved = localStorage.getItem(`settings-${label}`);
            if (saved) input.value = saved;
        });

        // Restore spans
        document.querySelectorAll('.setting-info strong').forEach(title => {
            const span = title.nextElementSibling;
            if (!span) return;

            const saved = localStorage.getItem(`settings-${title.textContent}`);
            if (saved) span.textContent = saved;
        });
    }
};

/* --- INIT --- */
document.addEventListener('DOMContentLoaded', () => {
    Settings.init();
});
