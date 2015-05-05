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
    var semesters, events;
    // Date format (if changes, need to be changed in several places)
    var dateFormat = "YYYY-MM-DD";

    // Add delay to display the modal
    $('#loading').on('show.bs.modal', function (e) {
        setTimeout(function(){
            loadSemesters();
        }, loadingInterval);
        $('#loading').off('show.bs.modal');
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
                    current = JSON.parse(current);
                    // just in case there are ever no events in the DB
                    if (current[0]) {
                        current = current[0];
                        $("#semesterInput").val(current.pk);
                        // trigger change to update dates
                        $("#semesterInput").trigger("change");
                        // triger date pickers to include the dates
                        $('#startDatePicker').data("DateTimePicker").date(
                            moment($('#startDatePicker').val(), dateFormat)
                        );
                        $('#endDatePicker').data("DateTimePicker").date(
                            moment($('#endDatePicker').val(), dateFormat)
                        );
                        loadEvents();
                    } else {
                        $("#semesterInput").val(-1);
                        $("#semesterInput").trigger("change");
                        doneLoading();
                        return;
                    }
                } catch (e) {
                    console.log(e);
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

            console.log(data);

            // TO-DO

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

    // Event binders

    // Reload on click
    $("#applyDateRange").on("click", function(e) {
        e.preventDefault();
        resetModal();
        $('#loading').modal('show');

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
    $('#startDatePicker').datetimepicker({
        format: dateFormat
    });
    $('#endDatePicker').datetimepicker({
        format: dateFormat
    });
    $("#startDatePicker").on("dp.change", function (e) {
        $('#endDatePicker').data("DateTimePicker").minDate(e.date);
    });
    $("#endDatePicker").on("dp.change", function (e) {
        $('#startDatePicker').data("DateTimePicker").maxDate(e.date);
    });

    $('#loading').modal('show');

});