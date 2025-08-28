
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, MapPin, CreditCard, Star, Loader2 } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { formatCurrency } from "@/utils/orderUtils";

const CustomerInsights = () => {
  const { customerInsights, topCustomers, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Statistiques clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[200px]">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Meilleurs clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[200px]">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const customerStats = [
    {
      title: "Clients actifs",
      value: customerInsights?.activeCustomers?.toString() || "0",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Panier moyen",
      value: formatCurrency(customerInsights?.averageOrderValue || 0),
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Note moyenne",
      value: `${customerInsights?.averageRating || 0}/5`,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Rétention",
      value: `${customerInsights?.retentionRate || 0}%`,
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const demographics = customerInsights?.demographics || [
    { age: "18-25", percentage: 0, count: 0 },
    { age: "26-35", percentage: 0, count: 0 },
    { age: "36-45", percentage: 0, count: 0 },
    { age: "46-55", percentage: 0, count: 0 },
    { age: "55+", percentage: 0, count: 0 },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Customer Stats */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Statistiques clients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {customerStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <span className="text-sm text-gray-600">{stat.title}</span>
                </div>
                <span className="font-semibold text-gray-900">{stat.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Répartition par âge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {demographics.map((demo, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{demo.age} ans</span>
                  <span className="font-medium">{demo.percentage}% ({demo.count})</span>
                </div>
                <Progress value={demo.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <div className="lg:col-span-2">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Meilleurs clients</CardTitle>
            <CardDescription>
              Clients avec le plus de commandes et de dépenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!topCustomers || topCustomers.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">Aucun client enregistré</p>
                  <p className="text-xs mt-1">Les données clients apparaîtront ici une fois que vous aurez des commandes</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(customer.totalSpent)}</p>
                      <p className="text-sm text-gray-500">{customer.orderCount} commandes</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerInsights;
