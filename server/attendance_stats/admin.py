from django.contrib import admin

from models import *

class StudentAdmin(admin.ModelAdmin):
    list_display = ('last_name', 'first_name', 'gender', 'n_number', 'net_id', 'year', 'gnu_student')
    search_fields = ('last_name', 'net_id')
    list_filter = ('year', 'gender', 'gnu_student')

admin.site.register(Student, StudentAdmin)

class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'date')
    filter_horizontal = ('participants',)
    readonly_fields=('uuid',)
    search_fields = ('name',)
    # TO-DO:
    # add list_filter based on semesters

admin.site.register(Event, EventAdmin)

class SemesterAdmin(admin.ModelAdmin):
    list_display = ('term', 'year', 'start_date', 'end_date')
    list_filter = ('term', 'year')


admin.site.register(Semester, SemesterAdmin)
