"""Prepare Natural Earth 1:110m, with Crimea attributed to Ukraine.
Usage: python3 scripts/prepare-map.py /path/to/ne_110m_admin_0_countries.geojson
Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson
License: public domain. The explicit geographic selection below fails closed if source topology changes.
"""
import json,sys
from pathlib import Path
p=json.loads(Path(sys.argv[1]).read_text())
fs=[]
for f in p['features']:
 d=f['properties']
 if d['CONTINENT']=='Europe' or d['ADMIN'] in ['Turkey','Cyprus','Georgia','Armenia','Azerbaijan']:
  f['properties']={k:d.get(k) for k in ['ADMIN','ADM0_A3','NAME_RU','NAME_DE','CONTINENT']};fs.append(f)
r=next(f for f in fs if f['properties']['ADM0_A3']=='RUS')
u=next(f for f in fs if f['properties']['ADM0_A3']=='UKR')
crimea=[poly for poly in r['geometry']['coordinates'] if all(32<x<37 and 44<y<47 for x,y in poly[0])]
assert len(crimea)==1,'Review source topology: expected exactly one Crimea polygon'
r['geometry']['coordinates'].remove(crimea[0])
u['geometry']={'type':'MultiPolygon','coordinates':[u['geometry']['coordinates'],crimea[0]]}
Path('public/data/europe.geojson').write_text(json.dumps({'type':'FeatureCollection','features':fs},ensure_ascii=False,separators=(',',':')))
