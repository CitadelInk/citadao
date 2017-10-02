import { Map, List } from 'immutable';
import { LANDING_SCROLL,
         LANDING_HEIGHT,
         LANDING_ADD_SECTION,
         LANDING_SECTION,
         LANDING_SET_TOP,
         LANDING_ARRIVED } from '../actions';


export default (state = Map({top: 0, height: 0, sections: List(), selected: 0, goingToSection: false}), action) => {
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
    default:
      return state;
  }
}