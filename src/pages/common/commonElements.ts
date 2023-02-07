const topBar = {
  topBar: '[aria-label="Top bar and user menu"]',
  logIn: '[data-testid="login-button"]',
  userWidgetLink: '[data-testid="user-widget-link"]',
  upgrade: '[aria-label="Upgrade to Premium"]',
};

const spotifyBanner = {
  spotifyBanner: '[role="banner"]',
};

const commonElements = {
  ...topBar,
  ...spotifyBanner,
};

export default commonElements;
