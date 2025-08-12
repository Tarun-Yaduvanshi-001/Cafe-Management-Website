import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/features/AuthSlice';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Coffee, UserCircle, LayoutDashboard } from 'lucide-react';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, email, role } = useSelector((state) => state.auth);

  const handleLogoutClick = () => {
    dispatch(logout())
      .unwrap()
      .then(() => navigate('/login'))
      .catch((err) => {
        console.error('Logout failed', err);
        navigate('/login');
      });
  };

  return (
    <nav className="bg-gray-900/50 backdrop-blur-sm text-white shadow-lg sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <Coffee className="w-8 h-8 text-orange-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Midnight Cafe
            </span>
          </div>

          <div className="flex items-center gap-4">
            {role === 'admin' && (
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-orange-500/20 hover:text-orange-400"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-white hover:bg-orange-500/20 hover:text-orange-400"
                >
                  <UserCircle className="h-5 w-5" />
                  <span>{name || 'Profile'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800 text-white">
                <DropdownMenuLabel className="flex flex-col space-y-1">
                  <span className="font-bold">{name || 'Welcome!'}</span>
                  <span className="text-xs font-normal text-gray-400">{email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="cursor-pointer focus:bg-gray-800">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-red-500/20 focus:text-red-400"
                  onClick={handleLogoutClick}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;