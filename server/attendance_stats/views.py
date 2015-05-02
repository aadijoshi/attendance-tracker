from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest
import json

from attendance_stats.models import *

from datetime import datetime

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def sync(request):
    if request.method == "POST":
        data = request.POST

        # check if all the fields are present
        if "name" not in data:
            return HttpResponseBadRequest("Has to include 'name'")
        if "date" not in data:
            return HttpResponseBadRequest("Has to include 'date'")
        if "uuid" not in data:
            return HttpResponseBadRequest("Has to include 'uuid'")
        if "swiped" not in data:
            return HttpResponseBadRequest("Has to include 'swiped'")

        name, date, uuid, swiped = \
            data["name"], data["date"], data["uuid"], data.getlist("swiped")

        max_name_len = Event._meta.get_field('name').max_length
        if len(name) > max_name_len:
            return HttpResponseBadRequest(
                "'name' is too long ({0} chars max)".format(max_name_len))

        # example format: Sat May 02 2015
        # delete Sat
        # date = date[4:]
        try:
            date = datetime.strptime(date, "%a %b %d %Y").date()
        except ValueError:
            return HttpResponseBadRequest("Can't parse 'date'")

        uuid_len = Event._meta.get_field('uuid').max_length
        if len(uuid) != uuid_len:
            return HttpResponseBadRequest(
                "'uuid' is of wrong length ({0} chars, should be {1} chars)"
                .format(len(uuid), uuid_len))

        event, _ = Event.objects.get_or_create(uuid=uuid, name=name, date=date)
        participants = Student.objects.filter(event=event)
        for n_number in swiped:
            participant, _ = Student.objects.get_or_create(n_number=n_number)
            print participant
            if participant not in participants:
                event.participants.add(participant)

        return HttpResponse(status=200)
    else:
        return HttpResponseBadRequest("Has to be a POST request")