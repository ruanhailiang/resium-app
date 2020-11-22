import json
import sys
from datetime import datetime

from pytz import timezone
from skyfield.api import Topos, load, EarthSatellite, utc

ts = load.timescale()
line1 = '1 25544U 98067A   14020.93268519  .00009878  00000-0  18200-3 0  5082'
line2 = '2 25544  51.6498 109.4756 0003572  55.9686 274.8005 15.49815350868473'
satellite = EarthSatellite(line1, line2, 'ISS (ZARYA)', ts)

# centroidTopos = Topos('40.8939 N', '83.8917 W')

# https://rhodesmill.org/skyfield/time.html
startTime = datetime.utcfromtimestamp(int(sys.argv[1]) / 1000).replace(tzinfo=utc)
endTime = datetime.utcfromtimestamp(int(sys.argv[2]) / 1000).replace(tzinfo=utc)

centroidX, centroidY = sys.argv[3], sys.argv[4]
centroidTopos = Topos(latitude=float(centroidY.strip('"')), longitude=float(centroidX.strip('"')))

t0 = ts.from_datetime(startTime)
t1 = ts.from_datetime(endTime)
t, events = satellite.find_events(centroidTopos, t0, t1, altitude_degrees=30.0)

# TODO: Dont hardcode to sg
output = {}
sgt = timezone('Asia/Singapore')
output['range'] = {"start": str(startTime), "end": str(endTime)}
event_list = []
for ti, event in zip(t, events):
    name = ('rise above 30°', 'culminate', 'set below 30°')[event]
    event_list.append({
        "time": ti.astimezone(sgt).strftime('%Y %b %d %H:%M:%S'),
        "name": name
    })
output['events'] = event_list

print(json.dumps(output))
sys.stdout.flush()
