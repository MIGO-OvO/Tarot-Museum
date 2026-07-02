(() => {
  const panels = document.querySelectorAll(".pos-panel");
  const buttons = document.querySelectorAll(".pos-switch button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const position = button.dataset.pos;

      buttons.forEach((candidate) => {
        const selected = candidate === button;
        candidate.classList.toggle("on", selected);
        candidate.setAttribute("aria-selected", String(selected));
      });

      panels.forEach((panel) => {
        panel.classList.toggle("show", panel.id === `panel-${position}`);
      });
    });
  });

  const reveals = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("active"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    });
  }, { threshold: .08 });

  reveals.forEach((element) => observer.observe(element));
})();
