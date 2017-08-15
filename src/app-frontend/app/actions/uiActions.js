// @flow
export const NAVIGATE_PAGE: string = "NAVIGATE_PAGE";

type Data = {| route: string, page: string |};


export const navigatePage = (data: Data): {|type: string, data: Data|} => {
  return {
    type: NAVIGATE_PAGE,
    data
  };
};

export default {
  NAVIGATE_PAGE,
  navigatePage
};
