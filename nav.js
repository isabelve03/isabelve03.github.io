// Close nav if clicked outside
// (toggleMenu itself is defined inline in index.html, alongside the
// scroll-based nav logic it needs to stay in sync with)
document.addEventListener("click", function(event) {
  const navMenu = document.getElementById("navMenu");
  const hamburger = document.querySelector(".hamburger");

  if (
    navMenu.classList.contains("show") &&
    !navMenu.contains(event.target) &&
    !hamburger.contains(event.target)
  ) {
    navMenu.classList.remove("show");
  }
});
