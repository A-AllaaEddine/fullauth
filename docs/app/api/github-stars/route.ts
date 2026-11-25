const repositoryUrl = 'https://api.github.com/repos/A-AllaaEddine/fullauth';

export const dynamic = 'force-dynamic';

export async function GET() {
  let stars: number | null = null;
  try {
    const response = await fetch(repositoryUrl, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'FullAuth-website',
      },
      next: { revalidate: 21600 },
    });
    if (response.ok) {
      const repository: unknown = await response.json();
      if (typeof repository === 'object' && repository !== null && 'stargazers_count' in repository) {
        const count = (repository as { stargazers_count?: unknown }).stargazers_count;
        if (typeof count === 'number' && Number.isSafeInteger(count) && count >= 0) stars = count;
      }
    }
  } catch {
    // Keep the UI's GitHub link usable when the API is offline or rate-limited.
  }
  return Response.json({ stars }, {
    headers: { 'Cache-Control': 'public, max-age=60, s-maxage=21600, stale-while-revalidate=86400' },
  });
}
