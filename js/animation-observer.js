document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     ANIMAÇÕES (Intersection)
  ========================== */

  const elements = document.querySelectorAll(".animate-in");

  if (!("IntersectionObserver" in window)) {

    elements.forEach(el => el.classList.remove("animate-in"));

  } else {

    const observer = new IntersectionObserver((entries, observer) => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const element = entry.target;
        const animationType = element.dataset.animType || "fade-in-up";
        const delay = parseInt(element.dataset.animDelay) || 0;

        setTimeout(() => {

          element.classList.add("animating");
          element.classList.add(animationType);
          element.classList.remove("animate-in");

        }, delay);

        element.addEventListener("animationend", () => {

          element.classList.remove("animating");
          element.classList.remove(animationType);

        }, { once: true });

        observer.unobserve(element);

      });

    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    elements.forEach(el => observer.observe(el));

  }


  /* =========================
     CASCADE ANIMATION
  ========================== */

  document.querySelectorAll(".animate-group").forEach(group => {

    const items = group.querySelectorAll(".animate-in");

    items.forEach((item, index) => {
      item.dataset.animDelay = index * 180;
    });

  });


  /* =========================
     SERVICES SLIDER
  ========================== */

  const track = document.querySelector(".services-track");
  let cards = document.querySelectorAll(".service-card");

  if (!track || cards.length === 0) return;

  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[cards.length - 1].cloneNode(true);

  track.appendChild(firstClone);
  track.insertBefore(lastClone, cards[0]);

  cards = document.querySelectorAll(".service-card");

  let index = 1;
  let autoSlide;
  let cardWidth;


  /* =========================
     UPDATE CARD WIDTH
  ========================== */

  function updateCardWidth(){

    const gap = 40;
    cardWidth = cards[0].offsetWidth + gap;

    track.style.transform = `translateX(-${index * cardWidth}px)`;

  }

  updateCardWidth();


  /* =========================
     ACTIVE CARD
  ========================== */

  function updateActiveCard(){

    cards.forEach(card => card.classList.remove("active"));

    if(cards[index]){
      cards[index].classList.add("active");
    }

  }

  updateActiveCard();


  /* =========================
     SLIDE
  ========================== */

  function slideTo(i){

    index = i;

    track.style.transition = "transform .6s ease";
    track.style.transform = `translateX(-${index * cardWidth}px)`;

  }


  track.addEventListener("transitionend", () => {

    if(cards[index] === firstClone){

      track.style.transition = "none";
      index = 1;
      track.style.transform = `translateX(-${index * cardWidth}px)`;

    }

    if(cards[index] === lastClone){

      track.style.transition = "none";
      index = cards.length - 2;
      track.style.transform = `translateX(-${index * cardWidth}px)`;

    }

    updateActiveCard();

  });


  /* =========================
     AUTO SLIDE
  ========================== */

  function startAutoSlide(){

    stopAutoSlide();

    autoSlide = setInterval(() => {

      slideTo(index + 1);

    }, 5000);

  }

  function stopAutoSlide(){

    clearInterval(autoSlide);

  }

  startAutoSlide();


  /* =========================
     DRAG DESKTOP
  ========================== */

  let isDragging = false;
  let startX = 0;

  track.addEventListener("mousedown", (e) => {

    isDragging = true;
    startX = e.pageX;

    stopAutoSlide();

    track.style.cursor = "grabbing";

  });

  window.addEventListener("mouseup", () => {

    if(!isDragging) return;

    isDragging = false;

    track.style.cursor = "grab";

    startAutoSlide();

  });

  window.addEventListener("mousemove", (e) => {

    if(!isDragging) return;

    const diff = e.pageX - startX;

    if(Math.abs(diff) > 80){

      if(diff < 0) slideTo(index + 1);
      else slideTo(index - 1);

      isDragging = false;

    }

  });


  /* =========================
     MOBILE SWIPE
  ========================== */

  let touchStartX = 0;

  track.addEventListener("touchstart", (e) => {

    touchStartX = e.touches[0].clientX;

    stopAutoSlide();

  }, { passive:true });


  track.addEventListener("touchend", (e) => {

    const diff = e.changedTouches[0].clientX - touchStartX;

    if(Math.abs(diff) > 60){

      if(diff < 0) slideTo(index + 1);
      else slideTo(index - 1);

    }

    startAutoSlide();

  });


  /* =========================
     RESPONSIVE
  ========================== */

  window.addEventListener("resize", () => {

    updateCardWidth();

  });


  /* =========================
     PAUSE OUT OF VIEW
  ========================== */

  const sliderObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if(entry.isIntersecting) startAutoSlide();
      else stopAutoSlide();

    });

  }, { threshold: 0.2 });

  sliderObserver.observe(track);

});