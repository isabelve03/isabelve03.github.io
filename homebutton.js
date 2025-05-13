// Show home button if not on index
if (window.location.pathname !== "/" && !window.location.pathname.endsWith("index.html")) {
  document.getElementById("home-button").style.display = "block";
}

// Toggle nav menu
function toggleMenu() {
  const navMenu = document.getElementById("navMenu");
  navMenu.classList.toggle("show");
}

// Close nav if clicked outside
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