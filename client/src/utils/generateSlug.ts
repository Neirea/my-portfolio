export function generateSlug(title: string) {
    return title
        .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ._-]/g, "") // remove all chars not letters, numbers, dash, underscore, dot and spaces (to be replaced)
        .replace(/\s+/g, "-"); // spaces to dashes
}
