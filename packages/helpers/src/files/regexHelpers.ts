// This file contains helper functions for working with regular expressions mainly used in chat.
// It will replace image links with img tags and etc etc

import { FilterXSS } from "xss";

let filterOptions = new FilterXSS({
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

export namespace RegexHelper {
  export function replaceAllImagesWithImgLinks(text: string): string {
    // Add extra classes
    return text.replace(
      /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/g,
      '<picture><img src="$1" /><picture/>'
    );
  }

  export function replaceAllLinksWithAnchorTags(text: string): string {
    return text.replace(
      /((?:https?:\/\/|www\.)[^\s]+)/g,
      '<a href="$1" target="_blank">$1</a>'
    );
  }

  // This is a function similar to whatsapp where it replaces text between _ and * with italic and bold tags. ~~~~ is strikethrough
  export function replaceFancyStyles(text: string): string {
    text = text.replace(/~(.*?)~/g, "<s>$1</s>");
    text = text.replace(/\*(.*?)\*/g, "<b>$1</b>");
    text = text.replace(/_(.*?)_/g, "<i>$1</i>");

    return text;
  }

  export function extractRoomCode(text: string): string | false {
    const regex: RegExp = new RegExp(/(\w+)-(\w+)-(\w+)-(\w+)/g);

    const match = regex.exec(text);

    console.log(match);

    if (match) {
      return match[0];
    }

    return false;
  }

  export function globalReplaceLinksAndImages(text: string): string {
    // Check if the end of the string is a link or image

    if (
      text.endsWith(".png") ||
      text.endsWith(".jpg") ||
      text.endsWith(".jpeg") ||
      text.endsWith(".gif")
    ) {
      return filterOptions.process(replaceAllImagesWithImgLinks(text));
    }

    return filterOptions.process(
      replaceAllLinksWithAnchorTags(replaceFancyStyles(text))
    );
  }
}
