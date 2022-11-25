import useCartStore from '@/hooks/useCartStore';

export default function Cart() {
  const [snapshot] = useCartStore();
  const { items } = snapshot;

  return (
    <div>
      <h2>Cart</h2>
      {items.length ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              상품 #{item.productId}
              {' -  '}
              {item.quantity}
            </li>
          ))}
        </ul>
      ) : (
        <p>장바구니가 비어있습니다</p>
      )}
    </div>
  );
}
