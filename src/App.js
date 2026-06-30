import React, { useState } from 'react';
import './App.css';
import Checkout from './components/Checkout';
import img01 from './images/classic.jpg';
import img02 from './images/universal.jpg';
import img05 from './images/platform.jpg';

const categories = ['Все', 'Фрискейты', 'Комплектующие', 'Аксессуары'];

const initialProducts = [
    { id: 1, name: 'Фрискейты "Классические"', price: 10000, category: 'Фрискейты', image: img01 },
    { id: 2, name: 'Фрискейты "Универсальные"', price: 15000, category: 'Фрискейты', image: img02 },
    { id: 3, name: 'Фрискейты "Профессиональные"', price: 20000, category: 'Фрискейты', image: img01 },
    { id: 4, name: 'Комплект шкурок для подошв фрискейтов', price: 800, category: 'Комплектующие', image: img01 },
    { id: 5, name: 'Платформа для фрискейта универсальная', price: 3000, category: 'Комплектующие', image: img05 },
    { id: 6, name: 'Зимние лезвия для фрискейтов универсальных', price: 6000, category: 'Комплектующие', image: img01 },
    { id: 7, name: 'Колёса узкого профиля', price: 700, category: 'Комплектующие', image: img01 },
    { id: 8, name: 'Колёса широкого профиля', price: 700, category: 'Комплектующие', image: img01 },
    { id: 9, name: 'Комплект подвесок', price: 5000, category: 'Комплектующие', image: img01 },
    { id: 10, name: 'Комплект подшипников на одну пару фрискейтов', price: 2500, category: 'Комплектующие', image: img01 },
    { id: 11, name: 'Сумка для фрискейтов', price: 1700, category: 'Аксессуары', image: img01 },
];

function App() {
    const [activeCategory, setActiveCategory] = useState('Все');
    const [cart, setCart] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false); // показать форму оформления
    const [orderPlaced, setOrderPlaced] = useState(null);       // данные успешного заказа

    // Фильтрация товаров
    const filteredProducts = activeCategory === 'Все'
        ? initialProducts
        : initialProducts.filter(p => p.category === activeCategory);

    // Добавление в корзину
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    // Удаление из корзины
    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    // Изменение количества
    const changeQty = (id, delta) => {
        setCart(prev =>
            prev.map(item => {
                if (item.id !== id) return item;
                const newQty = item.qty + delta;
                return newQty < 1 ? item : { ...item, qty: newQty };
            }).filter(item => item.qty > 0)
        );
    };

    // Итоговая сумма корзины
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Обработка формы
    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (form.name && form.email && form.message) {
            setSubmitted(true);
            setForm({ name: '', email: '', message: '' });
            setTimeout(() => setSubmitted(false), 3000);
        }
    };

    // Переход к оформлению
    const handleCheckout = () => {
        if (cart.length === 0) return;
        setIsCheckingOut(true);
    };

    // Отмена оформления — вернуться к корзине
    const handleCancelCheckout = () => {
        setIsCheckingOut(false);
    };

    // Заказ успешно оформлен
    const handleOrderPlaced = (order) => {
        setOrderPlaced(order);
        setIsCheckingOut(false);
        setCart([]); // очищаем корзину
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
            {/* Шапка */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #ccc' }}>
                <h1 style={{ margin: 0 }}>Фрискейты "Чайка"</h1>
                <nav>
                    <a href="#catalog" style={{ marginRight: 20 }}>Каталог</a>
                    <a href="#cart">Корзина ({cart.reduce((s, i) => s + i.qty, 0)})</a>
                </nav>
            </header>

            {/* Слайдер акций (простая секция) */}
            <section style={{ background: '#e9f5ff', padding: 30, textAlign: 'center', margin: '20px 0', borderRadius: 10 }}>
                <h2>🔥 Специальное предложение!</h2>
                <p>Скидка 20% на все комплектующие при заказе от 10000 ₽</p>
            </section>

            {/* Каталог */}
            <main>
                <h2 id="catalog">Каталог товаров</h2>
                {/* Фильтр категорий */}
                <div style={{ marginBottom: 20 }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                marginRight: 10,
                                padding: '8px 16px',
                                background: activeCategory === cat ? '#007bff' : '#f0f0f0',
                                color: activeCategory === cat ? '#fff' : '#000',
                                border: 'none',
                                borderRadius: 4,
                                cursor: 'pointer'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Сетка товаров */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
                    {filteredProducts.map(product => (
                        <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 15, textAlign: 'center' }}>
                            <img src={product.image} alt={product.name} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 4 }} />
                            <h3>{product.name}</h3>
                            <p style={{ fontSize: 18, fontWeight: 'bold' }}>{product.price} ₽</p>
                            <button
                                onClick={() => addToCart(product)}
                                style={{
                                    background: '#28a745', color: 'white', border: 'none', padding: '8px 20px', borderRadius: 4, cursor: 'pointer'
                                }}
                            >
                                В корзину
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            {/* Корзина */}
            <section id="cart" style={{ marginTop: 40 }}>
                <h2>🛒 Корзина</h2>
                {cart.length === 0 ? (
                    <p>Ваша корзина пуста</p>
                ) : (
                    <div>
                        {cart.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                                <span>{item.name} (x{item.qty})</span>
                                <span>{item.price * item.qty} ₽</span>
                                <div>
                                    <button onClick={() => changeQty(item.id, -1)} style={{ marginRight: 5 }}>-</button>
                                    <button onClick={() => changeQty(item.id, 1)} style={{ marginRight: 10 }}>+</button>
                                    <button onClick={() => removeFromCart(item.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '4px 10px', borderRadius: 4 }}>Удалить</button>
                                </div>
                                {
                                    cart.length > 0 && (
                                        <div style={{ textAlign: 'right', marginTop: 15 }}>
                                            <button
                                                className="checkout-btn"
                                                onClick={handleCheckout}
                                                disabled={cart.length === 0}
                                            >
                                                Перейти к оформлению
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        ))}
                        <h3 style={{ textAlign: 'right' }}>Итого: {total} ₽</h3>
                    </div>
                )}
            </section>

            {/* Оформление заказа */}
            {isCheckingOut && (
                <Checkout
                    cart={cart}
                    total={total}
                    onOrderPlaced={handleOrderPlaced}
                    onCancel={handleCancelCheckout}
                />
            )}

            {/* Сообщение об успешном заказе */}
            {orderPlaced && (
                <section className="order-success">
                    <h2>✅ Заказ №{orderPlaced.id} оформлен!</h2>
                    <p>Спасибо, {orderPlaced.customer.name}! Мы свяжемся с вами по телефону {orderPlaced.customer.phone} для подтверждения.</p>
                    <button className="btn-continue" onClick={() => setOrderPlaced(null)}>
                        Продолжить покупки
                    </button>
                </section>
            )}

            {/* Форма обратной связи */}
            <section style={{ marginTop: 40, background: '#f9f9f9', padding: 20, borderRadius: 8 }}>
                <h2>📩 Напишите нам</h2>
                {submitted && <p style={{ color: 'green' }}>Сообщение отправлено!</p>}
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: 400 }}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Ваше имя"
                        value={form.name}
                        onChange={handleFormChange}
                        required
                        style={{ marginBottom: 10, padding: 8 }}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleFormChange}
                        required
                        style={{ marginBottom: 10, padding: 8 }}
                    />
                    <textarea
                        name="message"
                        placeholder="Сообщение"
                        rows={4}
                        value={form.message}
                        onChange={handleFormChange}
                        required
                        style={{ marginBottom: 10, padding: 8 }}
                    />
                    <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', padding: 10, borderRadius: 4, cursor: 'pointer' }}>
                        Отправить
                    </button>
                </form>
            </section>

            {/* Футер */}
            <footer style={{ marginTop: 40, borderTop: '1px solid #ccc', padding: '20px 0', textAlign: 'center' }}>
                <p>© 2025 Фрискейты "Чайка". Все права защищены.</p>
                <p>📞 8-952-402-46-67 | 📧 u5manov.ilya@yandex.ru</p>
            </footer>
        </div>
    );
}

export default App;
