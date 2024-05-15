import Container from '../../ui/container';
import ControlNavLinks from './control-nav-links';

const ControlNavbar = () => {
  return (
    <nav className='h-14 border-b py-1'>
      <Container
        isFullHeight
        isFlex
        className='items-center justify-between gap-x-2'
      >
        <ControlNavLinks />
      </Container>
    </nav>
  );
};

export default ControlNavbar;
