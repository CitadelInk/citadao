import { landingScroll, landingSection } from '../actions';

export default class ScrollController{
  constructor(dispatch) {
    this.dispatch = dispatch;
    this.wheelHandler = this.wheelHandler.bind(this);
    window.addEventListener('wheel', this.wheelHandler);
  }
  wheelHandler(e) {
    if (this.navTimeout) {
      window.clearTimeout(this.navTimeout);
    }
    this.navTimeout = window.setTimeout(() => {
      this.dispatch(landingSection(e.deltaY));
    }, 250);
    window.requestAnimationFrame(() => this.dispatch(landingScroll(e.deltaY)));
  }
  cleanUp() {
    window.removeEventListener('wheel', this.wheelHandler);
  }
}

