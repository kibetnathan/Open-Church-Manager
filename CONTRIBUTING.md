# Contributing to Open Church Management

Thanks for your interest in contributing to OCM! This document outlines how to get involved and maintain consistency across the codebase.

## Getting Started

### Prerequisites

- **Backend**: Python 3.12+, Django 6.x, DRF (Django REST Framework)
- **Frontend**: Node.js 20.19+, React 19+, Vite 7
- **Services**: Firebase/Firestore, Cloudinary, Paystack (their secrets must be set in `backend/.env` or the backend will not start)

### Setup

The quickest path is the Docker stack — it runs Postgres, the Django backend, and the Vite frontend with hot reload:

```bash
# create these locally (they are gitignored, no committed .env.example exists)
# see README §Getting Started for the required variables
touch backend/.env frontend/.env
# place the Firebase service account key at backend/firebase-key.json
make dev                                # http://localhost:5174
make logs                               # follow container logs
```

Manual setup:

#### Backend

```bash
git clone https://github.com/yourusername/ocm.git
cd ocm/backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend

```bash
cd ocm/frontend
npm install
# create .env per the README; VITE_API_URL must point at http://localhost:8000/api
npm run dev
```

`backend/.env`, `frontend/.env`, and `backend/firebase-key.json` are gitignored and required locally (fill in per README §Getting Started; also set `VITE_API_URL=http://localhost:8000/api` in `frontend/.env`, or API calls silently target the production backend). Without `backend/firebase-key.json` the backend still boots, but API auth fails per request.

## Development Workflow

### Branching

- Long-lived branches are `main` and `develop`. Create feature branches off `develop`.
- Use short, prefixed names that match the existing convention (e.g. `nk/<feature-slug>`).

### Commits

- Commits use `Type(Scope): Subject` with no emojis.
- Examples from this repo:
  - `Feat(SEO): Create a sitemap`
  - `Fix(Dependencies): update requirements.txt`
  - `Polish(UI): Fix contrast on the hero section`
  - `Docs(API): Document the API endpoints with drf swagger`

### Pull Requests

- Reference the issue number in your PR title: `#123: Add verse memorization spaced repetition`
- Provide context: what changed, why, and any breaking changes
- Request review from maintainers

## Code Standards

### Backend (Django/DRF)

**Structure**

- Use ViewSets with custom actions for non-standard endpoints
- Leverage `select_related` and `prefetch_related` for query optimization
- Custom authentication via `FirebaseAuthentication` backend

**Serializers**

- Keep serializers focused; create nested serializers for related data
- Validate at the serializer level, not the view
- Use `SerializerMethodField` sparingly; prefer explicit methods

**Views/Viewsets**

```python
class SermonViewSet(viewsets.ModelViewSet):
    queryset = Sermon.objects.select_related('speaker').prefetch_related('tags')
    serializer_class = SermonSerializer
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def mark_watched(self, request, pk=None):
        # Custom action logic
        pass
```

**Firebase Integration**

- Use Firebase Auth tokens via `FirebaseAuthentication`
- Always fetch user context from `request.user` (Firebase UID)
- Don't hardcode Firebase config; use environment variables

### Frontend (React/Vite)

**State Management**

- Use Zustand stores for global state
- Flat store structure; avoid deeply nested reducers
- Return `{ success, error }` from mutations
- Access auth token: `useAuthStore.getState().token`

```javascript
// Store pattern
const useMainStore = create((set) => ({
  items: [],
  loading: false,

  fetchItems: async () => {
    set({ loading: true });
    try {
      const data = await api.getItems();
      set({ items: data, error: null });
      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { error: err.message };
    } finally {
      set({ loading: false });
    }
  },
}));
```

**Styling**

- Use Tailwind CSS with arbitrary value syntax
- Dark theme: `bg-[#0f0f0d]` for cards
- Color palette: amber/stone tones, no gradients
- Hazard stripe borders for emphasis: `border-l-4 border-amber-500`

**Components**

- Keep components small and focused
- Extract logic into custom hooks
- Use TypeScript for type safety (recommended)

**Firebase Realtime Features**

- Room ID naming: `fellowship_`, `leadership_`, `department_`, `course_` prefixes
- Set up listeners in `useEffect`; clean up to prevent memory leaks
- Example room: `fellowship_worship_team`

### General

- No console errors in production builds
- Write comments for non-obvious logic
- Keep functions under 30 lines where possible
- Use meaningful variable names

## Testing

### Backend

```bash
python manage.py test
# or with coverage
coverage run --source='.' manage.py test
coverage report
```

Test suites live in `userapp/tests.py`, `communication/tests.py`, and `mainapp/tests/`.

### Frontend

There is currently **no test suite** — `package.json` only has `dev`, `build`, `lint`, and `preview` scripts.

```bash
npm run lint
```

- Run the linter after frontend changes

## Common Tasks

### Adding a New API Endpoint

1. Create a model (if needed)
2. Create a serializer
3. Create a ViewSet with proper `select_related`/`prefetch_related`
4. Register in `urls.py` via `DefaultRouter`
5. Add tests
6. Document in API schema (`drf-spectacular`)

### Adding a Firebase Realtime Feature

1. Define room ID prefix convention
2. Set up Firestore listener in component `useEffect`
3. Clean up listener in cleanup function
4. Bind Zustand store updates
5. Test for memory leaks with React DevTools Profiler

### Updating Dependencies

- Backend: `pip install --upgrade -r requirements.txt` then `pip freeze > requirements.txt`
- Frontend: `npm update` and test thoroughly
- Create a PR documenting why the upgrade is needed

## Performance Guidelines

- Use `select_related` for one-to-one/foreign key relationships
- Use `prefetch_related` for many-to-many/reverse foreign keys
- Avoid N+1 queries; inspect with Django Debug Toolbar
- Paginate large result sets (100+ items)
- Memoize expensive React computations with `useMemo`
- Cache API responses where appropriate (e.g., Bible data with `sessionStorage`)

## Reporting Issues

- Use GitHub Issues with descriptive titles
- Include steps to reproduce
- Attach error logs or screenshots
- Note your environment (OS, Node/Python versions, browser)

## Getting Help

- Check existing issues and PRs first
- Ask in the project's discussion board or Slack
- Reach out to maintainers for architectural questions

## Code of Conduct

- Be respectful and inclusive
- No spam, harassment, or discrimination
- Focus on the code, not the person
- Help others succeed

## License

By contributing, you agree your work is licensed under the project's license (check LICENSE file).

---

Thanks for making OCM better! 🙏

