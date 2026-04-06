/**
 * scripts/ssg/utils/fetch.js
 *
 * API fetching utilities with error handling.
 */

export async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${res.statusText} — ${url}\n${body}`);
    }
    return res.json();
}
