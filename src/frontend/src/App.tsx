import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumeProvider, useResumeStore } from "@/context/ResumeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
/**
 * App.tsx — Router configuration + provider wrappers.
 * Contains ONLY routing and provider setup — no page logic.
 */
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Toaster } from "sonner";

// ─── Lazy-loaded pages ─────────────────────────────────────────────────────
const FormPage = lazy(() => import("@/pages/FormPage"));
const ResultsPage = lazy(() => import("@/pages/ResultsPage"));
const PreviewPage = lazy(() => import("@/pages/PreviewPage"));

// ─── Page loading fallback ─────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="w-full space-y-4 py-8">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

// ─── Root layout — wraps all routes in Layout shell ──────────────────────────────
function RootComponent() {
  return (
    <Layout showSteps={true}>
      <Outlet />
    </Layout>
  );
}

// ─── Route definitions ────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: RootComponent });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <FormPage />
    </Suspense>
  ),
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <ResultsPage />
    </Suspense>
  ),
});

const previewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/preview",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PreviewPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  resultsRoute,
  previewRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── Query client ────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      retry: 1,
    },
  },
});

// ─── Root app ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ResumeProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </ResumeProvider>
    </QueryClientProvider>
  );
}
