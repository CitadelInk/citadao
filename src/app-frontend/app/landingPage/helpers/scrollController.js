import { landingScroll, landingSection, SCROLL_TIMEOUT } from '../actions';

export default class ScrollController{
  constructor(dispatch) {
    this.dispatch = dispatch;
    this.wheelHandler = this.wheelHandler.bind(this);
    window.addEventListener('wheel', this.wheelHandler);
  }
  checkDeltas(delta) {
    if (!this.prevDelta) {
      return true;
    }
    return Math.abs(delta) > Math.abs(this.prevDelta);
  }
  wheelHandler(e) {
    e.preventDefault();
    if (!this.alreadyCalled && this.checkDeltas(e.deltaY)) {
      this.dispatch(landingSection(e.deltaY));
      this.alreadyCalled = true;
    }
    this.prevDelta = e.deltaY;
    if (this.to2) {
      window.clearTimeout(this.to2);
    }
    if (!this.to) {
      this.to = window.setTimeout(() => {
        this.alreadyCalled = false
        this.to = null;
      }, SCROLL_TIMEOUT);
    }
    this.to2 = window.setTimeout(() => this.prevDelta = 0, 50);
  }
  cleanUp() {
    window.removeEventListener('wheel', this.wheelHandler);
  }
}

