const HTTP = {
  'OK': 200,
  'CREATED': 201,
  'BAD_REQUEST': 400,
  'UNAUTHORIZED': 401,
  'FORBIDDEN': 403,
  'NOT_FOUND': 404,
  'INTERNAL_SERVER_ERROR':500,
  'SERVICE_UNAVAILABLE': 503,
  'GATEWAY_TIMEOUT': 504,
}

const API_URL = 'https://api.thecatapi.com/v1/';
const API_KEY = '87486569-6b11-4cb6-9dc3-fcfc365fb813';
const IMAGES_AMOUNT = 5;

const endpoints ={
  API_URL_LIMIT: (limit = 2) => `${API_URL}images/search/?limit=${limit}`,
  API_URL_FAVOURITES: (key, param) => [
    API_URL,
    `favourites/`, 
    param,
    `?api_key=${key}`,
  ].join(''),
  API_URL_KEY: (key, limit = 2) => [
    API_URL,
    `favourites?limit=${limit}`, 
    '&order=asc',
    `&api_key=${key}`, 
  ].join(''),
};

const spanError = document.getElementById('spanError');
const spanMessage = document.getElementById('spanMessage');

// Get random image catties
const getRandomsCatties = async () => {
  try {
    const res = await fetch(endpoints.API_URL_LIMIT(IMAGES_AMOUNT));
    const data = await res.json();
    if (res.status === 200) {
      // Clean Random catties section
      const section = document.getElementById('randomCatties');
      section.innerHTML = '';
      const h2 = document.createElement('h2');
      const h2Text = document.createTextNode('Random catties');
      h2.appendChild(h2Text);
      section.appendChild(h2);
      data.map(item => {
        const article = document.createElement('article');
        const img = document.createElement('img');
        const btn = document.createElement('button');
        const btnText = document.createTextNode('Save cattie in favourites');
        btn.onclick = () => saveFavouriteCattie(item.id);
        btn.appendChild(btnText);
        img.src = item.url;
        img.width = 100;
        img.alt = 'Favourite cattie image';
        article.appendChild(img);
        article.appendChild(btn);
        section.appendChild(article);
      });
    } else {
      spanError.textContent = `Error on load Random catties images: ${res.status} - ${res.statusText} - ${data.message}`;
    }
  } catch (error) {
    console.error(new Error(error));
  }
}

/**
 * Favourites administration
 */

// Get favourites images catties
const getFavouritesCatties = async () => {
  try {
    const res = await fetch(endpoints.API_URL_KEY(API_KEY, 100));
    const data = await res.json();
    if (res.status === 200) {
      // Clean Random section
      const section = document.getElementById('favouritesCatties');
      section.innerHTML = '';
      const h2 = document.createElement('h2');
      const h2Text = document.createTextNode('Favourites catties');
      h2.appendChild(h2Text);
      section.appendChild(h2);
      data.map((item, i) => {
        const article = document.createElement('article');
        const img = document.createElement('img');
        const btn = document.createElement('button');
        const btnText = document.createTextNode('Take out cattie from favourites');
        btn.onclick = () => deleteFavouriteCattie(item.id);
        btn.appendChild(btnText);
        img.src = item.image.url;
        img.width = 100;
        img.alt = 'Favourite cattie image';
        article.appendChild(img);
        article.appendChild(btn);
        section.appendChild(article);
        img.src = item.image.url;
      });
    } else {
      spanError.textContent = `Error on load Favourites catties images: ${res.status} - ${res.statusText} - ${data.message}`;
    }
  } catch (error) {
    console.error(new Error(error));
  }
}

const saveFavouriteCattie = async (imageId) => {
  try {
    const res = await fetch(endpoints.API_URL_KEY(API_KEY, IMAGES_AMOUNT), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_id: imageId,
      })
    });
    const data = await res.json();
    if (res.status === 200) {
      getFavouritesCatties();
    } else {
      spanError.textContent = `Error on load Favourites catties images: ${res.status} - ${res.statusText} - ${data.message}`;
    }
  } catch (error) {
    console.error(new Error(error));
  }
}

const deleteFavouriteCattie = async (favouriteId) => {
  try {
    const res = await fetch(endpoints.API_URL_FAVOURITES(API_KEY, favouriteId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await res.json();
    if (res.status === 200) {
      getFavouritesCatties();
    } else {
      spanError.textContent = `Error on load Favourites catties images: ${res.status} - ${res.statusText} - ${data.message}`;
    }
  } catch (error) {
    console.error(new Error(error));
  }
}

// Load image on click button
const myButton = document.querySelector('button');
myButton.onclick = () => {
  getRandomsCatties();
};

// Load a image on load page
window.onload = () => {
  getRandomsCatties();
  getFavouritesCatties();
};