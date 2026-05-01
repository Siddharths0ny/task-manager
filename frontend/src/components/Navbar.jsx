import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
    const { logout } = useContext(AuthContext);

    return (
        <header className="bg-white h-16 border-b flex items-center justify-between px-6 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-800">Team Workspace</h1>
            <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
            >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
            </button>
        </header>
    );
};

export default Navbar;
