type FakerCompProps = {
  faker: {
    id: number;
    productName: string;
    price: number;
  };
};

const FakerComp = ({ faker }: FakerCompProps) => {
  return (
    <div className='border p-3'>
      <p>{faker.productName}</p>
      <p>{faker.price}</p>
    </div>
  );
};

export default FakerComp;
