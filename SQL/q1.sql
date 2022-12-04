SELECT ST_AsGeoJson(ST_AsText( ST_MakeLine(sp,ep) )) FROM
  
   (SELECT
      ST_PointN(geom, generate_series(1, ST_NPoints(geom)-1)) as sp,
      ST_PointN(geom, generate_series(2, ST_NPoints(geom)  )) as ep
    FROM
 
      (SELECT (ST_Dump(ST_Boundary(geom))).geom
       FROM borolekh where plot_no_en = 1
       ) AS linestrings
    ) AS segments;
	
	
	