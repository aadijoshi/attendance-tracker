from django.db import models

class Student(models.Model):
    n_number = models.IntegerField("N Number (N is 8)", primary_key=True)
    first_name = models.CharField(max_length=32, null=True, blank=True)
    last_name = models.CharField(max_length=32, null=True, blank=True)
    net_id = models.CharField("Net ID", max_length=16, null=True, blank=True)

    GENDER = (
        ('F', 'Female'),
        ('M', 'Male'),
    )
    gender = models.CharField(max_length=1,
                                choices=GENDER, null=True, blank=True)
    year = models.PositiveSmallIntegerField(null=True, blank=True)

    gnu_student = models.BooleanField("GNU Student")

    def __str__(self):
        return "{0} {1} ({2!s})".format(
            self.first_name,
            self.last_name,
            self.n_number
            )

class Event(models.Model):
    name = models.CharField(max_length=256)
    date = models.DateField()
    participants = models.ManyToManyField(Student)
    uuid = models.CharField('UUID', max_length=36)

    def __str__(self):
        count = self.participants.count()
        return "{0} {1!s} ({2!s} participant{plural})".format(
            self.name,
            self.date,
            count,
            plural="s" if count != 1 else "",
            )

class Semester(models.Model):
    TERM = (
        ('S', 'Spring'),
        ('F', 'Fall'),
        ('J', 'J-Term'),
        ('M', 'Summer')
    )
    term = models.CharField(max_length=1,
                                choices=TERM)
    year = models.PositiveSmallIntegerField()
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return "{0} {1!s} ({2!s} - {3!s})".format(
            self.term,
            self.year,
            self.start_date,
            self.end_date
            )