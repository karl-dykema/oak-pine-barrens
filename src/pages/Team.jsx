import teamData from '../../data/team.json'

function initials(name) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

function TeamCard({ member }) {
  return (
    <div className="rounded-lg border border-bark-200 bg-white p-6 shadow-sm flex gap-5">
      {/* Avatar */}
      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-pine-100 border border-pine-200 flex items-center justify-center">
        <span className="font-serif text-lg font-semibold text-pine-700">
          {initials(member.name)}
        </span>
      </div>
      {/* Content */}
      <div className="min-w-0">
        <h2 className="font-serif text-lg font-semibold text-pine-900 leading-snug">
          {member.name}
        </h2>
        <p className="text-sm font-sans font-medium text-sand-700 mb-1">
          {member.title}
          {member.org && ` — ${member.org}`}
        </p>
        <p className="text-sm font-sans text-bark-600 leading-relaxed">{member.bio}</p>
        {member.links?.length > 0 && (
          <div className="mt-2 flex gap-3">
            {member.links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                 className="text-sm text-pine-600 hover:text-pine-800 underline font-sans">
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Team() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-pine-900 mb-2">
        Project Team
      </h1>
      <p className="text-bark-500 font-sans text-sm mb-8">
        The people restoring oak-pine barrens habitat in Newaygo County, Michigan.
      </p>
      <div className="flex flex-col gap-5">
        {teamData.map((member) => (
          <TeamCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  )
}
