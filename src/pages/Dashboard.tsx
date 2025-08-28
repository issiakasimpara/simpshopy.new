
import DashboardLayout from "@/components/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentOrders from "@/components/dashboard/RecentOrders";
import StoreStatus from "@/components/dashboard/StoreStatus";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="h-full p-2 sm:p-4">
        {/* Header avec gradient moderne */}
        <DashboardHeader />

        {/* Stats Cards avec design amélioré */}
        <DashboardStats />

        {/* Main Content Grid avec design modernisé */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <RecentOrders />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Store Status */}
            <StoreStatus />

            {/* Quick Actions */}
            <DashboardQuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
