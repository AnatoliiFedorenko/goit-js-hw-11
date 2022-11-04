import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import ApiService from './components/apiservice';
import renderMarkup from './components/renderMarkup';

const RENDER_ITEM_COUNT = 40;

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', handleSubmit);
refs.button.addEventListener('click', handleButton);

let imageApiService = new ApiService(RENDER_ITEM_COUNT);
let markupGallery = new renderMarkup(refs.gallery);
let simpleLightbox = new SimpleLightbox('.gallery a');

async function handleSubmit(e) {
  const searchImgName = e.currentTarget.searchQuery.value.trim();
  hideButton(refs.button);
  e.preventDefault();
  imageApiService.resetRenderCount();
  markupGallery.resetMarkup();

  imageApiService.page = 1;
  if (searchImgName === '') return;

  const imgList = await imageApiService.getImg(searchImgName);

  if (imgList.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  markupGallery.imagesArray = imgList;
  markupGallery.makeCardMarkup();
  markupGallery.renderMarkup().then(() => {
    simpleLightbox.refresh();
    verifyLibraryButton(refs.button);
    Notify.info(`Hooray! We found ${imageApiService.totalHits} images.`);
  });
}

async function handleButton() {
  hideButton(refs.button);
  markupGallery.imagesArray = await imageApiService.getImg();
  markupGallery.makeCardMarkup();
  markupGallery.renderMarkup().then(() => {
    simpleLightbox.refresh();
    verifyLibraryButton(refs.button);
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}

function verifyLibraryButton(reference) {
  switch (imageApiService.endLibrary) {
    case 0:
      hideButton(reference);
      break;
    case 1:
      hideButton(reference);
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      break;
    case 2:
      showButton(reference);
      break;
  }
  return;
}

function hideButton(reference) {
  reference.disabled = true;
  reference.style.display = 'none';
}

function showButton(reference) {
  reference.disabled = false;
  reference.style.display = 'block';
}
