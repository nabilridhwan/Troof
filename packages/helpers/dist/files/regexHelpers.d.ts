export declare namespace RegexHelper {
    function replaceAllImagesWithImgLinks(text: string): string;
    function replaceAllLinksWithAnchorTags(text: string): string;
    function replaceFancyStyles(text: string): string;
    function extractRoomCode(text: string): string | false;
    function globalReplaceLinksAndImages(text: string): string;
}
