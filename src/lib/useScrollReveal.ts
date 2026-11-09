import { useEffect } from "react";

/**
 * Texts reveal from transitions.dev: elements marked with .t-reveal fade and
 * rise into place once, the first time they enter the viewport. Uses
 * IntersectionObserver so no scroll listener runs on every frame.
 */
export const useScrollReveal = () => {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".t-reveal:not(.is-revealed)"));

    if (typeof IntersectionObserver === "undefined") {
      elements.forEach((element) => element.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));

    // Safety net: if rendering frames are throttled (background tab, print,
    // some embedded webviews) reveal whatever is already on screen.
    const fallback = window.setTimeout(() => {
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          element.classList.add("is-revealed");
        }
      });
    }, 2500);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);
};
