"use strict";
// This file contains helper functions for working with regular expressions mainly used in chat.
// It will replace image links with img tags and etc etc
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegexHelper = void 0;
const xss_1 = require("xss");
let filterOptions = new xss_1.FilterXSS({
    whiteList: {
        img: ["src", "alt", "title", "width", "height"],
        a: ["href", "target", "title"],
        p: [],
        picture: [],
        s: [],
        b: [],
        i: [],
    },
});
var RegexHelper;
(function (RegexHelper) {
    function replaceAllImagesWithImgLinks(text) {
        // Add extra classes
        return text.replace(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/g, '<picture><img src="$1" /><picture/>');
    }
    RegexHelper.replaceAllImagesWithImgLinks = replaceAllImagesWithImgLinks;
    function replaceAllLinksWithAnchorTags(text) {
        return text.replace(/((?:https?:\/\/|www\.)[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    }
    RegexHelper.replaceAllLinksWithAnchorTags = replaceAllLinksWithAnchorTags;
    // This is a function similar to whatsapp where it replaces text between _ and * with italic and bold tags. ~~~~ is strikethrough
    function replaceFancyStyles(text) {
        text = text.replace(/~(.*?)~/g, "<s>$1</s>");
        text = text.replace(/\*(.*?)\*/g, "<b>$1</b>");
        text = text.replace(/_(.*?)_/g, "<i>$1</i>");
        return text;
    }
    RegexHelper.replaceFancyStyles = replaceFancyStyles;
    function extractRoomCode(text) {
        const regex = new RegExp(/(\w+)-(\w+)-(\w+)-(\w+)/g);
        const match = regex.exec(text);
        console.log(match);
        if (match) {
            return match[0];
        }
        return false;
    }
    RegexHelper.extractRoomCode = extractRoomCode;
    function globalReplaceLinksAndImages(text) {
        // Check if the end of the string is a link or image
        if (text.endsWith(".png") ||
            text.endsWith(".jpg") ||
            text.endsWith(".jpeg") ||
            text.endsWith(".gif")) {
            return filterOptions.process(replaceAllImagesWithImgLinks(text));
        }
        return filterOptions.process(replaceAllLinksWithAnchorTags(replaceFancyStyles(text)));
    }
    RegexHelper.globalReplaceLinksAndImages = globalReplaceLinksAndImages;
})(RegexHelper = exports.RegexHelper || (exports.RegexHelper = {}));
