import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '30064011-1a9313b9a48be265534983023';
const mainRequest = '&image_type=photo&orientation=horizontal&safesearch=true';

const galleryCard = document.querySelector('.gallery');
const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('input'),
    searchBtn: document.querySelector('#submit'),
    loadBtn: document.querySelector('.load-more'),
};
refs.form.addEventListener('submit', (formSubmit));
refs.loadBtn.addEventListener('click', (onLoadMore));
refs.input.addEventListener('input', (submitButton));