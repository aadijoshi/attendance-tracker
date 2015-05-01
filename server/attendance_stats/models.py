from django.db import models

class Student(models.Model):
    n_number = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    net_id = models.CharField(max_length=16)

    FEMALE = 'F'
    MALE = 'M'
    GENDER = (
        (FEMALE, 'F'),
        (MALE, 'M'),
    )
    gender = models.CharField(max_length=1,
                                choices=GENDER,
                                default=FEMALE)
    year = models.IntegerField()

    def __str__(self):
        return "{0} {1} ({2!s}}".format(self.first_name,
                                        self.last_name,
                                        self.n_number)

class Event(models.Model):
    name = models.CharField(max_length=256)
    date = models.DateField()
    participants = models.ManyToManyField(Student)
    creator = models.CharField(max_length=64)

    def __str__(self):
        return "{0} {1!s} ({2!s} participants)".format(self.name,
                                                     self.date,
                                                     self.participants.count())