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

## Application structure
- Keep illustrative election data and geographic geometry in browser-safe data modules separate from reusable presentation components, so a future data provider can replace the fixtures without redesigning the interface.
- Use local static state geometry and SVG for the interactive Brazil map to avoid remote map dependencies and keep the initial page lightweight.
