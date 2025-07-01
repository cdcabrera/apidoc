/*
 * apidoc
 * https://apidocjs.com
 *
 * Authors:
 * Peter Rottmann <rottmann@inveris.de>
 * Nicolas CARPi @ Deltablot
 * Copyright (c) 2013 inveris OHG
 * Licensed under the MIT license.
 */

/**
 * UrlProcessor class
 *
 * Replace placeholders in a URL with specific query parameters.
 *
 * @class
 */
class UrlProcessor {
  /**
   * Replace parameters from url (:id) by the parameters from input values
   *
   * Process a URL by replacing parameters in the pathname and query string with the corresponding values
   * from the provided queryParameters object. Dynamic segments in the pathname (e.g., `:param`) are replaced.
   *
   * @param {string} url - Base URL to be hydrated. Can contain dynamic segments in the pathname or query string.
   * @param {object} queryParameters - An object where the keys represent the dynamic parameters in the URL and
   *     their values represent the replacement values.
   * @returns {string} Hydrated URL
   */
  hydrate(url, queryParameters) {
    // The dummy URL base is only used for parses of relative URLs in Node.js.
    const parsedUrl = new URL(url, typeof window === 'undefined' ? 'https://dummy.base' : window.location.origin);
    const queryParametersChangedInPathname = {};

    // For API parameters in the URL parts delimited by `/` (e.g. `/:foo/:bar`).
    parsedUrl.pathname.split('/').forEach(pathnamePart => {
      if (pathnamePart.charAt(0) === ':') {
        const realPathnamePart = pathnamePart.slice(1);

        if (typeof queryParameters[realPathnamePart] !== 'undefined') {
          parsedUrl.pathname = parsedUrl.pathname.replace(
            pathnamePart,
            encodeURIComponent(queryParameters[realPathnamePart])
          );
          queryParametersChangedInPathname[realPathnamePart] = queryParameters[realPathnamePart];
        }
      }
    });

    // For API parameters in the URL query string (e.g. `?foo=:foo&bar=:bar`).
    for (const key in queryParameters) {
      if (
        typeof queryParametersChangedInPathname[key] === 'undefined' || // Avoid adding query parameter if it has already been changed in pathname.
        parsedUrl.searchParams.has(key)
      ) {
        parsedUrl.searchParams.set(key, queryParameters[key]);
      }
    }

    return parsedUrl.toString();
  }
}

export { UrlProcessor as default, UrlProcessor };
