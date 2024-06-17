const AllProducts = async ({
  params,
}: {
  params: {
    categoryAddressNameArray: string[];
  };
}) => {
  const cat = params.categoryAddressNameArray
    ? params.categoryAddressNameArray[
        params.categoryAddressNameArray?.length - 1
      ]
    : -1;
  return (
    <div className='mt-2 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-8'>
      <div className='p-2 lg:col-span-2'></div>
    </div>
  );
};

export default AllProducts;
