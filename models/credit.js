module.exports = class Credit {
    /**
     * Provide credit to images, libraries, and other things used
     * @param {String} sourceName Name of source website
     * @param {String} sourceLink URL to source website
     * @param {String} localPath (Optional) Path to image file
     * @param {String} remotePath (Optional) URL to remote source
     * @param {String} authorName (Optional) Name of artist/author of the image
     * @param {String} authorLink (Optional) URL to artist/author page
     */
    constructor(sourceName, sourceLink, localPath, remotePath, authorName, authorLink) {
        this.source = {
            "name": sourceName,
            "link": sourceLink
        }
        this.image = (localPath && remotePath ? {
            "localPath": localPath,
            "remotePath": remotePath
        } : null)
        this.author = (authorName && authorLink ? {
            "name": authorName,
            "link": authorLink
        } : null)
    }

    get() {
        return (this.image != null && this.author != null ?
            {
                source: this.source,
                image: this.image,
                author: this.author
            } :
            {
                source: this.source
            }
        )
    }
}