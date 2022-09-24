import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GetImages from './js/Api';

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

const newImgService = new GetImages();

function onLoadButton() {
  newImgService.incrementPage();
  newImgService.getImages().then(data => choiceImg(data));
}
function submitButton(evt) {
  if (evt.currentTarget.value) {
    refs.submitBtn.disabled = false;
  }
}

async function choiceImg(data) {
  const images = data.hits;
  const maxHits = data.totalHits;

  if (maxHits > 21) {
    refs.loadBtn.disabled = false;
  }
  if (images.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.loadBtn.disabled = true;
  }
  if (images.length < 21 && images.length > 0) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    refs.loadBtn.disabled = true;
  }

  const markup = images
    .map(img => {
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
  if (newImgService.page === 1 && images.length > 0) {
    Notify.success(`Horray! We found ${maxHits} images!!!`);
  }
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

function formSubmit(evt) {
  refs.loadBtn.disabled = true;
  evt.preventDefault();
  const { searchQuery } = evt.currentTarget;
  newImgService.query = searchQuery.value;
  newImgService.resetPage();
  newImgService.getImages().then(data => choiceImg(data));
}
