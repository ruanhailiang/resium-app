import json
import math
import sys
from datetime import datetime, timedelta

from skyfield.api import load, EarthSatellite, utc

ts = load.timescale()
line1 = '1 25544U 98067A   14020.93268519  .00009878  00000-0  18200-3 0  5082'
line2 = '2 25544  51.6498 109.4756 0003572  55.9686 274.8005 15.49815350868473'
satellite = EarthSatellite(line1, line2, 'ISS (ZARYA)', ts)
time_step = 60  # in seconds
field_of_regard = 536000 * math.tan(math.radians(40))  # 449757.402311
field_of_view = 40250  # assume diameter = 80500m * 80500m

# TODO: Check that radius of AOI is within field of view

# TODO: need haversine formula?
def distance(lat0, lon0, lat1, lon1):
    # number of metres in one degree
    deg_len = 110250
    x = lat0 - lat1
    y = (lon0 - lon1) * math.cos(math.radians(lat1))
    return deg_len * math.sqrt(x * x + y * y)


start_time = datetime.utcfromtimestamp(int(sys.argv[1]) / 1000).replace(tzinfo=utc)
end_time = datetime.utcfromtimestamp(int(sys.argv[2]) / 1000).replace(tzinfo=utc)
centerX, centerY = float(sys.argv[3]), float(sys.argv[4])
radius = float(sys.argv[5])

output = {}
output['range'] = {"start": str(start_time), "end": str(end_time)}

# populate event list
event_list = []
delta_seconds = round((end_time - start_time).total_seconds())
time_range = [start_time + timedelta(seconds=i) for i in range(0, delta_seconds + 1, time_step)]
ts_range = ts.from_datetimes(time_range)
geocentric = satellite.at(ts_range)
for t, geo in zip(time_range, geocentric):
    subpoint = geo.subpoint()
    d = distance(subpoint.longitude.degrees, subpoint.latitude.degrees, centerX, centerY)
    if d < field_of_regard - radius:
        event_list.append({
            "time": str(t),
            "lon": subpoint.longitude.degrees,
            "lat": subpoint.latitude.degrees
        })
output['events'] = event_list

print(json.dumps(output))
sys.stdout.flush()
