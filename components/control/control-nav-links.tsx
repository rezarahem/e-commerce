'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type ControlNavLinksProps = {
  className?: string;
};

const ControlNavLinks = ({ className }: ControlNavLinksProps) => {
  const pathname = usePathname();

  const routesLinks = [
    {
      href: '/control',
      label: 'کنترل',
      active: pathname === '/control',
    },
    // {
    //   href: '/control/orders',
    //   label: 'سفارش‌ها',
    //   active: pathname === '/control/orders',
    // },
    // {
    //   href: '/control/products',
    //   label: 'محصولات',
    //   active: pathname === '/control/products',
    // },
    {
      href: '/control/categories',
      label: 'دسته‌بندی‌ها',
      active: pathname === '/control/categories',
    },
    // {
    //   href: '/control/main-slider',
    //   label: 'اسلایدر',
    //   active: pathname === '/control/main-slider',
    // },
  ];

  return (
    <nav className={cn('flex items-center gap-x-6', className)}>
      {routesLinks.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black' : 'text-muted-foreground',
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default ControlNavLinks;
