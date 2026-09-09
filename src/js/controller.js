"use strict";
const btnNavOpen = document.querySelector(".btn-nav--open");
const btnNavClose = document.querySelector(".btn-nav--close");
const aside = document.querySelector(".aside");
const overlay = document.querySelector(".overlay");
const btnAsideToggle = document.querySelector(".btn-aside--toggle");
const asideIconShow = document.querySelector(".aside-icon--show");
const asideIconHide = document.querySelector(".aside-icon--hide");
const stashLogoS = document.querySelector(".stash-logo-s");
const stashLogoFull = document.querySelector(".stash-logo-full");
const btnTheme = document.querySelector(".btn-theme");
const html = document.querySelector("html");
const lightTheme = document.querySelector(".light-theme");
const darkTheme = document.querySelector(".dark-theme");
const tooltip = document.querySelectorAll(".tooltip");
const asideText = document.querySelectorAll(".aside-text");
// const main = document.querySelector(".main");
let isSidebarCollapsed = true;
// mobile sidebar
const asideOpenMobile = function (e) {
  e.preventDefault();
  stashLogoS.classList.add("hidden");
  stashLogoFull.classList.remove("hidden");
  aside.classList.add("translate-x-0");
  aside.classList.remove("-translate-x-full");
  overlay.classList.remove("hidden");
  asideText.classList.remove("lg:hidden");
};
const asideCloseMobile = function (e) {
  e.preventDefault();
  stashLogoS.classList.remove("hidden");
  stashLogoFull.classList.add("hidden");
  aside.classList.remove("translate-x-0");
  aside.classList.add("-translate-x-full");
  overlay.classList.add("hidden");
  asideText.classList.add("lg:hidden");
};
// expand sidebar
const asideToggle = function () {
  isSidebarCollapsed = !isSidebarCollapsed;
  if (isSidebarCollapsed) {
    asideIconHide.classList.add("hidden");
    asideIconShow.classList.remove("hidden");
    stashLogoS.classList.remove("hidden");
    stashLogoFull.classList.add("hidden");
    aside.classList.remove("lg:w-[clamp(10rem,15vw,15rem)]");
    aside.classList.add("lg:w-[clamp(3rem,5vw,4.5rem)]");
    tooltip.forEach((el) => el.classList.remove("hidden"));

    asideText.forEach((el) => {
      el.classList.add("opacity-0");

      setTimeout(() => {
        el.classList.add("lg:hidden");
      }, 300);
    });
  } else {
    asideIconHide.classList.remove("hidden");
    asideIconShow.classList.add("hidden");
    stashLogoS.classList.add("hidden");
    stashLogoFull.classList.remove("hidden");
    aside.classList.remove("lg:w-[clamp(3rem,5vw,4.5rem)]");
    aside.classList.add("lg:w-[clamp(10rem,15vw,15rem)]");
    tooltip.forEach((el) => el.classList.add("hidden"));
    setTimeout(() => {
      asideText.forEach((el) => {
        el.classList.remove("lg:hidden");

        requestAnimationFrame(() => {
          el.classList.remove("opacity-0");
        });
      });
    }, 300);
  }
};
// theme toggle
const toggleTheme = function (e) {
  e.preventDefault();

  html.classList.toggle("dark");

  lightTheme.classList.toggle("scale-0");
  lightTheme.classList.toggle("rotate-90");
  lightTheme.classList.toggle("opacity-0");

  darkTheme.classList.toggle("scale-0");
  darkTheme.classList.toggle("rotate-90");
  darkTheme.classList.toggle("opacity-0");
};

// api

// enents
btnNavOpen.addEventListener("click", asideOpenMobile);
btnNavClose.addEventListener("click", asideCloseMobile);
overlay.addEventListener("click", asideCloseMobile);
btnAsideToggle.addEventListener("click", asideToggle);
btnTheme.addEventListener("click", toggleTheme);
