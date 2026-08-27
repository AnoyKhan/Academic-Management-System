# Frontend Audit Notes

## Scope Completed

- Fixed shared responsiveness problems in the dashboard shell, topbar, notification menu, tables, and route content wrappers.
- Improved accessibility with skip navigation, focus-visible styling, route error states, ARIA labels, menu/dialog semantics, table captions, and `aria-current` navigation.
- Added skeleton loaders and route-level loading fallbacks.
- Added reusable empty states and table empty-state support.
- Added 404 and 403 pages, plus a route error boundary page.
- Added animated dashboard transitions with reduced-motion support.
- Optimized performance by lazy-loading route pages and keeping chart-heavy dashboards out of the initial route module.
- Prepared API integration with a shared Axios client, request headers, auth token hook-in, and centralized endpoint constants.

## Final Project Structure

```txt
src/
  app/
    providers.jsx
  components/
    common/
      empty-state.jsx
      error-state.jsx
      module-placeholder.jsx
      performance-chart.jsx
      theme-toggle.jsx
    forms/
      form-field.jsx
      search-form.jsx
    layout/
      breadcrumbs.jsx
      notification-bell.jsx
      profile-dropdown.jsx
      sidebar.jsx
      topbar.jsx
    ui/
      badge.jsx
      button.jsx
      card.jsx
      input.jsx
      loader.jsx
      modal.jsx
      select.jsx
      table.jsx
  context/
    theme-context.jsx
    theme-context-value.js
  data/
    admin-portal-data.js
    ai-analytics-data.js
    dummy-auth.js
    role-dashboard.js
    student-portal-data.js
    teacher-portal-data.js
  hooks/
    useAppDispatch.js
    useAppSelector.js
    useTheme.js
  layouts/
    auth-layout.jsx
    dashboard-layout.jsx
  pages/
    admin/
    auth/
    common/
    student/
    teacher/
    error-boundary-page.jsx
    forbidden-page.jsx
    not-found-page.jsx
  routes/
    app-router.jsx
    protected-routes.jsx
    root-redirect.jsx
    route-paths.js
  services/
    api-endpoints.js
    auth.service.js
    dummy-auth.js
    http.js
  store/
  utils/
```

## Backend Integration Conventions

- Use `src/services/http.js` for all HTTP calls.
- Configure the backend URL with `VITE_API_URL`.
- Add new REST paths to `src/services/api-endpoints.js`.
- Keep mock data in `src/data/*` until the real API resource is ready.
- Move data fetching into small service functions per domain when backend endpoints are available, for example `student.service.js`, `teacher.service.js`, `analytics.service.js`.
- Preserve the UI state contract: loading uses `PageLoader` or skeleton components, no-data uses `EmptyState`, and failures use `ErrorState`.

## Recommended API Response Shape

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 120
  },
  "message": "OK"
}
```

## Accessibility Checklist

- Every icon-only button should have an `aria-label` or visible screen-reader text.
- Every data table should pass a `caption` when the surrounding heading is not enough.
- Empty lists should render `EmptyState` instead of blank panels.
- Keep keyboard focus visible and preserve the skip link in `DashboardLayout`.
- Avoid motion-only feedback; reduced-motion users receive near-instant transitions.

## Performance Checklist

- Route pages are lazy-loaded in `src/routes/app-router.jsx`.
- Keep chart libraries inside routed pages rather than shared shell modules.
- Prefer memoized/derived data near the data source once API state is introduced.
- Split especially large future dashboards into route-level or component-level chunks.
- Keep images in `public/` or compressed assets, and avoid importing unused media.

## Validation

Run these before delivery:

```bash
npm run lint
npm run build
```
