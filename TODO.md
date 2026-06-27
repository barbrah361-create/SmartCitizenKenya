# TODO - SmartCitizenKenya sync/profile/images/logo

- [ ] Update client-side profile update endpoint + wire correct handler into Dashboard (currently seems to call a different path).
- [ ] Ensure “synchronize profile/central server update” alert is fixed by aligning frontend fetch URL with backend Express routes.
- [ ] Replace any placeholder/remote images used in ServiceApplication and seed data that show non-Kenyan/white visuals with local images from `src/image/*` (keep car image only).
- [ ] Ensure header logo uses the same logo image/component everywhere.
- [ ] Add a brief verification step: run app + manually test profile update and image rendering.

