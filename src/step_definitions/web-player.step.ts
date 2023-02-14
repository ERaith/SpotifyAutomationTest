import { Given, Then, When } from "@cucumber/cucumber";
import SpotifyWebPlayerPage from "../pages/web-player-page";
const { expect } = require("chai");

Given("User navigates to the web player", async function () {
  this.page = await new SpotifyWebPlayerPage(this.driver, this.globalConfig);
  await this.page.navigate();
});

When(
  "User creates a playlist with name {string}",
  async function (playlistName: string) {
    await this.page.createPlaylist(playlistName);
  }
);

Then("User sees the playlist populate in their sidebar", async function () {
  const playlistElement = await this.page.findElementByXpath(
    `//span[(contains(text(),"${this.page.playlistId}"))]`
  );

  expect(await playlistElement.isDisplayed());
});

When(
  "User adds {string} songs totaling {int} min between {int} min and {int} min long",
  async function (searchText, playlistDuration, minSongTime, maxSongTime) {
    await this.page.navigateToSearchPane();
    await this.page.search(searchText);
    await this.page.clickSongFilter();
    await this.page.addSongsToPlaylist(
      playlistDuration,
      minSongTime,
      maxSongTime
    );
  }
);

When("User checks total duration of the created playlist", async function () {
  await this.page.openPlaylistDetails(this.page.playlistId);
});

Then("There should be no song duplicates", async function () {
  const playlistSongs = await this.page.getAvailableSongs();
  let playlistSongTitles: string[] = [];
  for (const element of playlistSongs) {
    const listItemText = await element.getText();
    const songDetails = this.page.getSongDetails(listItemText);
    playlistSongTitles.push(songDetails.title);
  }

  expect(playlistSongTitles.length).to.equal(new Set(playlistSongTitles).size);
});

When("Deletes all of their playlists", async function () {
  await this.page.deleteAllPlaylists();
});
