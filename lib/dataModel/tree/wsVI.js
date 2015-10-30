module.exports = {
    units: "fraction",
    description: "An alterntative to _pfs_, wsVI, along with it's companion laVI defines the partitioning of foliage to stem [(WF/WS) fraction] in allocating aboveground biomass, using the volume index (VI).  VI=(diameter@22cm (cm))^2 * height (m). wsVI relates the Volume Index (VI), to woody biomass (WS), WS[g]=constant*VI^power.  WS/stems_per_stump is inverted to estimate VI for the tree",
    value: {
        stems_per_stump: {
            description: "Averge number of stems on each stump after coppicing",
            value: 2.8
        },
        constant: {
            units: "[g]",
            description: "Constant in relation of VI to WS",
            value: 161
        },
        power: {
            description: "Power in relation of VI to WS.",
            value: 0.854
        }
    }
};
