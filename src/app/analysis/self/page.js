import AppLayout from '../../../components/AppLayout';
import PageTransition from '../../../components/PageTransition';
import SelfAnalysisInterface from '../../../components/analysis/SelfAnalysisInterface';

export default function SelfAnalysisPage() {
  return (
    <PageTransition>
      <AppLayout title="自己内省と自己理解">
        <SelfAnalysisInterface />
      </AppLayout>
    </PageTransition>
  );
} 