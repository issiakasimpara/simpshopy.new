
import DashboardLayout from "@/components/DashboardLayout";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import KPICards from "@/components/analytics/KPICards";
import AnalyticsTabs from "@/components/analytics/AnalyticsTabs";
import QuickActions from "@/components/analytics/QuickActions";

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <AnalyticsHeader />
        <KPICards />
        <AnalyticsTabs />
        <QuickActions />
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
