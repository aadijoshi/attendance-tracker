$(function(){

    "use strict";

    // Template constant for faster element creation
    var loadingElement = _.template("<h<%= h_num%> class='<%= type %>'> <%= message %>. <%= extra %></h<%= h_num%>>");
    var getLoadingElement = function (dict) {
        _.defaults(dict, {h_num : 5, extra : ""});
        return loadingElement(dict);
    }


    // To smoothen loading put intervals (or put to 0 for fastest speed)
    var loadingInterval = 1000;
    // To store dates of semesters globally
    var semesters, events;

    // Add delay to display the modal
    $('#loading').on('show.bs.modal', function (e) {
        setTimeout(function(){
            loadSemesters();
        }, loadingInterval);
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
        var current = data["current"];
        if (semesters) {
            try {
                semesters = JSON.parse(semesters);
                var selectSemesterElement = _.template("<option value='<%= value %>'><%= name %></option>")
                _.each(semesters, function (semester) {
                    $("#semesterInput").append(selectSemesterElement({
                        value : semester.pk,
                        name : semester.fields.term + " " + semester.fields.year
                    }));
                });
                $("#semesterInput").on("change", function(val) {
                    var val = $("#semesterInput :selected").val();
                    var semester = _.find(semesters, function(semester) {
                        return semester.pk == val;
                    });
                    $("#startDatePicker").val(semester.fields.start_date);
                    $("#endDatePicker").val(semester.fields.end_date);
                });
                try {
                    current = JSON.parse(current);
                    if (current[0]) {
                        current = current[0];
                        $("#semesterInput").val(current.pk);
                        // trigger change to update dates
                        $("#semesterInput").trigger("change");
                        loadEvents();
                    }
                } catch (e) {
                    loadingError("Error parsing current semester data received from server");
                }
            } catch (e) {
                loadingError("Error parsing semesters data received from server");
            }
        } else {
            loadingError("Server returned unexpected data");
        }
    }

    // Loads events from the server
    var loadEvents = function () {
        var start_date = $("#startDatePicker").val();
        var end_date = $("#endDatePicker").val();
        $.getJSON("events/json", {
            start : start_date,
            end : end_date
        })
        .always(function() {
            $("#loading .modal-body").append(getLoadingElement({
                message : "Loading events info for current semester&hellip;",
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

            console.log(data);

            doneLoading();
        });
    }

    var doneLoading = function () {

        $("#loading .modal-body").append(getLoadingElement({
            h_num : 4,
            message : "Completed loading and rendering data. All done",
            type : "text-success"
        }));

        $("#loading .modal-body .glyphicon").removeClass("glyphicon-refresh-animate glyphicon-refresh").addClass("glyphicon-ok");

        setTimeout(function(){
            $('#loading').modal('hide');
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

    $('#loading').modal('show');

});