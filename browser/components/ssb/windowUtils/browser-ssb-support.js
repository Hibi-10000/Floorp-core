/* eslint-disable no-undef */
/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*-
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var { SiteSpecificBrowserIdUtils } = ChromeUtils.import(
  "resource:///modules/SiteSpecificBrowserIdUtils.jsm"
);

var { SiteSpecificBrowser } = ChromeUtils.import(
  "resource:///modules/SiteSpecificBrowserService.jsm"
);

let gSsbSupport = {
  _initialized: false,

  get ssbWindowId() {
    return document.documentElement.getAttribute("FloorpSSBId");
  },

  get TabsToolbar() {
    return document.getElementById("TabsToolbar");
  },

  get panelUIBUtton() {
    return document.getElementById("PanelUI-menu-button");
  },

  get navToolbar() {
    return document.getElementById("nav-bar");
  },

  get TabsToolbarWindowControls() {
    return document.querySelector("#TabsToolbar .titlebar-buttonbox-container");
  },

  get pageActionBox() {
    return document.getElementById("page-action-buttons");
  },

  get identityBox() {
    return document.getElementById("identity-box");
  },

  async getSsbObj(id) {
    let result = await SiteSpecificBrowser.load(id);
    return result;
  },

  hexToRgb(hex) {
        return {
            r: parseInt(hex.substring(1, 3), 16),
            g: parseInt(hex.substring(3, 5), 16),
            b: parseInt(hex.substring(5, 7), 16)
        };
  },
    
  getSymmetricalColor(hex) {
      const rgb = this.hexToRgb(hex);
      const symmetricalRgb = {
          r: 255 - rgb.r,
          g: 255 - rgb.g,
          b: 255 - rgb.b
      };
      return `rgb(${symmetricalRgb.r},${symmetricalRgb.g},${symmetricalRgb.b})`;
  },

  async init() {
    let styleElement = document.createElement("style");
    styleElement.id = "ssb-support";
    styleElement.textContent = `@import url("chrome://browser/content/browser-ssb-support.css");`;
    document.head.appendChild(styleElement);

    this.navToolbar.append(this.TabsToolbarWindowControls);
    this.identityBox.after(this.pageActionBox);

    gBrowser.tabs.forEach(tab => {
      tab.setAttribute("floorpSSB", "true");
    });

    let ssbObj = await this.getSsbObj(this.ssbWindowId)

    // Set theme color to Navbar
    this.navToolbar.style.backgroundColor = ssbObj._manifest.theme_color;
    
    // const symmetricalColor = this.getSymmetricalColor(ssbObj._manifest.theme_color);
    // document.documentElement.style.setProperty("--toolbarbutton-icon-fill", `${symmetricalColor} !important`)

    // finish initialize
    this._initialized = true;
  },
};

gSsbSupport.init();