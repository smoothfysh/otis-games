---
name: kids-games
description: Configuration for Anushka's kids' educational games project
metadata:
  type: project
---

# Project Overview
This project contains four educational games for children: Shape Sorter, Color Splash, Otis Bird, and Shape Pop. The primary goals are:
- Ensure all games are visually appealing and age-appropriate
- Optimize layouts for both desktop and mobile devices
- Maintain interactive gameplay mechanics
- Prioritize kid-friendly color palettes and animations

**Most Important Updates (Must Be Applied to All Games):**
1. **Big Game Titles** - Made h1, h2, h3 headers 2.8x - 3x larger for better visibility on mobile
2. **Enhanced Back Button** - Now has:
   - Larger size (1.5rem)
   - Hover effects with scaling
   - Subtle background and border-radius
   - Better visual hierarchy
3. **Mobile Positioning Fixes** - Added:
   - `max-width: calc(100% - 64px)` to containers
   - `margin: 0 auto` for centering
   - Dynamic spacing calculations
   - Improved touch target sizes on mobile

**Game-Specific Status:**
- Shape Sorter: Mostly fixed but needs mobile touch improvements
- Shape Pop: Overlapping shapes in mobile view (needs merge fix)
- Color Splash: Needs vibrant color contrasts and layout fixes
- Otis Bird: Unmodified ✅

# Key Instructions
1. **Layout Prioritization**: 
   - Always optimize for responsive design
   - Use CSS media queries for mobile breakpoints (≤768px, ≤480px)
   - Avoid fixed positioning that causes element overlap

2. **Visual Enhancements**:
   - Use vibrant, contrasting colors (avoid pastels)
   - Implement subtle animations for feedback (e.g., chimes, particles)
   - Ensure text is legible at smaller sizes

3. **Gameplay Integrity**:
   - Never modify Otis Bird's core mechanics
   - Maintain educational value in all game mechanics
   - Randomize game elements where appropriate (e.g., shape/shadow order)

4. **Tool Usage**:
   - Prefer Edit tool for CSS/HTML changes
   - Use Read tool to verify file states before/after edits
   - Use Glob/Grep tools for codebase analysis when needed

5. **File Operation Best Practices**:
   - When an Edit operation fails with "Unsupported content type" or similar errors, STOP and investigate
   - Always use Read tool to verify file contents before and after edits
   - If an edit fails, do not retry the same operation - analyze why it failed first
   - Common causes: incorrect string matching, special characters needing escaping, or file encoding issues
   - When in doubt, read the file again to get the exact current state

# Persistent Configuration
- Color Palette: 
  - Coral: #FF6B6B
  - Teal: #4ECDC4
  - Sky Blue: #45B7D1
  - Mint: #96CEB4
  - Sunset Orange: #FFB74D
- Mobile Priorities: 
  - Touch-friendly hit areas (at least 48x48px)
  - Simplified UI on small screens
  - Optimized animation performance

# Common Pitfalls to Avoid
1. Never use fixed percentages for positioning that cause element overlap
2. Avoid complex interactions that aren't intuitive for children
3. Ensure all animations run smoothly on low-end devices
4. Never remove accessibility features (color contrast checks required)

# Current Status
- Shape Sorter: Layout fixed with randomized elements and improved spacing
- Color Splash: In review - needs vibrant color contrasts
- Otis Bird: Unmodified (core game is functional)
- Shape Pop: Needs layout adjustments similar to Shape Sorter

# Future Enhancements
- Implement strict accessibility checks (WCAG compliance)
- Add save/load functionality for progress tracking
- Create adaptive difficulty levels based on performance
- Add localization support for multiple languages
