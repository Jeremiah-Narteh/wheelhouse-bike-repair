/* =========================================================
   NAV MENU (phones)
   Shows the hamburger button and opens/closes a full-screen
   menu. The CSS reads aria-expanded to decide whether the
   links are shown, so screen readers and the screen agree.
   On tablet and desktop the CSS hides the button and always
   shows the links.
   ========================================================= */

const navToggle = document.querySelector(".nav-toggle");
const siteHeader = document.querySelector(".site-header");

if (navToggle && siteHeader) {
  // JavaScript is running, so the menu can work: switch the header
  // to the phone menu layout, show the button, start closed.
  siteHeader.classList.add("has-menu");
  navToggle.hidden = false;
  navToggle.setAttribute("aria-expanded", "false");

  // Everything under the dimmed layer while the menu is open. These
  // are made "inert": not clickable and skipped by Tab and screen
  // readers, so focus can't wander behind the menu. The header
  // (logo, Call, WhatsApp) stays bright and usable.
  const behindMenu = document.querySelectorAll(".skip-link, main, footer");

  function setMenuOpen(isOpen) {
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
    for (const element of behindMenu) {
      element.inert = isOpen;
    }
  }

  function isMenuOpen() {
    return navToggle.getAttribute("aria-expanded") === "true";
  }

  // Button: open if closed, close if open.
  navToggle.addEventListener("click", function () {
    setMenuOpen(!isMenuOpen());
  });

  // After choosing a link, close the menu so the section is visible.
  const navLinks = document.querySelectorAll(".site-nav a");
  for (const link of navLinks) {
    link.addEventListener("click", function () {
      setMenuOpen(false);
    });
  }

  // Tapping the dimmed page below the menu closes it.
  // (Anything outside the nav counts as "outside".)
  const siteNav = document.querySelector(".site-nav");
  document.addEventListener("click", function (event) {
    if (isMenuOpen() && !siteNav.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  // Escape closes the menu and puts focus back on the button,
  // so keyboard users don't lose their place.
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isMenuOpen()) {
      setMenuOpen(false);
      navToggle.focus();
    }
  });

  // If the screen gets wider (e.g. phone turned sideways) while the
  // menu is open, close it so the page isn't left inert.
  const wideScreen = window.matchMedia("(min-width: 40em)");
  wideScreen.addEventListener("change", function () {
    if (wideScreen.matches) {
      setMenuOpen(false);
    }
  });
}
