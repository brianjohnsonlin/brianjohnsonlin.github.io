document.addEventListener("DOMContentLoaded", event => setup());

function setup() {
  document.querySelector('.home .portraits img').classList.add('selected');
  setInterval(cyclePortrait, 5000);
  if (localStorage.getItem('darkMode') === 'true') {
    toggleDarkMode();
  }
  setExpAndProject(window.location.hash);
  selectSlide(0);
  resumeSlideshow();
  addEventListener('scroll', (event) => {
    const homeThemeButton = document.querySelector('.home .theme');
    document.querySelector('.header').classList.toggle('past-home', window.scrollY >= homeThemeButton.offsetTop + homeThemeButton.offsetHeight);
  });
  for (const display of document.querySelectorAll('.slideshow .display')) {
    display.addEventListener('touchstart', nextSlide);
  }
}

function toggleDarkMode() {
  for (const button of document.querySelectorAll('button.theme')) {
    button.classList.toggle('on');
  }

  document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
}

function setExpAndProject(hash) {
  let page = '';
  let expIndex = 0;
  let projectIndex = 0;

  switch (hash) {
    case '#about':
      page = 'about';
      break;
    case '#experience':
    case '#waymo':
      page = 'experience';
      break;
    case '#osmo':
      page = 'experience';
      expIndex = 1;
      break;
    case '#ucsc':
      page = 'experience';
      expIndex = 2;
      break;
    case '#projects':
    case '#moai':
      page = 'projects';
      break;
    case '#ttl':
      page = 'projects';
      projectIndex = 1;
      break;
    case '#crazyegg':
      page = 'projects';
      projectIndex = 2;
      break;
    case '#otherprojects':
      page = 'projects';
      projectIndex = 3;
      break;
    case '#contact':
      page = 'contact';
      break;
    default:
      break;
  }
  
  selectExp(expIndex, false, true);
  selectProject(projectIndex, false);
  if (page) {
    setTimeout(() => scrollIntoView(page, false, true), 10);
  }
}

function updateHash(hash) {
  window.location = '#' + hash;
}

function scrollIntoView(className, needUpdateHash = true, instant = false) {
  window.scroll({
    top: document.querySelector(`.${className}`).offsetTop,
    behavior: instant ? 'instant' : 'smooth',
  });
  if (needUpdateHash) {
    updateHash(className === 'home' ? '' : className);
  }
  closeCondensedMenu();
}

function openCondensedMenu() {
  document.body.classList.add('condensed-menu-open');
}

function closeCondensedMenu() {
  document.body.classList.remove('condensed-menu-open');
}

// For the portrait on the home page
let selectedPortraitIndex = 0;
function cyclePortrait() {
  const portraits = document.querySelectorAll('.home .portraits img');
  selectedPortraitIndex++;
  if (selectedPortraitIndex >= portraits.length) {
    selectedPortraitIndex = 0;
  }
  for (let i = 0; i < portraits.length; i++) {
    portraits[i].classList.toggle('selected', selectedPortraitIndex === i);
  }
}

// For experience tabs
let selectedExpIndex;
function selectExp(index, needUpdateHash = true, instant = false) {
  if (needUpdateHash) {
    switch (index) {
      case 0:
        updateHash('waymo');
        break;
      case 1:
        updateHash('osmo');
        break;
      case 2:
        updateHash('ucsc');
        break;
      default:
        break;
    }
  }

  if (selectedExpIndex === index) return;
  const tabHeads = document.querySelectorAll('.experience .tab-head');
  const tabBodies = document.querySelectorAll('.experience .tab-content .tab-body');
  const selectedTabHead = tabHeads[index];
  selectedTabHead.classList.add('selected');
  tabBodies[index].classList.add('selected');
  
  const tabHeader = document.querySelector('.experience .tab-header');
  if (selectedTabHead.offsetLeft < tabHeader.scrollLeft) {
    tabHeader.scrollTo({
      left: selectedTabHead.offsetLeft,
      behavior: instant ? 'instant' : 'smooth',
    });
  } else if (tabHeader.scrollLeft + tabHeader.offsetWidth < selectedTabHead.offsetLeft + selectedTabHead.offsetWidth) {
    tabHeader.scrollTo({
      left: selectedTabHead.offsetLeft + selectedTabHead.offsetWidth - tabHeader.offsetWidth,
      behavior: instant ? 'instant' : 'smooth',
    });
  }

  setTimeout(body => {
    body.classList.remove('appearing');
    body.classList.add('selected');
  }, 0, tabBodies[index]);
  if (selectedExpIndex !== undefined) {
    tabHeads[selectedExpIndex].classList.remove('selected');
    tabBodies[selectedExpIndex].classList.remove('selected');
    tabBodies[selectedExpIndex].classList.add('vanishing');
    setTimeout(body => {
      body.classList.remove('vanishing');
    }, 200, tabBodies[selectedExpIndex]);
  }
  selectedExpIndex = index;
  document.querySelector('.experience .picker-vertical').style.top = `${45 * selectedExpIndex}px`;
  document.querySelector('.experience .picker-horizontal').style.left = `${140 * selectedExpIndex}px`;
}

// For project tabs
let selectedProjectIndex;
function selectProject(index, needUpdateHash = true) {
  if (needUpdateHash) {
    switch (index) {
      case 0:
        updateHash('moai');
        break;
      case 1:
        updateHash('ttl');
        break;
      case 2:
        updateHash('crazyegg');
        break;
      case 3:
        updateHash('otherprojects');
        break;
      default:
        break;
    }
  }

  if (selectedProjectIndex === index) return;
  const tabHeads = document.querySelectorAll('.projects .tab-head');
  const tabBodies = document.querySelectorAll('.projects .tab-content .tab-body');
  tabHeads[index].classList.add('selected');
  tabBodies[index].classList.add('appearing');
  setTimeout(body => {
    body.classList.remove('appearing');
    body.classList.add('selected');
  }, 0, tabBodies[index]);
  if (selectedProjectIndex !== undefined) {
    tabHeads[selectedProjectIndex].classList.remove('selected');
    tabBodies[selectedProjectIndex].classList.remove('selected');
    tabBodies[selectedProjectIndex].classList.add('vanishing');
    setTimeout(body => {
      body.classList.remove('vanishing');
    }, 500, tabBodies[selectedProjectIndex]);
  }
  selectedProjectIndex = index;
  selectSlide(0);
  resetSlideshowTimer();
}

// For slideshow
const MAX_NUM_PICTURES = 5;
let selectedSlideIndex;
let slideshowTimeoutId = null;
function selectSlide(index) {
  if (selectedSlideIndex === index) return;
  selectedSlideIndex = index;
  for (const slideshow of document.querySelectorAll('.slideshow')) {
    const images = slideshow.querySelectorAll('.display img');
    const pickerDots = slideshow.querySelectorAll('.picker-dot');
    for (let i = 0; i < MAX_NUM_PICTURES; i++) {
      images[i].classList.toggle('selected', selectedSlideIndex === i);
      pickerDots[i].classList.toggle('selected', selectedSlideIndex === i);
    }
  }
  resetSlideshowTimer();
}

function nextSlide() {
  selectSlide((selectedSlideIndex + 1) % MAX_NUM_PICTURES);
}

function resumeSlideshow() {
  if (slideshowTimeoutId === null) {
    slideshowTimeoutId = setTimeout(nextSlide, 5000);
    for (const playPause of document.querySelectorAll('.slideshow .play-pause')) {
      playPause.classList.add('playing');
    }
  }
}

function pauseSlideshow() {
  clearTimeout(slideshowTimeoutId);
  slideshowTimeoutId = null;
  for (const playPause of document.querySelectorAll('.slideshow .play-pause')) {
    playPause.classList.remove('playing');
  }
}

function resetSlideshowTimer() {
  if (slideshowTimeoutId === null) return;
  pauseSlideshow();
  resumeSlideshow();
}

function toggleSlideshow() {
  if (slideshowTimeoutId === null) {
    resumeSlideshow();
  } else {
    pauseSlideshow();
  }
}
