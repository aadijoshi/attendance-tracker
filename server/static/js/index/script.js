$(function(){

    "use strict";

    // Template constant for faster element creation
    var loadingElement = _.template("<h<%= h_num%> class='<%= type %>'> <%= message %>. <%= extra %></h<%= h_num%>>");
    var getLoadingElement = function (dict) {
        _.defaults(dict, {h_num : 5, extra : ""});
        return loadingElement(dict);
    }

    var glyphiconElement = _.template("<span class='glyphicon <%= type %>'></span>");


    // To smoothen loading put intervals (or put to 0 for fastest speed)
    var loadingInterval = 1000;
    // To store dates of semesters globally
    var semesters, events, students, studentsDict, prevFilteredEvents;
    // Date format (if changes, need to be changed in several places)
    var dateFormat = "YYYY-MM-DD";
    // Table id to find main events table
    var eventsTableId = "eventsTable";

    // Helper functions to get ID strings
    var getEventId = function (id) {
        return "event" + id;
    }
    var getParticipantId = function (id) {
        return "participant" + id;
    }

    // Logic starts here

    // Add delay to display the modal
    $("#loading").on("show.bs.modal", function (e) {
        setTimeout(function(){
            loadSemesters();
        }, loadingInterval);
        $("#loading").off("show.bs.modal");
    });

    // Dirty fix for proper graphs styling
    $("#statsModal").on("shown.bs.modal", function (e) {
        $(window).resize();

        $("#graphLoading").hide();
        $("#genderGraphRow div").show();
        $("#yearGraphRow div").show();
        $("#generalInfoH").show();

    });

    $("#statsModal").on("hidden.bs.modal", function (e) {
        var c1 = $("#genderGraphRow div").highcharts();
        if (c1) {
            c1.destroy();
        }
        var c2 = $("#yearGraphRow div").highcharts();
        if (c2) {
            c2.destroy();
        }

        $("#genderGraphRow div").hide();
        $("#yearGraphRow div").hide();
        $("#generalInfoH").hide();
        $("#graphLoading").show();
        $("#generalInfo").html("");
    });

    // Load semesters data from the server
    var loadSemesters = function () {
        $.getJSON("semesters/json", {
        })
        .always(function() {
            $("#loading .modal-body").append(getLoadingElement({
                message : "Loading semesters info&hellip;",
                type : "text-info"
            }));
        })
        .fail(function() {
            loadingError("Error loading semesters info");
        })
        .done(function(data) {
            $("#loading .modal-body").append(getLoadingElement({
                message : "Finished loading semesters info&hellip;",
                type : "text-success"
            }));

            loadSemestersDOM(data);
        });
    }

    // Load data from the server about semesters into the DOM
    var loadSemestersDOM = function(data) {
        semesters = data["semesters"];
        if (semesters) {

            try {
                semesters = JSON.parse(semesters);
            } catch (e) {
                console.log(e);
                loadingError("Error parsing semesters data received from server");
                return;
            }

            var selectSemesterElement = _.template("<option value='<%= value %>'><%= name %></option>")
            _.each(semesters, function (semester) {
                $("#semesterInput").append(selectSemesterElement({
                    value : semester.pk,
                    name : semester.fields.term + " " + semester.fields.year
                }));
            });
            $("#semesterInput").append(selectSemesterElement({
                value : -1,
                name : "custom"
            }));
            $("#semesterInput").on("change", function(val) {
                var val = $("#semesterInput :selected").val();
                if (val != -1) {
                    var semester = _.find(semesters, function(semester) {
                        return semester.pk == val;
                    });
                    $("#startDatePicker").val(semester.fields.start_date);
                    $("#endDatePicker").val(semester.fields.end_date);
                } else {
                    $("#startDatePicker").focus();
                }
            });

            try {
                var current = data["current"];

                if (current) {

                    current = JSON.parse(current);
                    // just in case there are ever no events in the DB
                    if (current[0]) {
                        current = current[0];
                        $("#semesterInput").val(current.pk);
                        // trigger change to update dates
                        $("#semesterInput").trigger("change");
                        // triger date pickers to include the dates
                        $("#startDatePicker").data("DateTimePicker").date(
                            moment($("#startDatePicker").val(), dateFormat)
                        );
                        $("#endDatePicker").data("DateTimePicker").date(
                            moment($("#endDatePicker").val(), dateFormat)
                        );
                        loadEvents();
                    } else {
                        $("#semesterInput").val(-1);
                        $("#semesterInput").trigger("change");
                        doneLoading();
                        return;
                    }

                } else {
                    loadingError("Server returned unexpected data. No current semester");
                    return;
                }

            } catch (e) {
                console.log(e);
                loadingError("Error parsing current semester data received from server");
                return;
            }


        } else {
            loadingError("Server returned unexpected data. No semesters info found");
            return;
        }
    }

    // Loads events from the server
    var loadEvents = function () {
        var start_date = $("#startDatePicker").val();
        // check if start date is valid
        if (!moment(start_date, dateFormat, true).isValid()) {
            dismissibleError("Wrong start date format, please use " + dateFormat);
            return;
        }
        var end_date = $("#endDatePicker").val();
        // check if end date is valid
        if (!moment(end_date, dateFormat, true).isValid()) {
            dismissibleError("Wrong end date format, please use " + dateFormat);
            return;
        }

        $.getJSON("events/json", {
            start : start_date,
            end : end_date
        })
        .always(function() {
            $("#loading .modal-body").append(getLoadingElement({
                message : "Loading events info for selected date range&hellip;",
                type : "text-info"
            }));
        })
        .fail(function() {
            loadingError("Error loading events info");
        })
        .done(function(data) {
            $("#loading .modal-body").append(getLoadingElement({
                message : "Finished loading events info&hellip;",
                type : "text-success"
            }));

            loadAllGraphs(data);

        });
    }

    var loadAllGraphs = function (data) {

        $("#" + eventsTableId).html("");

        $("#loading .modal-body").append(getLoadingElement({
            message : "Rendering all the needed graphs&hellip;",
            type : "text-info"
        }));

        try {
            if (data["students"]) {
                students = JSON.parse(data["students"]);
            } else {
                loadingError("No data on students received from server");
                return;
            }

            if (data["events"]) {
                events = JSON.parse(data["events"]);
            } else {
                loadingError("No data on events received from server");
                return;
            }

        } catch (e) {
            console.log(e);
            loadingError("Error parsing current semester data received from server");
            return;
        }

        // TO-DO: here is the check and DOM update for no events/no students
        if (events.length == 0) {
            $("#eventsTableContainter h2").remove();
            $("#" + eventsTableId).after("<h2>No events to display, please try new search</h2>");
            $(".hide-no-events").hide();
            doneLoading();
            return;
        }
        $(".hide-no-events").show();


        // converts students to students dictionary for easy look up by n_number
        studentsDict = _.object(_.map(students, function(item) {
           return [item.pk, item.fields]
        }));


        createEventsTable();

        createGlobalGraphs();

        doneLoading();

    }

    var createGlobalGraphs = function() {
        var c1 = $("#genderGraph div").highcharts();
        if (c1) {
            c1.destroy();
        }
        var c2 = $("#yearGraph div").highcharts();
        if (c2) {
            c2.destroy();
        }
        $("#participantsGlobal").html("");

        getGenderChartAt("#genderGraph div", events);

        getYearChartAt("#yearGraph div", events);

        getGeneralInfoAt("#participantsGlobal", events);
    }

    var createEventsTable = function () {
        var tableElement = $("<table />", {
            id: eventsTableId
        }).appendTo("#eventsTableContainter");
        tableElement.addClass("table table-hover sortable hide-no-events");
        tableElement.append("\
            <thead> \
                <th>Name</th> \
                <th data-defaultsort='desc'>Date</th> \
                <th>Attendees</th> \
            </thead> \
            <tbody> \
            </tbody> \
        ");

        tableElement = $("#" + eventsTableId + " tbody");

        var tableRowElement = _.template("\
            <tr id='<%= id %>' class='clickable-row'> \
                <td><%= name %></td> \
                <td data-dateformat='" + dateFormat + "'><%= date %></td> \
                <td><%= participants %></td> \
            </tr> \
        ");

        _.each(events, function (ev) {
            tableElement.append(tableRowElement({
                id : getEventId(ev.pk),
                name : ev.fields.name,
                date : ev.fields.date,
                participants : ev.fields.participants.length,
            }));
            $("#" + getEventId(ev.pk)).on("click", tableRowModal.bind(this, ev));
        });

        $.bootstrapSortable("applyLast");

    }

    var updateFilter = function (filterString) {
        if (filterString.length == 0) {
            applyFilter(events)
        } else {
            var filteredEvents = events;
            _.each(filterString.trim().split(' '), function (filterStr) {
                if (filterStr[0] == "-") {
                    filteredEvents = _.filter(filteredEvents, function (ev) {
                        return ev.fields.name.toLowerCase().indexOf(filterStr.substring(1).toLowerCase()) == -1;
                    })
                } else {
                    filteredEvents = _.filter(filteredEvents, function (ev) {
                        return ev.fields.name.toLowerCase().indexOf(filterStr.toLowerCase()) != -1;
                    })
                }
            })
            applyFilter(filteredEvents);
        }
    }

    var applyFilter = function (filteredEvents) {
        $("#eventsTableContainter h2").remove();
        $(".hide-no-events").show();
        if (filteredEvents.length == 0) {
            $("#" + eventsTableId).after("<h2>No events to display, please try new search</h2>");
            $(".hide-no-events").hide();
        }
        getGeneralInfoAt("#participantsGlobal", filteredEvents);
        $("#eventsTableContainter tbody tr").hide()
        _.each(filteredEvents, function (ev) {
            $("#" + getEventId(ev.pk)).show();
        });
        var c1 = $("#genderGraph div").highcharts();
        if (c1) {
            c1.destroy();
        }
        var c2 = $("#yearGraph div").highcharts();
        if (c2) {
            c2.destroy();
        }

        getGenderChartAt("#genderGraph div", filteredEvents);

        getYearChartAt("#yearGraph div", filteredEvents);
    }

    var tableRowModal = function (ev) {
        $("#statsModal .modal-title").text(ev.fields.name + " (" + ev.fields.date + ")");

        $("#statsModal").modal("show");

        setTimeout(function(){
            getGenderChartAt("#genderGraphRow div", ev);

            getYearChartAt("#yearGraphRow div", ev);

            getGeneralInfoAt("#generalInfo", ev);

        }, loadingInterval);

    }

    var getGeneralInfoAt = function (id, ev) {
        $(id).html("");
        var eventParticipants = getEventParticipants(ev);
        var isMultipleEvent = _.isArray(ev);

        var tableId = "studentsTableContainer" + id.substring(1);

        $(id + "H h4 span").html(" ("+ eventParticipants.length + " " + (eventParticipants.length == 1 ? "person" : "people") + ")")

        var tableElement = $("<table />", {
            id: tableId
        }).appendTo(id);
        tableElement.addClass("table table-hover sortable");
        tableElement.append("\
            <thead> \
                <th data-defaultsort='asc'>Name</th> \
                <th>Gender</th> \
                <th>Year</th> \
            </thead> \
            <tbody> \
            </tbody> \
        ");

        if (isMultipleEvent) {
            $("#" + tableId + " thead tr").append("<th>Attended</th>");
        }

        tableElement = $("#" + tableId + " tbody");

        var tableRowElement = _.template("\
            <tr id='<%= id %>' class='clickable-row'> \
                <td><%= name %></td> \
                <td><%= gender %></td> \
                <td><%= year %></td> \
            </tr> \
        ");

        var participatedElement = _.template("\
            <td><%= participated %></td> \
        ");

        _.each(eventParticipants, function (participant) {
            var student = studentsDict[participant];
            tableElement.append(tableRowElement({
                id : getParticipantId(participant),
                name : student.last_name + " " + student.first_name,
                gender : student.gender,
                year : student.year,
            }));
            if (isMultipleEvent) {
                $("#" + getParticipantId(participant)).append(participatedElement({

                    participated : _.chain(events)
                        .filter(function(ev) {
                            return _.indexOf(ev.fields.participants, participant) != -1
                        })
                        .value()
                        .length

                }));
            }

            // $("#" + getEventId(ev.pk)).on("click", tableRowModal.bind(this, ev));
        });

        $.bootstrapSortable("applyLast");
    }

    var getGenderChartAt = function (id, ev) {

        var seriesDrilldown = getGenderData(ev);

        $(id).highcharts({
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Breakdown by gender'
            },
            subtitle: {
                text: 'Click the slices to view breakdown of each gender by year'
            },
            series: [{
                name: 'Genders',
                colorByPoint: true,
                data: seriesDrilldown[0]
            }],
            drilldown: {
                series: seriesDrilldown[1]
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y} ({point.percentage:.2f}%)</b><br/>'
            },
        });
    };

    var getYearChartAt = function (id, ev) {

        var seriesDrilldown = getYearData(ev);

        $(id).highcharts({
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Breakdown by year'
            },
            subtitle: {
                text: 'Click the slices to view breakdown of each year by gender'
            },
            series: [{
                name: 'Years',
                colorByPoint: true,
                data: seriesDrilldown[0]
            }],
            drilldown: {
                series: seriesDrilldown[1]
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y} ({point.percentage:.2f}%)</b><br/>'
            },
        });
    };

    var getGenderData = function (ev) {
        var series = _.map(getGenderBreakdown(ev), function(num, key) {
            return {
                name : key,
                y: num,
                drilldown : key
            }
        });


        var drilldown = _.map(series, function (num) {
            return {
                id : num.drilldown,
                data : _.pairs(getYearBreakdown(ev, num.name))
            }
        });

        return [series, drilldown];
    };

    var getYearData = function (ev) {
        var series = _.map(getYearBreakdown(ev), function(num, key) {
            return {
                name : key,
                y: num,
                drilldown : key
            }
        });

        var drilldown = _.map(series, function (num) {
            return {
                id : num.drilldown,
                data : _.pairs(getGenderBreakdown(ev, num.name))
            }
        });

        return [series, drilldown];
    };

    var getGenderBreakdown = function (ev, constraint) {
        var eventParticipants = getEventParticipants(ev);

        // filter ones that we don't need
        if (constraint) {
            eventParticipants = _.filter(eventParticipants, function (participant) {
                if (studentsDict[participant].year == null && constraint == "null") {
                    return true;
                }
                return studentsDict[participant].year == constraint;
            })
        }

        // count them
        var result = _.countBy(eventParticipants, function(participant) {
            return studentsDict[participant].gender;
        });

        return result;

    }

    var getYearBreakdown = function (ev, constraint) {
        var eventParticipants = getEventParticipants(ev);

        // filter ones that we don't need
        if (constraint) {
            eventParticipants = _.filter(eventParticipants, function (participant) {
                if (studentsDict[participant].gender == null && constraint == "null") {
                    return true;
                }
                return studentsDict[participant].gender == constraint;
            })
        }

        // count them
        var result = _.countBy(eventParticipants, function(participant) {
            return studentsDict[participant].year;
        });

        return result;

    }

    var getEventParticipants = function (ev) {
        var eventParticipants;

        // Get all unique participants
        if (_.isArray(ev)) {
            eventParticipants = _.chain(ev)
                .map(function (n) { return n.fields.participants; })
                .flatten()
                .uniq()
                .value();
        } else {
            eventParticipants = ev.fields.participants;
        }

        return eventParticipants;
    }

    var doneLoading = function () {

        $("#loading .modal-body").append(getLoadingElement({
            h_num : 4,
            message : "Completed loading and rendering data. All done",
            type : "text-success"
        }));

        $("#loading .modal-body .glyphicon").removeClass("glyphicon-refresh-animate glyphicon-refresh").addClass("glyphicon-ok");

        setTimeout(function(){
            $("#loading").modal("hide");
        }, loadingInterval);
    }

    var resetModal = function (dict) {
        // _.defaults cannot do defaults on undefined
        $("#loading .modal-body").html("");
        var to_append_after = "";

        if (!dict) {
            dict = {};
            to_append_after = "<h4>Loading, please wait&hellip;</h4>";
        }
        _.defaults(dict, {type : "glyphicon-refresh glyphicon-refresh-animate"});

        $("#loading .modal-body").append(glyphiconElement(dict));

        $("#loading .modal-body").append(to_append_after);
    };

    var dismissibleError = function (errorText) {

        resetModal({type : "glyphicon-exclamation-sign"});

        $("#loading .modal-body").append(getLoadingElement({
            h_num : 4,
            message : errorText,
            type : "text-danger"
        }));

        setTimeout(function(){
            $("#loading").modal("hide");
        }, loadingInterval);
    }

    // Adds error message to the loading modal
    var loadingError = function (errorText) {
        $("#loading .modal-body").append(getLoadingElement({
            h_num : 4,
            message : errorText,
            extra : "Please try realoading the page or contact administrator if problem persists.",
            type : "text-danger"
        }));
        $("#loading .modal-body .glyphicon").removeClass("glyphicon-refresh-animate glyphicon-refresh").addClass("glyphicon-remove");
    }

    // Event binders

    // Reload on click
    $("#applyDateRange").on("click", function(e) {
        e.preventDefault();
        resetModal();
        $("#loading").modal("show");

        setTimeout(function(){
            loadEvents();
        }, loadingInterval);
    });

    // Remove semester on change
    $("#startDatePicker").on("focus", function() {
        $("#semesterInput").val(-1);
    });
    $("#endDatePicker").on("focus", function() {
        $("#semesterInput").val(-1);
    });


    // Datepickers setup
    $("#startDatePicker").datetimepicker({
        format: dateFormat
    });
    $("#endDatePicker").datetimepicker({
        format: dateFormat
    });
    $("#startDatePicker").on("dp.change", function (e) {
        $("#endDatePicker").data("DateTimePicker").minDate(e.date);
    });
    $("#endDatePicker").on("dp.change", function (e) {
        $("#startDatePicker").data("DateTimePicker").maxDate(e.date);
    });

    // Handle filtering
    $("#filterInput").on("keypress", function (e) {
        if (e.which == 13 ) {
            e.preventDefault();
            updateFilter($("#filterInput").val());
        }
    });

    $("#applyFilter").on("click", function (e) {
        e.preventDefault();
        updateFilter($("#filterInput").val());
    });

    $("#removeFilter").on("click", function (e) {
        e.preventDefault();
        $("#filterInput").val("");
        updateFilter("");
    })

    $("#loading").modal("show");

});