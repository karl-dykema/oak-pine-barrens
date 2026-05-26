// Deploy this to Cloudflare Workers (cloudflare.com → Workers & Pages → Create Worker).
// After pasting this code, go to Settings → Variables and add three env vars:
//   GITHUB_CLIENT_ID     — from your GitHub OAuth App (Settings → Developer settings → OAuth Apps)
//   GITHUB_CLIENT_SECRET — from your GitHub OAuth App
//   APP_URL              — https://karl-dykema.github.io/oak-pine-barrens/

export default {
  async fetch(req, env) {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    if (!code) return new Response('Missing code', { status: 400 })

    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id:     env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const data = await res.json()
    if (!data.access_token) return new Response('Auth failed: ' + JSON.stringify(data), { status: 400 })

    return Response.redirect(`${env.APP_URL}#token=${data.access_token}`, 302)
  },
}
