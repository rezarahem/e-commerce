import ThemeButtonToggler from '../dark-mode/theme-button-toggler';
import Container from '../ui/container';

const Footer = () => {
  return (
    <footer className='border-t py-8 dark:border-gray-700 dark:bg-black'>
      <Container isFullHeight className='items-center'>
        <ThemeButtonToggler />
      </Container>
    </footer>
  );
};

export default Footer;
