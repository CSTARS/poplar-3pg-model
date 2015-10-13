## kG 

kG is a modifier that primilarly drives the limiting factor that a high Vapor Pressure Deficit (VPD) has on the 
plant.  fVPD is defined as ```exp(-kG*VPD)```.  So, as ```kG``` decreases, the tree becomes less sensititive 
to high VPDs (as in the summer) and the productivity goes up.

kG also effects the canopy's transpiration, indirectly through the fVPD parameter.  When this value is high, then
canopy conductance approaches it's maximum value, and transpiration increases.  Typically this effect is less dramatic
in the transpiration estimates as compared to the effect fVPD directly has on the the productivity.

For Poplar trees, kG factors in the range of about 0.3 to 0.5 are expected ranges.

## Canopy Conductance (min,max,LAI)

Canopy Conductance influences the predicted transpiration.  

* The minimum value is rarely used, and can be left pretty much alone.
* The maximum value will affect the amount of water the trees need.  
* The LAI parameter 

A higher value means more water use.  This is because a higer value lowers the div

