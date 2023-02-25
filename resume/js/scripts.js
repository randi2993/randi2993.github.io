function sortJSONByDate(a,b) {
    return new Date(b["start-date"]).getTime() - new Date(a["start-date"]).getTime();
}

function getDateDifference(startDate, endDate) { // @see https://stackoverflow.com/a/51441904/9056410
    if (startDate > endDate) {
        console.error('Start date must be before end date');
        return null;
    }
    var startYear = startDate.getFullYear();
    var startMonth = startDate.getMonth();
    var startDay = startDate.getDate();

    var endYear = endDate.getFullYear();
    var endMonth = endDate.getMonth();
    var endDay = endDate.getDate();

    // We calculate February based on end year as it might be a leep year which might influence the number of days.
    var february = (endYear % 4 == 0 && endYear % 100 != 0) || endYear % 400 == 0 ? 29 : 28;
    var daysOfMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var startDateNotPassedInEndYear = (endMonth < startMonth) || endMonth == startMonth && endDay < startDay;
    var years = endYear - startYear - (startDateNotPassedInEndYear ? 1 : 0);

    var months = (12 + endMonth - startMonth - (endDay < startDay ? 1 : 0)) % 12;

    // (12 + ...) % 12 makes sure index is always between 0 and 11
    var days = startDay <= endDay ? endDay - startDay : daysOfMonth[(12 + endMonth - 1) % 12] - startDay +
        endDay;

    return {
        years: years,
        months: months,
        days: days
    };
}
$(document).ready(function () {

    $.getJSON("json/profile.json",
        function (profile) {
            $(document).prop('title', profile.name + '- resume');

            $("#profile-name").text(profile.name);
            $("#profile-role").text(profile.role);

            if (profile.location == undefined || profile.location.name == [] || profile.location.name == undefined) {
                $("#profile-location-link").empty();
            } else {
                $("#profile-location-link").attr("href", profile.location["google-maps-link"]);
                $("#profile-location-text").text(profile.location["name"]);
            }

            if (profile.linkedin == "" || profile.linkedin == undefined) {
                $("#profile-linkedin").empty();
            } else {
                $("#profile-linkedin").attr("href", $("#profile-linkedin").attr('href') + profile.linkedin);
                $("#profile-linkedin-text").text(profile.linkedin);
            }

            if (profile.stackoverflow == "" || profile.stackoverflow == undefined) {
                $("#profile-stackoverflow").empty();
            } else {
                $("#profile-stackoverflow").attr("href", $("#profile-stackoverflow").attr('href') + profile.stackoverflow);
                $("#profile-stackoverflow-text").text(profile.stackoverflow.split("/").pop());
            }

            if (profile.github == "" || profile.github == undefined) {
                $("#profile-github").empty();
            } else {

                $("#profile-github").attr("href", $("#profile-github").attr('href') + profile.github);
                $("#profile-github-text").text(profile.github);
            }

            if (profile.email == "" || profile.email == undefined) {
                $("#profile-email").empty();
            } else {
                $("#profile-email").attr("href", $("#profile-email").attr('href') + profile.email);
                $("#profile-email-text").text(profile.email);
            }

            $.each(profile.knowledge, function (key, item) {
                $("#knowledge").append('<span class="post-tag">' + item + '</span>');
            });

            $.each(profile["open-to-learn-work"], function (key, item) {
                $("#open-to-learn-work").append('<span class="post-tag">' + item + '</span>');
            });
        });

    $.getJSON("json/timeline.json",
        function (timeline) {

            timeline.sort(sortJSONByDate);
            console.log(timeline);

            $.each(timeline, function (key, item) {
                let type = "";
                let title = "";
                let picture = "";
                var at = " at ";
                var date = new Date();

                if (item['is-job']) {
                    type = "job";
                    title = "Position";
                    title = "Position";
                    picture += '<img src="' + item.picture + '" alt="Claro Dominicana" class="js-list-img" />';
                } else if (item['is-github']) {
                    type = "project github";
                    title = "Open Source";
                    at = "";
                } else if (item['is-educational']) {
                    type = "educational";
                    title = "Education";
                }

                var html = '<div id="item-' + key + 1 + '" class="timeline-item ' + type + '">';
                html += '<header>';
                html += title + '&#8226; ' + item["start-date"] + '&#x2192; ';


                if (item['is-current']) {
                    html += "Current";
                } else
                    date = new Date(item['end-date']);

                var result = getDateDifference(new Date(item["start-date"]), date);


                html += ' (' + result.years + ' years, ' + result.months + ' months)';
                html += '</header>';
                html += '<div class="timeline-item-content ">';
                html += '<div class="js-listcard-container"></div>';
                html += '<div class="g-center img logo logo-blank js-logo-blank dno align-self " data-list-url="">';
                html += '<svg aria-hidden="true" class="svg-icon iconIndustry" width="18" height="18" viewbox="0 0 18 18">';
                html += '<path d="M10 16v-4H8v4H2V4c0-1.1.9-2 2-2h6c1.09 0 2 .91 2 2v2h2c1.09 0 2 .91 2 2v8h-6zM4 4v2h2V4H4zm0 4v2h2V8H4zm4-4v2h2V4H8zm0 4v2h2V8H8zm-4 4v2h2v-2H4zm8 0v2h2v-2h-2zm0-4v2h2V8h-2z" />';
                html += '</svg>';
                html += '</div>';
                html += '<div class="img logo align-self">';
                html += picture;
                html += '</div>';
                html += '<div class="timeline-item-text">';
                html += '<div class="timeline-item-title">';
                html += item.role + at;
                html += '<span class="js-listcard-hover">';
                html += '<a href="' + item.url + '" target="_blank"> ' + item.name + ' </a>';
                html += '</span>';
                html += '</div>';
                html += '<br>';
                html += '<div class="timeline-item-content">';
                html += '<ul>';

                $.each(item.description, function (key_, value) {
                    html += '<li>';
                    html += value;
                    html += '</li>';
                });

                html += '</ul>';
                html += '</div>';
                html += '<div class="timeline-item-tags grid gs4 fl-none fw-wrap mt16">';

                $.each(item.techs, function (key_, value) {
                    html += '<span class="grid--cell s-tag">' + value + '</span>';

                });

                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';

                $("#timeline-items-loop").append(html);
            });
        });
});