import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const KEY = '29561920-1065b6adaef0eaf94313a88f4';
const BASIC_URL = `https://pixabay.com/api/?key=${KEY}&q=`;
const mainRequest = '&image_type=photo&orientation=horizontal&safesearch=true';

const bodyGallary = document.querySelector('.gallery');
const refs = {
  form: document.querySelector('#search-form'),
  loadBtn: document.querySelector('.load-more'),
  submitBtn: document.querySelector('#submit'),
  input: document.querySelector('input'),
};
refs.form.addEventListener('submit', formSubmit);
refs.loadBtn.addEventListener('click', onLoadButton);
refs.input.addEventListener('input', submitButton);
refs.loadBtn.disabled = true;
let total = 1;

class GetImages {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.newQuery = '';
  }
  async getImages() {
    refs.submitBtn.disabled = true;
    const serverURL = `${BASIC_URL}${this.searchQuery}${mainRequest}&page=${this.page}&per_page=21`;
    try {
      const server = await axios.get(serverURL);
      const data = await server.data;

      return data;
    } catch (error) {}
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  incrementPage() {
    this.page += 1;
  }
}
const newImgService = new GetImages();

function formSubmit(evt) {
  refs.loadBtn.disabled = true;
  evt.preventDefault();
  const { searchQuery } = evt.currentTarget;
  newImgService.query = searchQuery.value;
  newImgService.resetPage();
  newImgService.getImages().then(data => choiceImg(data.hits));
}

function onLoadButton() {
  newImgService.incrementPage();
  newImgService.getImages().then(data => choiceImg(data.hits));
}
function submitButton(evt) {
  if (evt.currentTarget.value) {
    refs.submitBtn.disabled = false;
  }
}

async function choiceImg(images) {
  refs.loadBtn.disabled = false;
  const data = await newImgService.getImages();
  const allHits = data.hits.length;
  const maxHits = data.totalHits;

  if (images.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.loadBtn.disabled = true;
  }
  const markup = images
    .map(img => {
      total += 1;

      return ` 
      
      <div class="photo-card">
   <a href="${img.largeImageURL}">
    <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy"  class="gallery__image" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes </b><span>${img.likes}</span>
      </p>
      <p class="info-item">
        <b>Views </b><span>${img.views}</span>
      </p>
      <p class="info-item">
        <b>Comments </b><span>${img.comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads </b><span>${img.downloads}</span>
      </p>
    </div>
  </div>`;
    })
    .join('');
  total -= 1;
  if (total < 21) {
    refs.loadBtn.disabled = true;
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }

  notification(total, maxHits);
  total = 1;
  if (newImgService.page === 1) {
    bodyGallary.innerHTML = markup;
  }
  if (newImgService.page !== 1) {
    bodyGallary.insertAdjacentHTML('beforeend', markup);
  }
  modalListener();
}
function modalListener() {
  let galleryLarge = new SimpleLightbox('.photo-card a');
  bodyGallary.addEventListener('click', evt => {
    evt.preventDefault();
    galleryLarge.on('show.simplelightbox', () => {
      galleryLarge.defaultOptions.captionDelay = 250;
    });
  });
  galleryLarge.refresh();
}
function notification(totalImg, totalHits) {
  if (newImgService.page > 1 && totalImg === 21) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}