import { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/public/Dashboard';
import { BookManager } from './components/admin/BookManager';
import { CategoryManager } from './components/admin/CategoryManager';
import { ItemManager } from './components/admin/ItemManager';
import { BookView } from './components/public/BookView';
import { ReadingView } from './components/public/ReadingView';
import { Search } from './components/public/Search';
import { storage } from './services/storage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Navigation State
  // view: 'list' (dashboard/books list), 'book' (single book), 'item' (reading view)
  const [view, setView] = useState<{ type: 'list' | 'book' | 'item', id?: string }>({ type: 'list' });

  // Initialize Storage (Seed)
  useEffect(() => {
    storage.init();
  }, []);

  // Handle Tab Switch
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setView({ type: 'list' }); // Reset view when switching top-level tabs
  };

  // Render Logic
  const renderContent = () => {
    if (activeTab === 'dashboard') {
      if (view.type === 'book' && view.id) {
        return <BookView bookId={view.id} onNavigate={(type, id) => setView({ type, id })} onBack={() => setView({ type: 'list' })} />;
      }
      if (view.type === 'item' && view.id) {
        return <ReadingView itemId={view.id} onBack={() => {
          // Need to know where we came from? Ideally 'book' view of the item's book
          const item = storage.getItem(view.id!);
          if (item) setView({ type: 'book', id: item.bookId });
          else setView({ type: 'list' });
        }} onNavigate={(id) => setView({ type: 'item', id })} />;
      }
      return <Dashboard onNavigate={(type, id) => setView({ type, id })} />;
    }

    if (activeTab === 'books') {
      // Similar to dashboard logic or just a list of all books
      if (view.type === 'book' && view.id) {
        return <BookView bookId={view.id} onNavigate={(type, id) => setView({ type, id })} onBack={() => setView({ type: 'list' })} />;
      }
      if (view.type === 'item' && view.id) {
        return <ReadingView itemId={view.id} onBack={() => {
          const item = storage.getItem(view.id!);
          if (item) setView({ type: 'book', id: item.bookId });
          else setView({ type: 'list' });
        }} onNavigate={(id) => setView({ type: 'item', id })} />;
      }
      // Simple Book List for 'Books' tab
      return <Dashboard onNavigate={(type, id) => setView({ type, id })} />; // Reusing Dashboard for now as it lists books per category
    }

    if (activeTab === 'search') {
      if (view.type === 'item' && view.id) {
        return <ReadingView itemId={view.id} onBack={() => setView({ type: 'list' })} onNavigate={(id) => setView({ type: 'item', id })} />;
      }
      return <Search onNavigate={(type, id) => setView({ type, id })} />;
    }

    if (activeTab === 'admin') {
      return (
        <div className="space-y-12">
          <CategoryManager />
          <hr className="border-slate-200 dark:border-slate-800" />
          <BookManager />
          <hr className="border-slate-200 dark:border-slate-800" />
          <ItemManager />
        </div>
      );
    }

    return <div>Select a tab</div>;
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </Layout>
  );
}

export default App;
