import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Coffee, Plus, Edit, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { addMenuItem, updateMenuItem, deleteMenuItem } from "../../redux/features/adminSlice";

const categoryColors = {
  coffee: "bg-orange-500",
  tea: "bg-green-500",
  pastry: "bg-purple-500",
  sandwich: "bg-blue-500",
  dessert: "bg-pink-500",
  food: "bg-red-500"
};

function MenuItemForm({ item, onSave }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    category: item?.category || 'coffee',
    isAvailable: item?.isAvailable !== undefined ? item.isAvailable : true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} className="bg-gray-800 border-gray-700 text-white" />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" value={formData.description} onChange={handleChange} className="bg-gray-800 border-gray-700 text-white" />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} className="bg-gray-800 border-gray-700 text-white" />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full p-2 bg-gray-800 border-gray-700 rounded-md text-white">
            <option value="coffee">Coffee</option>
            <option value="tea">Tea</option>
            <option value="pastry">Pastry</option>
            <option value="dessert">Dessert</option>
            <option value="food">Food</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <input type="checkbox" id="isAvailable" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
        <Label htmlFor="isAvailable">Available</Label>
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600">Save</Button>
      </DialogFooter>
    </form>
  );
}

export function MenuView() {
  const dispatch = useDispatch();
  const { menu: menuItems } = useSelector(state => state.admin);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const filteredItems = (menuItems || []).filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSave = (itemData) => {
    if (editingItem) {
      dispatch(updateMenuItem({ id: editingItem._id, itemData }));
    } else {
      dispatch(addMenuItem(itemData));
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };
  
  const handleDelete = (itemId) => {
      if (window.confirm("Are you sure you want to delete this item?")) {
          dispatch(deleteMenuItem(itemId));
      }
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Menu Management</h2>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
            </Button>
        </div>

      {/* FIX: The Dialog component is now at the top level and controlled by state */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
                <DialogDescription>Fill out the details for the menu item.</DialogDescription>
            </DialogHeader>
            <MenuItemForm 
                item={editingItem} 
                onSave={handleSave} 
            />
        </DialogContent>
      </Dialog>

      <div className="flex gap-4">
        <Input
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-gray-900 border-gray-700 text-white"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <Card key={item._id} className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg font-medium">{item.name}</CardTitle>
                  <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                </div>
                <Coffee className="w-5 h-5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-orange-500 font-semibold text-lg">₹ {(item.price || 0).toFixed(2)}</span>
                <Badge className={`${categoryColors[item.category] || 'bg-gray-500'} text-white text-xs`}>{item.category}</Badge>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                <Badge
                  variant={item.isAvailable ? "default" : "secondary"}
                  className={item.isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </Badge>
                
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        onClick={() => openEditDialog(item)}
                    >
                        <Edit className="w-3 h-3" />
                    </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-700 text-red-400 hover:bg-red-900/50 hover:text-red-300"
                    onClick={() => handleDelete(item._id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}