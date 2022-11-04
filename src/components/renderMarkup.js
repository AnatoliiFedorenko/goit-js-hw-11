export default class renderMarkup {
  constructor(reference) {
    this.ref = reference;
    this.markup = '';
    this.imgList = [];
  }

  resetMarkup() {
    this.ref.innerHTML = '';
  }

  makeCardMarkup() {
    if (this.imgList.length === 0) {
      this.markup = '';
      return;
    }
    this.markup = this.imgList
      .map(element => {
        return `
           <div class="gallery__item">
              <a class="gallery__ref" href="${element.largeImageURL}">
                <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
              </a>
              <div class="info">
                <p class="info__item">
                  <b>Likes</b><br>${element.likes}
                </p>
                <p class="info__item">
                  <b>Views</b><br>${element.views}
                </p>
                <p class="info__item">
                  <b>Comments</b><br>${element.comments}
                </p>
                <p class="info__item">
                  <b>Downloads</b><br>${element.downloads}
                </p>
              </div>
            </div>
`;
      })
      .join('');
  }

  async renderMarkup() {
    await this.ref.insertAdjacentHTML('beforeend', this.markup);
  }

  get imagesArray() {
    return this.imgList;
  }

  set imagesArray(a) {
    this.imgList = a;
  }
}
