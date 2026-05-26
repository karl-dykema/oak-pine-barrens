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
          soils across the Great Lakes region. They are defined by a sparse, savanna-like canopy of
          black oak (<em>Quercus velutina</em>) and jack pine (<em>Pinus banksiana</em>) over an
          open ground layer of native grasses, sedges, lichens, and wildflowers. Without periodic
          fire, these systems succeed to closed-canopy forest within a few decades, eliminating the
          specialized species that depend on open, sunny conditions.
        </p>

        <h2>Fire Dependence</h2>
        <p>
          Historically, barrens were maintained by natural lightning fires and Indigenous burning
          practices that kept canopy cover low and bare sand exposed. Today, most barrens remnants
          require active management — primarily prescribed fire — to maintain their ecological
          character. This project uses prescribed burning as the primary restoration tool, combined
          with mechanical removal of invasive shrubs such as glossy buckthorn
          (<em>Frangula alnus</em>).
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
          Eastern box turtles (<em>Terrapene carolina</em>) use oak-pine barrens for nesting, foraging,
          and overwintering. The dry, sandy soils are ideal nesting substrate, and the diverse ground
          layer provides food resources throughout the active season. This species is experiencing
          range-wide population declines, and maintaining connected, fire-maintained barrens is
          critical for its persistence in Michigan.
        </p>

        <h2>LSFSC Internship Context</h2>
        <p>
          This project is supported by a 2026 internship through the Lake States Forest Stewardship
          Center (LSFSC), a regional program that places emerging conservation professionals on
          working landscapes to develop skills in ecological restoration, fire management, and
          community science. Karl Dykema and Emily Guyot are leading the field work under the
          guidance of LSFSC Program Director Stuart Goldman and site host Rod Denning.
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
