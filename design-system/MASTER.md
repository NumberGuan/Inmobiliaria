# Design System: InmoVisión Master

Global source of truth for the InmoVisión real estate administrative panel and public catalog.

---

## 1. Core Visual Aesthetics
- **Style**: Statement Exaggerated Minimalism. Ultra-clean layouts, strong visual hierarchies, elegant font choices, and generous negative space.
- **Theme**: Premium dark mode support coupled with high-contrast, accessible light mode cards.
- **Palette**: Harmonious Deep Teal & Professional Slate Blue.
- **Rules**: Absolutely NO colored emojis in visual elements or navigation menus. All indicators must use lightweight, outline-style SVG vector icons.

---

## 2. Color Palette Tokens

| Role | Token Name | Light Value | Dark Value | Purpose |
|------|------------|-------------|------------|---------|
| Primary Teal | `--primary-teal` | `#0f766e` | `#14b8a6` | Headers, brand elements, active states |
| Brand Blue | `--brand-blue` | `#0284c7` | `#38bdf8` | CTA buttons, links, secondary badges |
| Background | `--bg-main` | `#f8fafc` | `#0b0f19` | Root viewport backdrop |
| Card BG | `--bg-card` | `#ffffff` | `#151e2f` | Dashboard modules, grid item wrappers |
| Text Primary | `--text-main` | `#0f172a` | `#f8fafc` | Primary titles, text copy, labels |
| Text Muted | `--text-muted` | `#475569` | `#94a3b8` | Subtitles, supporting details, meta-text |
| Borders | `--border-token` | `#e2e8f0` | `#1e293b` | Segment lines, table borders, input strokes |

---

## 3. Typography Pairings
- **Headings**: `Cinzel` (Google Font)
  - Ideal for establishing luxury, architecture, and real estate authority.
- **Body & Controls**: `Josefin Sans` or `Plus Jakarta Sans`
  - High geometric precision, highly legible at small sizes, sleek minimal curves.
- **Import Link**:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;500;600;700&display=swap');
  ```

---

## 4. Iconography Standards
- **Source**: Inline SVG Icons (Lucide/Heroicons standard outlines).
- **Stroke**: `2px` for bold, legible borders.
- **Hover Transitions**: `transition-all duration-200 ease-in-out` on all interactive links and SVG strokes.
- **Anti-patterns to Avoid**:
  - Emojis such as `🏡`, `💬`, `📅`, `⏳`, `🔒`, `⚠️` in cards or buttons.
  - Scale transforms that shift sibling elements (always use scale inside a hidden overflow container or opacity shifts instead).
