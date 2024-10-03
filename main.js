// CREATE SERVICE WORKER
const serviceWorkerLink = './src/sw.js';
let serviceWorkerRegistration;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(serviceWorkerLink).then((registration) => {
        serviceWorkerRegistration = registration;
        console.log(serviceWorkerRegistration, 1111)
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    });
  }

// MAIN CODE
let deferredPrompt; // Variable to store the event

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();

  deferredPrompt = e;

  const installButton = document.getElementById('install-button');
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    installButton.style.display = 'none';

    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null; // Reset the deferredPrompt variable
    });
  });
});

function askNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.log('Notification permission denied.');
        }
      });
    }
  }
  
  // Ask for notification permission on load
  window.addEventListener('load', askNotificationPermission);


const notifyBtnRef = document.querySelector('#notify-button');

notifyBtnRef.addEventListener('click', event => {
    showNotification();
});

function showNotification() {
    if (Notification.permission === 'granted') {
      // Check if the service worker is ready
      if (serviceWorkerRegistration) {
        console.log(serviceWorkerRegistration);
        const options = {
          body: 'Here is a notification from your PWA!',
          icon: './src/assets/icons/small-icon.png', // Replace with your own icon path
          badge: './src/assets/icons/small-icon.png' // Replace with your own badge path
        };
        serviceWorkerRegistration.showNotification('PWA Notification', options);
      } else {
        console.log('Service Worker is not ready.');
      }
    } else {
      console.log('Notification permission not granted.');
    }
  }

  const moviesContainerRef = document.querySelector('#movies')

  async function createMovieList() {
    try {
      const response = await fetch('https://freetestapi.com/api/v1/movies');
      const movies = await response.json();

      movies.forEach(element => {
        const moviePElement = document.createElement('p');
        moviePElement.textContent = element.title;
        moviesContainerRef.appendChild(moviePElement);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  createMovieList();

  caches.open('PWA_CACHE').then(cache => {
    cache.match('https://freetestapi.com/api/v1/movies').then(response => {
      if (response) {
        // Get the response body
        response.json().then(data => {
          console.log('movies:', data); // Log the response body
        });
      } else {
        console.log('No matching cache found');
      }
    }).catch(error => console.error('Error matching cache:', error));
  }).catch(error => console.error('Error opening cache:', error));
  
