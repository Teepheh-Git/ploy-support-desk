"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

// Custom dropdown that replaces the browser's native <select>.
// `options` is an array of strings. `placeholder` is shown as the first, empty choice when given.
// Keyboard: Enter/Space/ArrowDown opens, ArrowUp/ArrowDown move, Home/End jump, Enter selects, Escape closes.
export default function Select({ id, label, value, onChange, options, placeholder, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const listId = useId();

  // The first entry is the placeholder (value ""), when one is given.
  const items = placeholder !== undefined ? ["", ...options] : options;
  const selectedLabel = value ? value : placeholder ?? "";

  // Close when the user clicks anywhere outside the dropdown.
  useEffect(() => {
    if (!isOpen) return;
    function handlePointer(event) {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("pointerdown", handlePointer);
    return () => document.removeEventListener("pointerdown", handlePointer);
  }, [isOpen]);

  function open() {
    setActiveIndex(Math.max(items.indexOf(value), 0));
    setIsOpen(true);
  }

  function choose(index) {
    onChange(items[index]);
    setIsOpen(false);
  }

  function handleKeyDown(event) {
    if (!isOpen) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        open();
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, items.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(items.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(activeIndex);
    } else if (event.key === "Tab") {
      setIsOpen(false);
    }
  }

  const activeId = isOpen && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={activeId}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
        className="flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 text-left text-sm text-slate-900 transition-colors hover:border-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
      >
        <span className={`truncate ${value ? "" : "text-slate-400"}`}>{selectedLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 z-40 mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
        >
          {items.map((item, index) => {
            const isSelected = item === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={item || "placeholder"}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex min-h-10 cursor-pointer items-center justify-between gap-2 rounded-lg px-3 text-sm ${
                  isActive ? "bg-violet-50 text-violet-900" : "text-slate-700"
                } ${item === "" ? "text-slate-400" : ""}`}
              >
                <span className="truncate">{item === "" ? placeholder : item}</span>
                {isSelected && item !== "" ? <Check className="h-4 w-4 shrink-0 text-violet-600" aria-hidden="true" /> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
