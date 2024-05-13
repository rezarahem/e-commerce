import { cn } from '@/libs/utils';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  isFullHeight?: boolean;
};

const Container = ({
  children,
  className,
  isFullHeight = false,
}: ContainerProps) => {
  return (
    <div
      className={cn('mx-auto flex max-w-7xl px-5 md:px-3', className, {
        'h-full': isFullHeight,
      })}
    >
      {children}
    </div>
  );
};

export default Container;
