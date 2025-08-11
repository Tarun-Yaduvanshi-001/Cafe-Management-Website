import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone } from "lucide-react";
import { useSelector } from "react-redux";
import Loader from "../Loader";

export function CustomersView() {
  const { customers, status } = useSelector(state => state.admin);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = (customers || []).filter(customer =>
    (customer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLoyaltyBadge = (points) => {
    if (points >= 150) return { label: "Gold", color: "bg-yellow-500" };
    if (points >= 100) return { label: "Silver", color: "bg-gray-400" };
    return { label: "Bronze", color: "bg-orange-600" };
  };
  
  if (status === 'loading' && customers.length === 0) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Customer Management</h2>
        <div className="flex items-center gap-2 text-gray-400">
          <Users className="w-5 h-5" />
          <span>{(customers || []).length} Total Customers</span>
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-gray-900 border-gray-700 text-white"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => {
          const loyaltyBadge = getLoyaltyBadge(customer.loyaltyPoints || 0);
          
          return (
            <Card key={customer._id} className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-lg font-medium">{customer.name}</CardTitle>
                    <p className="text-gray-400 text-sm">{customer._id}</p>
                  </div>
                  <Badge className={`${loyaltyBadge.color} text-white text-xs`}>{loyaltyBadge.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Mail className="w-3 h-3" />
                    <span>{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Phone className="w-3 h-3" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                  <div>
                    <p className="text-white text-sm">{(customer.loyaltyPoints || 0)} points</p>
                    <p className="text-gray-400 text-xs">Loyalty Points</p>
                  </div>
                  <div className="text-right">
                    {/* FIX: Safely handle potentially missing lastlogin date */}
                    <p className="text-white text-sm">{customer.lastlogin ? new Date(customer.lastlogin).toLocaleDateString() : 'N/A'}</p>
                    <p className="text-gray-400 text-xs">Last Visit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}