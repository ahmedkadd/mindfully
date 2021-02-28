/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// We put these functions in a separate file so they can be loaded into the
// summary page as well as the background page.

function time_to_hours_and_minutes(time) {
    let absTime = Math.abs(time),
        h = Math.floor(absTime / 3600),
        m = Math.floor(absTime / 60) % 60;
        s = Math.floor(absTime % 60);

    return [h, m,s];
};

function format_time(time) {
    let [h, m, s] = time_to_hours_and_minutes(time);
    return ((h < 1) ? "0:" : h + ":") +
           ((m < 10) ? ((m < 1) ? "00" : "0" + m) : m) + ":"+ 
           ((s < 10) ? ((s < 1) ? "00" : "0" + s) : s); 
};
