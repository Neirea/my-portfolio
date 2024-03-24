// Generate URL slug from article title
export function generateSlug(title: string) {
    return title
        .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
        .toLowerCase() // Convert the string to lowercase letters
        .trim() // Remove whitespace from both sides of a string (optional)
        .replace(/[^a-z0-9 ._-]/g, "") // remove all chars not letters, numbers, dash, underscore, dot and spaces (to be replaced)
        .replace(/\s+/g, "-"); // spaces to dashes
}
