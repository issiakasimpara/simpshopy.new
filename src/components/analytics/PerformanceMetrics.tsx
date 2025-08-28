
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, ShoppingBag, CreditCard, Loader2 } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { formatCurrency } from "@/utils/orderUtils";

const PerformanceMetrics = () => {
  const { performanceMetrics, salesTargets, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Métriques de performance</CardTitle>
            <CardDescription>
              Indicateurs clés de performance de votre boutique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Objectifs de ventes</CardTitle>
            <CardDescription>
              Suivi de vos objectifs par période
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const metrics = [
    {
      title: "Taux de conversion",
      value: `${performanceMetrics?.conversionRate || 0}%`,
      target: "4.0%",
      progress: (performanceMetrics?.conversionRate || 0) * 25, // 4% = 100%
      icon: Target
    },
    {
      title: "Temps moyen sur site",
      value: performanceMetrics?.avgTimeOnSite || "0m 0s",
      target: "3m 00s",
      progress: performanceMetrics?.avgTimeOnSiteProgress || 0,
      icon: Clock
    },
    {
      title: "Panier abandonné",
      value: `${performanceMetrics?.cartAbandonmentRate || 0}%`,
      target: "60.0%",
      progress: 100 - (performanceMetrics?.cartAbandonmentRate || 0), // Lower is better
      icon: ShoppingBag
    },
    {
      title: "Paiements réussis",
      value: `${performanceMetrics?.paymentSuccessRate || 0}%`,
      target: "95.0%",
      progress: (performanceMetrics?.paymentSuccessRate || 0) * 1.05, // 95% = 100%
      icon: CreditCard
    }
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Performance Metrics */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Métriques de performance</CardTitle>
          <CardDescription>
            Indicateurs clés de performance de votre boutique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gray-50">
                    <metric.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{metric.title}</p>
                    <p className="text-sm text-gray-500">Objectif: {metric.target}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{metric.value}</p>
                  <p className="text-xs text-gray-500">
                    {performanceMetrics ? "Données actuelles" : "Aucune donnée"}
                  </p>
                </div>
              </div>
              <Progress value={metric.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sales Targets */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Objectifs de ventes</CardTitle>
          <CardDescription>
            Suivi de vos objectifs par période
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(salesTargets || []).map((target, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{target.period}</span>
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  {target.percentage}%
                </Badge>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatCurrency(target.achieved)}</span>
                <span>/ {formatCurrency(target.target)}</span>
              </div>
              <Progress value={target.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
