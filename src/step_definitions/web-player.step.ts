import { Given, Then, When } from "@cucumber/cucumber";
import SpotifyWebPlayerPage from "../pages/web-player-page";
import { ScenarioWorld } from "./setup/world";
const { expect } = require("chai");

Given("User navigates to the web player", async function (this: ScenarioWorld) {
  const {
    screen: { driver },
    globalConfig,
  } = this;

  this.page = await new SpotifyWebPlayerPage(driver, globalConfig);
  await this.page.navigate();
});

When(
  "User creates a playlist with name {string}",
  async function (this: ScenarioWorld, playlistName: string) {
    const { page } = this;

    await page.createPlaylist(playlistName);
  }
);

Then(
  "User sees the playlist populate in their sidebar",
  async function (this: ScenarioWorld) {
    const { page } = this;
    const playlistElement = await page.findElementByXpath(
      `//span[(contains(text(),"${page.playlistId}"))]`
    );

    expect(await playlistElement.isDisplayed());
  }
);

When(
  "User adds {string} songs totaling {int} min between {int} min and {int} min long",
  async function (
    this: ScenarioWorld,
    searchText,
    playlistDuration,
    minSongTime,
    maxSongTime
  ) {
    const { page } = this;
    await page.navigateToSearchPane();
    await page.search(searchText);
    await page.clickSongFilter();
    await page.addSongsToPlaylist(playlistDuration, minSongTime, maxSongTime);
  }
);

When(
  "User checks total duration of the created playlist",
  async function (this: ScenarioWorld) {
    const { page } = this;
    await page.openPlaylistDetails(page.playlistId);
  }
);

Then(
  "There should be no song duplicates",
  async function (this: ScenarioWorld) {
    const { page } = this;
    const playlistSongs = await page.getAvailableSongs();
    let playlistSongTitles: string[] = [];
    for (const element of playlistSongs) {
      const listItemText = await element.getText();
      const songDetails = page.getSongDetails(listItemText);
      playlistSongTitles.push(songDetails.title);
    }

    expect(playlistSongTitles.length).to.equal(
      new Set(playlistSongTitles).size
    );
  }
);

When("Deletes all of their playlists", async function (this: ScenarioWorld) {
  const { page } = this;
  await page.deleteAllPlaylists();
});
