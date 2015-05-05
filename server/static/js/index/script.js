$(function(){


    $('#loading').on('show.bs.modal', function (e) {
        setTimeout(function(){
            loadSemesters();
        }, 500);
    });

    var loadSemesters = function () {
        $.getJSON( "semesters/json")
            .always(function() {
                var element = $("<h5>Loading semesters info&hellip;</h5>").addClass("text-info");
                $("#loading .modal-body").append(element);
            })
            .fail(function() {
                var element = $("<h5>Error loading semesters info. Please try realoading the page or contact administrator if problem persists.</h5>").addClass("text-danger");
                $("#loading .modal-body").append(element);
                $("#loading .modal-body .glyphicon").removeClass("glyphicon-refresh-animate glyphicon-refresh").addClass("glyphicon-remove");
            })
            .done(function(data) {
                var element = $("<h5>Finished loading semesters info&hellip;</h5>").addClass("text-success");
                $("#loading .modal-body").append(element);
                console.log(data);
                loadEvents();
            });
    }

    var loadEvents = function () {
        console.log("loadEvents");
    }

    $('#loading').modal('show');

});