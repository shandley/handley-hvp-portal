// History of the virome: a first-pass timeline. Every date and attribution was
// researched against the primary literature via PubMed and CrossRef, with contested
// points flagged, not written from memory. Displayed DOIs in HISTORY_BIB are verified.

export type HistoryEra = { key: string; name: string; span: string; color: string };
export type HistoryEvent = {
  era: string;
  year: string;
  title: string;
  desc: string;
  cite: string;
  flag?: string;
};
export type HistoryRef = { ref: string; doi: string };

export const HISTORY_ERAS: HistoryEra[] = [
  { key: "e1", name: "Origins", span: "1890s", color: "#0072B2" },
  { key: "e2", name: "The phage era", span: "1915 to 1945", color: "#009E73" },
  { key: "e3", name: "Molecules and classification", span: "1939 to 1985", color: "#E69F00" },
  { key: "e4", name: "The environmental turn", span: "1989 to 2006", color: "#56B4E9" },
  { key: "e5", name: "The human virome", span: "2010 to present", color: "#CC79A7" },
];

export const HISTORY_EVENTS: HistoryEvent[] = [
  { era: "e1", year: "1892", title: "A filterable agent",
    desc: "Ivanovsky shows sap from mosaic-diseased tobacco stays infectious after passing filters that stop all known bacteria.",
    cite: "via Bos 1999, Phil Trans R Soc B",
    flag: "Priority vs Beijerinck is contested; Ivanovsky read it within germ theory." },
  { era: "e1", year: "1898", title: "The virus concept",
    desc: "Beijerinck argues the tobacco agent is a new kind of self-multiplying, non-cellular entity, a contagium vivum fluidum.",
    cite: "via Bos 1999, Phil Trans R Soc B" },
  { era: "e1", year: "1898", title: "Viruses of animals",
    desc: "Loeffler and Frosch find the agent of foot-and-mouth disease is also filterable, extending the idea from plants to animals.",
    cite: "via Brown 2003, Virus Res" },
  { era: "e2", year: "1915", title: "A transmissible lysis",
    desc: "Twort describes a filterable agent that dissolves and can be passed between bacterial cultures.",
    cite: "Twort 1915, The Lancet" },
  { era: "e2", year: "1917", title: "The bacteriophage",
    desc: "d'Herelle independently finds an invisible microbe that clears bacterial lawns, names it bacteriophage, and invents the plaque assay.",
    cite: "via Billiau 2016; Summers 2017",
    flag: "Twort and d'Herelle priority is the classic dispute; treat as independent." },
  { era: "e2", year: "1935", title: "Viruses as molecules",
    desc: "Stanley crystallizes tobacco mosaic virus, bringing viruses into biochemistry; Bawden and Pirie soon show they are nucleoproteins.",
    cite: "Stanley 1935, Science" },
  { era: "e2", year: "1939", title: "One-step growth",
    desc: "Ellis and Delbruck resolve the phage life cycle into adsorption, a latent period, and a synchronous burst, making phage a precise model system.",
    cite: "Ellis and Delbruck 1939, J Gen Physiol" },
  { era: "e3", year: "1939", title: "Seeing a virus",
    desc: "Kausche, Pfankuch and Ruska publish the first electron micrographs of a virus, giving filterable agents a visible shape.",
    cite: "via Kruger 2000, The Lancet" },
  { era: "e3", year: "1952", title: "DNA is the genes",
    desc: "Hershey and Chase use radiolabeled phage to show that DNA, not protein, carries the genetic material.",
    cite: "Hershey and Chase 1952, J Gen Physiol" },
  { era: "e3", year: "1966", title: "Formal taxonomy",
    desc: "An international body is founded to build one universal virus classification.",
    cite: "via Adams et al. 2017, Arch Virol",
    flag: "Founded 1966 as the ICNV; the ICTV name dates to 1975." },
  { era: "e3", year: "1971", title: "The Baltimore scheme",
    desc: "Baltimore classifies all viruses by how their genome relates to mRNA, a mechanism-based scheme still used to read genomes today.",
    cite: "Baltimore 1971, Bacteriol Rev" },
  { era: "e3", year: "1976", title: "The first genome",
    desc: "Fiers and colleagues complete the RNA genome of bacteriophage MS2, the first full genome sequence of any replicon.",
    cite: "Fiers et al. 1976, Nature",
    flag: "MS2 is first; phiX174 (1977) is the first DNA genome, not the first genome." },
  { era: "e3", year: "1977", title: "phiX174 and Sanger",
    desc: "Sanger's group sequences the DNA phage phiX174, reveals overlapping genes, and introduces dideoxy sequencing.",
    cite: "Sanger et al. 1977, Nature and PNAS" },
  { era: "e4", year: "1989", title: "The ocean is full of viruses",
    desc: "Bergh and colleagues count up to 2.5 x 10^8 virus particles per mL of seawater, far more than anyone expected.",
    cite: "Bergh et al. 1989, Nature" },
  { era: "e4", year: "2002", title: "Viral metagenomics",
    desc: "Breitbart and Rohwer shotgun-sequence whole uncultured marine viral communities; most sequences match nothing in the databases.",
    cite: "Breitbart et al. 2002, PNAS" },
  { era: "e4", year: "2003", title: "The human gut virome",
    desc: "The same approach turns to human feces, founding the study of the human gut virome, a DNA-phage community of about 1,200 genotypes.",
    cite: "Breitbart et al. 2003, J Bacteriol" },
  { era: "e4", year: "2006", title: "The RNA side",
    desc: "Zhang and colleagues survey the human gut RNA virome and find it dominated by diet-derived plant viruses.",
    cite: "Zhang et al. 2006, PLoS Biology" },
  { era: "e5", year: "2010", title: "Personal and stable",
    desc: "Reyes and colleagues show the gut virome is highly individual and remarkably stable over time, unlike the bacterial community.",
    cite: "Reyes et al. 2010, Nature" },
  { era: "e5", year: "2011", title: "Diet shapes it",
    desc: "Minot and colleagues show a controlled diet shifts the gut virome, linking it to host physiology.",
    cite: "Minot et al. 2011, Genome Research" },
  { era: "e5", year: "2014", title: "crAssphage",
    desc: "A cross-assembly method uncovers crAssphage, hidden in plain sight as the most abundant virus in the human gut.",
    cite: "Dutilh et al. 2014, Nat Communications" },
  { era: "e5", year: "2020", title: "A taxonomy of realms",
    desc: "ICTV adopts a 15-rank, realm-based classification spanning the whole virosphere by genome and evolution.",
    cite: "Gorbalenya et al. 2020, Nat Microbiology" },
  { era: "e5", year: "2020-21", title: "Reference catalogs",
    desc: "GVD, MGV and GPD map tens to hundreds of thousands of gut viral genomes, closing the reference gap.",
    cite: "Gregory; Nayfach; Camarillo-Guerrero" },
  { era: "e5", year: "2021-23", title: "Caudovirales dissolved",
    desc: "ICTV abolishes the order Caudovirales and the morphology-based tailed-phage families in favor of genome-based classification.",
    cite: "Turner et al. 2023, Arch Virol",
    flag: "Proposed 2021, ratified 2022, published 2023." },
  { era: "e5", year: "2022-24", title: "The Human Virome Program",
    desc: "The NIH Common Fund launches a coordinated effort to map the healthy human virome across the body and lifespan.",
    cite: "NIH Common Fund",
    flag: "Program 2022, funding calls 2023 to 2024, first awards 2024." },
];

export const HISTORY_BIB: HistoryRef[] = [
  { ref: "Beijerinck's work on tobacco mosaic virus (Bos, Phil Trans R Soc B, 1999)", doi: "10.1098/rstb.1999.0420" },
  { ref: "The growth of bacteriophage (Ellis and Delbruck, J Gen Physiol, 1939)", doi: "10.1085/jgp.22.3.365" },
  { ref: "Independent functions of viral protein and nucleic acid (Hershey and Chase, J Gen Physiol, 1952)", doi: "10.1085/jgp.36.1.39" },
  { ref: "High abundance of viruses found in aquatic environments (Bergh et al., Nature, 1989)", doi: "10.1038/340467a0" },
  { ref: "Genomic analysis of uncultured marine viral communities (Breitbart et al., PNAS, 2002)", doi: "10.1073/pnas.202488399" },
  { ref: "A highly abundant bacteriophage in human faecal metagenomes (Dutilh et al., Nat Commun, 2014)", doi: "10.1038/ncomms5498" },
  { ref: "The new scope of virus taxonomy, 15 ranks and realms (Gorbalenya et al., Nat Microbiol, 2020)", doi: "10.1038/s41564-020-0709-x" },
  { ref: "Abolishment of morphology-based taxa, 2022 ICTV update (Turner et al., Arch Virol, 2023)", doi: "10.1007/s00705-022-05694-2" },
];
