const topBar = {
  topBar: '[aria-label="Top bar and user menu"]',
  logIn: '[data-testid="login-button"]',
  userWidgetLink: '[data-testid="user-widget-link"]',
  upgrade: '[aria-label="Upgrade to Premium"]',
};

const spotifyBanner = {
  spotifyBanner: '[role="banner"]',
};

const playlistSidebar = {
  playlistContainer: '[data-testid="rootlist-container"]',
};

const commonElements = {
  ...topBar,
  ...spotifyBanner,
  ...playlistSidebar,
};

export default commonElements;
