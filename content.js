function initScript() {
  const luMap = document.querySelector("#lu_map");
  const otherStaticMap = document.querySelector(".ZqGZZ.xP81Pd  .Lx2b0d"); // "Prague 3" or "Kubelikova" or "50.11262282409548, 14.451207636672475"
  const dynamicMapPlaces = document.querySelector(".e4meb.kyNbUb"); // "Unnamed Road, Al Diwaniyah, Al-Qādisiyyah Governorate, Iraq"
  const dynamicMapCountry = document.querySelector(".zMVLkf.jdQ9hc .ZqGZZ"); // Czechia

  if (dynamicMapPlaces) {
    addMapButtonPlaces();
  }
  if (dynamicMapCountry) {
    addMapButtonCountry();
  }
  if (luMap) {
    createLinkStaticMap(luMap);
  }
  if (otherStaticMap) {
    createLinkStaticMap(otherStaticMap);
  }
}

function getPlaceQueryFromTitle() {
  let searchQuery = document.querySelector("title").innerText;
  let lastIndex = searchQuery.lastIndexOf(" -");
  if (lastIndex !== -1) {
    searchQuery = searchQuery.substring(0, lastIndex);
  }
  return searchQuery;
}

function composeMapUrl(searchQuery, type) {
  const mapsUrl = `https://www.google.com/maps/${type}/${encodeURIComponent(
    searchQuery
  )}`;
  return mapsUrl;
}

function addMapButtonPlaces() {
  if (document.querySelector(".custom-map-link")) return;
  const config = { childList: true, subtree: true };

  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.addedNodes) {
        const mapImage = document.querySelector(".yXg2De");
        if (mapImage) {
          const searchQuery = getPlaceQueryFromTitle();
          const mapsUrl = composeMapUrl(searchQuery, "search");

          const prefersDarkMode =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;

          const anchor = document.createElement("a");
          anchor.textContent = "Open Google Maps";
          anchor.href = mapsUrl;
          anchor.target = "_blank";

          if (prefersDarkMode) {
            anchor.style =
              "display: inline-block; width: 100%; height: 100%; cursor: pointer; text-decoration: none; color: #D2D4D7; font-size: 14px; padding: 10px 9px; border-radius: 20px; background-color: #1F1F1F; box-shadow: 0 2px 4px rgba(0,0,0,0.2); text-align: center;";
          } else {
            anchor.style =
              "display: inline-block; width: 100%; height: 100%; cursor: pointer; text-decoration: none; color: white; font-size: 14px; padding: 10px 9px; border-radius: 20px; background-color: rgba(0, 0, 0, 0.6); box-shadow: 0 2px 4px rgba(0,0,0,0.2); text-align: center;";
          }

          anchor.addEventListener(
            "click",
            function (event) {
              event.stopPropagation();
            },
            false
          );

          const newDiv = document.createElement("div");
          newDiv.className = "custom-map-link";
          newDiv.style =
            "position: absolute; top: 10px; left: 10px; z-index: 10; display: inline-block; box-sizing: border-box; width: auto; height: auto;";
          newDiv.appendChild(anchor);

          mapImage.style.position = "relative";
          mapImage.appendChild(newDiv);

          observer.disconnect();
          break;
        }
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(document.body, config);
}

function addMapButtonCountry() {
  let searchQuery;
  if (document.querySelector(".custom-map-link")) return;

  if (document.querySelector("a.gL9Hy")) {
    searchQuery = document.querySelector("a.gL9Hy").textContent;
  } else {
    searchQuery = getPlaceQueryFromTitle();
  }

  const mapsUrl = composeMapUrl(searchQuery, "search");
  const mapImage = document.querySelector(".ZqGZZ");
  const anchor = document.createElement("a");
  anchor.textContent = "Open Google Maps";
  anchor.href = mapsUrl;
  anchor.target = "_blank";
  anchor.style =
    "display: inline-block; width: 100%; height: 100%; cursor: pointer; text-decoration: none; color: white; font-size: 14px; padding: 9px 8px; border-radius: 20px; background-color: rgba(0, 0, 0, 0.6); box-shadow: 0 2px 4px rgba(0,0,0,0.2); text-align: center;";

  anchor.addEventListener(
    "click",
    function (event) {
      event.stopPropagation();
    },
    false
  );

  const newDiv = document.createElement("div");
  newDiv.className = "custom-map-link";
  newDiv.style =
    "position: absolute; top: 12px; left: 10px; z-index: 10; display: inline-block; box-sizing: border-box; width: auto; height: auto;";
  newDiv.appendChild(anchor);

  mapImage.style.position = "relative";
  mapImage.appendChild(newDiv);
}

function createLinkStaticMap(mapImage) {
  let searchQuery;
  let anchor;
  let mapUrl;

  // Check if precise address with link exists
  let addressSpan = document.querySelector(".gqkR3b.hP3ybd a");
  if (addressSpan) {
    mapUrl = addressSpan.href;
  }
  // Check if corrected location name exists eg. "Showing results for Nelson NSW 2765 ..."
  else if (
    document.querySelector("a.gL9Hy") &&
    document.querySelector("a.spell_orig")
  ) {
    searchQuery = document.querySelector("a.gL9Hy").textContent;
    mapUrl = composeMapUrl(searchQuery, "search");
  }
  // Check if small lu_map on a right side exists
  else if (
    document.querySelector(".I6TXqe .SPZz6b span") ||
    document.querySelector(".wwUB2c.PZPZlf.E75vKf")
  ) {
    mapUrl = extractLocationNameFromLuMap();
  } else {
    searchQuery = getPlaceQueryFromTitle();
    mapUrl = composeMapUrl(searchQuery, "search");
  }
  anchor = document.createElement("a");
  anchor.href = mapUrl;
  anchor.target = "_blank";
  anchor.style.cursor = "pointer";
  mapImage.parentNode.insertBefore(anchor, mapImage);
  anchor.appendChild(mapImage);
}

function extractLocationNameFromLuMap() {
  let mapUrl;
  let addressParts;
  let address;
  let smallLuMapRight = [
    document.querySelector(".I6TXqe .SPZz6b span"), // Main address h2
    document.querySelector(".wwUB2c.PZPZlf.E75vKf"), // Road in the United Kingdom || new || Municipality in Norway || Postal code in Australia
  ];

  addressParts = smallLuMapRight
    .filter((elem) => elem !== null)
    .map((elem) => elem.textContent);
  address = addressParts.join(" ");
  mapUrl = composeMapUrl(address, "search");

  return mapUrl;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScript);
} else {
  initScript();
}
