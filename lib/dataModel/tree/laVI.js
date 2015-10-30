module.exports = {
    units: "fraction",
    description: "An alterntative to _pfs_, laVI, along with wsVI defines the partitioning of foliage to stem [(WF/WS) fraction] in allocating aboveground biomass using the volume index (VI).  VI=(Basal area * stem height).  laVI predicts the leaf area given a (VI). Along with SLA, the total foliage is calculated  WF = SLA*LeafArea where LeafArea= constant*(VI)^power.",
    value: {
      constant: {
          units: "[m^2]",
          description: "constant in leaf_area=constant*VI^power.  If this is not=0, then these functions will be used, otherwise the pfs functions are used.",
          value: 0
      },
        power: {
            description: "power in leaf_area= constant*VI^power ",
            value: 0
        },
    }
};
