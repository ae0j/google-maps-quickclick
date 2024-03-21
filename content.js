function initScript() {
  const mapImage1 =
    document.querySelector("#lu_map") || // "Prague 3" or "Kubelikova" or "50.11262282409548, 14.451207636672475"
    document.querySelector(".Lx2b0d") || // Nelson NSW 2765
    document.querySelector(".zMVLkf.jdQ9hc") || // Czechia
    document.querySelector(
      'div[aria-label="Featured results"] img[src*="/maps/"]'
    ); // Prague

  const mapImage2 = document.querySelector(".e4meb.kyNbUb"); // "Unnamed Road, Al Diwaniyah, Al-Qādisiyyah Governorate, Iraq"
  const mapImage3 = document.querySelector(".ZqGZZ.xP81Pd"); // Čechy

  if (mapImage1 || mapImage2 || mapImage3) {
    if (mapImage2) {
      addMapLink(mapImage2);
    } else if (mapImage1 && mapImage3) {
      wrapMapImageWithLink(mapImage3);
    }
    if (mapImage1) {
      wrapMapImageWithLink(mapImage1);
    }
  }
}

function addMapLink(mapImage) {
  if (document.querySelector(".custom-map-link")) return;

  let searchQuery = getSearchQuery();
  searchQuery = searchQuery.split(" ").join("+");
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    searchQuery
  )}`;

  const style = document.createElement("style");
  const prefersDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const anchor = document.createElement("a");
  anchor.href = mapsUrl;
  anchor.target = "_blank";
  anchor.textContent = "View on Google Maps";
  anchor.className = "custom-hover";

  if (prefersDarkMode) {
    style.innerHTML = `
    a.custom-hover:hover {
      background: #2c303d !important;
      text-decoration: none;
    }
  `;
    anchor.style.cssText = `
    font-size: 14px;
    padding: 10px 20px;
    border: 1px solid #dadce0;
    border-radius: 20px;
    border-color: #3c4043;
    background: #202124;
    text-decoration: none;
    color: #f1f3f4;
  `;
  } else {
    style.innerHTML = `
    a.custom-hover:hover {
      background: #f1f3f4;
      text-decoration: none;
    }
  `;
    anchor.style.cssText = `
    font-size: 14px;
    padding: 10px 20px;
    border: 1px solid #dadce0;
    border-radius: 20px;
    color: #202124;
    text-decoration: none;
  `;
  }

  document.head.appendChild(style);
  console.log(prefersDarkMode);
  const newDiv = document.createElement("div");
  newDiv.className = "custom-map-link";
  newDiv.style.marginBottom = "8px";
  newDiv.appendChild(anchor);
  mapImage.appendChild(newDiv);
}

function wrapMapImageWithLink(mapImage) {
  let searchQuery = getSearchQuery();
  //searchQuery = searchQuery.split(" ").join("+");
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    searchQuery
  )}`;

  const anchor = document.createElement("a");
  anchor.href = mapsUrl;
  anchor.target = "_blank";
  anchor.style.cursor = "pointer";

  mapImage.parentNode.insertBefore(anchor, mapImage);
  anchor.appendChild(mapImage);
}

function getSearchQuery() {
  let searchQuery = document.querySelector("title").innerText;
  let lastIndex = searchQuery.lastIndexOf(" -");
  if (lastIndex !== -1) {
    searchQuery = searchQuery.substring(0, lastIndex);
  }

  let addressElements = [
    document.querySelector(".I6TXqe .SPZz6b span"),
    document.querySelector(".PZPZlf.ssJ7i"), // A5 || Aalborg Airport
    document.querySelector(".gqkR3b.hP3ybd span"), // "Eg, Address: 315 Falls Ave, Twin Falls, ID 83301, United States"
    document.querySelector(".iAIpCb.PZPZlf"), // Road in England
    document.querySelector(".PAq55d .aiAXrc"),
    document.querySelector(".PAq55d .fMYBhe"),
  ];

  let addressParts = addressElements
    .filter((elem) => elem !== null)
    .map((elem) => elem.textContent);

  let address = addressParts.join(" ");

  let postal = document.querySelector(".wwUB2c.PZPZlf.E75vKf"); // NSW 2765
  let town = document.querySelector(".ZqGZZ.xP81Pd .Lx2b0d img[id='dimg_1']"); // Nelson NSW 2765

  if (address && !postal && !town) {
    searchQuery = address.replace("Map for ", "");
  }

  return searchQuery;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScript);
} else {
  initScript();
}
