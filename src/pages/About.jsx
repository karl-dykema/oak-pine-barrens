export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-pine-900 mb-6">
        About the Project
      </h1>

      <article className="prose prose-bark max-w-none">
        <h2>Oak-Pine Barrens Ecology</h2>
        <p>
          Oak-pine barrens are fire-dependent ecosystems found on well-drained, nutrient-poor sandy
          soils across the Great Lakes region. In Newaygo County, the characteristic overstory
          species are black oak (<em>Quercus velutina</em>), white oak (<em>Quercus alba</em>),
          and eastern white pine (<em>Pinus strobus</em>), growing in an open, savanna-like
          structure over a diverse ground layer of native grasses, sedges, lichens, and
          wildflowers. Without periodic fire, these systems succeed to closed-canopy forest within
          a few decades — canopy cover closes, bare sand disappears, and the specialized plants and
          animals that define barrens habitat are lost.
        </p>

        <h2>Logging History</h2>
        <p>
          The landscape around this site was profoundly shaped by two waves of industrial logging.
          Beginning in the 1860s and peaking through the 1870s and 1880s, Newaygo County was at
          the center of Michigan's white pine boom. Massive white pines were felled and floated
          down the Muskegon River to mills at Muskegon, then shipped to Chicago and other markets —
          much of the lumber going to rebuild Chicago after the Great Fire of 1871. By the late
          1880s, the pine was effectively gone. A second wave followed in the early 1900s as loggers
          returned for the remaining hardwoods, including the oaks. By roughly 1910, the county's
          forests had been largely stripped. The cutover lands that remained — abandoned by failed
          homesteaders on the sandy, infertile soils — are the origin of today's barrens remnants.
          Fire, both accidental and intentional, shaped these post-logging landscapes for decades
          before 20th-century fire suppression allowed them to grow back in.
        </p>

        <h2>Fire Dependence</h2>
        <p>
          Historically, barrens were maintained by natural lightning fires and Indigenous burning
          practices that kept canopy cover low and bare sand exposed. Today, most barrens remnants
          require active management — primarily prescribed fire — to maintain their ecological
          character. This project uses prescribed burning as the primary restoration tool, combined
          with targeted removal of encroaching woody vegetation. On this site, the main management
          challenge is black cherry (<em>Prunus serotina</em>) sapling recruitment in the
          openings — aggressive sprout growth that shades out lupine and other light-demanding
          ground-layer species if left unchecked.
        </p>

        <h2>Karner Blue Butterfly</h2>
        <p>
          The Karner blue butterfly (<em>Lycaeides melissa samuelis</em>) is a federally endangered
          species that depends entirely on wild lupine (<em>Lupinus perennis</em>) for larval
          development. Lupine is an obligate plant of oak-pine barrens and oak savanna — it grows
          in the open, sandy gaps that fire maintains. Restoring barrens structure directly benefits
          Karner blue populations by expanding lupine habitat and creating the bare sand and open
          vegetation structure adults and larvae require.
        </p>

        <h2>Eastern Box Turtle</h2>
        <p>
          Eastern box turtles (<em>Terrapene carolina</em>) use oak-pine barrens for nesting,
          foraging, and overwintering. The dry, sandy soils are ideal nesting substrate, and the
          diverse ground layer provides food resources throughout the active season. This species
          is experiencing range-wide population declines, and maintaining connected,
          fire-maintained barrens is critical for its persistence in Michigan.
        </p>

        <h2>LSFSC Internship Context</h2>
        <p>
          This project is supported by a 2026 internship through the Lake States Fire Science
          Consortium (LSFSC), a regional program funded by the Joint Fire Science Program and
          administered through The Ohio State University. LSFSC connects fire-dependent ecosystem
          research with on-the-ground management across the Lake States region. Karl Dykema and
          Emily Guyot are leading the field work with support from project advisors Rod Denning,
          Stuart Goldman, Jacob Lemon, and Tyler Bassett.
        </p>

        <h2>Forest Management Plan</h2>
        <p>
          A full forest management plan for the property is available on request. The plan outlines
          management objectives, burn unit prescriptions, monitoring protocols, and a 10-year
          action schedule.{' '}
          <a href="#" className="text-pine-600 hover:text-pine-800">
            View the management plan (Google Drive) →
          </a>
        </p>
      </article>
    </div>
  )
}
