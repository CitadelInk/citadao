import scrollTo from '../helpers/animatedScroll';

export const LANDING_SCROLL = "LANDING_SCROLL";
export const LANDING_SECTION = "LANDING_SECTION";
export const LANDING_HEIGHT = "LANDING_HEIGHT";
export const LANDING_ADD_SECTION = "LANDING_ADD_SECTION";
export const LANDING_SET_TOP = "LANDING_SET_TOP";
export const LANDING_ARRIVED = "LANDING_ARRIVED";
export const SCROLL_TIMEOUT = 1000;

const decideSelected = (delta, top, sections, selected) => {
  top = Math.abs(top);
  let newSelection = selected;
  if (delta < 0 && selected > 0) {
    newSelection = selected - 1;
  } else if (delta > 0 && selected < sections.size - 1) {
    newSelection = selected + 1;
  }
  return newSelection;
};

export const landingScroll = (top) => {
  return {
    type: LANDING_SCROLL,
    data: top
  };
};

export const landingArrived = () => {
  return {
    type: LANDING_ARRIVED
  };
};

export const landingSection = (delta) => (dispatch, getState) => {
  const {landing} = getState().core;
  const selected = decideSelected(delta, landing.get('top'), landing.get('sections'), landing.get('selected'));
  scrollTo(landing.get('top'), landing.getIn(['sections', selected]).top, SCROLL_TIMEOUT, dispatch);
  dispatch({
    type: LANDING_SECTION,
    data: selected
  });
};

export const landingHeight = (height) => {
  return {
    type: LANDING_HEIGHT,
    data: height
  };
};

export const landingAddSection = (data) => {
  return {
    type: LANDING_ADD_SECTION,
    data
  };
};

export const landingSetTop = (data) => {
  return {
    type: LANDING_SET_TOP,
    data
  };
};
