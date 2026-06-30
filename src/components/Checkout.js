import React, { useState } from 'react';

const ORDER_FORM_ID = 'meeblvvz'; // тот же ID для уведомлений о заказе

function Checkout({ cart, total, onOrderPlaced, onCancel }) {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        comment: '',
        payment: 'card',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Укажите имя';
        if (!form.phone.trim()) newErrors.phone = 'Укажите телефон';
        else if (!/^\+?\d[\d\s()-]{5,}$/.test(form.phone.trim()))
            newErrors.phone = 'Некорректный номер';
        if (form.email && !/\S+@\S+\.\S+/.test(form.email))
            newErrors.email = 'Некорректный email';
        if (!form.address.trim()) newErrors.address = 'Укажите адрес доставки';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const order = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: cart.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
            total,
            customer: { ...form },
        };

        // Сохраняем в localStorage
        const savedOrders = JSON.parse(localStorage.getItem('sportShopOrders') || '[]');
        savedOrders.push(order);
        localStorage.setItem('sportShopOrders', JSON.stringify(savedOrders));

        // Отправляем уведомление в Formspree
        const orderPayload = {
            _subject: `Заказ №${order.id} от ${order.customer.name}`,
            name: order.customer.name,
            phone: order.customer.phone,
            email: order.customer.email || 'не указан',
            address: order.customer.address,
            items: order.items.map(i => `${i.name} x${i.qty} – ${i.price * i.qty}₽`).join('\n'),
            total: `${order.total}₽`,
            payment: order.customer.payment === 'card' ? 'Картой' : 'Наличными',
            comment: order.customer.comment || 'нет',
        };

        try {
            await fetch(`https://formspree.io/f/${ORDER_FORM_ID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(orderPayload),
            });
        } catch (err) {
            console.error('Ошибка отправки заказа:', err);
        }

        onOrderPlaced(order);
    };

    // JSX формы (как было раньше)
    return (
        <section className="checkout">
            <h2 className="checkout__title">Оформление заказа</h2>

            <div className="checkout__summary">
                <p>Товаров в корзине: {cart.reduce((sum, item) => sum + item.qty, 0)}</p>
                <p>Итого к оплате: <strong>{total} ₽</strong></p>
            </div>

            <form className="checkout-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Имя *</label>
                    <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Иван Иванов" />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Телефон *</label>
                    <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+7 900 123-45-67" />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@mail.ru" />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="address">Адрес доставки *</label>
                    <input id="address" name="address" value={form.address} onChange={handleChange} placeholder="Город, улица, дом, квартира" />
                    {errors.address && <span className="form-error">{errors.address}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="comment">Комментарий к заказу</label>
                    <textarea id="comment" name="comment" rows="3" value={form.comment} onChange={handleChange} placeholder="Домофон не работает, позвоните за час..." />
                </div>

                <fieldset className="payment-methods">
                    <legend>Способ оплаты</legend>
                    <label className={`payment-option ${form.payment === 'card' ? 'active' : ''}`}>
                        <input type="radio" name="payment" value="card" checked={form.payment === 'card'} onChange={handleChange} />
                        💳 Банковской картой
                    </label>
                    <label className={`payment-option ${form.payment === 'cash' ? 'active' : ''}`}>
                        <input type="radio" name="payment" value="cash" checked={form.payment === 'cash'} onChange={handleChange} />
                        💵 Наличными при получении
                    </label>
                </fieldset>

                <div className="checkout-actions">
                    <button type="button" className="btn-cancel" onClick={onCancel}>
                        Вернуться в корзину
                    </button>
                    <button type="submit" className="btn-confirm">
                        Подтвердить заказ
                    </button>
                </div>
            </form>
        </section>
    );
}

export default Checkout;