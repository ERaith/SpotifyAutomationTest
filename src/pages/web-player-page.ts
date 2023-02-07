import { GlobalConfig, PageId, SongDetails } from "../env/global";
import { WebDriver, By, Keys } from "selenium-webdriver";
const { v4: uuidv4 } = require("uuid");
import Page from "./page";

/**
 * Page Constants
 */

const pageId: PageId = "webplayer";
const pageRoute = "/";

export default class SpotifyWebPlayerPage extends Page {
  /**
   * Get page elements
   * @returns {Object} page elements
   */

  constructor(driver: WebDriver, globalConfig: GlobalConfig) {
    super(driver, globalConfig, pageId, pageRoute);
    this.playlistId = uuidv4();
  }

  playlistId: string;

  get pageElementMappings() {
    return {
      createPlaylistBtn: '[data-testid="create-playlist-button"]',
      entityTitle: '[data-testid="entityTitle"]',
      editNameInput: '[data-testid="playlist-edit-details-name-input"]',
      saveBtn: '[data-testid="playlist-edit-details-save-button"]',
      songMoreBtn: '[data-testid="more-button"]',
      songAddToPlaylist: '//span[contains(text(),"Add to playlist")]',
      songPlaylistMenu: '//div[@id="context-menu"]',
      searchLink: 'a[href="/search"]',
      searchPageBody: '[id="searchPage"]',
      searchInput: '[data-testid="search-input"]',
      songFilterBtn: '//button[span[text()="Songs"]]',
      trackList: '[data-testid="track-list"]',
      trackItem: `[data-testid="tracklist-row"]`,
      rootPlaylist: '[data-testid="rootlist"]',
      playlistItems: '[data-testid="rootlist-item"]',
    };
  }

  async createBlankPlaylist() {
    let createPlaylistBtn = await this.findElementByCss("createPlaylistBtn");
    await createPlaylistBtn.click();
  }

  async editPlaylistDetails() {
    let playlistTitle = await this.findElementByCss("entityTitle");
    await playlistTitle.click();
  }

  async editPlaylistTitle(title: string) {
    let playlistEditNameInput = await this.findElementByCss("editNameInput");
    await playlistEditNameInput.sendKeys(title + ":" + this.playlistId);
  }

  async saveplaylistDetails() {
    let savePlaylistBtn = await this.findElementByCss("saveBtn");
    await savePlaylistBtn.click();
  }

  async openPlaylistDetails(playlistId) {
    const playlistContainer = await this.findElementByCss("rootPlaylist");
    const playlist = await playlistContainer.findElement(
      By["xpath"](`//li[a[span[(contains(text(),"${playlistId}"))]]]`)
    );
    await playlist.click();
  }
  async createPlaylist(title: string) {
    await this.createBlankPlaylist();
    await this.editPlaylistDetails();
    await this.editPlaylistTitle(title);
    await this.saveplaylistDetails();
  }

  async getAvailableSongs() {
    const songs = await this.findElementsByCss("trackItem");
    return songs;
  }

  async addSongToPlaylist(element) {
    await element.click();
    const moreButton = await element.findElement(
      By["css"]('[data-testid="more-button"]')
    );
    await moreButton.click();

    const addToPlaylistBtn = await this.findElementByXpath(
      this.pageElementMappings.songAddToPlaylist
    );
    await addToPlaylistBtn.click();

    let playlistMenu = await this.findElementByXpath(
      this.pageElementMappings.songPlaylistMenu
    );

    await playlistMenu
      .findElement(
        By["xpath"](`.//span[contains(text(),"${this.playlistId}")]`)
      )
      .click();
  }

  getSongDetails(songText): SongDetails {
    let trackTimeString: string = songText.split("\n")[4].split(":");
    let durationSeconds: number =
      parseInt(trackTimeString[0]) * 60 + parseInt(trackTimeString[1]);
    const songDetails = {
      title: songText.split("\n")[1],
      trackTime: durationSeconds,
    };
    return songDetails;
  }

  async addSongsToPlaylist(desiredPlaylistDuration, minSongTime, maxSongTime) {
    let currentPlaylistSongTitles: string[] = [];
    desiredPlaylistDuration = desiredPlaylistDuration * 60;
    let songs = await this.getAvailableSongs();

    for (const element of songs) {
      const listItemText = await element.getText();
      const songDetails = this.getSongDetails(listItemText);

      if (this.existsInPlaylist(currentPlaylistSongTitles, songDetails.title)) {
        continue;
      }
      currentPlaylistSongTitles.push(songDetails.title);
      if (songDetails.trackTime > desiredPlaylistDuration) {
        break;
      }
      desiredPlaylistDuration -= songDetails.trackTime;

      await this.addSongToPlaylist(element);
    }
  }

  existsInPlaylist(playlist, title) {
    return (
      playlist.findIndex((v) => {
        return v.includes(title) || title.includes(v);
      }) != -1
    );
  }

  // Search Page

  async navigateToSearchPane() {
    const searchLink = await this.findElementByCss("searchLink");

    await searchLink.click();

    await this.findElementByCss("searchPageBody");
  }

  async search(searchText) {
    const searchInput = await this.findElementByCss("searchInput");

    await searchInput.sendKeys(searchText);
  }

  async clickSongFilter() {
    const searchSongBtn = await this.findElementByXpath(
      this.pageElementMappings.songFilterBtn
    );

    await searchSongBtn.click();
    await this.findElementByCss("trackList");
  }

  // cleanup
  async deleteAllPlaylists() {
    const playlists = await this.findElementsByCss("playlistItems");
    for (const playlist of playlists) {
      await playlist.click();
      await this.driver.sendKeys(Keys.DELETE)
      await this.driver.sendKeys(Keys.RETURN)
    }
  }
}
