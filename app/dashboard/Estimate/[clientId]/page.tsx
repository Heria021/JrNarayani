"use client"
import { useParams } from 'next/navigation';
import EstimateForm, { EstimateData } from './_components/GenerateEstimate';
import { Id } from '@/convex/_generated/dataModel';
import { useState } from 'react';
import PreviewEstimate from './_components/PreviewEstimate';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookUserIcon, FileTextIcon, EyeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const EstimatePage = () => {
  const [estimateData, setEstimateData] = useState<Id<'estimate'> | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  const handleGenerateInvoice = (data: Id<'estimate'>) => {
    setEstimateData(data);
    setActiveTab('preview');
  };

  const { clientId } = useParams<{ clientId: Id<'client'> }>();

  return (
    <div className=" bg-background">
      {/* Header */}
      {/* <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <img
                src="/images/NT.png"
                alt="Narayani Traders Logo"
                className="w-16 h-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Narayani Traders</h1>
                <p className="text-sm text-muted-foreground">Granite, Marble, Chemical and Building Materials</p>
              </div>
            </div>
            <Link href="/dashboard/Client">
              <Button variant="outline" className="gap-2">
                <BookUserIcon className="w-5 h-5" />
                <span>Search Estimate</span>
              </Button>
            </Link>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('form')}
                className={cn(
                  "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === 'form'
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                )}
              >
                <FileTextIcon className={cn(
                  "mr-2 h-5 w-5",
                  activeTab === 'form' ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                Create Estimate
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={cn(
                  "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === 'preview'
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted",
                  !estimateData && "opacity-50 cursor-not-allowed"
                )}
                disabled={!estimateData}
              >
                <EyeIcon className={cn(
                  "mr-2 h-5 w-5",
                  activeTab === 'preview' ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                Preview Estimate
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'form' ? (
              <EstimateForm clientId={clientId} onGenerateInvoice={handleGenerateInvoice} />
            ) : (
              estimateData && <PreviewEstimate estimateId={estimateData} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default EstimatePage;
