document.addEventListener("DOMContentLoaded", () => {

  const elements = document.querySelectorAll(".animate-in");

  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.remove("animate-in"));
    return;
  }

  const observer = new IntersectionObserver((entries, observer) => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const element = entry.target;

      const animationType = element.dataset.animType || "fade-in";
      const delay = parseInt(element.dataset.animDelay) || 0;

      setTimeout(() => {

        element.classList.add("animating", animationType);
        element.classList.remove("animate-in");

      }, delay);

      element.addEventListener("animationend", () => {

        element.classList.remove("animating", animationType);

      }, { once: true });

      observer.unobserve(element);

    });

  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  elements.forEach(element => observer.observe(element));

});

document.querySelectorAll(".animate-group").forEach(group => {

  const items = group.querySelectorAll(".animate-in");

  items.forEach((item,index)=>{

    item.dataset.animDelay = index * 180;

  });

});