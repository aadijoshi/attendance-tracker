from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest
import json

from django.contrib.auth.decorators import login_required

from attendance_stats.models import *

import datetime

from django.views.decorators.csrf import csrf_exempt

from django.core import serializers

# constants

DATE_FORMAT = "%Y-%m-%d"

# event synching end-point
@csrf_exempt
def sync(request):
    if request.method == "POST":
        try:
            try:
                data = json.loads(request.body)
            except:
                return HttpResponseBadRequest("Failed to parse JSON",
                    content_type='text/plain')

            name, date, uuid, swiped = \
                data.get("name", False), \
                data.get("date", False), \
                data.get("uuid", False), \
                data.get("swiped", False)

            # check if all the fields are present
            if not name:
                return HttpResponseBadRequest("Has to include 'name'",
                    content_type='text/plain')
            if not date:
                return HttpResponseBadRequest("Has to include 'date'",
                    content_type='text/plain')
            if not uuid:
                return HttpResponseBadRequest("Has to include 'uuid'",
                    content_type='text/plain')
            if swiped == False:
                return HttpResponseBadRequest("Has to include 'swiped'",
                    content_type='text/plain')

            max_name_len = Event._meta.get_field('name').max_length
            if len(name) > max_name_len:
                return HttpResponseBadRequest(
                    "'name' is too long ({0} chars max)".format(max_name_len))

            # example format: Sat May 02 2015
            # delete Sat
            # date = date[4:]
            try:
                date = datetime.datetime.strptime(date, "%a %b %d %Y").date()
            except ValueError:
                return HttpResponseBadRequest("Can't parse 'date'")

            uuid_len = Event._meta.get_field('uuid').max_length
            if len(uuid) != uuid_len:
                return HttpResponseBadRequest(
                    "'uuid' is of wrong length ({0} chars, should be {1} chars)"
                    .format(len(uuid), uuid_len),
                    content_type='text/plain')

            event, created_event = Event.objects.get_or_create(uuid=uuid, name=name, date=date)
            participants = Student.objects.filter(event=event)
            added = []
            for n_number in swiped:
                participant, _ = Student.objects.get_or_create(n_number=n_number)
                if participant not in participants and participant not in added:
                    event.participants.add(participant)
                    added.append(participant)

            return HttpResponse("{1} event: {0}"
                .format(event, "Created" if created_event else "Updated"),
                status=200,
                content_type='text/plain')
        except Exception as e:
            print str(e)
            return HttpResponse("Server error message: {0!s}".format(e),
                status=500,
                content_type='text/plain')
    else:
        return HttpResponseBadRequest("Has to be a POST request",
            content_type='text/plain')


# API endpoint for listing semesters
@login_required
def semesters(request):
    semesters = Semester.objects.order_by('end_date')
    print semesters

    response = {
        'semesters' : serializers.serialize('json', semesters)
    }

    if len(semesters) > 0:
        today = datetime.date.today()

        # take first semester as a current
        current = semesters[0]
        # find most recent semester
        for semester in semesters:
            if today > semester.start_date and today < semester.end_date:
                current = semester
                break
            elif today < semester.start_date:
                break
            else:
                current = semester

        response.update({
            'current' : serializers.serialize('json', [current])
        })

    else:
        response.update({
            'current' : []
        })



    data = json.dumps(response)

    return HttpResponse(data, content_type='application/json')


# API endpoint for listing events
@login_required
def events(request):

    data = request.GET.dict()

    start = data.get('start', False)

    if not start:
         return HttpResponse("Needs 'start' parameter",
             status=500,
             content_type='text/plain')

    end = data.get('end', False)

    if not data.get('end', False):
         return HttpResponse("Needs 'end' parameter",
             status=500,
             content_type='text/plain')

    try:
        start = datetime.datetime.strptime(start, DATE_FORMAT).date()
        end = datetime.datetime.strptime(end, DATE_FORMAT).date()
    except:
        return HttpResponse("Wrong date format, should be {0}"
            .format(DATE_FORMAT),
            status=500,
            content_type='text/plain')

    events = Event.objects \
        .filter(date__gte=start) \
        .filter(date__lte=end) \
        .order_by('-date')

    response = json.dumps(serializers.serialize('json', events))

    return HttpResponse(response, content_type='application/json')


@login_required
def index(request):
    return render(request, 'index/index.html', {})
