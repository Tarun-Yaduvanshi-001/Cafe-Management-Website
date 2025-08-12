import { Coffee, ShoppingCart, Users, BarChart3, ExternalLink } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Orders",
    icon: ShoppingCart,
    value: "orders",
  },
  {
    title: "Menu",
    icon: Coffee,
    value: "menu",
  },
  {
    title: "Customers",
    icon: Users,
    value: "customers",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    value: "analytics",
  },
];

export function AppSidebar({ activeView, setActiveView }) {
  return (
    <Sidebar className="border-r border-gray-800/50 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-sm">
      <SidebarHeader className="p-6 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Coffee className="w-6 h-6 text-white" />
          </div>
          <div>
            {/* <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              CafeHub
            </span> */}
            <p className="text-gray-400 text-xs">Management Portal</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-sm font-medium mb-4 px-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => setActiveView(item.value)}
                    className={`w-full justify-start text-left hover:bg-gray-800/50 rounded-lg transition-all duration-200 ${
                      activeView === item.value
                        ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border border-orange-500/30 shadow-lg"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${
                      activeView === item.value ? "text-orange-400" : "text-gray-400"
                    }`} />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-800/50">
        <Button
          variant="outline"
          className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white hover:border-orange-500/50 transition-all duration-200"
          onClick={() => window.open('/menu', '_blank')}
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Customer Menu</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}