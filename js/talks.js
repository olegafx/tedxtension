function getTedxtensionDiv() {
    return document.getElementById("tedxtension");
}

function appendTedxtensionLinks() {
    if (!document.getElementsByClassName("box talks")[0]) {
        return;
    }
    var tedxtensionDiv = document.createElement("div");
    tedxtensionDiv.setAttribute("id", "tedxtension");

    var tedxtensionLink = document.createElement("a");
    tedxtensionLink.setAttribute("id", "tedxtensionLink");
    tedxtensionLink.setAttribute("href", "#");
    tedxtensionLink.innerText = chrome.i18n.getMessage("tedxtensionLink");

    tedxtensionDiv.appendChild(tedxtensionLink);

    document.getElementById("header").appendChild(tedxtensionDiv);
    tedxtensionLink.addEventListener("click", getAndAppendDownloadLinks, false);
}

function getAndAppendDownloadLinks() {
    var tedxtensionLink = document.getElementById("tedxtensionLink");
    tedxtensionLink.removeEventListener("click", getAndAppendDownloadLinks, false);

    var foundedVideoLinks = document.createElement("span");
    foundedVideoLinks.setAttribute("id", "foundedVideoLinks");
    foundedVideoLinks.innerText = chrome.i18n.getMessage("foundedVideoLinks");

    var howToDownload = document.createElement("span");
    howToDownload.setAttribute("id", "howToDownload");
    howToDownload.innerHTML = chrome.i18n.getMessage("howToDownload") + "<br/>";

    document.getElementById("tedxtension").replaceChild(howToDownload, tedxtensionLink);
    document.getElementById("tedxtension").appendChild(foundedVideoLinks);

    tedxtensionDiv.innerHTML += "<br/>";

    getAndAppendVideosData();
}

function getAndAppendVideosData() {
    var videosData = document.getElementsByClassName("box talks")[0].getElementsByClassName("col");

    for (var i = 0; i < videosData.length; i++) {

        var videoData = videosData[i].getElementsByTagName("a")[0];
        var video = {page: '', title: ''};

        video["page"] = videoData.getAttribute("href");
        video["title"] = videoData.getAttribute("title");

        getAndAppendVideoHref(video);
    }
}

function getAndAppendVideoHref(video) {
    var req = new XMLHttpRequest();
    req.open(
        "GET",
        "http://www.ted.com" + video["page"],
        true
    );
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var xmlDoc = parser.parseFromString(req.responseText, "text/xml");

            var linkData = xmlDoc.getElementById("no-flash-video-download");
            if (linkData) {
                var stHref = linkData.getAttribute("href");

                video["stHref"] = stHref;
                video["lowHref"] = getLowHref(stHref);
                video["hqHref"] = getHqHref(stHref);

                appendDownloadLinks(video);
            }
        }
    };
    req.send(null);
}

function getLowHref(stHref) {
    return stHref.replace(".mp4", "-light.mp4");
}

function getHqHref(stHref) {
    return stHref.replace(".mp4", "-480p.mp4");
}

function appendDownloadLinks(video) {
    tedxtensionDiv.innerHTML += "<br/>";

    tedxtensionDiv.innerHTML += "<span class='downloadTitle'>" + video["title"] + "</span>";
    tedxtensionDiv.innerHTML += "<br/>";

    tedxtensionDiv.innerHTML += "<span>" + chrome.i18n.getMessage("quality") + "</span>";

    appendDownloadLink(video["lowHref"], video["title"], chrome.i18n.getMessage("lowQuality"));

    appendDownloadLink(video["stHref"], video["title"], chrome.i18n.getMessage("stQuality"));

    appendDownloadLink(video["hqHref"], video["title"], chrome.i18n.getMessage("hqQuality"));

    tedxtensionDiv.innerHTML += "<br/>";
}

function appendDownloadLink(href, title, innerText) {
    var link = document.createElement("a");

    link.setAttribute("href", href);
    link.setAttribute("class", "downloadLink");
    link.setAttribute("title", title);
    link.innerText = innerText;

    tedxtensionDiv.appendChild(link);
}

appendTedxtensionLinks();

var parser = new DOMParser();
var tedxtensionDiv = getTedxtensionDiv();