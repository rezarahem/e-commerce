'use client';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const LogoutButton = () => {
  return (
    <button
      className='flex gap-x-2 rounded-md p-3 text-red-500 hover:bg-red-100'
      onClick={(e) => {
        e.preventDefault();
        signOut({
          callbackUrl: '/',
        });
      }}
    >
      <LogOut className='h-6 w-6' />
      خروج
    </button>
  );
};

export default LogoutButton;
