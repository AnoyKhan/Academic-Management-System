import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "../context/theme-context";
import { store } from "../store";
import { appRouter } from "../routes/app-router";
import { DashboardSkeleton } from "../components/ui/loader";

export function AppProviders() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={appRouter} fallbackElement={<DashboardSkeleton />} />
        <Toaster
          position="top-right"
          toastOptions={{
            className:
              "border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
          }}
        />
      </ThemeProvider>
    </Provider>
  );
}
