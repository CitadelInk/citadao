export const NAVIGATE_PAGE = "NAVIGATE_PAGE";

export const navigatePage = (data) => {
  return {
    type: NAVIGATE_PAGE,
    data
  };
};

export default {
  NAVIGATE_PAGE,
  navigatePage
};
