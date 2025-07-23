import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";

import HomePage from "./pages/home-page.tsx";
import AuthPage from "./pages/auth-page.tsx";
import BrowseRpgs from "./pages/browse-rpgs.tsx";
import RpgDetails from "./pages/rpg-details.tsx";
import Rankings from "./pages/rankings.tsx";
import Forums from "./pages/forums.tsx";
import ForumThread from "./pages/forum-thread.tsx";
import AdminPanel from "./pages/admin-panel.tsx";
import ResetPasswordPage from "./pages/reset-password.tsx";
import { ProtectedRoute } from "./lib/protected-route.tsx";
import { AuthProvider } from "./hooks/use-auth.tsx";
import SubmitAdventure from "./pages/submit-adventure.tsx";
import AdminPhotos from "./pages/admin-photos.tsx";
import React, { Component, ReactNode, useEffect } from "react";
import { suppressNavigationErrors, setNavigationInProgress } from "./utils/navigation-guard";

// Error Boundary to catch and handle runtime errors
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Runtime error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-4">We encountered an unexpected error.</p>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/browse" component={BrowseRpgs} />
      <Route path="/rpg/:id" component={RpgDetails} />
      <Route path="/rankings" component={Rankings} />
      <Route path="/forums" component={Forums} />
      <Route path="/forum/thread/:id" component={ForumThread} />
      <ProtectedRoute path="/admin" component={AdminPanel} />
      <ProtectedRoute path="/admin/photos" component={AdminPhotos} />
      <Route path="/submit-adventure" component={SubmitAdventure} />
      <Route>
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'#f9fafb'}}>
          <div style={{maxWidth:'400px',padding:'2rem',backgroundColor:'white',borderRadius:'8px',boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)',textAlign:'center'}}>
            <h1 style={{fontSize:'1.5rem',fontWeight:'bold',marginBottom:'1rem',color:'#1f2937'}}>Page Not Found</h1>
            <p style={{color:'#6b7280',marginBottom:'1.5rem'}}>The page you're looking for doesn't exist.</p>
            <button onClick={() => window.location.href = '/'} style={{backgroundColor:'#3b82f6',color:'white',padding:'0.5rem 1rem',borderRadius:'4px',border:'none',cursor:'pointer'}}>Go Home</button>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  // Handle browser navigation events to prevent runtime errors
  useEffect(() => {
    // Initialize navigation error suppression
    const cleanupErrorSuppression = suppressNavigationErrors();
    
    const handleBeforeUnload = () => {
      // Clean up any pending operations
      try {
        queryClient.cancelQueries();
        setNavigationInProgress(false);
      } catch (error) {
        console.warn("Error cancelling queries on unload:", error);
      }
    };

    const handlePopState = (event: PopStateEvent) => {
      try {
        setNavigationInProgress(true);
        
        // If navigating back from auth page, ensure clean state
        if (event.state?.fromLoginPrompt) {
          // Give a small delay to allow auth state to settle
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ["/api/user"] });
            setNavigationInProgress(false);
          }, 100);
        } else {
          setTimeout(() => setNavigationInProgress(false), 100);
        }
      } catch (error) {
        console.error("Error handling browser navigation:", error);
        setNavigationInProgress(false);
      }
    };

    // Enhanced focus handling for tab switching
    const handleFocus = () => {
      try {
        // Reset navigation state when user returns to tab
        setTimeout(() => setNavigationInProgress(false), 100);
      } catch (error) {
        console.warn("Error handling focus event:", error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('focus', handleFocus);
      cleanupErrorSuppression();
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
