import ControlNavLinks from './control-nav-links';

const ControlNavbar = () => {
  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <ControlNavLinks />
      </div>
    </div>
  );
};

export default ControlNavbar;
