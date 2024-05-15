import Container from '../ui/container';
import Logo from '../ui/logo';
import User from '../user/user';
import Menu from './menu';

const Navbar = () => {
  return (
    <nav className='h-14 border-b py-1'>
      <Container
        isFlex
        isFullHeight
        className='items-center justify-between gap-x-2'
      >
        <div className='flex items-center gap-x-2 sm:flex-row-reverse'>
          <Menu />
          <Logo iconSize='siz-6 sm:size-7' fontSize='text-3xl sm:text-4xl' />
        </div>
        <div>
          <User />
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
