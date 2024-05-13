import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';

const HomeLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Navbar />
      <div className='h-full'>{children}</div>
      <Footer />
    </>
  );
};

export default HomeLayout;
