import sys
import json
from datetime import datetime
from pytz import timezone
from skyfield.api import Topos, load, EarthSatellite

ymd = [int(x) for x in sys.argv[1:]]

ts = load.timescale()
line1 = '1 25544U 98067A   14020.93268519  .00009878  00000-0  18200-3 0  5082'
line2 = '2 25544  51.6498 109.4756 0003572  55.9686 274.8005 15.49815350868473'
satellite = EarthSatellite(line1, line2, 'ISS (ZARYA)', ts)

bluffton = Topos('40.8939 N', '83.8917 W')

# TODO: Get timezone from web app
# https://rhodesmill.org/skyfield/time.html
sgt = timezone('Asia/Singapore')
t0 = ts.from_datetime(sgt.localize(datetime(ymd[0], ymd[1], ymd[2])))
t1 = ts.from_datetime(sgt.localize(datetime(ymd[3], ymd[4], ymd[5])))
t, events = satellite.find_events(bluffton, t0, t1, altitude_degrees=30.0)

output = []
for ti, event in zip(t, events):
    name = ('rise above 30°', 'culminate', 'set below 30°')[event]
    output.append({
        "time": ti.astimezone(sgt).strftime('%Y %b %d %H:%M:%S'),
        "name": name
    })

print(json.dumps(output))
sys.stdout.flush()
