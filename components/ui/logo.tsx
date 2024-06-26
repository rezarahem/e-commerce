import { cn } from '@/lib/utils';
import Link from 'next/link';

type LogoProps = {
  iconSize?: string;
  fontSize?: string;
};

const Logo = ({ iconSize, fontSize }: LogoProps) => {
  return (
    <Link
      href='/'
      className='-mr-2 flex items-center gap-x-2 p-2 text-purple-800'
    >
      <h1 className={cn('text- font-jersey text-2xl', fontSize)}>e-com</h1>
      {/* <Film className={cn('size-5', iconSize)} /> */}
    </Link>
  );
};

export default Logo;
