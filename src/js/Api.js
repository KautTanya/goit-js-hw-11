import axios from 'axios';
const KEY = '29561920-1065b6adaef0eaf94313a88f4';
const BASIC_URL = `https://pixabay.com/api/?key=${KEY}&q=`;
const mainRequest = '&image_type=photo&orientation=horizontal&safesearch=true';
const refs = {
  submitBtn: document.querySelector('#submit'),
};
export default class GetImages {
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
