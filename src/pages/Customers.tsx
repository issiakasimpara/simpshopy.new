
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Search,
  Plus,
  ShoppingCart,
  Filter,
  Download,
  Package,
  Store,
  UserCheck,
  TrendingUp,
  Star,
  Loader2,
  Mail,
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { useCustomers } from "@/hooks/useCustomers";
import { formatCurrency } from "@/utils/orderUtils";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { customers, stats, isLoading, isLoadingStats } = useCustomers();

  // Filtrer les clients selon le terme de recherche
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header avec gradient moderne */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 via-blue-600/5 to-purple-600/5 rounded-3xl" />
          <div className="relative p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl border border-border/50 shadow-lg">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/40 dark:to-blue-900/40 rounded-xl shadow-md">
                    <Users className="h-5 w-5 sm:h-7 sm:w-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      Clients
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium">
                      Gérez vos clients et leur historique - 0 client
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <Button variant="outline" disabled className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-emerald-200/50 dark:border-emerald-800/30 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-blue-100 transition-all duration-300">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
                <Button disabled className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Ajouter un client
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats avec design modernisé */}
        <div className="bg-gradient-to-br from-background via-background to-muted/10 rounded-2xl border border-border/50 shadow-lg p-3 sm:p-4 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 bg-gradient-to-br from-background via-background to-muted/10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500 opacity-60" />
              
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-blue-600 transition-colors">
                  Total clients
                </CardTitle>
                <div className="p-2 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold text-foreground group-hover:text-blue-600 transition-colors">
                  {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.totalCustomers || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.totalCustomers ? `${stats.totalCustomers} client${stats.totalCustomers > 1 ? 's' : ''}` : 'Aucun client'}
                </p>
              </CardContent>
            </Card>
            
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 bg-gradient-to-br from-background via-background to-muted/10">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 opacity-60" />
              
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-purple-600 transition-colors">
                  Clients VIP
                </CardTitle>
                <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold text-foreground group-hover:text-purple-600 transition-colors">
                  {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.activeCustomers || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.activeCustomers ? `${stats.activeCustomers} client${stats.activeCustomers > 1 ? 's' : ''} actif${stats.activeCustomers > 1 ? 's' : ''}` : 'Aucun client actif'}
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 bg-gradient-to-br from-background via-background to-muted/10">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 opacity-60" />
              
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-green-600 transition-colors">
                  Nouveaux clients
                </CardTitle>
                <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold text-foreground group-hover:text-green-600 transition-colors">
                  {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.newCustomersThisMonth || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Aucun nouveau client</p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 bg-gradient-to-br from-background via-background to-muted/10">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 opacity-60" />
              
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-orange-600 transition-colors">
                  Panier moyen
                </CardTitle>
                <div className="p-2 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold text-foreground group-hover:text-orange-600 transition-colors">
                  {isLoadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : formatCurrency(stats?.averageOrderValue || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Panier moyen</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section principale avec layout amélioré */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Liste des clients */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-background via-background to-muted/10 rounded-2xl border border-border/50 shadow-lg p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Liste des clients</h3>
                  <p className="text-muted-foreground">Tous vos clients enregistrés</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Rechercher un client..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 bg-background/50 border-border/60 focus:border-emerald-500 transition-colors"
                      disabled
                    />
                  </div>
                  <Button variant="outline" size="sm" disabled className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-emerald-200/50 dark:border-emerald-800/30 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-blue-100 transition-all duration-300">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Liste des clients ou état vide */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                  <p className="text-muted-foreground">Chargement des clients...</p>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/40 dark:to-blue-900/40 rounded-2xl shadow-lg mb-6">
                    <Users className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {customers.length === 0 ? "Aucun client pour le moment" : "Aucun résultat"}
                  </h3>
                  <p className="text-muted-foreground text-center mb-8 max-w-md">
                    {customers.length === 0
                      ? "Vos clients apparaîtront ici après leurs premiers achats. Commencez par ajouter des produits et configurer votre boutique."
                      : "Aucun client ne correspond à votre recherche."
                    }
                  </p>
                  {customers.length === 0 && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <Link to="/products">
                          <Package className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                          Ajouter des produits
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-emerald-200/50 dark:border-emerald-800/30 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-blue-100 transition-all duration-300">
                        <Link to="/store-config">
                          <Store className="mr-2 h-4 w-4" />
                          Configurer ma boutique
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Commandes</TableHead>
                        <TableHead>Total dépensé</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Dernière commande</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.map((customer) => (
                        <TableRow key={customer.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {customer.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium">{customer.name}</p>
                                <p className="text-sm text-muted-foreground">{customer.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{customer.email}</span>
                              </div>
                              {customer.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">{customer.phone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {customer.totalOrders} commande{customer.totalOrders > 1 ? 's' : ''}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-green-600">
                              {formatCurrency(customer.totalSpent)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={customer.status === 'active' ? 'default' : 'secondary'}
                              className={customer.status === 'active'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                              }
                            >
                              {customer.status === 'active' ? 'Actif' : 'Inactif'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {new Date(customer.lastOrderDate).toLocaleDateString('fr-FR')}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar avec détails client et commandes récentes */}
          <div className="space-y-6">
            {/* Profil client */}
            <div className="bg-gradient-to-br from-background via-background to-muted/10 rounded-2xl border border-border/50 shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground mb-2">Profil client</h3>
                <p className="text-muted-foreground text-sm">Informations détaillées du client sélectionné</p>
              </div>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-md mb-4">
                  <Users className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-muted-foreground text-center text-sm">
                  Sélectionnez un client pour voir son profil
                </p>
              </div>
            </div>

            {/* Commandes récentes */}
            <div className="bg-gradient-to-br from-background via-background to-muted/10 rounded-2xl border border-border/50 shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground mb-2">Commandes récentes</h3>
                <p className="text-muted-foreground text-sm">Dernières commandes de tous les clients</p>
              </div>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 rounded-xl shadow-md mb-4">
                  <ShoppingCart className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-muted-foreground text-center text-sm mb-4">
                  Aucune commande pour le moment
                </p>
                <Button variant="outline" size="sm" asChild className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-emerald-200/50 dark:border-emerald-800/30 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-blue-100 transition-all duration-300">
                  <Link to="/orders">
                    Voir toutes les commandes
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
