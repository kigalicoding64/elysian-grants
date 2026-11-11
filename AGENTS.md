<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep scan normalization in a browser-safe validation module and persist both manual and batch results in the existing review table, so review work survives refreshes.
- Use authenticated, role-checked sync functions and at most six concurrent outbound reads, so scans respect authorization and the published runtime's connection budget.
- Public content loaders use shared query options and paginated publishable-client server reads, so real listings and guide text render during SSR without exposing privileged credentials.
- The TanStack sitemap handler is the sole sitemap source; use page-specific publication/change dates or omit lastmod, so generated dates never misrepresent content freshness.
