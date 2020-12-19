import json
from datetime import datetime

import math
import sys
from pytz import timezone
from skyfield.api import load, utc
from skyfield.searchlib import find_minima
from skyfield.toposlib import Topos


class SatelliteQuery:
    def __init__(self, satellite, centroid_topos):
        self.satellite = satellite
        self.centroid_topos = centroid_topos

    def distance(self, t):
        sp = self.satellite.at(t).subpoint()
        return (sp.at(t) - self.centroid_topos.at(t)).distance().km

    distance.step_days = 1 / (24 * 60 * 60)


def convert_datetime_to_str(t):
    return t.astimezone(timezone('Asia/Singapore')).strftime("%Y/%m/%d, %H:%M:%S")


def run_program():
    # TODO: Put in storage that is more permanent?
    satellites_url = 'http://celestrak.com/NORAD/elements/resource.txt'
    satellites = load.tle(satellites_url)
    # get Teleos 1 satellite, which resides in a LEO
    satellite = satellites['TELEOS 1']
    ts = load.timescale()
    time_step = 60  # in seconds
    field_of_regard = 536000 * math.tan(math.radians(40))  # 449757.402311
    field_of_view = 40250  # assume diameter = 80500m * 80500m
    start_time = ts.from_datetime(datetime.utcfromtimestamp(int(sys.argv[1]) / 1000).replace(tzinfo=utc))
    end_time = ts.from_datetime(datetime.utcfromtimestamp(int(sys.argv[2]) / 1000).replace(tzinfo=utc))
    center_x, center_y = float(sys.argv[3]), float(sys.argv[4])
    center_topos = Topos(longitude_degrees=center_x, latitude_degrees=center_y)
    query = SatelliteQuery(satellite, center_topos)
    min_times, min_dist = find_minima(start_time, end_time, query.distance)
    output = {'range': {"start": convert_datetime_to_str(start_time), "end": convert_datetime_to_str(end_time)},
              'error': "", 'events': []}
    radius = float(sys.argv[5])
    if radius > field_of_view:
        output['error'] = "Area of Interest exceeds Field of View."
    else:
        # populate event list
        # TODO: add lon/lat of subpoint
        event_list = []
        for t, d in zip(min_times, min_dist):
            # if d < field_of_regard - radius:
            event_list.append({
                "time": convert_datetime_to_str(t),
                "distance": d
            })
        output['events'] = event_list
    print(json.dumps(output))
    sys.stdout.flush()


if __name__ == "__main__":
    run_program()
