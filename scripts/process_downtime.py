"""
Created on 12/02/2016
@author: Aitor Gomez Goiri <aitor.gomez-goiri@open.ac.uk>

This script processes Apache's access log files to generate a simplified file
with Apache's downtime periods (503 service unavailable errors).
"""

import re
import time
import json


accessfile = 'access_log_2016-01.log'
errorfile = 'error_log_2016-01.log'
catalinafile = 'catalina.2016-01-28.log'


later = "27 Jan 16"
before = "29 Jan 16"
restrict_to = 'http://forge.kmi.open.ac.uk/pt/'


resources_to_ignore = ('/favicon.ico', '/pt/app/memorable', '/pt/static/')


look_for = ('500', '503')
def status_change(previous, current):
    """
    We are only looking for unavailability changes.
    Therefore we only check whether the status has changed to/from error 503.
    """
    if previous in look_for:
        return current not in look_for
    elif current in look_for:
        return previous not in look_for


def ignore_resource(resource):
    #If astherisc wasn't an option:
    #if resource not in resources_to_ignore
    for to_ignore in resources_to_ignore:
        if resource.startswith(to_ignore):
            return True
    return False


def extract_error_recoveries(filename):
    prog = re.compile('(?!::1) \[(.*) \+\d+\] "\S+ (\S+) \S+" (\d{3}) \d+ "' + restrict_to)

    last_match = None
    recovery_from_error = []
    with open(filename) as f:
        for line in f.readlines():
            match = prog.search(line)
            if match and not ignore_resource(match.group(2)):
                status = match.group(3)
                if not last_match:
                    last_match = match
                elif status_change(status, last_match.group(3)):
                    last_match = match
                    if status not in look_for:
                        el = [time.strptime(last_match.group(1), "%d/%b/%Y:%H:%M:%S"),
                                last_match.group(3), last_match.group(2)]
                        #print last_match.groups()
                        recovery_from_error.append(el)
    return recovery_from_error


#Jan 28, 2016 9:41:59 AM org.apache.catalina.startup.Catalina start
def extract_tomcat_restarts(filename):
    prog = re.compile('(.*) org\.apache\.catalina\.startup\.Catalina (\w+)')
    restarts = []
    with open(filename) as f:
        for line in f.readlines():
            match = prog.search(line)
            if match:
                # Jan 28, 2016 9:41:59 AM
                restart_t = time.strptime(match.group(1), '%b %d, %Y %I:%M:%S %p')
                if match.group(2) == 'start':
                    # We can also record when it was stopped
                    restarts.append((restart_t, '200'))
    return restarts


def extract_errors(filename):
    prog = re.compile('\[(.*)\.\d+ (\d{4})\] \[proxy_ajp:error]')
    errors = []
    with open(filename) as f:
        for line in f.readlines():
            match = prog.search(line)
            if match:
                # Thu Jan 28 13:35:29 2016
                etime = match.group(1) + ' ' + match.group(2)
                error_t = time.strptime(etime, '%a %b %d %H:%M:%S %Y')
                errors.append((error_t, '503'))
    return errors


def append_event(elist, event):
    #elist.append((time.strftime("%d/%b/%Y:%H:%M:%S", event[0]), event[1], None if len(event)<3 else event[2]))
    elist.append((event[0].isoformat(), event[1], None if len(event)<3 else event[2]))


def mix_order_and_simplify(list1, list2):
    # mix and sort by time
    mix = sorted(list1 + list2, key=lambda line: line[0])
    previous_event = None
    ret = []
    for el in mix:
        # filter ignoring events outside Jan 27 and Jan 28
        low_limit = time.strptime(later, "%d %b %y")
        high_limit = time.strptime(before, "%d %b %y")
        if low_limit < el[0] and el[0] < high_limit:
            if not previous_event:
                previous_event = el
            # filter ignoring repeated events
            elif previous_event[1] == '503':
                if el[1] != '503':
                    #append_event(ret, previous_event)
                    ret.append(previous_event)
                    previous_event = el
            else:
                if el[1] == '503':
                    ret.append(previous_event)
                    previous_event = el
    ret.append(previous_event)
    return ret


def to_chart_js_point(when, status):
    value = 0 if status == '503' else 1
    return {'x': time.strftime('%Y-%m-%dT%H:%M:%SZ', when), 'y': value}


def write_json(filename, events):
    with open(filename, 'w') as f:
        f.write('results = ')
        data = []
        for event in events:
            data.append(to_chart_js_point(event[0], event[1]))
        f.write(json.dumps(data))
        f.write(';')



#recoveries = extract_error_recoveries(accessfile)
errors = extract_errors(errorfile)
restarts = extract_tomcat_restarts(catalinafile)
print restarts
all_events = mix_order_and_simplify(restarts, errors)

for el in all_events:
    print time.strftime('%Y-%m-%dT%H:%M:%SZ', el[0]), el[1:]

write_json('results.js', all_events)
