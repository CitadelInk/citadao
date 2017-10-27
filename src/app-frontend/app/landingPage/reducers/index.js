import { Map, List } from 'immutable';
import { LANDING_SCROLL,
         LANDING_HEIGHT,
         LANDING_ADD_SECTION,
         LANDING_SECTION,
         LANDING_SET_TOP,
         LANDING_ARRIVED,
         SET_SVG_SIZE,
         SET_SECTION,
         SET_SVG_START } from '../actions';


export default (state = Map({
  svgStartTime: Date.now(),
  top: 0,
  height: 0,
  sections: List(),
  selected: 0,
  goingToSection: false,
  points: [],
  svgContainerSize: {width: window.innerWidth, height: 800}
}), action) => {
  switch (action.type) {
    case LANDING_HEIGHT:
      return state.set('height', action.data);
    case LANDING_SET_TOP:
      return state.set('top', action.data);
    case LANDING_SCROLL:
      const newTop = Math.min(Math.max(state.get('top') - action.data, -state.get('height')), 0);
      return !state.get('goingToSection') ? state.set('top', newTop) : state;
    case LANDING_ADD_SECTION:
      return state.set('sections', state.get('sections').push(action.data));
    case LANDING_SECTION:
      state = state.set('goingToSection', true);
      return state.set('selected', action.data);
    case LANDING_ARRIVED:
      return state.set('goingToSection', false);
    case SET_SVG_SIZE:
      const { width, height, points } = action.data;
      state = state.set('svgContainerSize', {width, height});
      return state.set('points', points);
    case SET_SECTION:
      return state.set('selected', action.data);
    case SET_SVG_START:
      return state.set('svgStartTime', action.data);
    default:
      return state;
  }
}